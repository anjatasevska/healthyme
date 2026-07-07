import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiFire } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { BADGES } from '../utils/achievements';
import { getDisplayName, getProfileAge, looksLikeEmail, normalizeUsername, AGE_MIN, AGE_MAX } from '../utils/profileHelpers';
import { AppIcon, AVATAR_COLORS, UserAvatar } from '../utils/icons';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressRing from '../components/ui/ProgressRing';
import Alert from '../components/ui/Alert';

export default function Profile() {
  const { user, profile, displayName, updateUserProfile } = useAuth();
  const profileAge = getProfileAge(profile, user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: profile.username || '',
    age: profileAge || '',
    avatar: profile.avatar || 'indigo',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      username: profile.username || '',
      age: getProfileAge(profile, user) || '',
      avatar: profile.avatar || 'indigo',
    });
  }, [profile.username, profile.age, profile.avatar, user]);

  useEffect(() => {
    if (!displayName) setEditing(true);
  }, [displayName]);

  const unlockedBadges = (profile.badges || []).map((id) => BADGES.find((b) => b.id === id)).filter(Boolean);
  const xpProgress = (profile.xp || 0) % 100;

  const handleSave = () => {
    const username = form.username.trim();
    if (!username) return;
    if (looksLikeEmail(username)) return;
    if (form.age) {
      const ageNum = Number(form.age);
      if (ageNum < AGE_MIN || ageNum > AGE_MAX) return;
    }
    updateUserProfile({ ...form, username: normalizeUsername(username) });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const name = displayName || form.username.trim();

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="page-header">
        <h1>Profile</h1>
        <p>Your account and progress.</p>
      </header>

      {!displayName && (
        <Alert type="info">
          Choose a username below — it will appear on your profile and dashboard.
        </Alert>
      )}

      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <UserAvatar name={name || 'U'} colorId={profile.avatar} size="lg" />
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-semibold">{name || 'Set your username'}</h2>
            <p className="text-sm text-stone-500">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-700/50 text-xs font-medium">
                Level {profile.level || 1}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-700/50 text-xs font-medium">
                {profile.xp || 0} XP
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-200/60 dark:bg-stone-700/50 text-xs font-medium inline-flex items-center gap-1">
                <HiFire className="w-3 h-3" /> {profile.streak || 0} day streak
              </span>
            </div>
          </div>
          <ProgressRing progress={xpProgress} size={72} strokeWidth={5} />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Badges', value: unlockedBadges.length },
          { label: 'Challenges', value: profile.completedChallenges || 0 },
          { label: 'Streak', value: profile.streak || 0 },
        ].map((s) => (
          <Card key={s.label} className="!p-4 text-center">
            <p className="text-xl font-semibold">{s.value}</p>
            <p className="text-xs text-stone-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">Details</h2>
          {!editing ? (
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave} disabled={!form.username.trim()}>Save</Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-stone-500 mb-1.5">
                Username <span className="text-primary">*</span>
              </label>
              <input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username"
                autoComplete="nickname"
                className="input-field p-2.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-2">Avatar color</label>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_COLORS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setForm({ ...form, avatar: a.id })}
                    className={`w-8 h-8 rounded-full ${a.bg} ${form.avatar === a.id ? 'ring-2 ring-offset-2 ring-stone-400' : ''}`}
                    title={a.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="age" className="block text-xs font-medium text-stone-500 mb-1.5">Age</label>
              <input
                id="age"
                type="number"
                min={AGE_MIN}
                max={AGE_MAX}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="input-field p-2.5"
              />
            </div>
          </div>
        ) : (
          <dl className="space-y-3 text-sm">
            {[
              { label: 'Username', value: displayName || '—' },
              { label: 'Age', value: profileAge || '—' },
              { label: 'Email', value: user?.email },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-border-soft dark:border-border-dark last:border-0">
                <dt className="text-stone-500">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {saved && <p className="text-sm text-emerald-600 mt-3">Profile updated</p>}
      </Card>

      {unlockedBadges.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">Badges</h2>
            <Link to="/achievements" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="flex gap-2 flex-wrap">
            {unlockedBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-soft dark:border-border-dark text-sm">
                <AppIcon name={badge.icon} className="w-4 h-4 text-stone-400" />
                {badge.name}
              </div>
            ))}
          </div>
        </section>
      )}

      <Link to="/settings">
        <Button variant="secondary" className="w-full">Settings</Button>
      </Link>
    </div>
  );
}
