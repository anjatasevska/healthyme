import { Link } from 'react-router-dom';
import {
  HiArrowRight,
  HiChartBar,
  HiEmojiHappy,
  HiHeart,
  HiLightningBolt,
  HiMoon,
  HiBeaker,
} from 'react-icons/hi';
import Button from '../components/ui/Button';

const features = [
  { icon: HiEmojiHappy, title: 'Mood tracking', desc: 'Log how you feel and notice patterns over time.' },
  { icon: HiMoon, title: 'Sleep monitor', desc: 'Track bedtime, wake-up, and sleep quality.' },
  { icon: HiBeaker, title: 'Hydration', desc: 'Meet your daily water goal with simple tracking.' },
  { icon: HiLightningBolt, title: 'Daily challenges', desc: 'One focused task each day to build consistency.' },
  { icon: HiChartBar, title: 'Statistics', desc: 'Review trends across mood, sleep, and activity.' },
  { icon: HiHeart, title: 'Wellness assistant', desc: 'Practical guidance when you need support.' },
];

const steps = [
  { title: 'Sign up', desc: 'Set up your profile in under a minute.' },
  { title: 'Track daily', desc: 'Log mood, sleep, water, and exercise.' },
  { title: 'Complete challenges', desc: 'Finish your daily wellness task.' },
  { title: 'Review progress', desc: 'See your habits improve over time.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface dark:bg-navy">
      <nav className="border-b border-border-soft dark:border-border-dark bg-surface-raised dark:bg-navy">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-semibold">H</div>
            <span className="font-semibold text-slate-900 dark:text-white">HealthyMe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hidden sm:block">
              Log in
            </Link>
            <Link to="/register"><Button size="sm">Get started</Button></Link>
          </div>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <p className="text-sm font-medium text-primary mb-4">Inspired by HBSC research</p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white max-w-2xl leading-tight">
          Take care of your mind. One healthy habit every day.
        </h1>
        <p className="text-lg text-slate-500 mt-6 max-w-xl leading-relaxed">
          HealthyMe helps teenagers build mental and physical wellbeing through simple daily tracking, challenges, and supportive guidance.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/register">
            <Button size="lg">Get started <HiArrowRight className="w-4 h-4" /></Button>
          </Link>
          <a href="#features"><Button variant="secondary" size="lg">Learn more</Button></a>
        </div>
      </section>

      <section id="features" className="border-t border-border-soft dark:border-border-dark bg-surface-raised dark:bg-navy-light">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-semibold mb-2">Features</h2>
          <p className="text-slate-500 mb-10">Everything you need for daily wellness.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-border-soft dark:border-border-dark bg-surface dark:bg-navy">
                <Icon className="w-5 h-5 text-slate-400 mb-3" />
                <h3 className="font-medium mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-semibold mb-10">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.title}>
              <p className="text-sm font-medium text-slate-400 mb-2">0{i + 1}</p>
              <h3 className="font-medium mb-1">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border-soft dark:border-border-dark">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold mb-3">Start your wellness journey</h2>
          <p className="text-slate-500 mb-6">Free to use. Private. Built for students.</p>
          <Link to="/register"><Button size="lg">Sign up</Button></Link>
        </div>
      </section>

      <footer className="border-t border-border-soft dark:border-border-dark bg-surface-raised dark:bg-navy-light">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span className="font-medium text-slate-900 dark:text-white">HealthyMe</span>
          <span>© 2026 · Inspired by HBSC Research</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white">Login</Link>
            <Link to="/register" className="hover:text-slate-900 dark:hover:text-white">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
