import { MOOD_OPTIONS, WATER_GOAL } from './wellnessHelpers';
import { calculateSleepHours, getSleepQuality } from './wellnessHelpers';

/** Calculate overall wellness score (0-100) from today's data */
export function calculateWellnessScore({ mood, sleep, water, exercise, challengeComplete }) {
  let total = 0;
  let factors = 0;

  // Mood (25%)
  if (mood) {
    const moodOption = MOOD_OPTIONS.find((m) => m.id === mood.mood);
    total += (moodOption?.score || 50) * 0.25;
    factors += 0.25;
  }

  // Sleep (25%)
  if (sleep) {
    const hours = sleep.hours || calculateSleepHours(sleep.bedtime, sleep.wakeTime);
    const quality = getSleepQuality(hours);
    total += quality.score * 0.25;
    factors += 0.25;
  }

  // Water (20%)
  if (water !== undefined && water !== null) {
    const glasses = typeof water === 'number' ? water : water.glasses || 0;
    total += Math.min(glasses / WATER_GOAL, 1) * 100 * 0.2;
    factors += 0.2;
  }

  // Exercise (20%)
  if (exercise && exercise.length > 0) {
    const totalMinutes = exercise.reduce((sum, e) => sum + (e.minutes || 0), 0);
    total += Math.min(totalMinutes / 30, 1) * 100 * 0.2;
    factors += 0.2;
  }

  // Challenge (10%)
  if (challengeComplete) {
    total += 100 * 0.1;
    factors += 0.1;
  }

  if (factors === 0) return 0;
  return Math.round(total / factors);
}

export function getScoreColor(score) {
  if (score >= 80) return 'from-mint to-emerald-400';
  if (score >= 60) return 'from-primary to-purple';
  if (score >= 40) return 'from-amber-400 to-orange-400';
  return 'from-red-400 to-rose-400';
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}
