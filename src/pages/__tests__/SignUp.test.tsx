import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import SignUp from '../SignUp';

// Mock Supabase client
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn().mockResolvedValue({ 
        data: { 
          user: { 
            id: 'test-user-id' 
          } 
        }, 
        error: null 
      })
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockResolvedValue({ error: null })
  }
}));

describe('SignUp Component', () => {
  it('should handle successful signup', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.click(screen.getByLabelText(/business/i));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for async operations
    await waitFor(() => {
      // Verify success actions
      expect(screen.getByText(/account created/i)).toBeInTheDocument();
    });
  });

  it('should handle signup error', async () => {
    // Setup error mock
    const { supabase } = await import('../../integrations/supabase/client');
    supabase.auth.signUp.mockResolvedValueOnce({ 
      data: null, 
      error: { message: 'Signup failed' } 
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for async operations
    await waitFor(() => {
      // Verify error handling
      expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
    });
  });
});