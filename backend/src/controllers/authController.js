const User = require("../models/User");
const EmailOtp = require("../models/EmailOtp");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const emailValidator = require("email-validator");
const dns = require("dns").promises;
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { createNotification } = require("./notificationController");
const { formatUserResponse } = require("../utils/userUtils");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.verifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Basic syntax check
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ 
        exists: false, 
        valid: false, 
        message: "Invalid email format" 
      });
    }

    // 2. Database check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        exists: true, 
        valid: true, 
        message: "Email already registered" 
      });
    }

    // 3. Domain/MX record check (Advanced verification)
    const domain = email.split("@")[1];
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return res.status(400).json({ 
          exists: false, 
          valid: false, 
          message: "Email domain does not exist or cannot receive emails" 
        });
      }
    } catch (dnsError) {
      console.error("DNS MX Resolve Error:", dnsError);
      return res.status(400).json({ 
        exists: false, 
        valid: false, 
        message: "Invalid email domain" 
      });
    }

    res.json({ 
      exists: false, 
      valid: true, 
      message: "Email is valid and available" 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !emailValidator.validate(email)) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    // Rate limiting check (e.g., max 3 requests per 10 mins) - simplified for now
    const recentOtp = await EmailOtp.findOne({ 
      email, 
      createdAt: { $gt: new Date(Date.now() - 60000) } // 1 minute cooldown
    });

    if (recentOtp) {
      return res.status(429).json({ message: "Please wait at least 60 seconds before requesting another code." });
    }

    // Generate 6-digit secure OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store in DB (upsert)
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Professional HTML Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">IdeaCollab</h1>
          <p style="color: #6b7280; font-size: 14px;">Connect. Create. Collaborate.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; text-align: center;">
          <h2 style="color: #111827; margin-top: 0;">Verification Code</h2>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Please use the following code to verify your email address:</p>
          <div style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 5px; margin-bottom: 24px; padding: 15px; background: white; border: 2px dashed #e5e7eb; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">This code will expire in 10 minutes.</p>
        </div>
        <div style="margin-top: 24px; color: #6b7280; font-size: 12px; text-align: center;">
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} IdeaCollab. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email with fallback logging
    try {
      const sent = await sendEmail({
        email,
        subject: "Verification Code - IdeaCollab",
        message: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent
      });
      
      if (!sent) {
        throw new Error("Email delivery returned false status");
      }

      console.log(`[OTP GENERATED] Success for ${email}`);
      res.json({ message: "Verification code sent to your email" });
    } catch (emailError) {
      console.error(`[OTP FAILURE] Delivery failed for ${email}:`, emailError.message);
      
      // If email fails, we still keep the OTP in DB for 10 mins, 
      // but inform the user about the delivery failure.
      res.status(503).json({ 
        message: "We're having trouble delivering the code. Please try again later or contact support.",
        technical: emailError.message 
      });
    }
  } catch (error) {
    console.error(`[OTP CRITICAL] Error in sendOtp for ${email}:`, error);
    res.status(500).json({ 
      message: "An internal error occurred. Please try again later."
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await EmailOtp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Success - we'll delete the record later after registration
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, headline, skills, googleId, avatarUrl } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create user (password is optional if googleId is present)
    const userData = {
      name,
      email,
      password, // Might be undefined for Google signups
      role,
      headline,
      skills
    };

    // Only add googleId and avatarUrl if they are provided
    if (googleId) userData.googleId = googleId;
    if (avatarUrl) userData.avatarUrl = avatarUrl;

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: formatUserResponse(user),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.googleVerify = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ message: "Google email not verified" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (user) {
      // User exists, so return token (login)
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.avatarUrl) user.avatarUrl = picture;
        await user.save();
      }
      return res.json({
        isNewUser: false,
        token: generateToken(user._id),
        user: formatUserResponse(user),
      });
    } else {
      // User doesn't exist, return profile info to autofill registration
      return res.json({
        isNewUser: true,
        profile: {
          name,
          email,
          googleId,
          avatarUrl: picture
        }
      });
    }
  } catch (error) {
    console.error("Google Verification Error:", error);
    res.status(401).json({ message: "Google verification failed", details: error.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res.status(401).json({ message: "Google email not verified" });
    }

    let user = await User.findOne({ email });

    if (user) {
      // If user exists but hasn't linked Google yet, link it
      if (!user.googleId) {
        user.googleId = googleId;
        // Optionally update picture if they don't have one
        if (!user.avatarUrl) user.avatarUrl = picture;
        await user.save();
      }
      
      console.log(`[AUTH SUCCESS] Google Login: ${email} (${user._id})`);
    } else {
      // SECURITY FIX: Prevent auto-registration during login flow
      console.warn(`[AUTH FAILURE] Unrecognized Google account attempt: ${email}`);
      return res.status(401).json({ 
        message: "This Google account is not registered. Please sign up first.",
        errorCode: "USER_NOT_FOUND"
      });
    }

    res.json({
      token: generateToken(user._id),
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Detailed Google Login Error:", {
      message: error.message,
      stack: error.stack,
      audience: process.env.GOOGLE_CLIENT_ID,
      token_provided: !!credential
    });
    res.status(401).json({ 
      message: "Google authentication failed", 
      details: error.message 
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email || !emailValidator.validate(email)) {
      return res.status(400).json({ message: "A valid email address is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({ message: "If an account exists with that email, we've sent instructions to reset your password." });
    }

    // Rate limiting check
    const recentOtp = await EmailOtp.findOne({ 
      email, 
      createdAt: { $gt: new Date(Date.now() - 60000) } 
    });

    if (recentOtp) {
      return res.status(429).json({ message: "Please wait at least 60 seconds before requesting another code." });
    }

    // Generate 6-digit secure OTP for password reset
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Store in DB (upsert)
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // Professional HTML Email Template for Password Reset
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">IdeaCollab</h1>
          <p style="color: #6b7280; font-size: 14px;">Connect. Create. Collaborate.</p>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; text-align: center;">
          <h2 style="color: #111827; margin-top: 0;">Password Reset Code</h2>
          <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Please use the following code to reset your password:</p>
          <div style="font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 5px; margin-bottom: 24px; padding: 15px; background: white; border: 2px dashed #e5e7eb; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">This code will expire in 10 minutes.</p>
        </div>
        <div style="margin-top: 24px; color: #6b7280; font-size: 12px; text-align: center;">
          <p>If you didn't request a password reset, please secure your account immediately.</p>
          <p>&copy; ${new Date().getFullYear()} IdeaCollab. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send email with fallback logging
    try {
      const sent = await sendEmail({
        email,
        subject: "Password Reset Verification Code - IdeaCollab",
        message: `Your verification code for password reset is: ${otp}. It will expire in 10 minutes.`,
        html: htmlContent
      });
      
      if (!sent) {
        throw new Error("Email delivery returned false status");
      }
      
      console.log(`[PASSWORD RESET OTP] Success for ${email}`);
      res.json({ message: "Verification code sent to your email." });
    } catch (emailError) {
      console.error(`[PASSWORD RESET OTP FAILURE] Delivery failed for ${email}:`, emailError.message);
      res.status(503).json({ 
        message: "We're having trouble delivering the reset code. Please try again later or contact support.",
        technical: emailError.message 
      });
    }
  } catch (error) {
    console.error(`[PASSWORD RESET CRITICAL] Error in forgotPassword for ${email}:`, error);
    res.status(500).json({ message: "An internal error occurred." });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // 1. Verify OTP
    const otpRecord = await EmailOtp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Enforce password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // 4. Update password
    user.password = newPassword;
    await user.save();

    // 5. Cleanup OTP
    await EmailOtp.deleteOne({ _id: otpRecord._id });

    // 6. Send notification email
    const successHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0;">IdeaCollab</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px;">
          <h2 style="color: #111827; margin-top: 0;">Password Reset Successful</h2>
          <p style="color: #374151; font-size: 16px;">Hello ${user.name},</p>
          <p style="color: #374151; font-size: 16px;">Your password has been successfully reset. You can now log in with your new password.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you did not perform this action, please contact our support team immediately.</p>
        </div>
        <div style="margin-top: 24px; color: #6b7280; font-size: 12px; text-align: center;">
          <p>&copy; ${new Date().getFullYear()} IdeaCollab. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Successful - IdeaCollab",
        message: `Hello ${user.name},\n\nYour password has been successfully reset. If you did not perform this action, please contact support immediately.\n\nBest regards,\nIdeaCollab Team`,
        html: successHtml
      });
    } catch (emailError) {
      console.error("Failed to send password reset success email:", emailError);
    }

    res.json({ message: "Password has been reset successfully. You can now log in with your new password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Enforce password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    user.password = newPassword;
    await user.save();

    // Send email notification
    try {
      await sendEmail({
        email: user.email,
        subject: "Password Changed - Idea Collab",
        message: `Hello ${user.name},\n\nYour password was successfully changed. If you did not make this change, please contact support immediately.\n\nBest regards,\nIdea Collab Team`,
      });
    } catch (emailError) {
      console.error("Failed to send password change email:", emailError);
      // Don't fail the request if email fails
    }

    // Create persistent notification
    await createNotification(req, {
      recipient: user._id,
      type: "success",
      title: "Password Changed",
      message: "Your password has been successfully updated.",
      relatedId: user._id,
      relatedModel: "User",
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ email: identifier });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        headline: user.headline,
        skills: user.skills,
        location: user.location,
        bio: user.bio,
        socialLinks: user.socialLinks,
        savedIdeas: user.savedIdeas || [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

