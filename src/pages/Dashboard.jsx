import { Link } from 'react-router-dom';
import {
  HiEmojiHappy,
  HiMoon,
  HiBeaker,
  HiTrendingUp,
  HiLightningBolt,
  HiBadgeCheck,
  HiDocumentText,
  HiFire,
  HiTrendingUp as HiLevel,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useWellness } from '../context/WellnessContext';
import { calculateWellnessScore, getScoreLabel } from '../utils/wellnessScore';
import { getDailyQuote } from '../utils/quotes';
import { MOOD_OPTIONS } from '../utils/wellnessHelpers';
import { AppIcon } from '../utils/icons';
import Card from '../components/ui/Card';
import ProgressRing from '../components/ui/ProgressRing';
import { DashboardSkeleton } from '../components/ui/LoadingSkeleton';

const quickCards = [
  { to: '/mood', icon: HiEmojiHappy, label: 'Mood', key: 'mood' },
  { to: '/sleep', icon: HiMoon, label: 'Sleep', key: 'sleep' },
  { to: '/water', icon: HiBeaker, label: 'Water', key: 'water' },
  { to: '/exercise', icon: HiTrendingUp, label: 'Activity', key: 'exercise' },
  { to: '/challenges', icon: HiLightningBolt, label: 'Challenge', key: 'challenge' },
  { to: '/achievements', icon: HiBadgeCheck, label: 'Badges', key: 'badges' },
];

export default function Dashboard() {
  const { profile, displayName } = useAuth();
  const {
    loading,
    getTodayMood,
    getTodaySleep,
    getTodayWater,
    getTodayExercise,
    getTodayChallenge,
  } = useWellness();

  if (loading) return <DashboardSkeleton />;

  const mood = getTodayMood();
  const sleep = getTodaySleep();
  const water = getTodayWater();
  const exercise = getTodayExercise();
  const challenge = getTodayChallenge();
  const quote = getDailyQuote();

  const score = calculateWellnessScore({
    mood,
    sleep,
    water: water?.glasses || 0,
    exercise,
    challengeComplete: challenge.completed,
  });

  const moodOption = mood ? MOOD_OPTIONS.find((m) => m.id === mood.mood) : null;

  const getCardStatus = (key) => {
    switch (key) {
      case 'mood': return moodOption ? moodOption.label : 'Not logged';
      case 'sleep': return sleep ? `${sleep.hours}h` : 'Not logged';
      case 'water': return water ? `${water.glasses}/8` : '0/8';
      case 'exercise': return exercise.length ? `${exercise.reduce((s, e) => s + e.minutes, 0)} min` : 'None';
      case 'challenge': return challenge.completed ? 'Done' : 'Pending';
      case 'badges': return `${profile.badges?.length || 0} earned`;
      default: return '';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="page-header">
        <h1>{displayName ? `Hi, ${displayName}` : 'Dashboard'}</h1>
        {!displayName && (
          <p className="text-sm text-stone-500">
            Choose a username in{' '}
            <Link to="/profile" className="text-primary font-medium hover:underline">Profile</Link>
            {' '}so we can greet you by name.
          </p>
        )}
        <p className={displayName ? 'mt-1' : 'mt-2'}>
          {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-slate-500 mb-4">Wellness score</p>
          <ProgressRing progress={score} size={140} strokeWidth={10} sublabel={getScoreLabel(score)} />
        </Card>

        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HiDocumentText className="w-4 h-4 text-slate-400" />
              <p className="text-sm font-medium text-slate-500">Daily quote</p>
            </div>
            <blockquote className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
              {quote.text}
            </blockquote>
            <p className="text-sm text-slate-500 mt-2">{quote.author}</p>
          </div>
          <div className="flex gap-6 mt-6 pt-6 border-t border-border-soft dark:border-border-dark">
            <div className="flex items-center gap-2">
              <HiFire className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Streak</p>
                <p className="text-sm font-semibold">{profile.streak || 0} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HiLevel className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Level</p>
                <p className="text-sm font-semibold">{profile.level || 1}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <section>
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCards.map(({ to, icon: Icon, label, key }) => (
            <Link key={key} to={to}>
              <Card hover className="!p-4">
                <Icon className="w-4 h-4 text-slate-400 mb-3" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{getCardStatus(key)}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Today's challenge</h2>
          <div className="flex items-start gap-3">
            <AppIcon name={challenge.category} className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{challenge.title}</p>
              <p className="text-sm text-slate-500 mt-1">+{challenge.xp} XP</p>
            </div>
            {challenge.completed ? (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">Done</span>
            ) : (
              <Link to="/challenges" className="text-sm text-primary font-medium hover:underline shrink-0">View</Link>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Daily summary</h2>
          <dl className="space-y-3">
            {[
              { label: 'Mood', value: moodOption?.label || '—' },
              { label: 'Sleep', value: sleep ? `${sleep.hours}h` : '—' },
              { label: 'Water', value: water ? `${water.glasses}/8 glasses` : '0/8 glasses' },
              { label: 'Exercise', value: exercise.length ? `${exercise.reduce((s, e) => s + e.minutes, 0)} min` : '—' },
              { label: 'Challenge', value: challenge.completed ? 'Completed' : 'Pending' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-900 dark:text-slate-100">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </div>
  );
}
