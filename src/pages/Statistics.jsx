import { useState, useMemo } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useWellness } from '../context/WellnessContext';
import { calculateWellnessScore } from '../utils/wellnessScore';
import Card from '../components/ui/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const FILTERS = [
  { id: 'week', label: 'Week', days: 7 },
  { id: 'month', label: 'Month', days: 30 },
  { id: 'year', label: 'Year', days: 365 },
];

const chartOpts = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: 'rgba(0,0,0,0.04)' } },
    x: { grid: { display: false } },
  },
};

export default function Statistics() {
  const { getWeeklyData, moods, sleepEntries, waterEntries, exerciseEntries, completedChallenges } = useWellness();
  const [filter, setFilter] = useState('week');
  const days = FILTERS.find((f) => f.id === filter)?.days || 7;
  const data = useMemo(() => getWeeklyData(Math.min(days, 30)), [getWeeklyData, days]);

  const wellnessScores = data.map((d) => {
    const mood = moods.find((m) => m.date === d.date);
    const sleep = sleepEntries.find((s) => s.date === d.date);
    const water = waterEntries.find((w) => w.date === d.date);
    const exercise = exerciseEntries.filter((e) => e.date === d.date);
    const challenge = completedChallenges.find((c) => c.date === d.date);
    return calculateWellnessScore({ mood, sleep, water: water?.glasses || 0, exercise, challengeComplete: !!challenge });
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <header className="page-header flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1>Statistics</h1>
          <p>Your wellness trends over time.</p>
        </div>
        <div className="flex gap-1 p-1 bg-stone-200/60 dark:bg-stone-700/50 rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-surface-raised dark:bg-navy-light text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Mood entries', value: moods.length },
          { label: 'Sleep logs', value: sleepEntries.length },
          { label: 'Water goals', value: waterEntries.filter((w) => w.glasses >= 8).length },
          { label: 'Challenges', value: completedChallenges.length },
        ].map((s) => (
          <Card key={s.label} className="!p-4">
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium mb-4">Mood</h3>
          <Line data={{ labels: data.map((d) => d.label), datasets: [{ data: data.map((d) => d.mood), borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.08)', fill: true, tension: 0.3, spanGaps: true }] }} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { min: 0, max: 100 } } }} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-4">Sleep hours</h3>
          <Bar data={{ labels: data.map((d) => d.label), datasets: [{ data: data.map((d) => d.sleep), backgroundColor: '#4f46e5', borderRadius: 4 }] }} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { beginAtZero: true, max: 12 } } }} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-4">Water intake</h3>
          <Line data={{ labels: data.map((d) => d.label), datasets: [{ data: data.map((d) => d.water), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.08)', fill: true, tension: 0.3 }] }} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { beginAtZero: true, max: 10 } } }} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-4">Exercise minutes</h3>
          <Bar data={{ labels: data.map((d) => d.label), datasets: [{ data: data.map((d) => d.exercise), backgroundColor: '#4f46e5', borderRadius: 4 }] }} options={chartOpts} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-4">Wellness score</h3>
          <Line data={{ labels: data.map((d) => d.label), datasets: [{ data: wellnessScores, borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.08)', fill: true, tension: 0.3 }] }} options={{ ...chartOpts, scales: { ...chartOpts.scales, y: { min: 0, max: 100 } } }} />
        </Card>
        <Card>
          <h3 className="text-sm font-medium mb-4">Activity breakdown</h3>
          <Doughnut
            data={{
              labels: ['Mood', 'Sleep', 'Water', 'Exercise'],
              datasets: [{ data: [moods.length, sleepEntries.length, waterEntries.filter((w) => w.glasses >= 8).length, exerciseEntries.length], backgroundColor: ['#4f46e5', '#6366f1', '#059669', '#64748b'], borderWidth: 0 }],
            }}
            options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }}
          />
        </Card>
      </div>
    </div>
  );
}
