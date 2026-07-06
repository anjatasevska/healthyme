import { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { MOOD_OPTIONS } from '../utils/wellnessHelpers';
import { AppIcon } from '../utils/icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

export default function MoodTracker() {
  const { moods, getTodayMood, saveMood, deleteMood } = useWellness();
  const todayMood = getTodayMood();
  const [selected, setSelected] = useState(todayMood?.mood || '');
  const [notes, setNotes] = useState(todayMood?.notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await saveMood({ mood: selected, notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const previousMoods = moods.filter((m) => m.date !== new Date().toISOString().split('T')[0]).slice(0, 14);

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Mood</h1>
        <p>How are you feeling today?</p>
      </header>

      <Card>
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Select mood</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selected === m.id
                  ? 'border-primary bg-indigo-50 dark:bg-indigo-950/20'
                  : 'border-border-soft dark:border-border-dark hover:border-stone-400'
              }`}
              aria-pressed={selected === m.id}
            >
              <AppIcon name={m.icon} className="w-4 h-4 text-slate-500 mb-2" />
              <span className="text-sm font-medium block">{m.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-6 pt-6 border-t border-border-soft dark:border-border-dark">
            <label htmlFor="notes" className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="input-field p-3 resize-none"
              placeholder="Optional — how was your day?"
            />
            <div className="flex items-center gap-3 mt-4">
              <Button onClick={handleSave} loading={saving}>
                {todayMood ? 'Update' : 'Save'}
              </Button>
              {saved && <span className="text-sm text-emerald-600">Saved</span>}
            </div>
          </div>
        )}
      </Card>

      <section>
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">History</h2>
        {previousMoods.length === 0 ? (
          <EmptyState icon="journal" title="No entries yet" description="Previous moods will appear here." />
        ) : (
          <div className="border border-border-soft dark:border-border-dark rounded-xl divide-y divide-border-soft dark:divide-border-dark">
            {previousMoods.map((entry) => {
              const mood = MOOD_OPTIONS.find((m) => m.id === entry.mood);
              return (
                <div key={entry.id} className="flex items-start justify-between gap-4 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <AppIcon name={mood?.icon} className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{mood?.label}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(entry.date).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      {entry.notes && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{entry.notes}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMood(entry.id)}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
