import React, { useState } from 'react';
import { ShieldAlert, Eye, EyeOff, Lock, ArrowRight, X } from 'lucide-react';
import { authService } from '../services/authService';

export const PasswordConfirmModal = ({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = 'Security Confirmation',
  actionDescription = 'Please confirm your password before applying these changes.'
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const res = await authService.verifyPassword(password);
      if (res.success) {
        setPassword('');
        setError('');
        onSuccess(password);
      } else {
        setError(res.message || 'Incorrect password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-in">
        {/* Header decoration bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-brand-600" />

        <div className="p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon & Title */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 font-display">
                {actionTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Google Security Verification
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-gray-200/60 dark:border-slate-700/60 mb-5 leading-relaxed">
            {actionDescription}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Enter Your Account Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter current password"
                  className="input input-icon pr-10"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1.5 flex items-center gap-1">
                  <span>⚠️</span> {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                disabled={verifying}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={verifying || !password}
                className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
              >
                {verifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Proceed <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
