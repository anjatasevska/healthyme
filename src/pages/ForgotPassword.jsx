import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMail, HiArrowLeft, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { formatAuthError } from '../utils/authErrors';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword, isSupabaseConfigured } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(formatAuthError(err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface dark:bg-navy">
      <div className="w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8">
          <HiArrowLeft className="w-4 h-4" /> Back
        </Link>

        <Card hover={false}>
          {sent ? (
            <div className="text-center">
              <HiCheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                {isSupabaseConfigured
                  ? `If an account exists for ${email}, we sent a reset link.`
                  : `Demo mode: reset simulated for ${email}`}
              </p>
              <Link to="/login"><Button variant="secondary">Back to sign in</Button></Link>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-semibold mb-1">Reset password</h1>
              <p className="text-sm text-slate-500 mb-6">Enter your email for a reset link.</p>
              {error && <Alert type="error" onDismiss={() => setError('')}>{error}</Alert>}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
                  <div className="relative">
                    <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field pl-9 pr-3 py-2.5" />
                  </div>
                </div>
                <Button type="submit" className="w-full" loading={loading}>Send reset link</Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
