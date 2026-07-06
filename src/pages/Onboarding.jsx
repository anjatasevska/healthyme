import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChartBar, HiEmojiHappy, HiLightningBolt, HiChat, HiUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { looksLikeEmail } from '../utils/profileHelpers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const slides = [
  { icon: HiEmojiHappy, title: 'Welcome to HealthyMe', desc: 'A wellness companion inspired by HBSC research. Track habits that support your mental and physical health.' },
  { icon: HiUser, title: 'Choose your username', desc: 'Pick a name that will show on your profile and dashboard.', username: true },
  { icon: HiChartBar, title: 'Track daily', desc: 'Log mood, sleep, water, and exercise. Small consistent entries build a clear picture over time.' },
  { icon: HiLightningBolt, title: 'Daily challenges', desc: 'Complete one focused challenge each day to earn XP and stay motivated.' },
  { icon: HiChat, title: 'Wellness assistant', desc: 'Get practical guidance when you need support with stress, sleep, or difficult days.' },
];

export default function Onboarding() {
  const { profile, updateUserProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState(profile.username || '');
  const navigate = useNavigate();
  const SlideIcon = slides[step].icon;
  const isUsernameStep = slides[step].username;

  const next = () => {
    if (isUsernameStep) {
      if (!username.trim() || looksLikeEmail(username)) return;
    }
    if (step < slides.length - 1) setStep(step + 1);
  };

  const finish = () => {
    const updates = { onboardingComplete: true };
    if (username.trim()) updates.username = username.trim();
    else if (profile.username) updates.username = profile.username;
    updateUserProfile(updates);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface dark:bg-navy">
      <Card className="w-full max-w-md !p-8">
        <div className="w-10 h-10 rounded-lg bg-stone-200/70 dark:bg-stone-700/50 flex items-center justify-center mb-6">
          <SlideIcon className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{slides[step].title}</h2>
        <p className="text-sm text-stone-500 leading-relaxed mb-6">{slides[step].desc}</p>

        {isUsernameStep && (
          <div className="mb-6">
            <label htmlFor="onboard-username" className="block text-xs font-medium text-stone-500 mb-1.5">
              Username
            </label>
            <input
              id="onboard-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              className="input-field p-2.5"
            />
          </div>
        )}

        <div className="flex gap-1.5 mb-8">
          {slides.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-stone-300 dark:bg-stone-600'}`} />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < slides.length - 1 ? (
            <Button onClick={next} className="flex-1" disabled={isUsernameStep && (!username.trim() || looksLikeEmail(username))}>
              Continue
            </Button>
          ) : (
            <Button onClick={finish} className="flex-1">Get started</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
