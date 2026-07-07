import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { formatAuthError } from '../utils/authErrors';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const registered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(formatAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface dark:bg-navy">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-semibold">H</div>
            <span className="font-semibold">HealthyMe</span>
          </Link>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm text-slate-500 mt-1">Continue to your dashboard</p>
        </div>

        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isSupabaseConfigured && (
              <Alert type="error">
                This deployed site is not connected to Supabase. In Netlify go to{' '}
                <strong>Site configuration → Environment variables</strong> and add{' '}
                <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
                <code className="text-xs">VITE_SUPABASE_ANON_KEY</code>, then redeploy.
              </Alert>
            )}
            {registered && (
              <Alert type="success">Account ready. Sign in with your email and password.</Alert>
            )}
            {error && <Alert type="error" onDismiss={() => setError('')}>{error}</Alert>}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-9 pr-3 py-2.5" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field pl-9 pr-9 py-2.5" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full" loading={loading}>Sign in</Button>

            <p className="text-center text-sm text-slate-500">
              No account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
