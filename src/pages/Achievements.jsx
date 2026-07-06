import { useAuth } from '../context/AuthContext';
import { BADGES } from '../utils/achievements';
import { AppIcon } from '../utils/icons';
import Card from '../components/ui/Card';
import ProgressRing from '../components/ui/ProgressRing';
import { HiFire, HiStar } from 'react-icons/hi';

export default function Achievements() {
  const { profile } = useAuth();
  const unlocked = profile.badges || [];
  const xpProgress = (profile.xp || 0) % 100;
  const xpToNext = 100 - xpProgress;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Achievements</h1>
        <p>Track your progress and unlocked badges.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center">
          <ProgressRing progress={xpProgress} size={88} strokeWidth={6} label="XP" />
          <p className="mt-3 font-semibold">Level {profile.level || 1}</p>
          <p className="text-xs text-slate-500">{xpToNext} XP to next level</p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <HiStar className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-2xl font-semibold">{profile.xp || 0}</p>
          <p className="text-xs text-slate-500">Total XP</p>
        </Card>
        <Card className="flex flex-col items-center justify-center text-center">
          <HiFire className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-2xl font-semibold">{profile.streak || 0}</p>
          <p className="text-xs text-slate-500">Day streak</p>
        </Card>
      </div>

      <section>
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
          Badges · {unlocked.length}/{BADGES.length}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = unlocked.includes(badge.id);
            return (
              <Card
                key={badge.id}
                hover={false}
                className={`!p-4 ${!isUnlocked ? 'opacity-40' : ''}`}
              >
                <div className="w-9 h-9 rounded-lg bg-stone-200/70 dark:bg-stone-700/50 flex items-center justify-center mb-3">
                  {isUnlocked ? (
                    <AppIcon name={badge.icon} className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  ) : (
                    <AppIcon name="lock" className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <p className="text-sm font-medium">{badge.name}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
                {isUnlocked && (
                  <p className="text-xs text-emerald-600 mt-2">+{badge.xp} XP</p>
                )}
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
