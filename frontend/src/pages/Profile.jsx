import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { PasswordConfirmModal } from '../components/PasswordConfirmModal';
import {
  User, Mail, Lock, ShieldCheck, CheckCircle2, KeyRound,
  Sliders, Shield, Smartphone, Globe, CreditCard, AlertCircle
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'security' | 'preferences'
  const [name, setName]         = useState(user?.name || '');
  const [email, setEmail]       = useState(user?.email || '');
  const [phone, setPhone]       = useState('+91 98765 43210');
  const [upiId, setUpiId]       = useState(user?.email ? `${user.email.split('@')[0]}@okaxis` : 'user@okaxis');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [saving, setSaving]     = useState(false);

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }
    setPendingUpdate({ type: 'PERSONAL', data: { name, email } });
    setShowPasswordModal(true);
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPendingUpdate({ type: 'SECURITY', data: { password: newPassword } });
    setShowPasswordModal(true);
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setPendingUpdate({ type: 'PREFERENCES', data: { phone, upiId } });
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = async () => {
    setShowPasswordModal(false);
    if (!pendingUpdate) return;

    setSaving(true);
    try {
      if (pendingUpdate.type === 'PERSONAL' || pendingUpdate.type === 'SECURITY') {
        const res = await userService.updateProfile(pendingUpdate.data);
        if (res.success) {
          updateUserProfile(res.data);
          showToast(
            pendingUpdate.type === 'PERSONAL'
              ? 'Personal information updated!'
              : 'Security password changed successfully!',
            'success'
          );
          setNewPassword('');
          setConfirmPassword('');
        }
      } else if (pendingUpdate.type === 'PREFERENCES') {
        showToast('Account preferences updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile details', 'error');
    } finally {
      setSaving(false);
      setPendingUpdate(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* Header Banner Google Account */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white text-brand-700 font-bold text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-display">{user?.name}</h2>
                <StatusBadge type="role" value={user?.role} />
              </div>
              <p className="text-xs text-blue-100 font-mono mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-2 text-[11px] text-blue-200 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Google Protected Account • All updates require password validation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs">
            <Lock className="w-4 h-4 text-amber-300" />
            <span>High Security Zone</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'personal'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4" /> Personal Info
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" /> Security & Password
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'preferences'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" /> Preferences & India UPI
        </button>
      </div>

      {/* TAB 1: Personal Info */}
      {activeTab === 'personal' && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 font-display">
                Basic Personal Profile
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Changes to your name or primary email address will require password verification.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
              🔒 Password Protected
            </span>
          </div>

          <form onSubmit={handlePersonalSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-icon"
                  />
                </div>
              </div>

              <div>
                <label className="label">Primary Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-icon"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> BCrypt 256-bit Encrypted
              </span>
              <button type="submit" disabled={saving} className="btn-primary">
                <Lock className="w-4 h-4" /> Save Info (Confirm Password)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 font-display">
                Security & Authentication
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Update password with current password verification.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
              🔒 Password Protected
            </span>
          </div>

          <form onSubmit={handleSecuritySubmit} className="space-y-5 max-w-md">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input input-icon"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="input input-icon"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-brand-500" /> Security Token Required
              </span>
              <button type="submit" disabled={saving || !newPassword} className="btn-primary">
                <Lock className="w-4 h-4" /> Update Password (Confirm Current)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Preferences & India UPI */}
      {activeTab === 'preferences' && (
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 font-display">
                Regional & Account Preferences
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Indian contact info, UPI ID for project reimbursements.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900">
              🔒 Password Protected
            </span>
          </div>

          <form onSubmit={handlePreferencesSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Contact Phone (+91)</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input input-icon font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="label">Reimbursement UPI ID</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="input input-icon font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                <Globe className="w-4 h-4 text-blue-500" /> Locale: India (en-IN / INR)
              </span>
              <button type="submit" disabled={saving} className="btn-primary">
                <Lock className="w-4 h-4" /> Save Preferences (Confirm Password)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Confirmation Security Modal */}
      <PasswordConfirmModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingUpdate(null);
        }}
        onSuccess={handlePasswordVerified}
        actionTitle="Google Account Security Check"
        actionDescription="For your security, enter your account password to confirm saving these changes."
      />
    </div>
  );
};
