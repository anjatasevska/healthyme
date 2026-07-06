import { NavLink } from 'react-router-dom';
import {
  HiHome,
  HiEmojiHappy,
  HiMoon,
  HiOutlineLogout,
  HiChartBar,
  HiCog,
  HiUser,
  HiSun,
  HiLightningBolt,
  HiBadgeCheck,
  HiChat,
  HiBeaker,
  HiTrendingUp,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { to: '/mood', icon: HiEmojiHappy, label: 'Mood' },
  { to: '/sleep', icon: HiMoon, label: 'Sleep' },
  { to: '/water', icon: HiBeaker, label: 'Water' },
  { to: '/exercise', icon: HiTrendingUp, label: 'Exercise' },
  { to: '/challenges', icon: HiLightningBolt, label: 'Challenges' },
  { to: '/achievements', icon: HiBadgeCheck, label: 'Achievements' },
  { to: '/statistics', icon: HiChartBar, label: 'Statistics' },
  { to: '/assistant', icon: HiChat, label: 'Assistant' },
  { to: '/profile', icon: HiUser, label: 'Profile' },
  { to: '/settings', icon: HiCog, label: 'Settings' },
];

export default function Sidebar() {
  const { profile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-surface-raised dark:bg-navy border-r border-border-soft dark:border-border-dark">
      <div className="p-6 border-b border-border-soft dark:border-border-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-semibold">
            H
          </div>
          <div>
            <h1 className="font-semibold text-stone-900 dark:text-stone-100">HealthyMe</h1>
            <p className="text-xs text-stone-500">Level {profile.level || 1} · {profile.xp || 0} XP</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Main navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-stone-200/70 dark:bg-stone-700/50 text-stone-900 dark:text-stone-100'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/40 dark:hover:bg-stone-700/30'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border-soft dark:border-border-dark space-y-0.5">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-200/40 dark:hover:bg-stone-700/30 transition-colors"
        >
          {isDark ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <HiOutlineLogout className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
