import { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { getDailyChallenge, CHALLENGE_POOL } from '../utils/challenges';
import { AppIcon } from '../utils/icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { HiCheckCircle } from 'react-icons/hi';

export default function Challenges() {
  const { getTodayChallenge, completeChallenge, completedChallenges } = useWellness();
  const challenge = getTodayChallenge();
  const [completing, setCompleting] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleComplete = async () => {
    setCompleting(true);
    const success = await completeChallenge(challenge.id);
    if (success) setJustCompleted(true);
    setCompleting(false);
  };

  const recentCompleted = completedChallenges.slice(0, 10);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Daily challenge</h1>
        <p>One focused task per day. Complete it to earn XP.</p>
      </header>

      <Card>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-4">Today</p>
        <div className="flex items-start gap-3 mb-6">
          <AppIcon name={challenge.category} className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-lg font-semibold">{challenge.title}</h2>
            <p className="text-sm text-slate-500 mt-1 capitalize">{challenge.category} · +{challenge.xp} XP</p>
          </div>
        </div>

        {challenge.completed || justCompleted ? (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400">
            <HiCheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Completed</p>
              <p className="text-xs opacity-80">+{challenge.xp} XP added</p>
            </div>
          </div>
        ) : (
          <Button onClick={handleComplete} loading={completing} className="w-full sm:w-auto">
            Mark as complete
          </Button>
        )}
      </Card>

      {recentCompleted.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Recent</h2>
          <div className="border border-border-soft dark:border-border-dark rounded-xl divide-y divide-border-soft dark:divide-border-dark">
            {recentCompleted.map((c) => {
              const def = CHALLENGE_POOL.find((p) => p.id === c.challengeId) || getDailyChallenge(new Date(c.date));
              return (
                <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="font-medium">{def.title}</span>
                  <div className="flex items-center gap-3 shrink-0 text-slate-500">
                    <span>{c.date}</span>
                    <span className="text-emerald-600">+{c.xp} XP</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
