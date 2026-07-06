export default function Card({
  children,
  className = '',
  hover = false,
  ...props
}) {
  return (
    <div
      className={`
        rounded-xl border border-border-soft dark:border-border-dark
        bg-surface-raised dark:bg-navy-light p-6
        ${hover ? 'transition-shadow hover:shadow-sm' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
