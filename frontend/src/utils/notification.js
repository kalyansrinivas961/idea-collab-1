/**
 * Determines the appropriate URL for a notification based on its related model and ID.
 * 
 * @param {Object} notification - The notification object
 * @returns {string} The URL to redirect to
 */
export const getNotificationUrl = (notification) => {
  if (!notification) return "/notifications";

  const { relatedModel, relatedId } = notification;

  switch (relatedModel) {
    case "FollowRequest":
      return "/follow-requests";
    case "CollaborationRequest":
      return "/collaborations";
    case "Idea":
      return `/ideas/${relatedId}`;
    case "User":
      return `/user/${relatedId}`;
    default:
      return "/notifications";
  }
};
