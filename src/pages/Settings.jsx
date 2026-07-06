import { HiMoon, HiSun, HiBell, HiShieldCheck, HiGlobe, HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Settings() {
  const { logout, profile, updateUserProfile, isSupabaseConfigured } = useAuth();
  const { theme, setTheme, isDark, soundEnabled, setSoundEnabled } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          icon: HiSun,
          label: 'Light Mode',
          action: (
            <button
              onClick={() => setTheme('light')}
              className={`w-12 h-7 rounded-full transition-colors ${theme === 'light' ? 'bg-primary' : 'bg-stone-300 dark:bg-stone-600'}`}
              aria-label="Light mode"
            >
              <div className={`w-5 h-5 rounded-full bg-surface-raised dark:bg-stone-300 shadow transition-transform ${theme === 'light' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ),
        },
        {
          icon: HiMoon,
          label: 'Dark Mode',
          action: (
            <button
              onClick={() => setTheme('dark')}
              className={`w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-stone-300 dark:bg-stone-600'}`}
              aria-label="Dark mode"
            >
              <div className={`w-5 h-5 rounded-full bg-surface-raised dark:bg-stone-300 shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ),
        },
        {
          icon: soundEnabled ? HiVolumeUp : HiVolumeOff,
          label: 'Sound Effects',
          action: (
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-7 rounded-full transition-colors ${soundEnabled ? 'bg-primary' : 'bg-stone-300 dark:bg-stone-600'}`}
              aria-label="Toggle sound"
            >
              <div className={`w-5 h-5 rounded-full bg-surface-raised dark:bg-stone-300 shadow transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: HiBell,
          label: 'Notifications',
          action: (
            <button
              onClick={() => updateUserProfile({ notifications: !profile.notifications })}
              className={`w-12 h-7 rounded-full transition-colors ${profile.notifications ? 'bg-primary' : 'bg-stone-300 dark:bg-stone-600'}`}
              aria-label="Toggle notifications"
            >
              <div className={`w-5 h-5 rounded-full bg-surface-raised dark:bg-stone-300 shadow transition-transform ${profile.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          ),
        },
        {
          icon: HiGlobe,
          label: 'Language',
          action: (
            <select
              value={profile.language || 'en'}
              onChange={(e) => updateUserProfile({ language: e.target.value })}
              className="px-3 py-1.5 rounded-lg bg-surface dark:bg-navy text-sm border border-border-soft dark:border-border-dark outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          ),
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: HiShieldCheck,
          label: 'Data Storage',
          action: (
            <span className="text-xs text-slate-500">
              {isSupabaseConfigured ? 'Supabase (Edge Functions)' : 'Local Storage'}
            </span>
          ),
        },
      ],
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Settings</h1>
        <p>Customize your experience.</p>
      </header>

      {settingsGroups.map((group) => (
        <Card key={group.title} hover={false}>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{group.title}</h2>
          <div className="space-y-1">
            {group.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-200/40 dark:hover:bg-stone-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.action}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Current theme preview */}
      <Card hover={false} className="text-center !p-6">
        <p className="text-sm text-slate-500 mb-2">Current theme</p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-navy-light text-stone-100' : 'bg-surface-raised text-stone-800 border border-border-soft'}`}>
          {isDark ? <HiMoon className="w-4 h-4" /> : <HiSun className="w-4 h-4" />}
          <span className="text-sm font-medium capitalize">{theme} Mode</span>
        </div>
      </Card>

      <Button variant="danger" className="w-full" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
