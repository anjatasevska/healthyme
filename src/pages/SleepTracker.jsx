import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { useWellness } from '../context/WellnessContext';
import { calculateSleepHours, getSleepQuality } from '../utils/wellnessHelpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function SleepTracker() {
  const { getTodaySleep, saveSleep, getWeeklyData } = useWellness();
  const todaySleep = getTodaySleep();
  const [bedtime, setBedtime] = useState(todaySleep?.bedtime || '22:30');
  const [wakeTime, setWakeTime] = useState(todaySleep?.wakeTime || '07:00');
  const [saving, setSaving] = useState(false);

  const hours = calculateSleepHours(bedtime, wakeTime);
  const quality = getSleepQuality(hours);

  const handleSave = async () => {
    setSaving(true);
    await saveSleep({ bedtime, wakeTime });
    setSaving(false);
  };

  const weeklyData = getWeeklyData(7);
  const chartData = {
    labels: weeklyData.map((d) => d.label),
    datasets: [{
      label: 'Hours',
      data: weeklyData.map((d) => d.sleep || 0),
      backgroundColor: '#4f46e5',
      borderRadius: 4,
    }],
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Sleep</h1>
        <p>Log bedtime and wake-up time.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Log sleep</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="bedtime" className="block text-xs font-medium text-slate-500 mb-1.5">Bedtime</label>
              <input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="input-field p-2.5"
              />
            </div>
            <div>
              <label htmlFor="wakeTime" className="block text-xs font-medium text-slate-500 mb-1.5">Wake up</label>
              <input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="input-field p-2.5"
              />
            </div>
          </div>

          <div className={`p-4 rounded-lg ${quality.bg} mb-4`}>
            <p className="text-2xl font-semibold">{hours}h</p>
            <p className={`text-sm font-medium ${quality.color}`}>{quality.label}</p>
          </div>

          <Button onClick={handleSave} loading={saving} className="w-full">
            {todaySleep ? 'Update' : 'Save'}
          </Button>
        </Card>

        <Card>
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">Quality guide</h2>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Excellent', range: '8+ hours' },
              { label: 'Good', range: '7–8 hours' },
              { label: 'Fair', range: '6–7 hours' },
              { label: 'Poor', range: 'Under 6 hours' },
            ].map((q) => (
              <li key={q.label} className="flex justify-between py-2 border-b border-border-soft dark:border-border-dark last:border-0">
                <span className="font-medium">{q.label}</span>
                <span className="text-slate-500">{q.range}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">This week</h2>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 12 }, x: { grid: { display: false } } },
          }}
        />
      </Card>
    </div>
  );
}
