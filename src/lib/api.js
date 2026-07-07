import { getAccessToken, getFunctionsUrl, isSupabaseConfigured, supabaseAnonKey } from './supabase.js';
import { formatApiError } from '../utils/authErrors.js';

function edgeHeaders(token) {
  const bearer = cleanHeaderValue(token || supabaseAnonKey);
  const key = cleanHeaderValue(supabaseAnonKey);

  if (!bearer || !key) {
    throw new Error('Supabase API key is missing or invalid. Check VITE_SUPABASE_ANON_KEY in Netlify.');
  }

  return {
    Authorization: `Bearer ${bearer}`,
    apikey: key,
    'Content-Type': 'application/json',
  };
}

function cleanHeaderValue(value) {
  return String(value ?? '').replace(/[^\x20-\x7E]/g, '').trim();
}

/**
 * Register via wellness-api Edge Function — no confirmation email sent.
 */
export async function registerViaEdge({ email, password, username, age }) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }

  let response;
  try {
    response = await fetch(getFunctionsUrl(), {
      method: 'POST',
      headers: edgeHeaders(),
      body: JSON.stringify({ action: 'register', email, password, username, age }),
    });
  } catch {
    throw new Error(
      'Could not reach the server. Redeploy the Edge Function: supabase functions deploy wellness-api'
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        'Registration server needs updating. Run in terminal: supabase functions deploy wellness-api'
      );
    }
    if (response.status === 404) {
      throw new Error(
        'Registration service not found. Run: supabase functions deploy wellness-api'
      );
    }
    throw new Error(formatApiError(data.error || data.message || `Registration failed (${response.status})`));
  }

  return data;
}

/**
 * All database operations go through the wellness-api Edge Function.
 * The browser never talks to Postgres directly.
 */
export async function callWellnessApi(action, payload = {}, accessToken = null) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured');
  }

  const token = accessToken || (await getAccessToken());
  if (!token) {
    throw new Error('Not authenticated');
  }

  let response;
  try {
    response = await fetch(getFunctionsUrl(), {
      method: 'POST',
      headers: edgeHeaders(token),
      body: JSON.stringify({ action, ...payload }),
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(formatApiError(data.error || data.message || `API error (${response.status})`));
  }

  return data;
}

export const wellnessApi = {
  getProfile: () => callWellnessApi('getProfile'),
  updateProfile: (updates, accessToken) => callWellnessApi('updateProfile', updates, accessToken),
  getWellnessData: () => callWellnessApi('getWellnessData'),
  upsertMood: (entry) => callWellnessApi('upsertMood', entry),
  deleteMood: (id) => callWellnessApi('deleteMood', { id }),
  upsertSleep: (entry) => callWellnessApi('upsertSleep', entry),
  upsertWater: (entry) => callWellnessApi('upsertWater', entry),
  upsertExercise: (entry) => callWellnessApi('upsertExercise', entry),
  deleteExercise: (id) => callWellnessApi('deleteExercise', { id }),
  completeChallenge: (entry) => callWellnessApi('completeChallenge', entry),
};

export { isSupabaseConfigured };
