import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-display font-bold text-slate-900">404 - Resource Not Found</h2>
      <p className="text-slate-500 text-xs max-w-md">
        The requested system route does not exist or you lack sufficient access permissions.
      </p>
      <Link
        to="/dashboard"
        className="btn-primary text-xs py-2.5 px-4 inline-flex items-center gap-2 mt-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Dashboard
      </Link>
    </div>
  );
};
