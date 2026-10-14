import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/extraServices';
import { userService as userApi } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import {
  Users, FolderKanban, CheckCircle2, Search, Edit3, Trash2,
  UserPlus, Activity, TrendingUp, Shield
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';

const CHART_COLORS = ['#5c6ef2', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

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

export const AdminDashboard = () => {
  const [metrics, setMetrics]       = useState(null);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingUser, setEditingUser]   = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'TEAM_MEMBER', status: 'ACTIVE' });
  const [saving, setSaving]     = useState(false);

  const { showToast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, userRes] = await Promise.all([
        dashboardService.getAdminDashboard(),
        userApi.getAllUsers(),
      ]);
      if (dashRes.success) setMetrics(dashRes.data);
      if (userRes.success) setUsers(userRes.data);
    } catch {
      showToast('Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'TEAM_MEMBER', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, password: '', role: u.role, status: u.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const payload = { name: formData.name, email: formData.email, role: formData.role, status: formData.status };
        if (formData.password) payload.password = formData.password;
        await userApi.updateUser(editingUser.id, payload);
        showToast('User updated', 'success');
      } else {
        await userApi.createUser(formData);
        showToast('User created', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}?`)) return;
    try {
      await userApi.deleteUser(id);
      showToast('User deleted', 'success');
      fetchData();
    } catch {
      showToast('Failed to delete user', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (roleFilter === 'ALL' || u.role === roleFilter) &&
      (statusFilter === 'ALL' || u.status === statusFilter)
    );
  });

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  const roleChart = metrics?.userRoleDistribution
    ? Object.entries(metrics.userRoleDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
    : [];

  const taskChart = metrics?.taskStatusDistribution
    ? Object.entries(metrics.taskStatusDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), count: value }))
    : [];

  return (
    <div className="space-y-6 animate-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-display">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage users, projects, and organization settings.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex-shrink-0">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}       label="Total Users"       value={metrics?.totalUsers || 0}     sub={`${metrics?.activeUsers || 0} active`}  color="brand" />
        <StatCard icon={FolderKanban} label="Total Projects"   value={metrics?.totalProjects || 0}   sub={`${metrics?.activeProjects || 0} active`} color="emerald" />
        <StatCard icon={CheckCircle2} label="Tasks Completed"  value={metrics?.completedTasks || 0}  sub={`${metrics?.totalTasks || 0} total`}     color="amber" />
        <StatCard icon={Activity}     label="Pending Tasks"    value={metrics?.pendingTasks || 0}    sub="In progress & to do"                      color="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">User Role Distribution</h3>
            <span className="text-xs text-gray-400 dark:text-slate-500">{metrics?.totalUsers || 0} users</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roleChart} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {roleChart.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">Task Status Breakdown</h3>
            <span className="text-xs text-gray-400 dark:text-slate-500">{metrics?.totalTasks || 0} tasks</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskChart} barSize={28}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #334155', backgroundColor: '#1e293b', color: '#e2e8f0' }} />
                <Bar dataKey="count" fill="#5c6ef2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        {/* Table controls */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 font-display">Organization Directory</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Manage user accounts and permissions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text" placeholder="Search users..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-icon py-1.5 text-xs w-full sm:w-48"
              />
            </div>
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="select py-1.5 text-xs w-full sm:w-auto">
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="TEAM_MEMBER">Team Member</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select py-1.5 text-xs w-full sm:w-auto">
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-slate-800/60 border-b border-gray-100 dark:border-slate-800">
                <th className="table-header-cell">User</th>
                <th className="table-header-cell">Role</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Joined</th>
                <th className="table-header-cell text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">No users found.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-slate-100 text-sm">{u.name}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell"><StatusBadge type="role" value={u.role} /></td>
                  <td className="table-cell">
                    <span className={`badge ${u.status === 'ACTIVE' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="table-cell text-gray-400 dark:text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="btn-ghost btn-sm text-gray-500 hover:text-brand-600">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(u.id, u.name)} className="btn-ghost btn-sm text-gray-500 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input type="text" required value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input" />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input" />
          </div>
          <div>
            <label className="label">Password {editingUser && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}</label>
            <input type="password" required={!editingUser} minLength={6} value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••" className="input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Role</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="select">
                <option value="TEAM_MEMBER">Team Member</option>
                <option value="PROJECT_MANAGER">Project Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="select">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
