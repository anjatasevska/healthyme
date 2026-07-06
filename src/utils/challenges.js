export const CHALLENGE_POOL = [
  { id: 'water8', title: 'Drink 8 glasses of water', xp: 15, category: 'hydration' },
  { id: 'walk30', title: 'Walk 30 minutes', xp: 20, category: 'activity' },
  { id: 'sleep11', title: 'Sleep before 11 PM', xp: 20, category: 'sleep' },
  { id: 'read20', title: 'Read for 20 minutes', xp: 15, category: 'mind' },
  { id: 'nosocial30', title: 'Spend 30 minutes without social media', xp: 25, category: 'mind' },
  { id: 'meditate10', title: 'Meditate for 10 minutes', xp: 20, category: 'mind' },
  { id: 'friend', title: 'Talk with a friend', xp: 15, category: 'social' },
  { id: 'grateful3', title: "Write 3 things you're grateful for", xp: 15, category: 'mind' },
  { id: 'stretch', title: 'Do 10 minutes of stretching', xp: 15, category: 'activity' },
  { id: 'fruit', title: 'Eat 2 servings of fruit', xp: 10, category: 'nutrition' },
  { id: 'journal', title: 'Write in your journal', xp: 15, category: 'mind' },
  { id: 'outside', title: 'Spend 20 minutes outdoors', xp: 15, category: 'activity' },
];

export function getDailyChallenge(date = new Date()) {
  const dateStr = date.toISOString().split('T')[0];
  const seed = dateStr.split('-').reduce((acc, n) => acc + parseInt(n, 10), 0);
  const index = seed % CHALLENGE_POOL.length;
  return { ...CHALLENGE_POOL[index], date: dateStr };
}

export function getUpcomingChallenges(days = 3) {
  const challenges = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    challenges.push(getDailyChallenge(date));
  }
  return challenges;
}
