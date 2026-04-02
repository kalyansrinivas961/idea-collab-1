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

### Backend: Soft-Delete Implementation
Located in [qaController.js](file:///z:/Final%20Year%20Project/idea-collab-trae/idea-collab-1/backend/src/controllers/qaController.js).

```javascript
exports.deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await Problem.findById(id);
    if (problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Soft-delete: mark as deleted instead of removing from DB
    problem.isDeleted = true;
    problem.deletedAt = new Date();
    await problem.save();

    // Cascade: soft-delete all associated solutions
    await Solution.updateMany(
      { problemId: id },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```
