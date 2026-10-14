import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Lock, UserCheck, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('TEAM_MEMBER');
  const [loading, setLoading] = useState(false);

  const { register }    = useAuth();
  const { showToast }   = useToast();
  const navigate        = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please complete all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await register({ name, email, password, role });
      if (res.success) {
        showToast('Account created successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm">PF</div>
          <span className="font-semibold text-gray-900 text-lg font-display">ProjectFlow</span>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-display">Create your account</h1>
            <p className="text-sm text-gray-500 mt-1">Join your organization's workspace on ProjectFlow.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Sharma" className="input input-icon" />
              </div>
            </div>

            <div>
              <label className="label">Work email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@company.com" className="input input-icon" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" className="input input-icon" />
              </div>
            </div>

            <div>
              <label className="label">Your role</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select value={role} onChange={(e) => setRole(e.target.value)} className="select input-icon">
                  <option value="TEAM_MEMBER">Team Member — Engineer / Designer / QA</option>
                  <option value="PROJECT_MANAGER">Project Manager — Sprint Lead</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full font-semibold mt-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5 pt-5 border-t border-gray-100">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account you agree to our{' '}
          <span className="underline cursor-pointer hover:text-gray-600">Terms of Service</span>
          {' '}and{' '}
          <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};
