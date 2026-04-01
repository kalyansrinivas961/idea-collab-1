const Report = require("../models/Report");
const Idea = require("../models/Idea");
const User = require("../models/User");
const { createNotification } = require("./notificationController");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Create a new report
exports.createReport = async (req, res) => {
  const { ideaId, category, context } = req.body;

  // 1. Mandatory context validation (500 character minimum as requested)
  if (!context || context.length < 500) {
    return res.status(400).json({ 
      message: "Context is mandatory and must be at least 500 characters long.",
      currentLength: context ? context.length : 0
    });
  }

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // 2. Prevent duplicate reports from same user within 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReport = await Report.findOne({
      reporter: req.user._id,
      idea: ideaId,
      createdAt: { $gte: last24Hours }
    });

    if (existingReport) {
      return res.status(400).json({ 
        message: "You have already reported this idea in the last 24 hours. Please wait for moderation." 
      });
    }

    // 3. Generate reference number
    const referenceNumber = `REP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const report = new Report({
      reporter: req.user._id,
      idea: ideaId,
      category,
      context,
      referenceNumber
    });

    const savedReport = await report.save();

    // 4. Automated Notification System (Moderation Team Alert)
    // For this project, let's assume all users with role 'admin' are moderators.
    const admins = await User.find({ role: "admin" });
    
    // Alert via dashboard notifications and email
    const notificationPromises = admins.map(admin => 
      createNotification(req, {
        recipient: admin._id,
        type: "error", // High priority
        title: "New Content Report",
        message: `A new report (${referenceNumber}) has been submitted for idea: "${idea.title}"`,
        relatedId: savedReport._id,
        relatedModel: "Report",
      })
    );

    // Alert via email (Mock/Real depending on SMTP)
    const emailPromises = admins.map(admin => 
      sendEmail({
        email: admin.email,
        subject: `[MODERATION] New Report: ${referenceNumber}`,
        message: `A new report has been submitted.\n\nIdea: ${idea.title}\nCategory: ${category}\nReporter: ${req.user.name}\nReference: ${referenceNumber}\n\nPlease review in the dashboard.`,
        html: `<h3>New Content Report</h3>
               <p><strong>Reference:</strong> ${referenceNumber}</p>
               <p><strong>Idea:</strong> ${idea.title}</p>
               <p><strong>Category:</strong> ${category}</p>
               <p><strong>Reporter:</strong> ${req.user.name}</p>
               <p><strong>Context:</strong> ${context}</p>
               <hr>
               <p>Please log in to the moderation dashboard to take action.</p>`
      })
    );

    // We don't block the response for notifications/emails
    Promise.all([...notificationPromises, ...emailPromises]).catch(err => 
      console.error("Moderator alert failed:", err)
    );

    res.status(201).json({
      message: "Report received successfully.",
      referenceNumber: savedReport.referenceNumber,
      report: savedReport
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports (Moderator only)
exports.getAllReports = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Moderators only." });
  }

  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("idea", "title")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update report status (Moderator only)
exports.updateReportStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Moderators only." });
  }

  const { status } = req.body;
  if (!["pending", "reviewed", "resolved", "dismissed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    res.json({ message: `Report status updated to ${status}`, report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
