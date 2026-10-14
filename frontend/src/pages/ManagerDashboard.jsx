import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/extraServices';
import { projectService as projApi } from '../services/projectService';
import { taskService as taskApi } from '../services/taskService';
import { userService as userApi } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  FolderKanban, CheckSquare, Plus, Clock, Users,
  AlertCircle, TrendingUp, Calendar, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#5c6ef2'];

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

export const ManagerDashboard = () => {
  const [metrics, setMetrics]     = useState(null);
  const [projects, setProjects]   = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading]     = useState(true);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen]       = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', startDate: '', endDate: '', status: 'PLANNING' });
  const [taskForm, setTaskForm]       = useState({ title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' });
  const [submitting, setSubmitting]   = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, projRes, userRes] = await Promise.all([
        dashboardService.getManagerDashboard(),
        projApi.getProjects(),
        userApi.getAllUsers(),
      ]);
      if (dashRes.success) setMetrics(dashRes.data);
      if (projRes.success) setProjects(projRes.data);
      if (userRes.success) setTeamMembers(userRes.data);
    } catch {
      showToast('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await projApi.createProject(projectForm);
      showToast('Project created', 'success');
      setIsProjectModalOpen(false);
      setProjectForm({ title: '', description: '', startDate: '', endDate: '', status: 'PLANNING' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create project', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskApi.createTask(taskForm);
      showToast('Task assigned', 'success');
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to assign task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  const statusPieData = metrics?.taskStatusBreakdown
    ? Object.entries(metrics.taskStatusBreakdown).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const workloadData = metrics?.teamWorkload
    ? Object.entries(metrics.teamWorkload).map(([name, count]) => ({ name: name.split(' ')[0], tasks: count }))
    : [];

  return (
    <div className="space-y-6 animate-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-display">Project Manager Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Oversee sprints, manage workloads, and track delivery milestones.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsProjectModalOpen(true)} className="btn-secondary">
            <Plus className="w-4 h-4" /> New Project
          </button>
          <button onClick={() => setIsTaskModalOpen(true)} className="btn-primary">
            <CheckSquare className="w-4 h-4" /> Assign Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FolderKanban} label="Managed Projects"  value={metrics?.totalManagedProjects || 0} sub={`${metrics?.activeProjects || 0} active`} color="brand" />
        <StatCard icon={TrendingUp}   label="Completion Rate"   value={`${(metrics?.overallCompletionRate || 0).toFixed(0)}%`} sub={`${metrics?.completedTasks || 0} of ${metrics?.totalTasks || 0} done`} color="emerald" />
        <StatCard icon={Clock}        label="In Progress"       value={metrics?.inProgressTasks || 0} sub="Currently active" color="amber" />
        <StatCard icon={AlertCircle}  label="Overdue Tasks"     value={metrics?.overdueTasks || 0} sub="Past deadline" color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">Task Status Distribution</h3>
            <span className="text-xs text-gray-400 dark:text-slate-500">Sprint overview</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {statusPieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">Team Workload</h3>
            <span className="text-xs text-gray-400 dark:text-slate-500">Tasks per member</span>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} barSize={24}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#e2e8f0' }} />
                <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">Active Initiatives</h3>
          <span className="text-xs text-gray-400 dark:text-slate-500">{projects.length} projects</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((p) => (
            <div key={p.id} className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/30 dark:hover:bg-brand-950/30 transition-all space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{p.title}</h4>
                  <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                </div>
                <StatusBadge type="projectStatus" value={p.status} />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-500 dark:text-slate-400">Progress</span>
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">{p.progress || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${p.progress || 0}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 dark:text-slate-500 pt-1 border-t border-gray-100 dark:border-slate-800">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.endDate || 'No deadline'}</span>
                <span className="font-medium text-gray-600 dark:text-slate-400">{p.completedTasks}/{p.totalTasks} done</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="label">Project Title</label>
            <input type="text" required value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={3} value={projectForm.description}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Date</label>
              <input type="date" value={projectForm.startDate}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })} className="input" />
            </div>
            <div>
              <label className="label">End Date</label>
              <input type="date" value={projectForm.endDate}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })} className="select">
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsProjectModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Assign Task">
        <form onSubmit={handleAssignTask} className="space-y-4">
          <div>
            <label className="label">Task Title</label>
            <input type="text" required value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={2} value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Project</label>
              <select required value={taskForm.projectId} onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })} className="select">
                <option value="">Select project...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Assignee</label>
              <select value={taskForm.assigneeId} onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })} className="select">
                <option value="">Select member...</option>
                {teamMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Priority</label>
              <select value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })} className="select">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })} className="select">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} className="input" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
