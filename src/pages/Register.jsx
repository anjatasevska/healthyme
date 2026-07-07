import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { formatAuthError } from '../utils/authErrors';
import { looksLikeEmail } from '../utils/profileHelpers';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', age: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.username.trim()) {
      setError('Please choose a username.');
      return;
    }
    if (looksLikeEmail(form.username)) {
      setError('Username cannot be your email. Pick a display name.');
      return;
    }
    if (form.username.trim().length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (!form.email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const age = Number(form.age);
    if (!form.age || age < 10 || age > 19) {
      setError('Please enter a valid age between 10 and 19.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(form.email, form.password, form.username.trim(), age);

      if (!result) {
        setError('Registration failed. Please try again.');
        return;
      }

      if (result.needsEmailConfirmation) {
        setSuccess('Account created! Check your email to confirm your account, then sign in.');
        return;
      }

      navigate('/onboarding');
    } catch (err) {
      setError(formatAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'input-field pl-9 pr-3 py-2.5';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-surface dark:bg-navy">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-semibold">H</div>
            <span className="font-semibold">HealthyMe</span>
          </Link>
          <h1 className="text-xl font-semibold">Sign up</h1>
          <p className="text-sm text-stone-500 mt-1">Pick a username and email to get started</p>
        </div>

        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && <Alert type="error" onDismiss={() => setError('')}>{error}</Alert>}
            {success && (
              <Alert type="success">
                {success}{' '}
                <Link to="/login" className="underline font-medium">Sign in</Link>
              </Alert>
            )}

            {[
              { name: 'username', label: 'Username', hint: 'Shown on your profile and dashboard — not your email', icon: HiUser, type: 'text', placeholder: 'username', autoComplete: 'nickname' },
              { name: 'email', label: 'Email', icon: HiMail, type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
              { name: 'age', label: 'Age', icon: HiUser, type: 'number', min: 10, max: 19 },
            ].map(({ name, label, hint, icon: Icon, placeholder, autoComplete, ...rest }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-xs font-medium text-stone-500 mb-1.5">{label}</label>
                {hint && <p className="text-xs text-stone-400 mb-1.5">{hint}</p>}
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    id={name}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={inputClass}
                    {...rest}
                  />
                </div>
              </div>
            ))}

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required minLength={6} className={`${inputClass} pr-9`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-slate-500 mb-1.5">Confirm password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required minLength={6} className={inputClass} />
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading} disabled={!!success}>
              Sign up
            </Button>
            <p className="text-center text-sm text-slate-500">
              Have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
