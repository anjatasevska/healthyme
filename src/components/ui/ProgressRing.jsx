import { motion } from 'framer-motion';

export default function ProgressRing({
                                       progress = 0,
                                       size = 120,
                                       strokeWidth = 8,
                                       label,
                                       sublabel,
                                     }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
      <div className="inline-flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-stone-300 dark:text-stone-600"
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-primary"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            {Math.round(progress)}%
          </span>
            {label && <span className="text-xs text-slate-500 mt-0.5">{label}</span>}
          </div>
        </div>
        {sublabel && (
            <p className="text-sm text-slate-500 mt-2">{sublabel}</p>
        )}
      </div>
  );
}
