import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import NotificationHistoryPage from '../NotificationHistoryPage';
import api from '../../api/client';
import { BrowserRouter } from 'react-router-dom';

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

    // Find the button for the first unread notification
    // The button text is "Mark Read" if unread, "Read" if read.
    // We want the one for item '1' (unread).
    const markReadBtn = screen.getAllByTitle('Mark as Read')[0];
    fireEvent.click(markReadBtn);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/notifications/read', { ids: ['1'] });
    });
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
