const CollaborationRequest = require("../models/CollaborationRequest");
const Idea = require("../models/Idea");
const { createNotification } = require("./notificationController");

// Send a collaboration request
exports.createRequest = async (req, res) => {
  const { ideaId, message } = req.body;

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot send a request to your own idea" });
    }

    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      sender: req.user._id,
      idea: ideaId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already pending" });
    }
    
    // Check if already a collaborator
    if (idea.collaborators.includes(req.user._id)) {
        return res.status(400).json({ message: "You are already a collaborator" });
    }

    const request = new CollaborationRequest({
      sender: req.user._id,
      receiver: idea.owner,
      idea: ideaId,
      message,
    });

    const createdRequest = await request.save();
    
    // Populate for response
    await createdRequest.populate("sender", "name avatarUrl headline");
    await createdRequest.populate("idea", "title");

    // Create persistent notification
    await createNotification(req, {
      recipient: idea.owner,
      type: "info",
      title: "Collaboration Request",
      message: `${req.user.name} requested to collaborate on "${idea.title}"`,
      relatedId: createdRequest._id,
      relatedModel: "CollaborationRequest",
    });

    // Optional: Emit socket event to receiver (Handled by createNotification now, but 'collaboration:request' might be used for badge count)
    // We keep 'collaboration:request' if frontend relies on it specifically for badge count, 
    // OR we update frontend to use notification count.
    // The Layout.jsx uses 'collaboration:request' to increment pendingCount.
    // So we should keep emitting it OR update createNotification to support custom events.
    // Since createNotification emits 'notification:new', we might need both.
    // Let's keep the specific event for now to not break existing badge logic, or update frontend later.
    req.io.to(idea.owner.toString()).emit("collaboration:request", createdRequest);

    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get requests received by the current user
exports.getRequestsForMe = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ receiver: req.user._id })
      .populate("sender", "name avatarUrl headline role")
      .populate("idea", "title")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get requests sent by the current user
exports.getRequestsByMe = async (req, res) => {
  try {
    const requests = await CollaborationRequest.find({ sender: req.user._id })
      .populate("receiver", "name avatarUrl")
      .populate("idea", "title")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update request status (accept/reject)
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body; // "accepted" or "rejected"
  const { id } = req.params;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const request = await CollaborationRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = status;
    await request.save();

    if (status === "accepted") {
      const idea = await Idea.findById(request.idea);
      if (idea) {
        if (!idea.collaborators.includes(request.sender)) {
          idea.collaborators.push(request.sender);
          await idea.save();
        }
      }

      // Notify sender
      await createNotification(req, {
        recipient: request.sender,
        type: "success",
        title: "Request Accepted",
        message: `Your request to collaborate on "${request.idea.title}" was accepted`,
        relatedId: request.idea,
        relatedModel: "Idea",
      });
    } else if (status === "rejected") {
       // Notify sender
       await createNotification(req, {
        recipient: request.sender,
        type: "error",
        title: "Request Rejected",
        message: `Your request to collaborate on "${request.idea.title}" was rejected`,
        relatedId: request.idea,
        relatedModel: "Idea",
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests (incoming and outgoing) for the current user
exports.getAllRequests = async (req, res) => {
  try {
    const incoming = await CollaborationRequest.find({ receiver: req.user._id })
      .populate("sender", "name avatarUrl headline role")
      .populate("idea", "title")
      .sort({ createdAt: -1 });

    const outgoing = await CollaborationRequest.find({ sender: req.user._id })
      .populate("receiver", "name avatarUrl")
      .populate("idea", "title")
      .sort({ createdAt: -1 });

    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPendingRequestCount = async (req, res) => {
  try {
    const count = await CollaborationRequest.countDocuments({
      receiver: req.user._id,
      status: "pending",
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
