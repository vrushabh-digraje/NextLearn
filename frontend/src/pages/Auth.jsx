import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, CheckCircle } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, user } = useContext(AuthContext);

  const mode = searchParams.get('mode') || 'login';
  const isLogin = mode === 'login';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    let res;
    if (isLogin) {
      res = await login(formData.email, formData.password);
    } else {
      res = await register(formData.name, formData.email, formData.password, formData.role);
    }

    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(res.error || 'Authentication failed. Please verify fields.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px 80px 20px',
      minHeight: 'calc(100vh - 180px)'
    }}>
      <div className="glass-panel animate-slide-up" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--glass-shadow)'
      }}>
        {/* Auth Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            background: 'rgba(139, 92, 246, 0.1)',
            color: 'var(--secondary)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={12} color="#f59e0b" />
            Join NextLearn
          </span>
          <h2 style={{ fontSize: '2rem', marginTop: '12px', fontFamily: 'var(--font-display)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            {isLogin ? 'Enter your credentials to continue studying.' : 'Sign up to access our premium courses.'}
          </p>
        </div>

        {/* Error Callout */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.88rem',
            marginBottom: '20px'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Name Field (Register Mode only) */}
          {!isLogin && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  style={{ paddingLeft: '44px' }}
                  required
                />
                <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="you@example.com"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password Field */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Role selector (Register mode only) */}
          {!isLogin && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">I want to enroll as a:</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid',
                  borderColor: formData.role === 'student' ? 'var(--primary)' : 'var(--border-color)',
                  background: formData.role === 'student' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: formData.role === 'student' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: '500',
                  transition: 'var(--transition-smooth)'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  {formData.role === 'student' && <CheckCircle size={14} color="var(--primary)" />}
                  Student
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid',
                  borderColor: formData.role === 'instructor' ? 'var(--secondary)' : 'var(--border-color)',
                  background: formData.role === 'instructor' ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: formData.role === 'instructor' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: '500',
                  transition: 'var(--transition-smooth)'
                }}>
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={formData.role === 'instructor'}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  {formData.role === 'instructor' && <CheckCircle size={14} color="var(--secondary)" />}
                  Instructor
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '0.98rem', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/auth?mode=register')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/auth?mode=login')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Log In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
