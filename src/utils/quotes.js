export const QUOTES = [
  { text: 'Small steps every day lead to big changes.', author: 'HealthyMe' },
  { text: 'Your mental health is just as important as your physical health.', author: 'HBSC Wisdom' },
  { text: 'Rest is not a reward — it is a requirement.', author: 'HealthyMe' },
  { text: 'Progress, not perfection.', author: 'HealthyMe' },
  { text: 'You are stronger than you think.', author: 'HealthyMe' },
  { text: 'One healthy habit at a time.', author: 'HealthyMe' },
  { text: 'Taking care of yourself is productive.', author: 'HealthyMe' },
  { text: 'Every day is a fresh start.', author: 'HealthyMe' },
  { text: 'Your well-being matters.', author: 'HBSC Wisdom' },
  { text: 'Breathe. You\'ve got this.', author: 'HealthyMe' },
  { text: 'Healthy habits build a healthy life.', author: 'HealthyMe' },
  { text: 'Be kind to yourself today.', author: 'HealthyMe' },
];

export function getDailyQuote(date = new Date()) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
