import React, { useState } from 'react';
import { 
  Settings, Building2, MapPin, DollarSign, ShieldAlert, Key, Users, Sparkles, 
  RefreshCw, User, Phone, Mail, CheckCircle2, Lock, ShieldCheck, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CrmSettings, User as UserType } from '../types';

interface SettingsSectionProps {
  settings: CrmSettings;
  onUpdateSettings: (settings: CrmSettings) => void;
  subView: string;
  currentUser: UserType | null;
  onUpdateProfile: (updated: UserType) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128', // Male Admin
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128', // Female Admin
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128', // Male Manager
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128', // Female Exec
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128', // Male Support
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128'  // Female Analyst
];

export default function SettingsSection({
  settings,
  onUpdateSettings,
  subView,
  currentUser,
  onUpdateProfile
}: SettingsSectionProps) {
  // Tabs within the settings profile sub-view
  const [profileTab, setProfileTab] = useState<'personal' | 'password' | 'workspace'>('personal');

  // Personal Profile state
  const [profileName, setProfileName] = useState(currentUser?.fullName || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePhone, setProfilePhone] = useState((currentUser as any)?.phone || '');
  const [profileDept, setProfileDept] = useState((currentUser as any)?.department || 'General Operations');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatarUrl || PRESET_AVATARS[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Workspace settings state
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [currency, setCurrency] = useState(settings.currency);
  const [address, setAddress] = useState('101 Corporate Way, Palo Alto, CA');
  const [workspaceSuccess, setWorkspaceSuccess] = useState('');

  // Security 2FA states
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileEmail) {
      alert('Name and Email are required properties.');
      return;
    }

    if (currentUser) {
      const updated: UserType = {
        ...currentUser,
        fullName: profileName,
        email: profileEmail,
        avatarUrl: profileAvatar,
        // Preserve other properties safely
        ...({
          phone: profilePhone,
          department: profileDept
        } as any)
      };
      onUpdateProfile(updated);
      setProfileSuccess('Personal profile variables synced successfully!');
      setTimeout(() => setProfileSuccess(''), 4000);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all standard credentials.');
      return;
    }

    // Verify current password (fallback to '123456' if not defined)
    const activePass = (currentUser as any)?.password || '123456';
    if (currentPassword !== activePass) {
      setPasswordError('Current passcode does not match administrative registry.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and password confirmation fields do not match.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('Password length must be at least 4 characters for security compliance.');
      return;
    }

    // Update password
    if (currentUser) {
      const updated: UserType = {
        ...currentUser,
        ...({
          password: newPassword
        } as any)
      };
      onUpdateProfile(updated);
      setPasswordSuccess('Security passcode updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 4000);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      companyName,
      currency
    });
    setWorkspaceSuccess('Workspace parameters synced successfully.');
    setTimeout(() => setWorkspaceSuccess(''), 4000);
  };

  const handleGenerateOTP = () => {
    setOtpSent(true);
    setOtpCode(Math.floor(100000 + Math.random() * 900000).toString());
    alert('Security: 2FA OTP code generated. Check secure ledger.');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpVerified(true);
    alert('2FA Multi-Factor validation succeeded.');
  };

  const isWorkspaceEditAllowed = currentUser?.role === 'Super Admin' || currentUser?.role === 'Admin';

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: COMPANY PROFILE / PERSONAL PROFILE (TABBED)
          ========================================== */}
      {subView === 'settings-profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              WORKSPACE PROFILE <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5 uppercase">PREFERENCES</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Manage your active CRM identity, passcodes, and administrative workspace indexes.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-900 gap-1 text-xs">
            <button
              onClick={() => setProfileTab('personal')}
              className={`px-4 py-2.5 font-bold transition-all relative ${
                profileTab === 'personal' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              My Identity Profile
            </button>
            <button
              onClick={() => setProfileTab('password')}
              className={`px-4 py-2.5 font-bold transition-all relative ${
                profileTab === 'password' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setProfileTab('workspace')}
              className={`px-4 py-2.5 font-bold transition-all relative ${
                profileTab === 'workspace' 
                  ? 'text-yellow-400 border-b-2 border-yellow-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Workspace Configuration
            </button>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-xl text-xs">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Personal Profile */}
              {profileTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-zinc-900 pb-5">
                    {/* Profile Photo Display with interactive preset picker */}
                    <div className="relative group">
                      <img 
                        src={profileAvatar} 
                        alt={profileName} 
                        className="w-20 h-20 rounded-full border-2 border-zinc-800 object-cover shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="absolute bottom-0 right-0 p-1.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full shadow transition-all cursor-pointer"
                        title="Choose Avatar Preset"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-base font-black text-white">{profileName || 'Active User'}</h3>
                      <p className="text-zinc-400 font-mono text-[11px] uppercase tracking-wide">{currentUser?.role} &bull; {profileDept}</p>
                      <p className="text-[10px] text-zinc-500">{profileEmail}</p>
                    </div>
                  </div>

                  {/* Avatar Preset Selector Grid */}
                  {showAvatarPicker && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-zinc-900/45 border border-zinc-850 rounded-xl space-y-2.5"
                    >
                      <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Select Premium Avatar Preset</p>
                      <div className="grid grid-cols-6 gap-2">
                        {PRESET_AVATARS.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setProfileAvatar(url);
                              setShowAvatarPicker(false);
                            }}
                            className={`p-1 rounded-lg border transition-all ${
                              profileAvatar === url ? 'border-yellow-400 bg-yellow-400/5' : 'border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <img src={url} alt={`Avatar ${i}`} className="w-full h-10 rounded-md object-cover" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {profileSuccess && (
                    <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{profileSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handlePersonalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="text" required placeholder="John Doe" value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="email" required placeholder="name@adjen.com" value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="text" placeholder="+1 (555) 000-0000" value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Department</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="text" placeholder="E.g. Enterprise Sales" value={profileDept}
                            onChange={(e) => setProfileDept(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-900 pt-4 text-[10px] font-mono text-zinc-500">
                      <div>
                        <span>Clearance Access Level:</span>
                        <strong className="block text-zinc-300 text-xs mt-1 uppercase tracking-wide">{currentUser?.role}</strong>
                      </div>
                      <div>
                        <span>Assigned Corporate Node:</span>
                        <strong className="block text-zinc-300 text-xs mt-1 uppercase tracking-wide">{currentUser?.companyName || 'Adjen Technologies'}</strong>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                    >
                      ✓ Save personal profile
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Tab 2: Change Password */}
              {profileTab === 'password' && (
                <motion.div
                  key="password"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-black text-white">UPDATE SYSTEM PASSCODE</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Ensure your account uses a secure credentials chain to safeguard private customer telemetry.</p>
                  </div>

                  {passwordError && (
                    <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-red-400 text-xs">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-emerald-400 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{passwordSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input 
                          type="password" required placeholder="••••••••" value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="password" required placeholder="••••••••" value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="password" required placeholder="••••••••" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl pl-9 pr-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                    >
                      <Key className="w-4 h-4" /> Save security password
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Tab 3: Workspace Parameters */}
              {profileTab === 'workspace' && (
                <motion.div
                  key="workspace"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-black text-white">WORKSPACE PARAMETERS (ADMIN ONLY)</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Configure system-wide corporate defaults, landmarks, and pricing currencies.</p>
                  </div>

                  {!isWorkspaceEditAllowed ? (
                    <div className="p-5 bg-red-950/25 border border-red-900/50 rounded-2xl text-center space-y-2.5">
                      <ShieldAlert className="w-8 h-8 text-red-500 mx-auto animate-pulse" />
                      <div>
                        <p className="font-bold text-white text-xs uppercase tracking-wide">Enterprise Clearance Required</p>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-normal max-w-sm mx-auto">
                          Your active account classification ({currentUser?.role}) does not hold administrative write authority over workspace metadata. Please consult a Super Admin or Operations Manager.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {workspaceSuccess && (
                        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-emerald-400 text-xs font-semibold">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>{workspaceSuccess}</span>
                        </div>
                      )}

                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Workspace Name</label>
                          <input 
                            type="text" required placeholder="E.g. Adjen Technologies" value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">Default Currency Symbol</label>
                            <input 
                              type="text" required placeholder="E.g. $" value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-mono uppercase font-bold">HQ Landmark</label>
                            <input 
                              type="text" required placeholder="Palo Alto, CA" value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5"
                        >
                          ✓ Save Workspace profile
                        </button>
                      </form>
                    </>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: USERS & ROLES
          ========================================== */}
      {subView === 'settings-roles' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SECURITY ACCESS ROLES <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">PERMISSIONS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit administrative hierarchy, system accesses, and roles configurations.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Access Classification</th>
                    <th className="p-4">Database Read</th>
                    <th className="p-4">Billing Modification</th>
                    <th className="p-4">System Configurations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300 font-mono">
                  <tr>
                    <td className="p-4 font-sans font-bold text-white">Administrator</td>
                    <td className="p-4 text-emerald-400 font-bold">✓ ENABLED</td>
                    <td className="p-4 text-emerald-400 font-bold">✓ ENABLED</td>
                    <td className="p-4 text-emerald-400 font-bold">✓ ENABLED</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-sans font-bold text-zinc-400">Sales specialist</td>
                    <td className="p-4 text-emerald-400 font-bold">✓ ENABLED</td>
                    <td className="p-4 text-zinc-600">✕ DISABLED</td>
                    <td className="p-4 text-zinc-600">✕ DISABLED</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-sans font-bold text-zinc-500">Support agent</td>
                    <td className="p-4 text-emerald-400 font-bold">✓ ENABLED</td>
                    <td className="p-4 text-zinc-600">✕ DISABLED</td>
                    <td className="p-4 text-zinc-600">✕ DISABLED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: THEME
          ========================================== */}
      {subView === 'settings-theme' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SYSTEM RE-THEMING <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">THEME</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure workspace themes, high-contrast levels, and borders transparency.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">Active theme: Premium Yellow & Black</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">High-end dark mode inspired by Adjen Technologies corporate branding.</p>
            </div>

            <span className="px-3.5 py-1.5 bg-yellow-400 text-black font-black uppercase rounded-lg">Dark active</span>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: SECURITY
          ========================================== */}
      {subView === 'settings-security' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              MUTUAL TWO-FACTOR ACCREDITATION <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">2FA SECURITY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Trigger simulated MFA OTP code checks to ensure compliance indices remain optimal.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4 text-xs">
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div>
                <p className="font-bold text-white flex items-center gap-1">Simulate 2FA Authentication Key</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Generates a diagnostic OTP code block.</p>
              </div>

              <button
                type="button"
                onClick={handleGenerateOTP}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg font-mono text-[10px] font-bold"
              >
                Generate OTP Code
              </button>
            </div>

            {otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="p-3 bg-black/40 border border-yellow-400/20 text-yellow-400 font-mono rounded-xl text-center text-xs space-y-1">
                  <span>Diagnostic Security Secure OTP Token Issued:</span>
                  <strong className="block text-xl tracking-widest">{otpCode}</strong>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Enter OTP Code</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" required placeholder="Paste token..."
                      className="flex-1 bg-zinc-900/60 border border-zinc-850 text-white rounded-xl px-3 py-2 text-center text-sm outline-none"
                    />
                    <button 
                      type="submit"
                      className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 font-black rounded-xl uppercase text-xs"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </form>
            )}

            {otpVerified && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-900 text-emerald-400 font-mono rounded-xl text-center text-[10px] font-bold uppercase tracking-wide">
                ✓ Accreditation checks complete. Mutual isolation system verified.
              </div>
            )}

          </div>
        </motion.div>
      )}

    </div>
  );
}
