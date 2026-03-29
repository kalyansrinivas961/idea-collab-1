/**
 * @typedef {Object} SocialLinks
 * @property {string} github
 * @property {string} linkedin
 * @property {string} twitter
 * @property {string} portfolio
 */

/**
 * @typedef {Object} PrivacySettings
 * @property {boolean} showEmail
 * @property {boolean} showLocation
 * @property {boolean} allowDirectMessages
 * @property {'public' | 'connections' | 'private'} profileVisibility
 */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {'Active' | 'Inactive' | 'Suspended'} status
 * @property {string} avatarUrl
 * @property {string} headline
 * @property {string[]} skills
 * @property {string} location
 * @property {string} bio
 * @property {SocialLinks} socialLinks
 * @property {PrivacySettings} privacySettings
 * @property {string[]} savedIdeas
 * @property {string[]} followers
 * @property {string[]} following
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Normalizes user data from the API to ensure it conforms to the standard structure.
 * @param {any} userData - Raw user data from API
 * @returns {User} Normalized user object
 */
export const normalizeUser = (userData) => {
  if (!userData) return null;

  return {
    _id: userData._id || '',
    name: userData.name || '',
    email: userData.email || '',
    role: userData.role || 'Developer',
    status: userData.status || 'Active',
    avatarUrl: userData.avatarUrl || '',
    headline: userData.headline || '',
    skills: Array.isArray(userData.skills) ? userData.skills : [],
    location: userData.location || '',
    bio: userData.bio || '',
    socialLinks: {
      github: userData.socialLinks?.github || '',
      linkedin: userData.socialLinks?.linkedin || '',
      twitter: userData.socialLinks?.twitter || '',
      portfolio: userData.socialLinks?.portfolio || '',
    },
    privacySettings: {
      showEmail: !!userData.privacySettings?.showEmail,
      showLocation: userData.privacySettings?.showLocation !== false,
      allowDirectMessages: userData.privacySettings?.allowDirectMessages !== false,
      profileVisibility: userData.privacySettings?.profileVisibility || 'public',
    },
    savedIdeas: Array.isArray(userData.savedIdeas) ? userData.savedIdeas : [],
    followers: Array.isArray(userData.followers) ? userData.followers : [],
    following: Array.isArray(userData.following) ? userData.following : [],
    createdAt: userData.createdAt || '',
    updatedAt: userData.updatedAt || '',
  };
};

/**
 * Checks if a user profile is complete.
 * @param {User} user 
 * @returns {number} Completion percentage (0-100)
 */
export const calculateProfileCompletion = (user) => {
  if (!user) return 0;
  
  const fields = [
    !!user.avatarUrl,
    !!user.bio,
    user.skills.length > 0,
    !!user.location,
    !!user.headline,
    Object.values(user.socialLinks).some(link => !!link)
  ];
  
  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
};
