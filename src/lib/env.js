/** Strip invisible chars and accidental text pasted after API keys */
export function cleanEnvValue(value) {
  if (value == null) return '';
  return String(value)
    .replace(/\uFEFF/g, '')
    .replace(/[\u200B-\u200D\u2060]/g, '')
    .trim();
}

/** Extract a JWT-shaped Supabase key if extra words were pasted with it */
export function cleanSupabaseAnonKey(value) {
  const cleaned = cleanEnvValue(value);
  const jwt = cleaned.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  return jwt ? jwt[0] : cleaned.replace(/[^\x21-\x7E]/g, '');
}

export function cleanSupabaseUrl(value) {
  return cleanEnvValue(value).replace(/\/$/, '');
}
