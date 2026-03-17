import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserProfilePage from '../UserProfilePage';
import api from '../../api/client';
import { BrowserRouter, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    circle: ({ ...props }) => <circle {...props} />,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Lucide Icons
vi.mock('lucide-react', () => ({
  Mail: () => <div>Mail</div>,
  MapPin: () => <div>MapPin</div>,
  Globe: () => <div>Globe</div>,
  Github: () => <div>Github</div>,
  Linkedin: () => <div>Linkedin</div>,
  Twitter: () => <div>Twitter</div>,
  Shield: () => <div>Shield</div>,
  Activity: () => <div>Activity</div>,
  BarChart3: () => <div>BarChart3</div>,
  Briefcase: () => <div>Briefcase</div>,
  ExternalLink: () => <div>ExternalLink</div>,
  MessageCircle: () => <div>MessageCircle</div>,
  UserPlus: () => <div>UserPlus</div>,
  UserMinus: () => <div>UserMinus</div>,
  Clock: () => <div>Clock</div>,
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
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockUser = {
  _id: 'user2',
  name: 'Other User',
  email: 'other@example.com',
  role: 'Designer',
  headline: 'UI/UX Expert',
  skills: ['Figma', 'Sketch'],
  avatarUrl: '',
  status: 'Active',
  socialLinks: { github: 'github.com/other' },
  privacySettings: {
    showEmail: false,
    showLocation: true,
    allowDirectMessages: true,
    profileVisibility: 'public'
  },
  createdAt: '2023-01-01T00:00:00.000Z',
};

const mockCurrentUser = {
  _id: 'user1',
  name: 'Current User',
  following: [],
};

const renderWithAuth = (ui) => {
  return render(
    <AuthContext.Provider value={{ user: mockCurrentUser, updateUser: vi.fn() }}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe('UserProfilePage Restricted Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: 'user2' });
    
    api.get.mockImplementation((url) => {
      if (url === '/users/user2') return Promise.resolve({ data: mockUser });
      if (url === '/users/stats/user2') return Promise.resolve({ data: { followersCount: 0 } });
      if (url === '/users/activity/user2') return Promise.resolve({ data: [] });
      if (url === '/ideas/user/user2') return Promise.resolve({ data: [] });
      return Promise.reject(new Error('Not found'));
    });
  });

  it('renders other user profile correctly', async () => {
    renderWithAuth(<UserProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Other User')).toBeInTheDocument();
      expect(screen.getByText('UI/UX Expert')).toBeInTheDocument();
    });
  });

  it('hides email when privacy settings restrict it', async () => {
    renderWithAuth(<UserProfilePage />);
    
    await waitFor(() => {
      expect(screen.queryByText('other@example.com')).not.toBeInTheDocument();
    });
  });

  it('does not show edit buttons for other users', async () => {
    renderWithAuth(<UserProfilePage />);
    
    await waitFor(() => {
      expect(screen.queryByText('Edit My Profile')).not.toBeInTheDocument();
    });
  });

  it('restricts access when user is private', async () => {
    api.get.mockImplementation((url) => {
      if (url === '/users/user2') {
        return Promise.reject({ response: { status: 403 } });
      }
      return Promise.resolve({ data: {} });
    });

    renderWithAuth(<UserProfilePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Access Restricted')).toBeInTheDocument();
      expect(screen.getByText('You are not authorized to view this profile.')).toBeInTheDocument();
    });
  });

  it('allows follow action for other users', async () => {
    renderWithAuth(<UserProfilePage />);
    
    await waitFor(() => {
      const followBtn = screen.getByText('Follow');
      expect(followBtn).toBeInTheDocument();
    });
  });
});
