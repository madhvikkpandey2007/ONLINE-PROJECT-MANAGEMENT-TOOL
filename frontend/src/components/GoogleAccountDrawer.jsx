import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userService } from '../services/userService';
import { PasswordConfirmModal } from './PasswordConfirmModal';
import { StatusBadge } from './StatusBadge';
import {
  User, Mail, ShieldCheck, UserCheck, UserPlus, LogOut,
  Settings, KeyRound, ExternalLink, Check, ChevronRight, Lock, Sparkles
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    id: 1,
    name: 'Arjun Sharma',
    email: 'admin@projectflow.com',
    role: 'ADMIN',
    avatarBg: 'bg-red-500 text-white',
    title: 'Chief Technology Officer (CTO)',
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'manager@projectflow.com',
    role: 'PROJECT_MANAGER',
    avatarBg: 'bg-brand-600 text-white',
    title: 'Lead Project Manager',
  },
  {
    id: 3,
    name: 'Rahul Kumar',
    email: 'member@projectflow.com',
    role: 'TEAM_MEMBER',
    avatarBg: 'bg-teal-600 text-white',
    title: 'Senior Software Engineer',
  },
];

export const GoogleAccountDrawer = ({ isOpen, onClose }) => {
  const { user, login, logout, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [targetSwitchAccount, setTargetSwitchAccount] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // 'UPDATE_PROFILE' | 'SWITCH_ACCOUNT'
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleTriggerUpdateProfile = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) {
      showToast('Name and email cannot be empty', 'error');
      return;
    }
    setPendingAction('UPDATE_PROFILE');
    setShowPasswordModal(true);
  };

  const handleTriggerSwitchAccount = (acc) => {
    if (acc.email === user?.email) return;
    setTargetSwitchAccount(acc);
    setPendingAction('SWITCH_ACCOUNT');
    setShowPasswordModal(true);
  };

  const handlePasswordVerified = async (password) => {
    setShowPasswordModal(false);
    setSaving(true);

    try {
      if (pendingAction === 'UPDATE_PROFILE') {
        const res = await userService.updateProfile({ name: editName, email: editEmail });
        if (res.success) {
          updateUserProfile(res.data);
          showToast('Profile changes saved successfully!', 'success');
        }
      } else if (pendingAction === 'SWITCH_ACCOUNT' && targetSwitchAccount) {
        // Authenticate with target email using password or default demo password
        let res;
        try {
          res = await login({ email: targetSwitchAccount.email, password });
        } catch (_) {
          // If custom password was used for current user, try standard demo login for fallback accounts
          res = await login({ email: targetSwitchAccount.email, password: 'password123' });
        }

        if (res?.success) {
          showToast(`Switched account to ${targetSwitchAccount.name}`, 'success');
          onClose();
          navigate('/dashboard');
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed.', 'error');
    } finally {
      setSaving(false);
      setPendingAction(null);
      setTargetSwitchAccount(null);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Google Account Panel Modal */}
      <div className="fixed right-4 top-16 z-50 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-in">
        {/* Top Google Colors Accent Bar */}
        <div className="h-1.5 flex w-full">
          <div className="h-full w-1/4 bg-blue-500" />
          <div className="h-full w-1/4 bg-red-500" />
          <div className="h-full w-1/4 bg-amber-400" />
          <div className="h-full w-1/4 bg-emerald-500" />
        </div>

        <div className="p-5 max-h-[85vh] overflow-y-auto scrollbar-thin space-y-5">
          {/* Header Card with Google Avatar */}
          <div className="text-center bg-gray-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-gray-200/80 dark:border-slate-700/60 relative">
            <div className="relative inline-block mb-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-blue-500 text-white text-2xl font-bold flex items-center justify-center shadow-md border-4 border-white dark:border-slate-900 mx-auto">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white text-[10px]" title="Account Active">
                ✓
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 font-display">
              {user?.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-mono">
              {user?.email}
            </p>

            <div className="mt-2.5 flex justify-center">
              <StatusBadge type="role" value={user?.role} />
            </div>

            <button
              onClick={() => {
                onClose();
                navigate('/profile');
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 shadow-sm transition-all"
            >
              <Settings className="w-3.5 h-3.5" /> Manage your Account
            </button>
          </div>

          {/* Quick Edit Profile Section (Password Protected) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-bold text-gray-900 dark:text-slate-100">
                  Quick Profile Edit
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                Password Protected
              </span>
            </div>

            <form onSubmit={handleTriggerUpdateProfile} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input py-1.5 text-xs"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-500 dark:text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="input py-1.5 text-xs"
                  placeholder="Enter email address"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Save Changes (Requires Password)
              </button>
            </form>
          </div>

          {/* Account Switcher Grid (Google Style) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
                Switch User Account
              </span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">1-Click Auth</span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
              {DEMO_ACCOUNTS.map((acc) => {
                const isActive = acc.email === user?.email;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleTriggerSwitchAccount(acc)}
                    className={`w-full p-3 flex items-center justify-between text-left transition-colors ${
                      isActive
                        ? 'bg-brand-50/50 dark:bg-brand-950/30'
                        : 'hover:bg-gray-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-full ${acc.avatarBg} text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        {acc.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 truncate font-mono">
                          {acc.email}
                        </p>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-slate-500 group-hover:text-brand-600 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-500" /> Switch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onClose();
                navigate('/register');
              }}
              className="btn-ghost text-xs text-gray-600 dark:text-slate-400 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add account
            </button>
            <button
              onClick={() => {
                logout();
                onClose();
                navigate('/login');
              }}
              className="btn-secondary text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Security Verification Password Modal */}
      <PasswordConfirmModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingAction(null);
          setTargetSwitchAccount(null);
        }}
        onSuccess={handlePasswordVerified}
        actionTitle={
          pendingAction === 'SWITCH_ACCOUNT'
            ? `Switch to ${targetSwitchAccount?.name}`
            : 'Confirm Profile Changes'
        }
        actionDescription={
          pendingAction === 'SWITCH_ACCOUNT'
            ? `Enter password to verify security and switch active session to ${targetSwitchAccount?.name} (${targetSwitchAccount?.email}).`
            : `Enter your account password to verify identity and commit changes to your name and email.`
        }
      />
    </>
  );
};
