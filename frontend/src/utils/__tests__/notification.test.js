import { describe, it, expect } from 'vitest';
import { getNotificationUrl } from '../notification';

describe('getNotificationUrl', () => {
  it('returns /notifications for null/undefined input', () => {
    expect(getNotificationUrl(null)).toBe('/notifications');
    expect(getNotificationUrl(undefined)).toBe('/notifications');
  });

  it('returns /follow-requests for FollowRequest model', () => {
    const notification = { relatedModel: 'FollowRequest' };
    expect(getNotificationUrl(notification)).toBe('/follow-requests');
  });

  it('returns /collaborations for CollaborationRequest model', () => {
    const notification = { relatedModel: 'CollaborationRequest' };
    expect(getNotificationUrl(notification)).toBe('/collaborations');
  });

  it('returns /ideas/:id for Idea model', () => {
    const notification = { relatedModel: 'Idea', relatedId: 'idea123' };
    expect(getNotificationUrl(notification)).toBe('/ideas/idea123');
  });

  it('returns /user/:id for User model', () => {
    const notification = { relatedModel: 'User', relatedId: 'user456' };
    expect(getNotificationUrl(notification)).toBe('/user/user456');
  });

  it('returns /notifications for unknown models', () => {
    const notification = { relatedModel: 'Unknown' };
    expect(getNotificationUrl(notification)).toBe('/notifications');
  });
});
