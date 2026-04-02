# Idea Collab - Technical Documentation

Idea Collab is a comprehensive full-stack platform designed to facilitate startup idea sharing, team formation, and real-time collaboration. This document provides a detailed overview of the project's architecture, features, and technical specifications.

## 1. System Architecture

The project follows a modern client-server architecture:

- **Frontend**: A Single Page Application (SPA) built with React and Vite, utilizing Tailwind CSS for styling and Framer Motion for animations.
- **Backend**: A RESTful API built with Node.js and Express.js, using Socket.io for real-time bidirectional communication.
- **Database**: MongoDB (NoSQL) for flexible data storage, managed through the Mongoose ODM.
- **Real-time Engine**: Socket.io handles instant notifications, typing indicators, and chat messaging.
- **AI Integration**: Groq SDK powers AI-assisted features like idea description enhancement and AI chat.

## 2. Technology Stack

### Backend
- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Data persistence and modeling.
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Socket.io**: Real-time communication.
- **Multer**: Middleware for handling `multipart/form-data` (file uploads).
- **Bcryptjs**: Password hashing and security.
- **Groq SDK**: AI model integration.
- **Nodemailer**: Email service for OTP and notifications.

### Frontend
- **React**: Component-based UI library.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Router Dom**: Client-side routing.
- **Context API**: State management for Authentication and Theme.
- **Axios**: HTTP client for API communication.
- **Socket.io-client**: Frontend integration for real-time features.
- **Framer Motion**: Animation library for a smooth UX.
- **Lucide React**: Icon set.

---

## 3. Database Schema (Mongoose Models)

### User Model
- `name`: String (Required)
- `email`: String (Unique, Required)
- `password`: String (Hashed)
- `googleId`: String (Optional, for OAuth)
- `role`: String (e.g., Developer, Designer)
- `avatarUrl`: String
- `skills`: Array of Strings
- `socialLinks`: Object (GitHub, LinkedIn, Twitter, Portfolio)
- `privacySettings`: Object (Profile visibility, DM settings)
- `followers`/`following`: Array of ObjectIds (Ref: User)
- `reputation`: Number

### Idea Model
- `title`: String (Required)
- `description`: String (Required)
- `category`: String (Required)
- `tags`: Array of Strings
- `owner`: ObjectId (Ref: User)
- `collaborators`: Array of ObjectIds (Ref: User)
- `likes`: Array of ObjectIds (Ref: User)
- `attachments`: Array of Objects (URL, Type, Name)
- `comments`: Array of Objects (User Ref, Text, Timestamp)

### Message Model
- `sender`: ObjectId (Ref: User)
- `conversationId`: ObjectId (Ref: Conversation)
- `content`: String
- `attachment`: Object (URL, Type, Name)
- `replyTo`: ObjectId (Ref: Message)
- `translations`: Map (Language -> Content)

---

## 4. API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user.
- `POST /login`: Login and receive JWT.
- `POST /google`: Google OAuth login.
- `POST /send-otp`: Request OTP for email verification or password reset.
- `PUT /password`: Change password (Protected).

### Ideas (`/api/ideas`)
- `GET /`: Get all public ideas.
- `POST /`: Create a new idea (Protected, handles file uploads).
- `GET /:id`: Get idea details.
- `PUT /:id/like`: Toggle like on an idea.
- `POST /:id/comments`: Add a comment.

### Chat (`/api/messages`)
- `GET /conversations`: Get all active conversations.
- `GET /:userId`: Get message history with a specific user.
- `POST /`: Send a message (Handles attachments).
- `POST /group`: Create a group chat.

---

## 5. Key Features & Workflows

### 1. Idea Management
Users can post startup ideas with detailed descriptions, categories, and tags. They can upload relevant documents or images to support their vision.

### 2. Real-time Collaboration
The collaboration request system allows users to apply to join an idea's team. Idea owners can review, accept, or reject requests, triggering real-time notifications.

### 3. Professional Networking
Users can follow each other, view professional profiles, and discover potential collaborators based on skills and interests.

### 4. Q&A (Problem Solving)
A dedicated space where users can post technical or operational problems. The community can provide solutions, which can be upvoted or accepted by the author.

### 5. AI Assistant
Integrated AI helps users refine their idea descriptions and provides an interactive chat interface for brainstorming and technical advice.

---

## 6. Security Implementation
- **JWT Authentication**: All sensitive routes are protected by a `protect` middleware that verifies the JWT in the Authorization header.
- **Rate Limiting**: Critical endpoints (login, OTP, follow) are rate-limited to prevent brute-force and spam.
- **Password Hashing**: Bcryptjs is used for hashing passwords before storage.
- **CORS Configuration**: Strict CORS policy to allow only trusted origins.
- **Input Validation**: Server-side validation for all incoming data.

## 7. Setup Instructions for Developers

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation
1. Clone the repository.
2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env with: PORT, MONGO_URI, JWT_SECRET, GROQ_API_KEY, EMAIL_USER, EMAIL_PASS
   npm run dev
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create .env with: VITE_API_URL
   npm run dev
   ```

---

## 8. Maintenance Guidelines
- **Database Backups**: Regularly backup MongoDB data.
- **Log Monitoring**: Check `ActivityLog` for unusual patterns.
- **Update Dependencies**: Regularly run `npm update` to keep packages secure.
- **Moderation**: Use the Admin Dashboard to review reports and manage content.
