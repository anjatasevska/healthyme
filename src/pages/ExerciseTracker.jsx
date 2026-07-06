import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { useWellness } from '../context/WellnessContext';
import { EXERCISE_TYPES } from '../utils/wellnessHelpers';
import { AppIcon } from '../utils/icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function ExerciseTracker() {
  const { getTodayExercise, addExercise, deleteExercise, getWeeklyData } = useWellness();
  const todayExercise = getTodayExercise();
  const [form, setForm] = useState({ type: 'walking', minutes: 30, calories: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await addExercise({
      type: form.type,
      minutes: parseInt(form.minutes, 10),
      calories: form.calories ? parseInt(form.calories, 10) : null,
    });
    setForm({ type: 'walking', minutes: 30, calories: '' });
    setSaving(false);
  };

  const weeklyData = getWeeklyData(7);
  const weeklyTotal = weeklyData.reduce((s, d) => s + d.exercise, 0);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Exercise</h1>
        <p>Log your physical activity.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Add activity</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {EXERCISE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setForm({ ...form, type: t.id })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm text-left transition-colors ${
                      form.type === t.id
                        ? 'border-primary bg-indigo-50 dark:bg-indigo-950/20'
                        : 'border-border-soft dark:border-border-dark hover:border-stone-400'
                    }`}
                  >
                    <AppIcon name={t.icon} className="w-4 h-4 text-slate-400 shrink-0" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="minutes" className="block text-xs font-medium text-slate-500 mb-1.5">Minutes</label>
                <input
                  id="minutes"
                  type="number"
                  min="1"
                  value={form.minutes}
                  onChange={(e) => setForm({ ...form, minutes: e.target.value })}
                  required
                  className="input-field p-2.5"
                />
              </div>
              <div>
                <label htmlFor="calories" className="block text-xs font-medium text-slate-500 mb-1.5">Calories</label>
                <input
                  id="calories"
                  type="number"
                  min="0"
                  value={form.calories}
                  onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  placeholder="Optional"
                  className="input-field p-2.5"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" loading={saving}>Log exercise</Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">This week</h2>
          <p className="text-2xl font-semibold mb-4">{weeklyTotal} min</p>
          <Bar
            data={{
              labels: weeklyData.map((d) => d.label),
              datasets: [{ data: weeklyData.map((d) => d.exercise), backgroundColor: '#4f46e5', borderRadius: 4 }],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
            }}
          />
        </Card>
      </div>

      <section>
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Today</h2>
        {todayExercise.length === 0 ? (
          <EmptyState icon="exercise" title="No activity logged" description="Add your first session above." />
        ) : (
          <div className="border border-border-soft dark:border-border-dark rounded-xl divide-y divide-border-soft dark:divide-border-dark">
            {todayExercise.map((entry) => {
              const type = EXERCISE_TYPES.find((t) => t.id === entry.type);
              return (
                <div key={entry.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <AppIcon name={type?.icon} className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-medium">{type?.label}</p>
                      <p className="text-xs text-slate-500">{entry.minutes} min{entry.calories ? ` · ${entry.calories} cal` : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteExercise(entry.id)} className="text-xs text-slate-400 hover:text-red-500">Delete</button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
