import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/extraServices';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Settings as SettingsIcon, Sliders, CheckCircle2, Shield } from 'lucide-react';

export const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const { showToast } = useToast();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getSettings();
      if (res.success && res.data) {
        const map = {};
        res.data.forEach((s) => { map[s.settingKey] = s.settingValue; });
        setSettings(map);
      }
    } catch {
      showToast('Error loading settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      showToast('Settings updated', 'success');
    } catch {
      showToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} type="card" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-display">System Configuration</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage application defaults and platform controls.</p>
        </div>
        <div className="w-10 h-10 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center border border-brand-100 dark:border-brand-900 flex-shrink-0">
          <SettingsIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General settings */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm pb-2 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2 font-display">
              <Sliders className="w-4 h-4 text-brand-600 dark:text-brand-400" /> General Settings
            </h3>
            <div>
              <label className="label">Application Brand Name</label>
              <input
                type="text" value={settings.APP_NAME || 'ProjectFlow'}
                onChange={(e) => handleChange('APP_NAME', e.target.value)}
                className="input max-w-md"
              />
            </div>
          </div>

          {/* Operational defaults */}
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm pb-2 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2 font-display">
              <Shield className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Operational Defaults
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Default Project Status</label>
                <select
                  value={settings.DEFAULT_PROJECT_STATUS || 'PLANNING'}
                  onChange={(e) => handleChange('DEFAULT_PROJECT_STATUS', e.target.value)}
                  className="select"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>

              <div>
                <label className="label">Default Task Status</label>
                <select
                  value={settings.DEFAULT_TASK_STATUS || 'TODO'}
                  onChange={(e) => handleChange('DEFAULT_TASK_STATUS', e.target.value)}
                  className="select"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 cursor-pointer transition-colors">
                <input
                  type="checkbox" checked={settings.EMAIL_NOTIFICATIONS_ENABLED === 'true'}
                  onChange={(e) => handleChange('EMAIL_NOTIFICATIONS_ENABLED', e.target.checked ? 'true' : 'false')}
                  className="rounded border-gray-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">Email Notifications</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Send automatic status emails on task updates</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 cursor-pointer transition-colors">
                <input
                  type="checkbox" checked={settings.ALLOW_USER_REGISTRATION === 'true'}
                  onChange={(e) => handleChange('ALLOW_USER_REGISTRATION', e.target.checked ? 'true' : 'false')}
                  className="rounded border-gray-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">User Registration</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Allow public self-registration for new users</p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary">
              <CheckCircle2 className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
