import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, Settings, Database, Activity, Landmark, MapPin, Building,
  HardDrive, Cpu, AlertCircle, RefreshCcw, Plus, Trash2, Check, X, CreditCard,
  Layers, ToggleLeft, ToggleRight, Play, CheckSquare, Sparkles, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface SuperAdminSectionProps {
  subView: string;
}

export default function SuperAdminSection({ subView }: SuperAdminSectionProps) {
  // --- 1. USER MANAGEMENT STATE ---
  const [users, setUsers] = useState([
    { id: 'usr-101', name: 'Marcus Chen', email: 'marcus.chen@adjen.io', role: 'Sales Executive', status: 'Active', department: 'Enterprise Sales' },
    { id: 'usr-102', name: 'Elena Rostova', email: 'elena.rostova@adjen.io', role: 'Manager', status: 'Active', department: 'Enterprise Sales' },
    { id: 'usr-103', name: 'Sarah Connor', email: 'sarah.connor@adjen.io', role: 'Admin', status: 'Active', department: 'Operations' },
    { id: 'usr-104', name: 'John Doe', email: 'johndoe@adjen.io', role: 'Support Executive', status: 'Inactive', department: 'Core Support' },
    { id: 'usr-105', name: 'Devon Smith', email: 'dsmith@adjen.io', role: 'Super Admin', status: 'Active', department: 'System Engineering' },
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Sales Executive');
  const [newUserDept, setNewUserDept] = useState('Enterprise Sales');
  const [isAddingUser, setIsAddingUser] = useState(false);

  // --- 2. PERMISSION STATE ---
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>({
    'Super Admin': { 'Full Access': true, 'System Settings': true, 'Billing': true, 'Team Management': true, 'Leads': true, 'Support': true },
    'Admin': { 'Full Access': false, 'System Settings': false, 'Billing': false, 'Team Management': true, 'Leads': true, 'Support': true },
    'Manager': { 'Full Access': false, 'System Settings': false, 'Billing': false, 'Team Management': true, 'Leads': true, 'Support': false },
    'Sales Executive': { 'Full Access': false, 'System Settings': false, 'Billing': false, 'Team Management': false, 'Leads': true, 'Support': false },
    'Support Executive': { 'Full Access': false, 'System Settings': false, 'Billing': false, 'Team Management': false, 'Leads': false, 'Support': true },
  });

  // --- 3. BRANCH MANAGEMENT ---
  const [branches, setBranches] = useState([
    { id: 'br-1', name: 'Silicon Valley HQ', location: 'Palo Alto, CA', headcount: 142, revenue: 2400000, status: 'Active' },
    { id: 'br-2', name: 'London Hub', location: 'London, UK', headcount: 58, revenue: 1100000, status: 'Active' },
    { id: 'br-3', name: 'Singapore Regional Office', location: 'Downtown, Singapore', headcount: 31, revenue: 750000, status: 'Active' },
  ]);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchLoc, setNewBranchLoc] = useState('');

  // --- 4. BACKUP & RESTORE ---
  const [backups, setBackups] = useState([
    { id: 'bak-20260701-01', size: '154 MB', createdAt: '2026-07-01 12:00', status: 'Completed', type: 'Daily Auto' },
    { id: 'bak-20260630-01', size: '153 MB', createdAt: '2026-06-30 12:00', status: 'Completed', type: 'Daily Auto' },
    { id: 'bak-20260629-01', size: '151 MB', createdAt: '2026-06-29 12:00', status: 'Completed', type: 'Manual' },
  ]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');

  // --- 5. SYSTEM MONITORING REALTIME TELEMETRY ---
  const [cpuUsage, setCpuUsage] = useState(24);
  const [memUsage, setMemUsage] = useState(512);
  const [telemetryHistory, setTelemetryHistory] = useState([
    { time: '12:00', cpu: 22, mem: 510 },
    { time: '12:05', cpu: 31, mem: 512 },
    { time: '12:10', cpu: 18, mem: 508 },
    { time: '12:15', cpu: 25, mem: 515 },
    { time: '12:20', cpu: 29, mem: 512 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate slight shifts in telemetry metrics
      const newCpu = Math.max(10, Math.min(95, cpuUsage + Math.floor(Math.random() * 11) - 5));
      const newMem = Math.max(400, Math.min(1024, memUsage + Math.floor(Math.random() * 21) - 10));
      setCpuUsage(newCpu);
      setMemUsage(newMem);
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setTelemetryHistory(prev => {
        const next = [...prev.slice(1), { time: timeStr, cpu: newCpu, mem: newMem }];
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [cpuUsage, memUsage]);

  // --- 6. DATABASE MAINTENANCE ACTIONS ---
  const [dbOptimizing, setDbOptimizing] = useState(false);
  const [dbLogs, setDbLogs] = useState<string[]>([
    'Database engine initialized securely on AWS RDS multi-AZ configuration.',
    'Schema tables: customer_directory, lead_pipelines, team_attendance synced successfully.',
    'No slow queries captured in past 24 hours.'
  ]);

  const handleRunVacuum = () => {
    setDbOptimizing(true);
    setDbLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 5)}] Vacuuming table space index maps...`]);
    setTimeout(() => {
      setDbOptimizing(false);
      setDbLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0, 5)}] VACUUM & REINDEX completed: 4.8MB reclaimed. DB performance optimized.`]);
    }, 1500);
  };

  // User list logic
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const nUsr = {
      id: `usr-${Date.now()}`,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      department: newUserDept
    };
    setUsers([...users, nUsr]);
    setNewUserName('');
    setNewUserEmail('');
    setIsAddingUser(false);
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  // Toggle permission cell
  const handleTogglePermission = (role: string, module: string) => {
    setRolePermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: !prev[role][module]
      }
    }));
  };

  // Add Branch logic
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName || !newBranchLoc) return;
    setBranches([...branches, {
      id: `br-${Date.now()}`,
      name: newBranchName,
      location: newBranchLoc,
      headcount: 1,
      revenue: 0,
      status: 'Active'
    }]);
    setNewBranchName('');
    setNewBranchLoc('');
  };

  // Run backup logic
  const handleRunBackup = () => {
    setIsBackingUp(true);
    setBackupMessage('Snapshotting system memory cache...');
    setTimeout(() => {
      setBackupMessage('Packing secure Firestore data schemas...');
      setTimeout(() => {
        const nBak = {
          id: `bak-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 90) + 10}`,
          size: `${(Math.random() * 5 + 150).toFixed(1)} MB`,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'Completed',
          type: 'Manual'
        };
        setBackups([nBak, ...backups]);
        setIsBackingUp(false);
        setBackupMessage('');
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* ==========================================
          SUB-VIEW: USER MANAGEMENT
          ========================================== */}
      {subView === 'admin-users' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                USER PROFILE DIRECTORY <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SECURITY CONTROLS</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Audit profiles, credentials, department groups, and core systemic roles.</p>
            </div>
            <button 
              onClick={() => setIsAddingUser(!isAddingUser)}
              className="px-4 py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isAddingUser ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAddingUser ? 'CANCEL' : 'PROVISION USER'}
            </button>
          </div>

          <AnimatePresence>
            {isAddingUser && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <form onSubmit={handleAddUser} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
                  <h3 className="font-mono text-zinc-400 uppercase font-black text-[10px]">NEW USER PROVISIONING SLATE</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Full Name</label>
                      <input required type="text" placeholder="John Wick" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:border-yellow-400/40" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Email Address</label>
                      <input required type="email" placeholder="jwick@adjen.io" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:border-yellow-400/40" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Assigned Role</label>
                      <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:border-yellow-400/40">
                        <option value="Super Admin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales Executive">Sales Executive</option>
                        <option value="Support Executive">Support Executive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-mono uppercase">Corporate Department</label>
                      <select value={newUserDept} onChange={e => setNewUserDept(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:border-yellow-400/40">
                        <option value="Enterprise Sales">Enterprise Sales</option>
                        <option value="Operations">Operations</option>
                        <option value="Core Support">Core Support</option>
                        <option value="System Engineering">System Engineering</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-white text-black font-black rounded-lg hover:bg-zinc-200 cursor-pointer">
                    SUBMIT PROVISIONING SIGNAL
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Corporate Email</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-900/10">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono font-bold flex items-center justify-center">
                            {u.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <span className="font-bold text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400 font-mono">{u.email}</td>
                      <td className="p-4">
                        <span className="text-zinc-300 font-semibold">{u.role}</span>
                      </td>
                      <td className="p-4 text-zinc-400">{u.department}</td>
                      <td className="p-4">
                        <button 
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            u.status === 'Active' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' : 'bg-red-950/30 text-red-400 border-red-900/20'
                          }`}
                        >
                          {u.status}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setUsers(users.filter(usr => usr.id !== u.id))}
                          className="p-1 hover:bg-zinc-900 text-zinc-500 hover:text-red-400 rounded transition-all cursor-pointer"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: ROLE MANAGEMENT
          ========================================== */}
      {subView === 'admin-roles' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ENTERPRISE ROLES CONFIG <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">MATRIX</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure systemic access boundaries and hierarchical parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { role: 'Super Admin', desc: 'Root system access. Can modify global setting schemas, manage subscriptions, run diagnostic audits, and toggle roles.', count: 1, auth: 'Full Root Capabilities' },
              { role: 'Admin', desc: 'Access to operations, attendance metrics, client directories, lead pipelines, and standard report files. Denied root configuration.', count: 2, auth: 'Operational Deck' },
              { role: 'Manager', desc: 'Focuses on team leadership, lead assigning matrices, target tracing, and deal validations. Restricted support access.', count: 3, auth: 'Team Deck' },
              { role: 'Sales Executive', desc: 'Assigned clients pipeline only. Access to deal generators, followups, notes, and timeline logs. Zero manager controls.', count: 8, auth: 'Sales Desk' },
              { role: 'Support Executive', desc: 'Authorized for ticketing deck, live chat simulators, customer history cards, and knowledge-base registries.', count: 4, auth: 'Support Desk' },
            ].map(r => (
              <div key={r.role} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex justify-between items-start border-b border-zinc-900 pb-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">{r.role}</h3>
                    <span className="text-[9px] font-mono uppercase text-yellow-400 mt-0.5 block">{r.auth}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">{r.count} users synced</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: PERMISSION MANAGEMENT
          ========================================== */}
      {subView === 'admin-permissions' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              DYNAMIC PERMISSION CONTROL <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">GRID</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Dynamically override active security layers per operational user role.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Module Group</th>
                    {Object.keys(rolePermissions).map(r => (
                      <th key={r} className="p-4 text-center">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {['Full Access', 'System Settings', 'Billing', 'Team Management', 'Leads', 'Support'].map(module => (
                    <tr key={module} className="hover:bg-zinc-900/10">
                      <td className="p-4 font-bold text-white uppercase tracking-wide text-[10px] font-mono">{module}</td>
                      {Object.keys(rolePermissions).map(role => {
                        const isAllowed = rolePermissions[role]?.[module] || false;
                        return (
                          <td key={role} className="p-4 text-center">
                            <button
                              onClick={() => handleTogglePermission(role, module)}
                              className={`p-1 rounded-lg transition-all border ${
                                isAllowed 
                                  ? 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10' 
                                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 hover:bg-zinc-900'
                              }`}
                            >
                              {isAllowed ? <Check className="w-4 h-4 mx-auto" /> : <X className="w-4 h-4 mx-auto" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: COMPANY SETTINGS
          ========================================== */}
      {subView === 'admin-company' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ENTERPRISE PROFILE <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">FIRM METADATA</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure workspace variables, branding structures, and legal compliance anchors.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4 max-w-xl text-xs">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">Primary Registered Particulars</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-mono uppercase">Registered Firm Name</label>
                <input type="text" defaultValue="Adjen Technologies Inc." className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-mono uppercase">Operations Region</label>
                <input type="text" defaultValue="North America & EMEA" className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-mono uppercase">Primary Support Email</label>
                <input type="text" defaultValue="legal@adjen.io" className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-mono uppercase">Primary Tax Identifier</label>
                <input type="text" defaultValue="EIN-4902-881A" className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
              </div>
            </div>

            <button className="px-4 py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer">
              COMMIT FIRM MODIFICATIONS
            </button>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: BRANCH MANAGEMENT
          ========================================== */}
      {subView === 'admin-branches' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                BRANCH DIRECTORY <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">REGIONS</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Audit regional headcounts, regional metrics, and branch health.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      <th className="p-4">Branch</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Personnel Count</th>
                      <th className="p-4">Annual Revenue</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {branches.map(b => (
                      <tr key={b.id} className="hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{b.name}</span>
                        </td>
                        <td className="p-4 text-zinc-400">{b.location}</td>
                        <td className="p-4 text-zinc-300 font-mono">{b.headcount} active</td>
                        <td className="p-4 text-yellow-400 font-mono font-bold">${b.revenue.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 rounded text-[9px] font-bold tracking-wider font-mono">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick add branch */}
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">EXPAND REGIONAL DEPLOYMENT</h4>
              <form onSubmit={handleAddBranch} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Branch Identification</label>
                  <input required type="text" placeholder="Tokyo Office" value={newBranchName} onChange={e=>setNewBranchName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Territorial Location</label>
                  <input required type="text" placeholder="Shibuya, Tokyo" value={newBranchLoc} onChange={e=>setNewBranchLoc(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer text-center">
                  PROVISION NEW OFFICE
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: DEPARTMENTS
          ========================================== */}
      {subView === 'admin-departments' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              DEPARTMENTS INDEX <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DIVISION</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit corporate department hierarchies, personnel limits, and manager codes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Enterprise Sales', count: 12, lead: 'Elena Rostova', budget: '$1.2M' },
              { name: 'Operations', count: 5, lead: 'Sarah Connor', budget: '$650K' },
              { name: 'Core Support', count: 8, lead: 'John Doe', budget: '$400K' },
              { name: 'System Engineering', count: 6, lead: 'Devon Smith', budget: '$1.8M' },
            ].map(d => (
              <div key={d.name} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <Building className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-none">{d.name}</h4>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1 block">Head: {d.lead}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-zinc-900 pt-2 text-zinc-500">
                  <span>{d.count} personnel</span>
                  <span className="text-yellow-400 font-bold">{d.budget} fiscal</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: SYSTEM SETTINGS (CRM)
          ========================================== */}
      {subView === 'admin-crm-settings' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              GLOBAL PIPELINE SYSTEM <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SCHEMAS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure lead score matrices, deal pipeline velocity weightings, and stage definitions.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4 max-w-xl text-xs">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">Operational Stages Weightings</h4>
            <div className="space-y-3">
              {[
                { stage: 'Prospect Phase', weighting: '10%' },
                { stage: 'Negotiation Phase', weighting: '60%' },
                { stage: 'Proposal Transmitted', weighting: '40%' },
                { stage: 'Contract Won', weighting: '100%' },
              ].map(w => (
                <div key={w.stage} className="flex justify-between items-center bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60">
                  <span className="text-zinc-300 font-medium">{w.stage}</span>
                  <span className="font-mono text-yellow-400 font-black">{w.weighting}</span>
                </div>
              ))}
            </div>
            <button className="px-4 py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer">
              APPLY WEIGHTING CONSTANTS
            </button>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: BACKUP & RESTORE
          ========================================== */}
      {subView === 'admin-backup' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                DATABASE SNAPSHOT RESTORES <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">BACKUPS</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Generate complete database instance snap-logs or restore historical data maps.</p>
            </div>
            <button 
              onClick={handleRunBackup}
              disabled={isBackingUp}
              className="px-4 py-2 bg-yellow-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 text-xs font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              {isBackingUp ? 'SNAPSHOTTING...' : 'TRIGGER BACKUP'}
            </button>
          </div>

          <AnimatePresence>
            {isBackingUp && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-xs flex items-center gap-3">
                <RefreshCcw className="w-4 h-4 text-yellow-400 animate-spin shrink-0" />
                <span className="font-mono text-zinc-300">{backupMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Snapshot Reference</th>
                    <th className="p-4">Memory Size</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Trigger Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {backups.map(b => (
                    <tr key={b.id} className="hover:bg-zinc-900/10">
                      <td className="p-4 font-mono font-bold text-zinc-300">{b.id}</td>
                      <td className="p-4 font-mono text-zinc-400">{b.size}</td>
                      <td className="p-4 text-zinc-400 font-mono">{b.createdAt}</td>
                      <td className="p-4 text-zinc-400">{b.type}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 rounded text-[9px] font-bold font-mono tracking-wider">
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => alert(`Synchronous DB remapping to instance ${b.id} has initiated. Complete within 300ms.`)}
                          className="px-2 py-1 bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black border border-zinc-800 text-[9px] font-bold rounded font-mono uppercase tracking-wide cursor-pointer transition-all"
                        >
                          RESTORE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: AUDIT LOGS
          ========================================== */}
      {subView === 'admin-audit' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SECURITY AUDIT REPOSITORY <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">AUDITS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit active modifications, systemic reindexing events, and authentication cycles.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl p-4 shadow-xl space-y-3.5">
            <h4 className="text-[10px] font-mono text-zinc-500 uppercase font-black border-b border-zinc-900 pb-2">Active Telemetry Logs</h4>
            <div className="space-y-2 text-xs font-mono max-h-[350px] overflow-y-auto pr-1">
              {[
                { time: '12:44:02', user: 'admin@adjen.io', role: 'Super Admin', ip: '192.168.1.144', event: 'REINDEX pipeline_indices completed (4.8MB remapped)' },
                { time: '12:35:15', user: 'admin@adjen.io', role: 'Super Admin', ip: '192.168.1.144', event: 'USER PROVISIONED: Devon Smith (usr-105)' },
                { time: '11:12:00', user: 'manager@adjen.io', role: 'Manager', ip: '192.168.1.91', event: 'LEAD STATUS MODIFIED: David Smith (cust-2) ➔ Negotiation' },
                { time: '10:02:44', user: 'sales@adjen.io', role: 'Sales Executive', ip: '192.168.1.12', event: 'QUOTATION COMPILED: Sarah Connor ($12,000 volume contract)' },
              ].map((log, i) => (
                <div key={i} className="p-2.5 bg-black/40 rounded-lg border border-zinc-900 flex flex-col md:flex-row justify-between gap-2 md:items-center">
                  <div className="space-y-0.5">
                    <p className="text-white font-bold leading-none text-[11px]">{log.event}</p>
                    <p className="text-[9px] text-zinc-500 mt-1">By {log.user} ({log.role}) • IP: {log.ip}</p>
                  </div>
                  <span className="text-yellow-400 text-[10px] font-bold shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: SYSTEM MONITORING
          ========================================== */}
      {subView === 'admin-monitoring' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              REAL-TIME TELEMETRY SYSTEMS <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">LIVE TELEMETRY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Visual telemetry tracking operational nodes load capacities and active socket sessions.</p>
          </div>

          {/* Quick numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md">
              <Cpu className="w-5 h-5 text-yellow-400 mb-2" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Active CPU Load</span>
              <p className="text-2xl font-black text-white mt-1 font-mono">{cpuUsage}%</p>
            </div>
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md">
              <HardDrive className="w-5 h-5 text-yellow-400 mb-2" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Allocated RAM</span>
              <p className="text-2xl font-black text-white mt-1 font-mono">{memUsage} MB</p>
            </div>
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md">
              <RefreshCcw className="w-5 h-5 text-yellow-400 mb-2 animate-spin" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Gateway Latency</span>
              <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">42 ms</p>
            </div>
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md">
              <Users className="w-5 h-5 text-yellow-400 mb-2" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">Active Sockets</span>
              <p className="text-2xl font-black text-white mt-1 font-mono">18 open</p>
            </div>
          </div>

          {/* Graph */}
          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">CPU & RAM Telemetry history</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Real-time sampling every 5 seconds.</p>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FACC15" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                  <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="cpu" stroke="#FACC15" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" name="CPU Load (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: BILLING & SUBSCRIPTION
          ========================================== */}
      {subView === 'admin-billing' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              BILLINGS & LICENSE SCHEMAS <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">FINANCIALS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit active enterprise plans, user license limits, and monthly renewal invoices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex justify-between items-start border-b border-zinc-900 pb-4">
                <div>
                  <h4 className="font-bold text-white text-sm">Enterprise Core Plan</h4>
                  <span className="text-[10px] font-mono text-yellow-400 mt-0.5 block">ACTIVE DEPLOYMENT</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-mono font-black text-white">$450 <span className="text-xs font-normal text-zinc-500">/ mo</span></p>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Renews August 01, 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
                  <p className="text-zinc-500 font-mono text-[9px] uppercase">User Licenses Seat Allocation</p>
                  <p className="text-base font-bold text-white mt-1">18 / 50 seats occupied</p>
                  <div className="w-full bg-zinc-850 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
                  <p className="text-zinc-500 font-mono text-[9px] uppercase">Allocated Schema Databases</p>
                  <p className="text-base font-bold text-white mt-1">4.2 GB / 20 GB used</p>
                  <div className="w-full bg-zinc-850 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: '21%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">SECURE PAYMENT METHOD</h4>
              <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-800 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="font-bold text-white font-mono">•••• •••• •••• 4902</p>
                  <p className="text-[9px] text-zinc-500 font-mono">Exp: 11 / 2029 • Mastercard</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: DATABASE MANAGEMENT
          ========================================== */}
      {subView === 'admin-database' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                DATABASE MAINTENANCE SUITE <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DATABASES</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Optimize table layouts, vacuum cache fragments, and inspect query logs.</p>
            </div>
            <button 
              onClick={handleRunVacuum}
              disabled={dbOptimizing}
              className="px-4 py-2 bg-yellow-400 disabled:bg-zinc-800 text-black disabled:text-zinc-500 text-xs font-black rounded-xl hover:bg-yellow-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              {dbOptimizing ? 'REINDEXING...' : 'RUN VACUUM DATABASE'}
            </button>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4 text-xs">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">Active Maintenance Operations Console Output</h4>
            <div className="bg-black/80 border border-zinc-900 rounded-xl p-4 font-mono text-[10px] text-zinc-300 space-y-2 max-h-72 overflow-y-auto leading-relaxed">
              {dbLogs.map((log, idx) => (
                <p key={idx}>{log}</p>
              ))}
              {dbOptimizing && (
                <div className="flex items-center gap-1.5 text-yellow-400 animate-pulse mt-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping"></span>
                  <span>Executing vacuum reindex thread...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
