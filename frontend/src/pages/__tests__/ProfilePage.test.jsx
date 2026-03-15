import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProfilePage from '../ProfilePage';
import api from '../../api/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

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
  },
}));

// Mock AuthContext
const mockLogout = vi.fn();
const mockUser = {
  _id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'Developer',
  skills: ['React', 'Node'],
  followers: [],
  following: [],
};

const renderWithAuth = (ui) => {
  return render(
    <AuthContext.Provider value={{ user: mockUser, logout: mockLogout, updateUser: vi.fn() }}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: [] }); // Default for user ideas
  });

  it('renders profile information', async () => {
    renderWithAuth(<ProfilePage />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('shows logout confirmation modal on logout click', () => {
    renderWithAuth(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to log out of your account?')).toBeInTheDocument();
  });

  it('hides modal when cancel is clicked', () => {
    renderWithAuth(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
  });

  it('calls logout function when logout is confirmed', () => {
    renderWithAuth(<ProfilePage />);
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);
    
    // There are two "Logout" buttons now (one in profile, one in modal). 
    // The modal one is the last one usually, or we can look for it within the modal container if we had a testid.
    // Or simpler: get all buttons with name Logout and click the second one (or the one in the modal).
    // The modal text is "Logout", the profile button is "Logout" (with icon).
    
    // Let's use getByText for the modal button specifically if possible, or getAllByRole.
    const confirmLogoutButton = screen.getAllByRole('button', { name: /logout/i })[1];
    fireEvent.click(confirmLogoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
