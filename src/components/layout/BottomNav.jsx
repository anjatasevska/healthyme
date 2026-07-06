import { NavLink } from 'react-router-dom';
import { HiHome, HiEmojiHappy, HiChartBar, HiUser, HiChat } from 'react-icons/hi';

const navItems = [
  { to: '/dashboard', icon: HiHome, label: 'Home' },
  { to: '/mood', icon: HiEmojiHappy, label: 'Mood' },
  { to: '/assistant', icon: HiChat, label: 'AI' },
  { to: '/statistics', icon: HiChartBar, label: 'Stats' },
  { to: '/profile', icon: HiUser, label: 'Profile' },
];

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-raised/95 dark:bg-navy/95 backdrop-blur-xl border-t border-border-soft dark:border-border-dark px-2 pb-safe"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive
                  ? 'text-primary'
                  : 'text-stone-500 dark:text-stone-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
