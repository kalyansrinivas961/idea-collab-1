import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProfilePage from '../ProfilePage';
import api from '../../api/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    circle: ({ ...props }) => <circle {...props} />,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Lucide Icons
vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Mail: () => <div />,
  MapPin: () => <div />,
  Globe: () => <div />,
  Github: () => <div />,
  Linkedin: () => <div />,
  Twitter: () => <div />,
  Camera: () => <div />,
  Shield: () => <div />,
  Activity: () => <div />,
  BarChart3: () => <div />,
  Settings: () => <div />,
  LogOut: () => <div />,
  CheckCircle2: () => <div />,
  AlertCircle: () => <div />,
  Plus: () => <div />,
  Trash2: () => <div />,
  ExternalLink: () => <div />,
  ChevronRight: () => <div />,
  Briefcase: () => <div />,
}));

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

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock AuthContext
const mockLogout = vi.fn();
const mockUpdateUser = vi.fn();
const mockUser = {
  _id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'Developer',
  headline: 'Senior Developer',
  skills: ['React', 'Node'],
  avatarUrl: 'https://example.com/avatar.jpg',
  socialLinks: {
    github: 'https://github.com/test',
    linkedin: '',
    twitter: '',
    portfolio: ''
  },
  privacySettings: {
    showEmail: false,
    showLocation: true,
    allowDirectMessages: true,
    profileVisibility: 'public'
  },
  createdAt: '2023-01-01T00:00:00.000Z',
};

const renderWithAuth = (ui) => {
  return render(
    <AuthContext.Provider value={{ user: mockUser, logout: mockLogout, updateUser: mockUpdateUser }}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === '/users/stats') {
        return Promise.resolve({ data: { followersCount: 10, followingCount: 5, ideasCount: 3, totalLikes: 20, collaborationsCount: 7 } });
      }
      if (url === '/users/activity') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it('renders profile header with user information', async () => {
    renderWithAuth(<ProfilePage />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders account statistics', async () => {
    renderWithAuth(<ProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Followers
      expect(screen.getByText('5')).toBeInTheDocument();  // Following
      expect(screen.getByText('3')).toBeInTheDocument();  // Ideas
      expect(screen.getByText('7')).toBeInTheDocument();  // Collaborations
    });
  });

  it('switches between tabs', async () => {
    renderWithAuth(<ProfilePage />);
    
    const activityTab = screen.getByText('Activity Timeline');
    fireEvent.click(activityTab);
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    
    const statsTab = screen.getByText('Insights');
    fireEvent.click(statsTab);
    expect(screen.getByText('Performance Insights')).toBeInTheDocument();

    const settingsTab = screen.getByText('Privacy & Security');
    fireEvent.click(settingsTab);
    expect(screen.getByText('Privacy Settings')).toBeInTheDocument();
  });

  it('updates profile information', async () => {
    api.put.mockResolvedValue({ data: { ...mockUser, name: 'Updated Name' } });
    renderWithAuth(<ProfilePage />);
    
    const nameInput = screen.getByPlaceholderText('Your Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name', name: 'name' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
      expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Name' }));
    });
  });

  it('handles logout correctly from header button', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithAuth(<ProfilePage />);
    
    const headerLogoutBtn = screen.getByLabelText('Logout Account');
    fireEvent.click(headerLogoutBtn);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to log out?');
    expect(mockLogout).toHaveBeenCalled();
  });

  it('handles logout correctly from settings tab', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderWithAuth(<ProfilePage />);
    
    // Go to settings tab where the other logout is located
    const settingsTab = screen.getByText('Privacy & Security');
    fireEvent.click(settingsTab);
    
    const dangerLogoutBtn = screen.getByText('Logout Account');
    fireEvent.click(dangerLogoutBtn);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
