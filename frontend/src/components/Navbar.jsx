import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationService } from '../services/extraServices';
import { GoogleAccountDrawer } from './GoogleAccountDrawer';
import { Bell, Search, CheckCheck, Menu, Clock, Sun, Moon, UserCheck, Shield } from 'lucide-react';

const getRelativeTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export const Navbar = ({ pageTitle, toggleMobileSidebar }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [showNotifs, setShowNotifs]       = useState(false);
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const [nRes, cRes] = await Promise.all([
        notificationService.getUserNotifications(),
        notificationService.getUnreadCount(),
      ]);
      if (nRes.success) setNotifications(nRes.data);
      if (cRes.success) setUnreadCount(cRes.data);
    } catch (_) {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const t = setInterval(fetchNotifications, 30000);
      return () => clearInterval(t);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const roleLabel = {
    ADMIN:           'Admin',
    PROJECT_MANAGER: 'Project Manager',
    TEAM_MEMBER:     'Team Member',
  }[user?.role] || 'Member';

  return (
    <>
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 flex-shrink-0 transition-colors duration-200">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={toggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-slate-500 hidden sm:block font-medium">Workspace</span>
            <span className="text-xs text-gray-300 dark:text-slate-700 hidden sm:block">/</span>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{pageTitle || 'Dashboard'}</h1>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sprint 24 Active
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, projects..."
              className="w-56 lg:w-72 text-sm bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-lg pl-9 pr-12 py-1.5 text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500
                         focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            <kbd className="absolute right-3 text-[10px] font-mono text-gray-400 dark:text-slate-500 hidden lg:block">⌘K</kbd>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900 transition-transform duration-200" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 overflow-hidden z-50 animate-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 font-medium">
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto scrollbar-thin divide-y divide-gray-50 dark:divide-slate-800/50">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400 dark:text-slate-500">
                      <p className="font-medium text-gray-600 dark:text-slate-400 mb-1">All caught up!</p>
                      No new notifications.
                    </div>
                  ) : notifications.map((n) => (
                    <div key={n.id} onClick={() => !n.read && markAsRead(n.id)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${!n.read ? 'bg-brand-50/60 dark:bg-brand-950/30 hover:bg-brand-50 dark:hover:bg-brand-950/50' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-brand-500' : 'bg-gray-200 dark:bg-slate-700'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate">{n.title}</p>
                          <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3" />{getRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Google Account Button */}
          <button
            onClick={() => setShowAccountDrawer(true)}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full border border-gray-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all ml-1 group"
            title="Google Account & User Switcher"
          >
            <div className="hidden sm:block text-right min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-slate-100 leading-tight truncate max-w-[110px]">
                {user?.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">
                {roleLabel}
              </p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-brand-500/20 group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
          </button>
        </div>
      </header>

      {/* Google Account Drawer */}
      <GoogleAccountDrawer
        isOpen={showAccountDrawer}
        onClose={() => setShowAccountDrawer(false)}
      />
    </>
  );
};
