import { AppIcon } from '../../utils/icons';

export default function EmptyState({ icon = 'journal', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-border-soft dark:border-border-dark rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-stone-200/70 dark:bg-stone-700/50 flex items-center justify-center mb-4">
        <AppIcon name={icon} className="w-5 h-5 text-slate-500" />
      </div>
      <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
