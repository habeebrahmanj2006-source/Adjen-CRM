import React, { useState } from 'react';
import { User, CrmSettings } from '../types';
import { Shield, Sparkles, Database, Save, RotateCcw, AlertTriangle, ToggleLeft, ToggleRight, UserCheck } from 'lucide-react';

interface SettingsProps {
  user: User;
  settings: CrmSettings;
  onUpdateUser: (updatedUser: User) => void;
  onUpdateSettings: (updatedSettings: CrmSettings) => void;
  onResetData: () => void;
}

export default function Settings({
  user,
  settings,
  onUpdateUser,
  onUpdateSettings,
  onResetData
}: SettingsProps) {
  // Local states for forms
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [companyName, setCompanyName] = useState(user.companyName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

  const [currency, setCurrency] = useState(settings.currency);
  const [enableReminders, setEnableReminders] = useState(settings.enableReminders);
  
  const [successMsg, setSuccessMsg] = useState('');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      fullName,
      email,
      role,
      companyName,
      avatarUrl
    });
    triggerSuccess('User profile details updated successfully!');
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      currency,
      enableReminders
    });
    triggerSuccess('System localization preferences updated!');
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleResetClick = () => {
    if (confirm('⚠️ WARNING: This will completely wipe all current local storage changes (Customers, Leads, Deals, Tasks) and reset back to default professional seed data. Do you wish to continue?')) {
      onResetData();
      alert('CRM Data successfully reset to factory default seed data.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Workspace Profiles & Preferences
        </h1>
        <p className="text-sm text-slate-400 mt-1">Configure profile signatures, currencies, localization, and data stores</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-xl text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card Section */}
        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-purple-500" /> Executive Profile Identity
            </h2>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-950/40 border border-slate-800 rounded-xl mb-2">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'}
                  alt="Profile Avatar"
                  className="w-12 h-12 rounded-xl object-cover border border-purple-500/20 shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Secure Session Signature</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{user.fullName} ({user.role})</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Profile Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Business Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Firm Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-[11px] outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-purple-400" /> Save Profile Signature
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Global Localization & Admin reset controls */}
        <div className="space-y-6">
          {/* Settings Card */}
          <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-500" /> Localization & Automation Settings
            </h2>

            <form onSubmit={handleSettingsSave} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workspace Currency Format</label>
                <div className="grid grid-cols-5 gap-2 bg-slate-950/60 p-1 border border-slate-800 rounded-xl">
                  {['$', '€', '£', '¥', '₹'].map(curOption => (
                    <button
                      key={curOption}
                      type="button"
                      onClick={() => setCurrency(curOption)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currency === curOption 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {curOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle reminder notification sound simulated alerts */}
              <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-200">Simulate Upcoming Reminders</div>
                  <p className="text-[10px] text-slate-400 mt-1">Show proactive header alert flags for pending deadlines</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableReminders(!enableReminders)}
                  className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {enableReminders ? (
                    <ToggleRight className="w-9 h-9 text-indigo-500" />
                  ) : (
                    <ToggleLeft className="w-9 h-9 text-slate-600" />
                  )}
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-indigo-400" /> Save CRM Preferences
                </button>
              </div>
            </form>
          </div>

          {/* Database Control Center reset */}
          <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-6 rounded-2xl border-red-950/30">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2 text-red-400">
              <Database className="w-5 h-5 text-red-400" /> Data Management Sandbox
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Reset your active localStorage workspace parameters and reload the default workspace seed logs.
            </p>

            <button
              onClick={handleResetClick}
              type="button"
              className="w-full py-2.5 bg-red-950/30 hover:bg-red-950/60 text-red-300 border border-red-900/40 hover:border-red-800/60 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Reset Local CRM Database
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
