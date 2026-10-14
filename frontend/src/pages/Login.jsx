import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck,
  CheckCircle, Building2, BarChart3, Users, Zap
} from 'lucide-react';

const PERSONAS = [
  { id: 'admin',    label: 'Admin',        role: 'System Administrator', email: 'admin@projectflow.com',    pass: 'admin123',   avatar: 'A',  color: 'bg-gray-800' },
  { id: 'manager',  label: 'Priya Patel',  role: 'Lead Project Manager',  email: 'manager@projectflow.com',  pass: 'manager123', avatar: 'P',  color: 'bg-violet-600' },
  { id: 'dev',      label: 'Amit Kumar',   role: 'Staff Engineer',        email: 'developer@projectflow.com',pass: 'dev123',     avatar: 'A',  color: 'bg-blue-600' },
  { id: 'designer', label: 'Sneha Desai',  role: 'Lead UI/UX Designer',   email: 'designer@projectflow.com', pass: 'design123',  avatar: 'S',  color: 'bg-rose-600' },
  { id: 'qa',       label: 'Vikram Singh', role: 'QA & Automation Lead',  email: 'tester@projectflow.com',   pass: 'test123',    avatar: 'V',  color: 'bg-amber-600' },
];

const FEATURES = [
  { icon: BarChart3,  title: 'Sprint Analytics',  desc: 'Real-time velocity tracking and delivery metrics across all active projects.' },
  { icon: Users,      title: 'Team Workload',      desc: 'Balance capacity across engineers, QA, and designers with live dashboards.' },
  { icon: Zap,        title: 'Instant Sync',       desc: 'Status changes propagate across all stakeholders in under 200ms.' },
];

export const Login = () => {
  const [email, setEmail]           = useState('admin@projectflow.com');
  const [password, setPassword]     = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [activeId, setActiveId]     = useState('admin');
  const [forgotOpen, setForgotOpen] = useState(false);

  const { login }      = useAuth();
  const { showToast }  = useToast();
  const navigate       = useNavigate();

  const selectPersona = (p) => {
    setActiveId(p.id);
    setEmail(p.email);
    setPassword(p.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { showToast('Please fill in all fields', 'error'); return; }
    setLoading(true);
    try {
      const res = await login({ email, password, rememberMe });
      if (res.success) {
        showToast(`Welcome back, ${res.data.name}!`, 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex lg:w-[54%] flex-col justify-between bg-gray-950 px-12 py-10 xl:px-16">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm">PF</div>
          <span className="text-white font-semibold text-lg font-display">ProjectFlow</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">Enterprise</span>
        </div>

        {/* Hero copy */}
        <div className="space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-400 bg-brand-950/40 border border-brand-900 px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Trusted by 500+ engineering teams across India
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight font-display">
              Ship faster.<br/>
              <span className="text-brand-400">Stay aligned.</span>
            </h1>
            <p className="mt-4 text-gray-400 text-base leading-relaxed max-w-md">
              Unified project management for engineering, design, and QA teams. From sprint planning to delivery — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="border-t border-gray-800 pt-7">
            <blockquote className="text-sm text-gray-400 italic leading-relaxed">
              "ProjectFlow cut our release cycle by 40%. The sprint board and workload view alone save us 3 hours of stand-ups every week."
            </blockquote>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-violet-700 text-white text-xs font-bold flex items-center justify-center">P</div>
              <div>
                <p className="text-sm font-semibold text-gray-300">Priya Patel</p>
                <p className="text-xs text-gray-500">VP Engineering · Tata Digital Hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="flex items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-gray-500" /> SOC-2 Certified</div>
          <div className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-gray-500" /> 256-bit TLS</div>
          <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-gray-500" /> ISO 27001</div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="w-full lg:w-[46%] flex flex-col justify-center bg-white px-6 sm:px-10 md:px-12 xl:px-16 py-10">
        {/* Mobile brand */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">PF</div>
          <span className="font-semibold text-gray-900 font-display">ProjectFlow</span>
        </div>

        <div className="max-w-sm w-full mx-auto space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-display">Sign in</h2>
            <p className="text-sm text-gray-500 mt-1">Select a demo persona or enter your credentials.</p>
          </div>

          {/* Persona selector */}
          <div className="space-y-2">
            <label className="label">Demo accounts</label>
            <div className="space-y-1.5">
              {PERSONAS.map((p) => {
                const isActive = activeId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPersona(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150 ${
                      isActive
                        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-md ${p.color} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                      {p.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-brand-700' : 'text-gray-800'}`}>{p.label}</p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-brand-500' : 'text-gray-400'}`}>{p.role}</p>
                    </div>
                    {isActive && <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input input-icon"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <button type="button" onClick={() => setForgotOpen(true)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-icon pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500 w-4 h-4" />
              <span className="text-sm text-gray-600">Keep me signed in for 30 days</span>
            </label>

            <button type="submit" disabled={loading}
              className="btn-primary btn-lg w-full font-semibold">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">Create one</Link>
          </p>
        </div>
      </div>

      {/* ─── FORGOT PASSWORD MODAL ─── */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm animate-fade">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-sm p-6 space-y-4 animate-in">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-brand-600" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900 font-display">Reset your password</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                Contact your workspace admin at{' '}
                <span className="font-medium text-gray-700">admin@projectflow.com</span>{' '}
                to reset your credentials.
              </p>
            </div>
            <button onClick={() => setForgotOpen(false)} className="btn-secondary w-full">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
