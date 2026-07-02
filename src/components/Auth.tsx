import React, { useState } from 'react';
import { LogIn, Key, Mail, ShieldAlert, CheckCircle, Eye, EyeOff, Cpu, RefreshCw, HelpCircle } from 'lucide-react';
import { User } from '../types';
import adjenBg from '../assets/images/adjen_tech_bg_1782846544221.jpg';

interface AuthProps {
  onLogin: (user: User, rememberMe: boolean) => void;
}

// Pre-configured accounts based on role requirements
export const DEFAULT_ACCOUNTS = [
  {
    id: 'user-superadmin',
    fullName: 'Alexander Mercer',
    email: 'superadmin@adjen.com',
    password: 'Admin@123',
    phone: '+1 (555) 019-2831',
    role: 'Super Admin',
    department: 'Executive Board',
    companyName: 'Adjen Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128'
  },
  {
    id: 'user-admin',
    fullName: 'Sarah Connor',
    email: 'admin@adjen.com',
    password: 'Admin@123',
    phone: '+1 (555) 014-4921',
    role: 'Admin',
    department: 'Administration',
    companyName: 'Adjen Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128'
  },
  {
    id: 'user-manager',
    fullName: 'David Smith',
    email: 'manager@adjen.com',
    password: 'Manager@123',
    phone: '+1 (555) 017-8321',
    role: 'Manager',
    department: 'Sales Operations',
    companyName: 'Adjen Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128'
  },
  {
    id: 'user-sales',
    fullName: 'Elena Rostova',
    email: 'sales@adjen.com',
    password: 'Sales@123',
    phone: '+1 (555) 012-7489',
    role: 'Sales Executive',
    department: 'Enterprise Sales',
    companyName: 'Adjen Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'
  },
  {
    id: 'user-support',
    fullName: 'Marcus Chen',
    email: 'support@adjen.com',
    password: 'Support@123',
    phone: '+1 (555) 015-3810',
    role: 'Support Executive',
    department: 'Customer Success',
    companyName: 'Adjen Technologies',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128'
  }
];

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  // Auto pre-fill if remember me was active
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('crm_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleQuickLogin = (account: typeof DEFAULT_ACCOUNTS[0]) => {
    setError('');
    setSuccess('');
    setEmail(account.email);
    setPassword(account.password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    // Match account
    const matched = DEFAULT_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
    );

    if (matched) {
      // Manage Remember Me preference
      if (rememberMe) {
        localStorage.setItem('crm_remembered_email', matched.email);
      } else {
        localStorage.removeItem('crm_remembered_email');
      }

      setSuccess(`Authentication successful! Welcome back, ${matched.fullName}.`);
      
      // Pass the user model with password, phone, and department embedded
      const userPayload: User & { phone?: string; department?: string; password?: string } = {
        id: matched.id,
        fullName: matched.fullName,
        email: matched.email,
        role: matched.role,
        companyName: matched.companyName,
        avatarUrl: matched.avatarUrl,
        phone: matched.phone,
        department: matched.department,
        password: matched.password
      };

      setTimeout(() => {
        onLogin(userPayload, rememberMe);
      }, 1200);
    } else {
      setError('Invalid email or password.');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setRecoverySent(true);
    setTimeout(() => {
      setRecoverySent(false);
      setForgotMode(false);
      setRecoveryEmail('');
    }, 4500);
  };

  return (
    <div id="auth-page" className="min-h-screen bg-[#030712] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans bg-cover bg-center" style={{ backgroundImage: `url(${adjenBg})` }}>
      {/* Visual Ambient Overlays */}
      <div className="absolute inset-0 bg-black/75 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md backdrop-blur-xl bg-zinc-950/85 border border-zinc-900 p-8 rounded-2xl shadow-[0_0_50px_rgba(254,220,9,0.15)] relative z-10 transition-all">
        {/* Adjen Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-yellow-400 text-black rounded-2xl mb-4 shadow-lg shadow-yellow-400/15">
            <Cpu className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
            <span className="text-yellow-400">ADJEN</span>
            <span className="text-zinc-300 font-light tracking-wide">TECHNOLOGIES</span>
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1.5 font-mono">
            Enterprise Client Relations Manager
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/50 p-3.5 rounded-xl text-red-400 text-xs mb-5 font-sans">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-900/50 p-3.5 rounded-xl text-emerald-400 text-xs mb-5 font-sans">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 animate-bounce" />
            <span>{success}</span>
          </div>
        )}

        {!forgotMode ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/55 border border-zinc-800 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 outline-none text-xs transition-all"
                  placeholder="name@adjen.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-[10px] text-yellow-400/80 hover:text-yellow-400 font-mono transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/55 border border-zinc-800 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 rounded-xl pl-10 pr-10 py-2.5 text-zinc-100 outline-none text-xs transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me control */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[10px] font-mono text-zinc-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-850 bg-zinc-900 text-yellow-400 focus:ring-yellow-400/30 focus:ring-offset-0"
                />
                Remember Me
              </label>
              <span className="text-[9px] text-zinc-500 font-mono">SECURE SES</span>
            </div>

            <button
              type="submit"
              id="auth-submit-btn"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black uppercase tracking-wider rounded-xl py-3 mt-2 shadow-lg hover:shadow-yellow-400/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <LogIn className="w-4 h-4" /> SECURE LOGIN
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
            <p className="text-zinc-400 text-[11px] leading-relaxed mb-1 font-mono">
              Enter your registered email address below. A recovery credential reset key will be dispatched to your security network container.
            </p>

            {recoverySent ? (
              <div className="bg-yellow-400/5 border border-yellow-400/20 p-4 rounded-xl text-yellow-400 space-y-1 text-[11px] font-mono">
                <p className="font-bold">✓ RESET TRANSACTION DISPATCHED</p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  An overrides password recovery link has been synchronized to: <br/>
                  <strong className="text-white text-xs">{recoveryEmail}</strong><br/>
                  Verify your secure terminal within 15 minutes.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 font-mono">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      className="w-full bg-zinc-900/55 border border-zinc-800 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 rounded-xl pl-10 pr-4 py-2.5 text-zinc-100 outline-none text-xs transition-all"
                      placeholder="name@adjen.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-xl py-2.5 font-bold transition-all uppercase text-[10px] tracking-wide"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl py-2.5 font-black transition-all uppercase text-[10px] tracking-wide"
                  >
                    Reset Password
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Demo Fast Login Panel */}
        <div className="mt-8 pt-6 border-t border-zinc-900">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-3 font-mono flex items-center justify-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-yellow-400 animate-spin-slow" /> COGNITIVE FAST-LOGIN ACCOUNTS
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {DEFAULT_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-900/80 hover:border-zinc-800 text-zinc-300 hover:text-white py-2 px-2 rounded-lg font-bold font-sans transition-all text-left flex flex-col justify-between h-14"
              >
                <span className="text-[9px] text-zinc-500 font-mono tracking-wide uppercase leading-none">{acc.role}</span>
                <span className="text-white truncate font-black mt-1 leading-none">{acc.fullName.split(' ')[0]}</span>
                <span className="text-[8px] text-yellow-400 font-mono mt-0.5 leading-none">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
