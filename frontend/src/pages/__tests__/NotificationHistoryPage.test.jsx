import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import NotificationHistoryPage from '../NotificationHistoryPage';
import api from '../../api/client';
import { BrowserRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Layout
vi.mock('../../components/Layout', () => ({
  default: ({ children }) => <div data-testid="layout">{children}</div>,
}));

// Mock API
vi.mock('../../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    create: vi.fn().mockReturnThis(),
    interceptors: { request: { use: vi.fn() } },
  },
}));

// Mock Socket
vi.mock('../../api/socket', () => ({
  default: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

describe('NotificationHistoryPage', () => {
  const mockNotifications = [
    {
      _id: '1',
      type: 'info',
      title: 'Test Notification',
      message: 'This is a test',
      createdAt: new Date().toISOString(),
      isRead: false,
    },
    {
      _id: '2',
      type: 'success',
      title: 'Success Notification',
      message: 'This is a success',
      createdAt: new Date().toISOString(),
      isRead: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({
      data: {
        notifications: mockNotifications,
        total: 2,
        totalPages: 1,
        currentPage: 1,
        unreadCount: 1,
      },
    });
  });

  it('renders notification list correctly', async () => {
    render(
      <BrowserRouter>
        <NotificationHistoryPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Notification History/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
      expect(screen.getByText('Success Notification')).toBeInTheDocument();
    });
  });

  it('filters notifications', async () => {
    render(
      <BrowserRouter>
        <NotificationHistoryPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Test Notification'));

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'info' } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/notifications', expect.objectContaining({
        params: expect.objectContaining({ type: 'info' })
      }));
    });
  });

  it('marks notification as read', async () => {
    api.put.mockResolvedValue({});
    render(
      <BrowserRouter>
        <NotificationHistoryPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Test Notification'));

    const markReadBtn = screen.getAllByTitle('Mark as Read')[0];
    fireEvent.click(markReadBtn);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/notifications/read', { ids: ['1'] });
    });
  });

  it('navigates to the correct URL when a notification is clicked', async () => {
    const mockFollowNotif = {
      _id: '3',
      type: 'info',
      title: 'Follow Request',
      message: 'Someone wants to follow you',
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedModel: 'FollowRequest',
    };

    api.get.mockResolvedValueOnce({
      data: {
        notifications: [mockFollowNotif],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        unreadCount: 1,
      },
    });

    render(
      <BrowserRouter>
        <NotificationHistoryPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Follow Request'));

    const notificationContent = screen.getByText('Someone wants to follow you');
    fireEvent.click(notificationContent);

    expect(mockNavigate).toHaveBeenCalledWith('/follow-requests');
  });

  it('navigates to collaborations when a collaboration request is clicked', async () => {
    const mockCollabNotif = {
      _id: '4',
      type: 'info',
      title: 'Collaboration Request',
      message: 'Someone wants to collaborate',
      createdAt: new Date().toISOString(),
      isRead: false,
      relatedModel: 'CollaborationRequest',
    };

    api.get.mockResolvedValueOnce({
      data: {
        notifications: [mockCollabNotif],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        unreadCount: 1,
      },
    });

    render(
      <BrowserRouter>
        <NotificationHistoryPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Collaboration Request'));

    const notificationContent = screen.getByText('Someone wants to collaborate');
    fireEvent.click(notificationContent);

    expect(mockNavigate).toHaveBeenCalledWith('/collaborations');
  });

  it('deletes notification', async () => {
    api.post.mockResolvedValue({});
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(
      <BrowserRouter>
        <NotificationHistoryPage />
      </BrowserRouter>
    );

    await waitFor(() => screen.getByText('Test Notification'));

    const deleteBtn = screen.getAllByTitle('Delete')[0];
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/notifications/delete', { ids: ['1'] });
    });
  });
});
