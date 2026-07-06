export const BADGES = [
  { id: 'first_login', name: 'First Login', icon: 'login', description: 'Welcome to HealthyMe', xp: 10 },
  { id: 'streak_7', name: '7-Day Streak', icon: 'streak7', description: '7 days of healthy habits', xp: 50 },
  { id: 'streak_30', name: '30-Day Streak', icon: 'streak30', description: '30 days of dedication', xp: 150 },
  { id: 'mood_master', name: 'Mood Master', icon: 'moodMaster', description: 'Track mood 14 days in a row', xp: 40 },
  { id: 'water_hero', name: 'Water Hero', icon: 'waterHero', description: 'Complete water goal 7 times', xp: 35 },
  { id: 'sleep_champion', name: 'Sleep Champion', icon: 'sleepChampion', description: '7 nights of good sleep', xp: 40 },
  { id: 'fitness_explorer', name: 'Fitness Explorer', icon: 'fitness', description: 'Log 10 exercise sessions', xp: 45 },
  { id: 'healthy_week', name: 'Healthy Week', icon: 'healthyWeek', description: 'Wellness score above 80 for 7 days', xp: 60 },
  { id: 'golden_wellness', name: 'Golden Wellness', icon: 'golden', description: 'Reach level 10', xp: 100 },
  { id: 'challenge_starter', name: 'Challenge Starter', icon: 'challengeStarter', description: 'Complete your first challenge', xp: 20 },
  { id: 'challenge_pro', name: 'Challenge Pro', icon: 'challengePro', description: 'Complete 20 challenges', xp: 80 },
];

export function getBadgeById(id) {
  return BADGES.find((b) => b.id === id);
}

export function checkAchievements(stats, profile) {
  const toUnlock = [];
  const badges = profile.badges || [];

  if (!badges.includes('first_login')) toUnlock.push('first_login');
  if ((profile.streak || 0) >= 7 && !badges.includes('streak_7')) toUnlock.push('streak_7');
  if ((profile.streak || 0) >= 30 && !badges.includes('streak_30')) toUnlock.push('streak_30');
  if ((stats.moodStreak || 0) >= 14 && !badges.includes('mood_master')) toUnlock.push('mood_master');
  if ((stats.waterGoalDays || 0) >= 7 && !badges.includes('water_hero')) toUnlock.push('water_hero');
  if ((stats.goodSleepDays || 0) >= 7 && !badges.includes('sleep_champion')) toUnlock.push('sleep_champion');
  if ((stats.exerciseCount || 0) >= 10 && !badges.includes('fitness_explorer')) toUnlock.push('fitness_explorer');
  if ((stats.highScoreDays || 0) >= 7 && !badges.includes('healthy_week')) toUnlock.push('healthy_week');
  if ((profile.level || 1) >= 10 && !badges.includes('golden_wellness')) toUnlock.push('golden_wellness');
  if ((profile.completedChallenges || 0) >= 1 && !badges.includes('challenge_starter')) toUnlock.push('challenge_starter');
  if ((profile.completedChallenges || 0) >= 20 && !badges.includes('challenge_pro')) toUnlock.push('challenge_pro');

  return toUnlock;
}
