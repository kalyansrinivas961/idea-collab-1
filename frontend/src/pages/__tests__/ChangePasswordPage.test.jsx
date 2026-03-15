import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ChangePasswordPage from '../ChangePasswordPage';
import api from '../../api/client';
import { BrowserRouter } from 'react-router-dom';

// Mock API
vi.mock('../../api/client', () => ({
  default: {
    put: vi.fn(),
  },
}));

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'current123' } });
    fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: 'NewPass1!' } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: 'Mismatch' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    expect(await screen.findByText(/new passwords do not match/i)).toBeInTheDocument();
  });

  it('validates password strength', async () => {
    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'Current123!' } });
    fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: 'weak' } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: 'weak' } });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    
    expect(await screen.findByText(/please meet all password requirements/i)).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    api.put.mockResolvedValue({ data: { message: 'Success' } });

    render(
      <BrowserRouter>
        <ChangePasswordPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'Current1!' } });
    fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: 'NewPass1!' } });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: 'NewPass1!' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/auth/password', {
        currentPassword: 'Current1!',
        newPassword: 'NewPass1!',
      });
      expect(screen.getByText(/password updated successfully/i)).toBeInTheDocument();
    });
  });
});
