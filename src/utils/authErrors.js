/** User-friendly messages for Supabase Auth & API errors */
export function formatAuthError(message = '') {
  const lower = String(message).toLowerCase();

  if (lower.includes('rate limit') || lower.includes('email rate')) {
    return 'Too many emails sent. Wait about an hour, or turn off email confirmation in Supabase (Authentication → Providers → Email).';
  }
  if (lower.includes('already registered') || lower.includes('already been registered') || lower.includes('user already registered')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return 'Invalid email or password. Please check and try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email first, then sign in.';
  }
  if (lower.includes('not authenticated') || lower.includes('unauthorized')) {
    return 'Your session expired. Please sign in again.';
  }
  if (lower.includes('password should be at least') || lower.includes('weak password')) {
    return 'Password is too weak. Use at least 6 characters.';
  }
  if (lower.includes('unable to validate email') || lower.includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  if (lower.includes('not found') || lower.includes('not_found')) {
    return 'Server setup incomplete. Run: supabase functions deploy wellness-api';
  }
  if (lower.includes('could not reach') || lower.includes('redploy')) {
    return message;
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Could not reach Supabase. Redeploy the Edge Function: supabase functions deploy wellness-api';
  }

  return message || 'Something went wrong. Please try again.';
}

export function formatApiError(message = '') {
  const lower = String(message).toLowerCase();

  if (lower.includes('registration server needs updating')) {
    return message;
  }
  if (lower.includes('network') || lower.includes('failed to fetch') || lower.includes('could not reach')) {
    return 'Could not reach Supabase. Redeploy: supabase functions deploy wellness-api';
  }

  return formatAuthError(message);
}
