'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

const styles = `
.login-container {
  max-width: 500px;
  margin: 100px auto;
  padding: 40px;
}

.login-form {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
  text-align: center;
}

.login-desc {
  color: #6B7280;
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #111827;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 16px;
  transition: 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #7C3AED;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.button {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
}

.button-primary {
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  color: white;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
}

.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 600;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}
`;

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { requestOtp, verifyOtp, isAdmin } = useAdmin();

  useEffect(() => {
    setMounted(true);
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!otpSent) {
      const result = await requestOtp(email);
      if (result.success) {
        setOtpSent(true);
        setError('OTP sent to your admin email. Enter the code to continue.');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } else {
      const success = await verifyOtp(email, otp);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid or expired OTP');
        setOtp('');
      }
    }
    setLoading(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <main>
        <Navigation />
        <div className="container login-container">
          <div className="login-form">
            <h1 className="login-title">Admin Login</h1>
            <p className="login-desc">Enter the admin email to receive a one-time password, then verify it to access the admin panel</p>

            {error && <div className={`message ${error.toLowerCase().includes('sent') ? 'success' : 'error'}`}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {otpSent && (
                <div className="form-group">
                  <label htmlFor="otp">OTP</label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter the 6-digit OTP"
                    disabled={loading}
                    inputMode="numeric"
                    maxLength={6}
                  />
                </div>
              )}

              <button
                type="submit"
                className="button button-primary"
                disabled={loading || !email || (otpSent && !otp)}
              >
                {loading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
