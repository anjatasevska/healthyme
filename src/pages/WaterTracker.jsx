import { motion } from 'framer-motion';
import { useWellness } from '../context/WellnessContext';
import { WATER_GOAL } from '../utils/wellnessHelpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function WaterTracker() {
  const { getTodayWater, addWaterGlass, setWaterGlasses } = useWellness();
  const todayWater = getTodayWater();
  const glasses = todayWater?.glasses || 0;
  const progress = Math.min((glasses / WATER_GOAL) * 100, 100);

  return (
    <div className="p-6 md:p-8 max-w-md mx-auto space-y-8">
      <header className="page-header text-center">
        <h1>Water</h1>
        <p>Goal: {WATER_GOAL} glasses per day</p>
      </header>

      <Card className="text-center">
        <div className="relative w-full max-w-[140px] h-48 mx-auto mb-6 border-2 border-border-soft dark:border-border-dark rounded-2xl overflow-hidden bg-surface dark:bg-navy">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-indigo-500/80"
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-semibold text-slate-900 dark:text-white z-10">{glasses}/{WATER_GOAL}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          {glasses >= WATER_GOAL ? 'Goal reached' : `${WATER_GOAL - glasses} remaining`}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => glasses > 0 && setWaterGlasses(glasses - 1)} disabled={glasses === 0}>
            −
          </Button>
          <Button onClick={addWaterGlass}>Add glass</Button>
        </div>

        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {[...Array(WATER_GOAL)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-8 rounded-sm border transition-colors ${
                i < glasses ? 'bg-indigo-500 border-indigo-500' : 'border-border-soft dark:border-border-dark'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
