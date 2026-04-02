import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ChatPage from './ChatPage';

describe('ChatPage', () => {
  it('should open the chat box when a user is selected', () => {
    render(<ChatPage />);

    // Simulate a user clicking on a conversation
    fireEvent.click(screen.getByText('John Doe'));

    // Check if the chat box is visible
    expect(screen.getByText('Type a message...')).toBeInTheDocument();
  });
});
