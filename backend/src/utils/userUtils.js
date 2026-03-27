/**
 * Formats a user object into a standardized structure for API responses.
 * Ensures consistency across authentication and user-related endpoints.
 * 
 * Standard structure:
 * - _id: Unique User ID
 * - name: Display name
 * - email: User email (often excluded for public profiles)
 * - role: User professional role (Developer, Designer, etc.)
 * - status: Account status (Active, Inactive, Suspended)
 * - avatarUrl: URL to the user's profile picture
 * - headline: Professional headline
 * - skills: Array of professional skills
 * - location: User's location
 * - bio: Professional bio
 * - socialLinks: Links to external profiles (GitHub, LinkedIn, etc.)
 * - privacySettings: User preferences for visibility and interactions
 * - savedIdeas: Array of Idea IDs the user has saved
 * - followers: Array of User IDs following this user
 * - following: Array of User IDs this user follows
 * - createdAt: Timestamp of account creation
 * - updatedAt: Timestamp of last profile update
 */
exports.formatUserResponse = (user) => {
  if (!user) return null;

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status || "Active",
    avatarUrl: user.avatarUrl,
    headline: user.headline || "",
    skills: user.skills || [],
    location: user.location || "",
    bio: user.bio || "",
    socialLinks: user.socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
      portfolio: "",
    },
    privacySettings: user.privacySettings || {
      showEmail: false,
      showLocation: true,
      allowDirectMessages: true,
      profileVisibility: "public"
    },
    savedIdeas: user.savedIdeas || [],
    followers: user.followers || [],
    following: user.following || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};
