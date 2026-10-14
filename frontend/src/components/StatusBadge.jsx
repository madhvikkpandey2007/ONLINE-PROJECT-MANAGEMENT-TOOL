import React from 'react';
import {
  CheckCircle2, Clock, AlertCircle, AlertTriangle,
  Flame, Circle, HelpCircle, Shield, Briefcase, Code2
} from 'lucide-react';

const Badge = ({ color, children }) => (
  <span className={`badge ${color}`}>{children}</span>
);

export const StatusBadge = ({ type, value }) => {
  if (!value) return null;

  if (type === 'projectStatus') {
    const map = {
      ACTIVE:    <Badge color="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Active</Badge>,
      PLANNING:  <Badge color="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Planning</Badge>,
      ON_HOLD:   <Badge color="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />On Hold</Badge>,
      COMPLETED: <Badge color="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60"><CheckCircle2 className="w-3 h-3" />Completed</Badge>,
      CANCELLED: <Badge color="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Cancelled</Badge>,
    };
    return map[value] || <Badge color="bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{value}</Badge>;
  }

  if (type === 'taskStatus') {
    const map = {
      TODO:        <Badge color="bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"><Circle className="w-3 h-3" />To Do</Badge>,
      IN_PROGRESS: <Badge color="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"><Clock className="w-3 h-3" />In Progress</Badge>,
      REVIEW:      <Badge color="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60"><HelpCircle className="w-3 h-3" />In Review</Badge>,
      COMPLETED:   <Badge color="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"><CheckCircle2 className="w-3 h-3" />Done</Badge>,
    };
    return map[value] || <Badge color="bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{value}</Badge>;
  }

  if (type === 'priority') {
    const map = {
      LOW:    <Badge color="bg-gray-100 text-gray-500 border-gray-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Low</Badge>,
      MEDIUM: <Badge color="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60"><AlertCircle className="w-3 h-3" />Medium</Badge>,
      HIGH:   <Badge color="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60"><AlertTriangle className="w-3 h-3" />High</Badge>,
      URGENT: <Badge color="bg-red-50 text-red-700 border-red-200 font-bold dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60"><Flame className="w-3 h-3" />Urgent</Badge>,
    };
    return map[value] || <Badge color="bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{value}</Badge>;
  }

  if (type === 'role') {
    const map = {
      ADMIN:           <Badge color="bg-red-50 text-red-700 border-red-200 font-semibold dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60"><Shield className="w-3 h-3" />Admin</Badge>,
      PROJECT_MANAGER: <Badge color="bg-brand-50 text-brand-700 border-brand-200 font-semibold dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800/60"><Briefcase className="w-3 h-3" />PM</Badge>,
      TEAM_MEMBER:     <Badge color="bg-teal-50 text-teal-700 border-teal-200 font-semibold dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60"><Code2 className="w-3 h-3" />Engineer</Badge>,
    };
    return map[value] || <Badge color="bg-gray-100 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">{value}</Badge>;
  }

  return null;
};
