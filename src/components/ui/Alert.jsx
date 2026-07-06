export default function Alert({ type = 'error', children, onDismiss }) {
  const styles = {
    error: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900',
    success: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    info: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
  };

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`p-3 rounded-lg border text-sm ${styles[type]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1">{children}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-current opacity-60 hover:opacity-100 shrink-0"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
