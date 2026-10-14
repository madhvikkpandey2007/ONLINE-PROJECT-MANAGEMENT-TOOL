import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/extraServices';
import { taskService as taskApi } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { CheckSquare, Clock, AlertCircle, CheckCircle2, Calendar, Target } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color = 'brand' }) => {
  const colors = {
    brand:   'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    amber:   'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    red:     'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400',
  };
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-0.5 font-display">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
};

export const MemberDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getMemberDashboard();
      if (res.success) setMetrics(res.data);
    } catch {
      showToast('Error loading personal workspace', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);
    try {
      await taskApi.updateTaskStatus(taskId, newStatus);
      showToast('Task updated', 'success');
      fetchData();
    } catch {
      showToast('Failed to update task', 'error');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) return <LoadingSkeleton count={3} type="card" />;

  const tasks = metrics?.recentTasks || [];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-display">My Workspace</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage your assigned deliverables and sprint progress.</p>
        </div>
        <div className="bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900 rounded-lg px-4 py-2 flex items-center gap-3">
          <Target className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <div>
            <p className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Velocity</p>
            <p className="text-sm font-bold text-brand-700 dark:text-brand-300 leading-none mt-0.5">{metrics?.completionPercentage?.toFixed(0) || 0}% On-Track</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label="Assigned Tasks" value={metrics?.assignedTasksCount || 0} sub="Total allocated" color="brand" />
        <StatCard icon={CheckCircle2} label="Completed"     value={metrics?.completedTasksCount || 0} sub="Successfully shipped" color="emerald" />
        <StatCard icon={Clock}        label="In Progress"   value={metrics?.inProgressTasksCount || 0} sub="Currently active" color="amber" />
        <StatCard icon={AlertCircle}  label="Overdue Tasks" value={metrics?.overdueTasksCount || 0} sub="Past due date" color="red" />
      </div>

      {/* Task List */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">Active Sprint Deliverables</h3>
          <span className="text-xs text-gray-400 dark:text-slate-500">{tasks.length} tasks</span>
        </div>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400 dark:text-slate-500 border border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
              No tasks currently assigned to you.
            </div>
          ) : tasks.map((task) => (
            <div key={task.id} className="p-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge type="priority" value={task.priority} />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{task.title}</h4>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1 mb-2">{task.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" /> Due: {task.dueDate || 'N/A'}</span>
                  <span>Project: {task.projectId}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:border-l md:border-gray-100 dark:md:border-slate-800 md:pl-4">
                <select
                  disabled={updatingTaskId === task.id}
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                  className="select py-1.5 text-xs font-semibold w-full md:w-36"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
