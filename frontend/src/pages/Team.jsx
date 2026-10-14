import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Users, Mail, CheckCircle2, Clock, Briefcase, Zap, Shield } from 'lucide-react';

export const Team = () => {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, taskRes] = await Promise.all([
          userService.getAllUsers(),
          taskService.getAllTasks(),
        ]);
        if (userRes.success) setMembers(userRes.data);
        if (taskRes.success) setTasks(taskRes.data);
      } catch (err) {
        showToast('Error loading team directory', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDepartment = (role, name) => {
    if (role === 'ADMIN') return 'Executive & Governance';
    if (role === 'PROJECT_MANAGER') return 'Product Operations';
    if (name.toLowerCase().includes('design')) return 'UI/UX & Product Design';
    if (name.toLowerCase().includes('qa') || name.toLowerCase().includes('test')) return 'Quality Assurance & SRE';
    return 'Core Engineering';
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  return (
    <div className="space-y-6">
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Team Directory & Velocity</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Engineering squad allocation, task throughput, and sprint workload capacity.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg border border-brand-200/80 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-brand-600" />
          {members.length} Active Engineers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => {
          const userTasks = tasks.filter((t) => t.assignee?.id === m.id);
          const completedCount = userTasks.filter((t) => t.status === 'COMPLETED').length;
          const pendingCount = userTasks.length - completedCount;
          const completionRate = userTasks.length > 0 ? Math.round((completedCount * 100) / userTasks.length) : 0;
          const dept = getDepartment(m.role, m.name);

          return (
            <div key={m.id} className="card p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all duration-200">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold text-sm flex items-center justify-center relative shadow-xs">
                      {m.name.charAt(0)}
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-900 text-sm">{m.name}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" /> {m.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
                    {dept}
                  </span>
                  <StatusBadge type="role" value={m.role} />
                </div>
              </div>

              {/* Progress & Task Metrics */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-600">Sprint Completion</span>
                    <span className="text-brand-700 font-bold">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                    <div className="bg-brand-600 h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Assigned</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{userTasks.length}</p>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
                    <p className="text-[10px] text-emerald-700 font-semibold uppercase">Shipped</p>
                    <p className="text-sm font-bold text-emerald-800 mt-0.5">{completedCount}</p>
                  </div>
                  <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <p className="text-[10px] text-amber-700 font-semibold uppercase">In-Flight</p>
                    <p className="text-sm font-bold text-amber-800 mt-0.5">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
