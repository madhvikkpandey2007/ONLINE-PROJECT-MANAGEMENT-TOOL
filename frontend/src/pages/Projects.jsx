import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const Projects = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'PLANNING',
    projectManagerId: '',
  });
  const [saving, setSaving] = useState(false);

  const canManageProjects = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, userRes] = await Promise.all([
        projectService.getProjects(),
        userService.getAllUsers(),
      ]);
      if (projRes.success) setProjects(projRes.data);
      if (userRes.success) setManagers(userRes.data.filter((u) => u.role === 'PROJECT_MANAGER' || u.role === 'ADMIN'));
    } catch (err) {
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'PLANNING',
      projectManagerId: user?.role === 'PROJECT_MANAGER' ? user.id : '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      description: p.description || '',
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      status: p.status,
      projectManagerId: p.projectManager?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProject) {
        await projectService.updateProject(editingProject.id, formData);
        showToast('Project updated successfully.', 'success');
      } else {
        await projectService.createProject(formData);
        showToast('Project created successfully.', 'success');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete project "${title}"?`)) {
      try {
        await projectService.deleteProject(id);
        showToast('Project deleted successfully.', 'success');
        fetchData();
      } catch (err) {
        showToast('Failed to delete project', 'error');
      }
    }
  };

  const getDomainTag = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('commerce') || lower.includes('retail') || lower.includes('payment')) return 'Fintech & Payments';
    if (lower.includes('bank') || lower.includes('mobile') || lower.includes('upi')) return 'Digital Banking';
    if (lower.includes('college') || lower.includes('management') || lower.includes('erp')) return 'Enterprise Core';
    if (lower.includes('ai') || lower.includes('bot') || lower.includes('data')) return 'AI & Data Engineering';
    return 'Software Systems';
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-600" />
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Active Projects & Initiatives</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Strategic roadmaps, deliverables, and team allocations.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search initiatives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input text-xs pl-9 pr-3 py-2"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select text-xs py-2 pr-8 pl-3"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {canManageProjects && (
            <button
              onClick={handleOpenCreateModal}
              className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4"
            >
              <Plus className="w-4 h-4" /> Create Initiative
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-slate-500">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-700">No projects found matching criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filteredProjects.map((p) => {
            const domain = getDomainTag(p.title);
            const progress = p.progress || 0;
            return (
              <div
                key={p.id}
                className="card p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all duration-200 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200/60 px-2.5 py-0.5 rounded-md">
                      {domain}
                    </span>
                    <StatusBadge type="projectStatus" value={p.status} />
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-base group-hover:text-brand-600 transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1.5">
                      {p.description || 'No detailed scope description provided for this project.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  {/* Progress Meter */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-brand-600" /> Milestone Completion
                      </span>
                      <span className="text-brand-700 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="text-xs text-slate-600 space-y-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Project Lead:
                      </span>
                      <span className="font-semibold text-slate-800">{p.projectManager?.name || 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> Target Date:
                      </span>
                      <span className="font-semibold text-slate-800">{p.endDate || 'TBD'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Tasks:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {p.completedTasks || 0} / {p.totalTasks || 0} Done
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {canManageProjects && (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Scope
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Archive
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Initiative Roadmap' : 'Initialize New Initiative'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Initiative Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Next-Gen Enterprise Core Banking Engine"
              className="input text-sm py-2.5"
            />
          </div>

          <div>
            <label className="label">Executive Summary / Scope</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline project business objectives, key architecture requirements, and milestones..."
              className="input text-sm py-2.5 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input text-sm py-2"
              />
            </div>
            <div>
              <label className="label">Target End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input text-sm py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Project Lead / Manager</label>
              <select
                value={formData.projectManagerId}
                onChange={(e) => setFormData({ ...formData, projectManagerId: e.target.value })}
                className="select text-sm py-2.5"
              >
                <option value="">Select Project Manager...</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="select text-sm py-2.5"
              >
                <option value="PLANNING">PLANNING</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-xs py-2 px-5"
            >
              {saving ? 'Saving...' : editingProject ? 'Update Initiative' : 'Launch Initiative'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
