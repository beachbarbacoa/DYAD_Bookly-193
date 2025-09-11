import { logError } from '@/utils/errorLogger';

// In the handleSignUp function:
catch (error) {
  await logError(error, 'user-signup');
  showError(error instanceof Error ? error.message : 'Database error creating new user');
}