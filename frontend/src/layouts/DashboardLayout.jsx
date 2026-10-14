import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useState } from 'react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/projects':  'Projects',
  '/tasks':     'Tasks & Sprints',
  '/team':      'Team Roster',
  '/reports':   'Analytics & Reports',
  '/profile':   'My Profile',
  '/settings':  'Settings',
};

export const DashboardLayout = () => {
  const [collapsed, setCollapsed]      = useState(false);
  const [mobileOpen, setMobileOpen]    = useState(false);
  const location = useLocation();

  const title = Object.entries(PAGE_TITLES).find(([k]) => location.pathname.startsWith(k))?.[1] || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-gray-950/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-60 flex-shrink-0">
            <Sidebar isCollapsed={false} toggleSidebar={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${collapsed ? 'md:pl-16' : 'md:pl-60'}`}>
        <Navbar pageTitle={title} toggleMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full animate-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
