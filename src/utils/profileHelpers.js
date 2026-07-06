/** True if the value looks like an email, not a display username */
export function looksLikeEmail(value) {
  if (!value || typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Normalize and validate a username for display */
export function normalizeUsername(value) {
  const trimmed = value?.trim();
  if (!trimmed || looksLikeEmail(trimmed)) return '';
  return trimmed;
}

/** Age from profile row or auth metadata */
export function getProfileAge(profile, user) {
  const fromProfile = profile?.age?.toString().trim();
  if (fromProfile) return fromProfile;

  const fromMeta = user?.user_metadata?.age?.toString().trim();
  if (fromMeta) return fromMeta;

  return '';
}

/** Display name with fallbacks from profile and auth metadata */
export function getDisplayName(profile, user) {
  const fromProfile = normalizeUsername(profile?.username);
  if (fromProfile) return fromProfile;

  const fromMeta = normalizeUsername(user?.user_metadata?.username);
  if (fromMeta) return fromMeta;

  return '';
}
