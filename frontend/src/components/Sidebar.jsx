import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  BarChart3, UserCircle, Settings, LogOut,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard',        path: '/dashboard', icon: LayoutDashboard },
      { label: 'Projects',         path: '/projects',  icon: FolderKanban },
      { label: 'Tasks & Sprints',  path: '/tasks',     icon: CheckSquare },
    ],
  },
  {
    label: 'People',
    items: [
      { label: 'Team',             path: '/team',     icon: Users },
      { label: 'Reports',          path: '/reports',  icon: BarChart3, roles: ['ADMIN', 'PROJECT_MANAGER'] },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'My Profile',       path: '/profile',  icon: UserCircle },
      { label: 'Settings',         path: '/settings', icon: Settings, roles: ['ADMIN'] },
    ],
  },
];

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const roleLabel = {
    ADMIN:           'Admin',
    PROJECT_MANAGER: 'Project Manager',
    TEAM_MEMBER:     'Team Member',
  }[user?.role] || 'Member';

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-60'}`}>
      {/* Brand / Header */}
      <div className={`flex items-center h-14 border-b border-gray-100 dark:border-slate-800/80 flex-shrink-0 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">PF</div>
            <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm truncate font-display">ProjectFlow</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">PF</div>
        )}
        {!isCollapsed && (
          <button onClick={toggleSidebar}
            className="p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Collapse sidebar">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <button onClick={toggleSidebar}
          className="mx-auto mt-2 p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          title="Expand sidebar">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2 space-y-5">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(item =>
            !item.roles || item.roles.includes(user?.role)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label}>
              {!isCollapsed && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-600 px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {visibleItems.map((item) => (
                  <NavLink key={item.path} to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-100 ${
                        isCollapsed ? 'justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                          : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
                      }`
                    }
                    title={isCollapsed ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-slate-500'}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Sprint health pill */}
      {!isCollapsed && (
        <div className="px-3 py-3 border-t border-gray-100 dark:border-slate-800/80">
          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/60 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Sprint Velocity
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">88%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: '88%' }} />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">4 days left in Sprint 24</p>
          </div>
        </div>
      )}

      {/* User footer */}
      <div className={`border-t border-gray-100 dark:border-slate-800/80 p-3 flex-shrink-0 ${isCollapsed ? 'flex flex-col items-center gap-2' : ''}`}>
        {!isCollapsed && user && (
          <div className="flex items-center gap-2.5 min-w-0 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{roleLabel}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ${isCollapsed ? 'justify-center w-full' : 'w-full'}`}
          title="Sign out"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
