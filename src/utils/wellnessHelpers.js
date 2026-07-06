/** Calculate hours slept from bedtime and wake-up time strings (HH:MM) */
export function calculateSleepHours(bedtime, wakeTime) {
  if (!bedtime || !wakeTime) return 0;

  const [bedH, bedM] = bedtime.split(':').map(Number);
  const [wakeH, wakeM] = wakeTime.split(':').map(Number);

  let bedMinutes = bedH * 60 + bedM;
  let wakeMinutes = wakeH * 60 + wakeM;

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  const diff = wakeMinutes - bedMinutes;
  return Math.round((diff / 60) * 10) / 10;
}

export function getSleepQuality(hours) {
  if (hours >= 8) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', score: 100 };
  if (hours >= 7) return { label: 'Good', color: 'text-primary', bg: 'bg-indigo-50 dark:bg-indigo-950/30', score: 75 };
  if (hours >= 6) return { label: 'Fair', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', score: 50 };
  return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', score: 25 };
}

export const MOOD_OPTIONS = [
  { id: 'very_happy', icon: 'very_happy', label: 'Very Happy', score: 100 },
  { id: 'happy', icon: 'happy', label: 'Happy', score: 80 },
  { id: 'neutral', icon: 'neutral', label: 'Neutral', score: 60 },
  { id: 'sad', icon: 'sad', label: 'Sad', score: 40 },
  { id: 'very_sad', icon: 'very_sad', label: 'Very Sad', score: 20 },
  { id: 'stressed', icon: 'stressed', label: 'Stressed', score: 30 },
];

export const EXERCISE_TYPES = [
  { id: 'walking', label: 'Walking', icon: 'walking' },
  { id: 'running', label: 'Running', icon: 'running' },
  { id: 'gym', label: 'Gym', icon: 'gym' },
  { id: 'cycling', label: 'Cycling', icon: 'cycling' },
  { id: 'football', label: 'Football', icon: 'football' },
  { id: 'basketball', label: 'Basketball', icon: 'basketball' },
  { id: 'swimming', label: 'Swimming', icon: 'swimming' },
  { id: 'other', label: 'Other', icon: 'other' },
];

export const WATER_GOAL = 8;
