# Project Feature Inventory

## 1. Executive Summary
This project is a Collaborative Idea Platform (Idea Collab) designed to facilitate idea sharing, team formation, and real-time communication. It features a full-stack MERN architecture (MongoDB, Express, React, Node.js) with real-time capabilities via Socket.io. The platform allows users to post ideas, request collaboration, chat in real-time, and manage their professional profile.

## 2. Functional Specifications

### 2.1 User Authentication & Management
*   **Registration**: Users can create accounts with name, email, and password.
*   **Login**: Secure authentication using JSON Web Tokens (JWT).
*   **Profile Management**:
    *   Update profile details (Headline, Bio, Skills, Location).
    *   Upload profile avatar (handled via Multer).
    *   Add social media links (GitHub, LinkedIn, Website).
*   **User Discovery**: Search users by name, skills, or headline.
*   **Social Graph**: Follow/Unfollow mechanism to build connections.

### 2.2 Idea Management
*   **Create Idea**: Users can post ideas with title, description, category, tags, and visibility settings.
*   **Visibility Controls**:
    *   *Public*: Visible to everyone.
    *   *Connections*: Visible only to followers/following.
    *   *Private*: Visible only to the creator.
*   **Engagement**:
    *   **Likes**: Toggle like status on ideas.
    *   **Comments**: Threaded discussions with permission controls (Anyone, Connections, No one).
    *   **Save**: Bookmark ideas for later reference.
*   **Search & Filter**: Filter ideas by category or search keywords.

### 2.3 Collaboration System
*   **Request Workflow**: Users can request to collaborate on specific ideas.
*   **Request Management**: Idea owners can Accept or Reject incoming requests.
*   **Status Tracking**: View status of outgoing requests (Pending, Accepted, Rejected).
*   **Real-time Notifications**: Badges and alerts for new requests.

### 2.4 Real-time Communication (Chat)
*   **Direct Messaging**: One-on-one private chats between users.
*   **Group Chat**: Create groups, add members, and assign admins.
*   **Rich Media**:
    *   File sharing (Images/Docs).
    *   Emoji picker integration.
*   **Message Features**:
    *   Read receipts (Double ticks).
    *   Unread message counters.
    *   Message deletion (Soft delete).
    *   Date separators in chat history.

## 3. User-Facing Capabilities (Frontend)

| Page | Description | Key Components |
| :--- | :--- | :--- |
| **Dashboard** | Personalized hub showing stats, recommended users, and quick actions. | `DashboardStats`, `RecommendedUsers` |
| **Community** | User directory with search functionality. | `UserCard`, `SearchBar` |
| **Ideas Feed** | List of all accessible ideas with filtering options. | `IdeaCard`, `CategoryFilter` |
| **Add Idea** | Form to submit new ideas with privacy settings. | `VisibilityDropdown`, `TagInput` |
| **Idea Details** | Full view of an idea with collaboration request and comments. | `CommentSection`, `LikeButton`, `SaveButton` |
| **Chat** | Real-time messaging interface with sidebar and chat window. | `ChatSidebar`, `ChatWindow`, `MessageInput` |
| **Profile** | User's public profile displaying info and created ideas. | `ProfileHeader`, `IdeaList` |
| **Collaborations** | Dashboard for managing incoming/outgoing requests. | `RequestCard` |

## 4. Backend Services & API Endpoints

### 4.1 Auth Service (`/api/auth`)
*   `POST /register`: Register a new user.
*   `POST /login`: Authenticate user and return JWT.

### 4.2 User Service (`/api/users`)
*   `GET /me`: Get current user details.
*   `GET /search`: Search for users.
*   `PUT /profile`: Update user profile.
*   `POST /:id/follow`: Follow a user.
*   `POST /:id/unfollow`: Unfollow a user.

### 4.3 Idea Service (`/api/ideas`)
*   `POST /`: Create a new idea.
*   `GET /`: Get all ideas (with filters).
*   `GET /:id`: Get specific idea details.
*   `PUT /:id/like`: Toggle like on an idea.
*   `POST /:id/comments`: Add a comment.

### 4.4 Chat Service (`/api/chat`)
*   `POST /send`: Send a message.
*   `GET /conversations`: Get user's conversation list.
*   `GET /messages/:conversationId`: Get message history.
*   `POST /group`: Create a group chat.

### 4.5 Collaboration Service (`/api/collaborations`)
*   `POST /requests`: Send a collaboration request.
*   `GET /requests`: Get all incoming/outgoing requests.
*   `PUT /requests/:id`: Update request status (Accept/Reject).

## 5. Database Schemas (MongoDB)

### 5.1 User Model
*   **Fields**: `name`, `email`, `password`, `headline`, `bio`, `skills` (Array), `location`, `socialLinks` (Object), `followers` (Ref), `following` (Ref), `savedIdeas` (Ref).

### 5.2 Idea Model
*   **Fields**: `title`, `description`, `owner` (Ref User), `tags` (Array), `category`, `likes` (Array of User IDs), `comments` (Embedded Array), `visibility` (Enum), `allowedCommenters` (Enum).

### 5.3 Conversation Model
*   **Fields**: `participants` (Array of Ref User), `isGroup` (Boolean), `groupName`, `admin` (Ref User), `lastMessage` (Ref Message).

### 5.4 Message Model
*   **Fields**: `conversationId`, `sender` (Ref User), `text`, `attachments` (Array), `readBy` (Array), `createdAt`.

## 6. Third-Party Integrations
*   **Socket.io**: Enables real-time bi-directional event-based communication.
*   **Multer**: Middleware for handling `multipart/form-data` (file uploads).
*   **Emoji Picker React**: Frontend library for emoji selection.
*   **Bcryptjs**: Library for hashing passwords.
*   **JsonWebToken**: Library for generating and verifying auth tokens.
*   **TailwindCSS**: Utility-first CSS framework for styling.

## 7. Security Implementations
*   **JWT Authentication**: Stateless authentication mechanism; tokens are required for all protected routes via `authMiddleware.js`.
*   **Password Hashing**: Passwords are hashed using `bcrypt` before storage.
*   **Authorization Checks**: Backend logic ensures users can only modify their own data (e.g., only idea owner can delete idea).
*   **CORS**: Configured to allow requests from specific frontend origins.
*   **Environment Variables**: Sensitive data (DB URI, JWT Secret) stored in `.env` files.

## 8. Performance & Optimization
*   **React Context API**: Efficient global state management for Authentication and User data to reduce prop drilling.
*   **Socket.io Rooms**: Optimized real-time broadcasting by using rooms for specific conversations and user-specific notifications.
*   **Database Indexing**: Implicit indexing on MongoDB `_id` and foreign keys for faster lookups.

## 9. Unique Technical Solutions
*   **Dual-Scope Visibility**: The `visibility` and `allowedCommenters` fields allow granular control over content privacy, mimicking professional network standards (e.g., LinkedIn).
*   **Unified Collaboration Hub**: The `CollaborationRequestsPage` aggregates both incoming (actionable) and outgoing (tracking) requests in a single view for better UX.
## 10. Implementation Status & Future Improvements

While the core functionality of the platform is robust, certain features are currently in a partial state of implementation, offering opportunities for future enhancement:

| Feature | Current Status | Missing Capabilities |
| :--- | :--- | :--- |
| **Group Chat** | **Partial** | Users can create groups and chat, but cannot leave groups, remove members, or update group info (name/avatar) after creation. |
| **Notifications** | **Partial** | Real-time toasts and badges work, but there is no persistent "Notification History" page to view past alerts. |
| **Search** | **Basic** | Search is implemented using regex matching. It lacks advanced filtering (by date, popularity) and full-text search engine capabilities. |
| **User Settings** | **Basic** | Users can update profile text, but cannot change their password or email address via the UI. |
| **Media Handling** | **Basic** | File uploads are stored locally on the server filesystem. Integration with cloud storage (AWS S3/Cloudinary) is recommended for scalability. |

