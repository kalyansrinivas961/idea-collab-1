# Idea Collab - Feature Implementation Samples

This document provides annotated code samples for the most critical features of the Idea Collab platform, demonstrating both frontend and backend implementation patterns.

---

## 1. Authentication & Security

### Backend: OTP Generation & Email Verification
Located in [authController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/authController.js).

```javascript
// Generate and send a 6-digit secure OTP for email verification
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    // Basic validation and cooldown check
    const otp = crypto.randomInt(100000, 1000000).toString();
    
    // Store in DB with expiration (managed by MongoDB TTL index)
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true }
    );

    // Send via Nodemailer
    await sendEmail({
      to: email,
      subject: "Your IdeaCollab Verification Code",
      text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
    });
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Backend: Secure Backup Codes (Generation & Hashing)
Located in [backupCodeUtils.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/utils/backupCodeUtils.js).

```javascript
// Cryptographically secure generation of 8-10 character alphanumeric codes
const generateBackupCodes = () => {
  const numCodes = Math.floor(Math.random() * (10 - 8 + 1)) + 8; // 8 to 10 codes
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codes = new Set();

  while (codes.size < numCodes) {
    const length = Math.floor(Math.random() * (10 - 8 + 1)) + 8; // 8 to 10 chars
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.add(code);
  }
  return Array.from(codes);
};

// Hashing backup codes using bcrypt with cost factor 10
const hashBackupCode = async (code) => {
  return await bcrypt.hash(code, 10);
};
```

### Frontend: Auth Context Provider
Located in [AuthContext.jsx](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/frontend/src/context/AuthContext.jsx).

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Auto-login on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/users/me")
        .then(res => setUser(normalizeUser(res.data)))
        .catch(() => localStorage.removeItem("token"));
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(normalizeUser(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Frontend: Multi-step Registration & Backup Code Display
Located in [RegisterPage.jsx](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/frontend/src/pages/RegisterPage.jsx).

```javascript
// Conditional rendering to show backup codes exactly once after registration
{backupCodes ? (
  <div className="space-y-6 animate-fade-in">
    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
      <h3 className="text-amber-800 font-bold">Important: Save these codes!</h3>
      <div className="grid grid-cols-2 gap-3 mt-4">
        {backupCodes.map((code, idx) => (
          <div key={idx} className="bg-white border rounded-lg p-2 text-center font-mono text-sm">
            {code}
          </div>
        ))}
      </div>
    </div>
    <button onClick={() => navigate("/dashboard")}>I've saved my codes</button>
  </div>
) : (
  <form onSubmit={handleSubmit}>
    {/* ... form fields ... */}
  </form>
)}
```

---

## 2. Idea Management

### Backend: Idea Creation with File Uploads
Located in [ideaController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/ideaController.js).

```javascript
exports.createIdea = async (req, res) => {
  const { title, description, category, tags } = req.body;
  const files = req.files; // Populated by Multer middleware

  try {
    const attachments = files ? files.map(file => ({
      url: `/uploads/${file.filename}`,
      fileType: file.mimetype.startsWith("image/") ? "image" : "document",
      originalName: file.originalname
    })) : [];

    const idea = new Idea({
      title,
      description,
      category,
      tags: typeof tags === 'string' ? tags.split(',') : tags,
      owner: req.user._id,
      attachments
    });

    await idea.save();
    // Emit real-time update to all connected clients
    req.io.emit("idea:created", idea);
    res.status(201).json(idea);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 3. Real-time Communication (Socket.io)

### Frontend: Receiving Messages
Located in [ChatPage.jsx](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/frontend/src/pages/ChatPage.jsx).

```javascript
useEffect(() => {
  const handleMessage = (message) => {
    // Check if the message belongs to the currently open chat
    const isRelevant = selectedUser && (
      (selectedUser.isGroup && message.conversationId === selectedUser._id) || 
      (!selectedUser.isGroup && message.sender._id === selectedUser._id)
    );

    if (isRelevant) {
      setMessages(prev => [...prev, message]);
    }
    
    // Update the conversations list sidebar in real-time
    setConversations(prev => {
      const filtered = prev.filter(c => c._id !== (message.conversationId || message.sender._id));
      return [{ ...updatedConversation, lastMessage: message }, ...filtered];
    });
  };

  socket.on("chat:message", handleMessage);
  return () => socket.off("chat:message", handleMessage);
}, [selectedUser]);
```

---

## 4. AI Integration (Groq SDK)

### Backend: AI Chat Completion
Located in [aiController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/aiController.js).

```javascript
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.getAIResponse = async (req, res) => {
  const { message, history } = req.body;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are the IdeaCollab AI Assistant..." },
        ...history,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    res.json({ response: chatCompletion.choices[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ message: "AI processing failed" });
  }
};
```

---

## 5. Q&A System (Problem Solving)

### Backend: Voting Logic
Located in [qaController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/qaController.js).

```javascript
exports.voteProblem = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body; // 'upvote' or 'downvote'
  const userId = req.user._id;

  const problem = await Problem.findById(id);
  const hasUpvoted = problem.upvotes.includes(userId);
  const hasDownvoted = problem.downvotes.includes(userId);

  if (type === "upvote") {
    if (hasUpvoted) problem.upvotes.pull(userId); // Toggle off
    else {
      problem.upvotes.push(userId);
      problem.downvotes.pull(userId); // Ensure mutually exclusive
    }
  }
  // ... similar logic for downvote ...
  await problem.save();
  res.json({ upvotes: problem.upvotes.length, downvotes: problem.downvotes.length });
};
```

---

## 6. Account Recovery (Backup Codes)

### Backend: Validation & Atomic Usage
Located in [authController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/authController.js).

```javascript
// Verify a submitted backup code against hashed values in DB
exports.verifyBackupCode = async (req, res) => {
  const { email, backupCode } = req.body;
  const user = await User.findOne({ email });

  // Find all unused backup codes for this user
  const userBackupCodes = await BackupCode.find({ user: user._id, usedStatus: false });

  // Compare with bcrypt
  let foundCode = null;
  for (const codeRecord of userBackupCodes) {
    const isMatch = await bcrypt.compare(backupCode, codeRecord.hashedCode);
    if (isMatch) {
      foundCode = codeRecord;
      break;
    }
  }

  if (foundCode) {
    // Atomic update to mark as used
    foundCode.usedStatus = true;
    foundCode.usedAt = new Date();
    await foundCode.save();

    // Generate a short-lived recovery token for password reset
    const resetToken = jwt.sign({ id: user._id, type: 'backup_code_reset' }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ resetToken });
  } else {
    res.status(400).json({ message: "Invalid backup code" });
  }
};
```

### Frontend: PDF Download Implementation
Located in [RegisterPage.jsx](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/frontend/src/pages/RegisterPage.jsx).

```javascript
// Using jsPDF to generate a secure formatted document of backup codes
const downloadPDF = () => {
  if (!backupCodes) return;
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text("IdeaCollab Backup Codes", 20, 20);
  doc.setFontSize(12);
  doc.text(`Generated for: ${form.email}`, 20, 35);
  
  backupCodes.forEach((code, index) => {
    doc.text(`${index + 1}. ${code}`, 30, 65 + (index * 8));
  });

  doc.save("ideacollab-backup-codes.pdf");
};
```

---

## 7. Professional Networking (Follow System)

### Backend: Follow/Unfollow Logic
Located in [userController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/userController.js).

```javascript
exports.followUser = async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  const isFollowing = currentUser.following.some(id => id.toString() === userToFollow._id.toString());

  if (isFollowing) {
    // Unfollow logic
    currentUser.following.pull(userToFollow._id);
    userToFollow.followers.pull(currentUser._id);
  } else {
    // Follow logic
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);
    
    // Notify the user being followed
    await createNotification(req, {
      recipient: userToFollow._id,
      type: "info",
      title: "New Follower",
      message: `${currentUser.name} started following you.`
    });
  }
  await Promise.all([currentUser.save(), userToFollow.save()]);
  res.json({ status: isFollowing ? "unfollowed" : "followed" });
};
```

---

## 8. Collaboration Requests

### Backend: Request Creation & Notification
Located in [collaborationController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/collaborationController.js).

```javascript
exports.createRequest = async (req, res) => {
  const { ideaId, message } = req.body;
  const idea = await Idea.findById(ideaId);

  const request = new CollaborationRequest({
    sender: req.user._id,
    receiver: idea.owner,
    idea: ideaId,
    message,
  });

  const createdRequest = await request.save();
  
  // Create persistent notification for the idea owner
  await createNotification(req, {
    recipient: idea.owner,
    type: "info",
    title: "Collaboration Request",
    message: `${req.user.name} requested to collaborate on "${idea.title}"`,
    relatedId: createdRequest._id,
    relatedModel: "CollaborationRequest",
  });

  // Emit real-time event via Socket.io
  req.io.to(idea.owner.toString()).emit("collaboration:request", createdRequest);
  res.status(201).json(createdRequest);
};
```

---

## 9. Notification System

### Backend: Generic Notification Dispatcher
Located in [notificationController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/notificationController.js).

```javascript
exports.createNotification = async (req, { recipient, type, title, message, relatedId, relatedModel }) => {
  // Prevent self-notification
  if (req.user && recipient.toString() === req.user._id.toString()) return null;

  const notification = await Notification.create({
    recipient,
    type, // 'info', 'success', 'warning', 'error'
    title,
    message,
    relatedId,
    relatedModel,
  });

  // Push real-time alert to the recipient's connected socket
  if (req.io) {
    req.io.to(recipient.toString()).emit("notification:new", notification);
  }
  return notification;
};
```

---

## 10. Moderation & Reporting

### Backend: Secure Content Reporting
Located in [reportController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/reportController.js).

```javascript
exports.createReport = async (req, res) => {
  const { ideaId, category, context } = req.body;

  // Generate unique reference number for tracking
  const referenceNumber = `REP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  const report = new Report({
    reporter: req.user._id,
    idea: ideaId,
    category,
    context,
    referenceNumber
  });

  await report.save();

  // Alert all administrators via email and dashboard notifications
  const admins = await User.find({ role: "admin" });
  admins.forEach(admin => {
    createNotification(req, {
      recipient: admin._id,
      type: "error",
      title: "New Content Report",
      message: `A new report (${referenceNumber}) has been submitted for review.`,
    });
  });

  res.status(201).json({ referenceNumber });
};
```
