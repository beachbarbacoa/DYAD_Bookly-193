import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { SignUp } from '../SignUp';

// Mock Supabase client
vi.mock('../../integrations/supabase/client', () => {
  const mockAuth = {
    signUp: vi.fn(),
  };
  
  const mockFrom = vi.fn().mockReturnThis();
  const mockInsert = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockUpdate = vi.fn().mockResolvedValue({ error: null });
  
  return {
    supabase: {
      auth: mockAuth,
      from: mockFrom,
      insert: mockInsert,
      eq: mockEq,
      update: mockUpdate,
      rpc: vi.fn().mockResolvedValue({ error: null })
    }
  };
});

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
    (supabase.auth.signUp as any).mockResolvedValueOnce({
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

  it('should show duplicate email error when user already exists (database constraint)', async () => {
    // Setup error mock with 23505 code (duplicate key)
    const { supabase } = await import('../../integrations/supabase/client');
    (supabase.auth.signUp as any).mockResolvedValueOnce({
      data: null,
      error: {
        code: '23505',
        message: 'duplicate key value violates unique constraint'
      }
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
      // Verify duplicate email error handling
      expect(screen.getByText(/A user with this email already exists/i)).toBeInTheDocument();
    });
  });

  it('should show duplicate email error when user already exists (auth error)', async () => {
    // Setup error mock with email_already_in_use code
    const { supabase } = await import('../../integrations/supabase/client');
    (supabase.auth.signUp as any).mockResolvedValueOnce({
      data: null,
      error: {
        code: 'email_already_in_use',
        message: 'User already registered'
      }
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
      // Verify duplicate email error handling
      expect(screen.getByText(/A user with this email already exists/i)).toBeInTheDocument();
    });
  });

  it('should show duplicate email error when error message contains "already exists"', async () => {
    // Setup error mock with message containing "already exists"
    const { supabase } = await import('../../integrations/supabase/client');
    (supabase.auth.signUp as any).mockResolvedValueOnce({
      data: null,
      error: {
        message: 'User already exists in system'
      }
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
      // Verify duplicate email error handling
      expect(screen.getByText(/A user with this email already exists/i)).toBeInTheDocument();
    });
  });

  it('should show duplicate email error when error message contains "duplicate"', async () => {
    // Setup error mock with message containing "duplicate"
    const { supabase } = await import('../../integrations/supabase/client');
    (supabase.auth.signUp as any).mockResolvedValueOnce({
      data: null,
      error: {
        message: 'Duplicate entry for email'
      }
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
      // Verify duplicate email error handling
      expect(screen.getByText(/A user with this email already exists/i)).toBeInTheDocument();
    });
  });
});