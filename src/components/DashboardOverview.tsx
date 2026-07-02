import React, { useState } from 'react';
import { 
  Users, Target, CheckSquare, Sparkles, TrendingUp, Bell, AlertCircle, Play, 
  Activity, ArrowUpRight, Plus, ArrowRight, Zap, RefreshCcw, CheckCircle2, AlertTriangle, 
  ShieldCheck, FileText, HelpCircle, Clock, ClipboardList, Building2, UserCheck, Calendar
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { motion } from 'motion/react';
import { Customer, Lead, Deal, Task, Activity as ActivityType } from '../types';

interface DashboardOverviewProps {
  customers: Customer[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: ActivityType[];
  currency: string;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Task) => void;
  onNavigateToView: (viewId: string) => void;
  subView: string;
  userRole?: string;
}

export default function DashboardOverview({
  customers,
  leads,
  deals,
  tasks,
  activities,
  currency,
  onToggleTask,
  onAddTask,
  onNavigateToView,
  subView,
  userRole = 'Super Admin'
}: DashboardOverviewProps) {
  // Mini task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Basic computed states
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;
  const activeLeadsCount = leads.filter(l => l.status !== 'Qualified').length;
  const activeDealsCount = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;

  // 1. Cumulative Customer Growth Chart Data (Non-financial)
  const customerGrowthData = [
    { month: 'Jan', customers: Math.max(5, activeCustomersCount - 15) },
    { month: 'Feb', customers: Math.max(10, activeCustomersCount - 11) },
    { month: 'Mar', customers: Math.max(16, activeCustomersCount - 7) },
    { month: 'Apr', customers: Math.max(22, activeCustomersCount - 4) },
    { month: 'May', customers: Math.max(29, activeCustomersCount - 1) },
    { month: 'Jun', customers: activeCustomersCount }
  ];

  // 2. Team performance data (Completed Tasks vs Target Leads)
  const teamPerformanceData = [
    { name: 'Elena Rostova', targetLeads: 15, completedTasks: 18 },
    { name: 'Marcus Chen', targetLeads: 12, completedTasks: 14 },
    { name: 'Sarah Connor', targetLeads: 10, completedTasks: 9 }
  ];

  // Circular Business Health Score calculation
  const businessHealthScore = 96;

  // Quick Task handler
  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
      customerName: customers[0]?.fullName || 'Global Account',
      priority: taskPriority,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* ==========================================
          SUB-VIEW: OVERVIEW (DEFAULT)
          ========================================== */}
      {subView === 'dashboard-overview' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Title Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                {userRole.toUpperCase()} DASHBOARD <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">PRO LIVE</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Real-time enterprise CRM insights, active telemetry logs, and workspace highlights.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => onNavigateToView('customers-all')}
                className="px-3 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-300 transition-all cursor-pointer flex items-center gap-1"
              >
                VIEW CLIENT DIRECTORY
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------------
              ROLE 1: SUPER ADMIN or ADMIN DASHBOARD
              ---------------------------------------------------------------------- */}
          {(userRole === 'Super Admin' || userRole === 'Admin') && (
            <div className="space-y-6">
              
              {/* Top Row: Company Overview & Business Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Company Overview */}
                <div className="lg:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Building2 className="w-32 h-32 text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest font-mono">Company Profile Overview</span>
                    <h2 className="text-2xl font-black text-white mt-1">Adjen Enterprise Group</h2>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xl">
                      Central intelligence terminal controlling global operations, security logs, branch management, and employee assignment workflows. Systems running on secure Sandboxed infrastructure with fully authorized multi-tenant access control list policies.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-zinc-900 pt-4 font-mono text-xs text-zinc-500">
                    <div>
                      <span className="text-[9px] block uppercase text-zinc-600">Headquarters</span>
                      <span className="font-bold text-zinc-300">San Francisco, CA</span>
                    </div>
                    <div>
                      <span className="text-[9px] block uppercase text-zinc-600">Active Branches</span>
                      <span className="font-bold text-zinc-300">3 Regional hubs</span>
                    </div>
                    <div>
                      <span className="text-[9px] block uppercase text-zinc-600">System Gateway</span>
                      <span className="font-bold text-emerald-400">● Port 3000 Ingress</span>
                    </div>
                    <div>
                      <span className="text-[9px] block uppercase text-zinc-600">Data Compliance</span>
                      <span className="font-bold text-white">✓ SOC2 compliant</span>
                    </div>
                  </div>
                </div>

                {/* 2. Business Health Score */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-between relative overflow-hidden">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono self-start">Business Health score</span>
                  <div className="relative flex items-center justify-center my-4">
                    {/* Radial Health representation */}
                    <div className="w-32 h-32 rounded-full border-4 border-zinc-900 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">{businessHealthScore}</span>
                      <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-widest uppercase">Excellent</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 text-center font-mono mt-1">
                    Telemetry shows optimal team output, customer retention velocity, and minimal lead funnel leakage.
                  </p>
                </div>

              </div>

              {/* Middle Row: Bento Statistics Cards (7 metrics) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                
                {/* 3. Active Users */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Active Users</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-white">5</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">Operators online</span>
                  </div>
                </div>

                {/* 4. Active Customers */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Active Customers</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-yellow-400">{activeCustomersCount}</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">Retained accounts</span>
                  </div>
                </div>

                {/* 5. Total Leads */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Total Leads</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-white">{leads.length}</span>
                    <span className="text-[10px] text-emerald-400 block font-mono font-bold">▲ funnel growth</span>
                  </div>
                </div>

                {/* 6. Active Deals */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Active Deals</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-white">{activeDealsCount}</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">Negotiations live</span>
                  </div>
                </div>

                {/* 7. Projects */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Projects</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-white">3</span>
                    <span className="text-[10px] text-yellow-400 block font-mono font-bold">In-progress setups</span>
                  </div>
                </div>

                {/* 8. Support Tickets */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Support Tickets</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-red-400">3</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">Pending response</span>
                  </div>
                </div>

                {/* 9. Employee Count */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4.5 rounded-2xl shadow-md flex flex-col justify-between hover:border-yellow-400/20 transition-all">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Employee Count</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-white">3</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">Strategic reps</span>
                  </div>
                </div>

              </div>

              {/* Bottom Row: Customer Growth Chart & AI Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 10. Monthly Customer Growth Chart */}
                <div className="lg:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Monthly Customer Growth</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Incremental customer base growth logged across active quarters.</p>
                  </div>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FACC15" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                        <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="customers" stroke="#FACC15" strokeWidth={2} fillOpacity={1} fill="url(#colorCust)" name="Customers Count" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 11. AI Insights */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-zinc-900 pb-2 mb-3">
                      <Sparkles className="w-4 h-4 text-yellow-400" /> AI Strategic Insights
                    </h3>
                    <div className="space-y-3.5 text-xs">
                      <div className="p-2.5 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono font-bold text-yellow-400 block">ADJUST LEAD DISPATCH</span>
                        <p className="text-zinc-300 leading-snug">Elena Rostova is exceeding closing velocity by 12%. Feed unassigned leads proactively.</p>
                      </div>
                      <div className="p-2.5 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 block">SLA ADHERENCE ALERT</span>
                        <p className="text-zinc-300 leading-snug">Vertex Corporation handshaking issues resolving. Maintain high customer touchpoints.</p>
                      </div>
                      <div className="p-2.5 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono font-bold text-yellow-400 block">CAPACITY THRESHOLDS</span>
                        <p className="text-zinc-300 leading-snug">Support ticket response intervals remain within SLA limits. Systems optimal.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------------
              ROLE 2: MANAGER DASHBOARD
              ---------------------------------------------------------------------- */}
          {userRole === 'Manager' && (
            <div className="space-y-6">
              
              {/* Top Row: Team Performance (1) & Assigned Leads (2) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Team Performance Chart */}
                <div className="lg:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Team Performance Monitor</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Compares completed tasks count against allocated target leads per active rep.</p>
                  </div>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                        <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="targetLeads" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Target Leads" />
                        <Bar dataKey="completedTasks" fill="#FACC15" radius={[4, 4, 0, 0]} name="Completed Tasks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Assigned Leads Metric Card */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">Assigned Leads Dispatcher</span>
                    <h3 className="text-3xl font-black text-white mt-1">{activeLeadsCount}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      All newly captured leads are logged. 3 unassigned items are currently waiting for active rep allocation.
                    </p>
                  </div>
                  <button 
                    onClick={() => onNavigateToView('manager-assign')}
                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl uppercase transition-all mt-4"
                  >
                    Manage Lead Dispatch
                  </button>
                </div>

              </div>

              {/* Middle Row: Customer Growth (3) & Daily Tasks (4) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 3. Customer Growth */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Customer Growth rate</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Rate of client account conversions logged over months.</p>
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                        <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                        <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="customers" stroke="#FACC15" strokeWidth={3} dot={{ fill: '#FACC15', strokeWidth: 1 }} name="Total Customers" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Daily Tasks checklist */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="border-b border-zinc-900 pb-2 mb-3">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Immediate Team Tasks</h3>
                      <p className="text-[10px] text-zinc-500">Urgent operational checklists required for team execution.</p>
                    </div>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {tasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => onToggleTask(task.id)}
                          className={`p-2 rounded-xl border flex items-center gap-3 text-xs transition-all cursor-pointer ${
                            task.completed ? 'bg-zinc-950/20 border-zinc-900 text-zinc-500 line-through' : 'bg-zinc-900/40 border-zinc-800 text-zinc-200'
                          }`}
                        >
                          <input type="checkbox" checked={task.completed} readOnly className="rounded border-zinc-700 text-yellow-400 bg-transparent w-3.5 h-3.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold truncate leading-snug">{task.title}</p>
                            <span className="text-[9px] text-zinc-500 font-mono">Account: {task.customerName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick task addition */}
                  <form onSubmit={handleQuickTaskSubmit} className="mt-4 border-t border-zinc-900 pt-3 flex gap-1.5">
                    <input 
                      type="text" required placeholder="Log new team task..." value={newTaskTitle}
                      onChange={e=>setNewTaskTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400/40"
                    />
                    <button type="submit" className="bg-yellow-400 text-black px-3 rounded-lg text-xs font-black uppercase hover:bg-yellow-300 font-mono">Add</button>
                  </form>
                </div>

              </div>

              {/* Bottom Row: Pending Follow-ups (5) & Completed Tasks (6) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                
                {/* 5. Pending Follow-ups */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">Upcoming Client touches</h3>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {customers.slice(0, 3).map((cust, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/20 border border-zinc-900 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{cust.fullName}</p>
                          <span className="text-[9px] font-mono text-zinc-500">Corporate: {cust.companyName}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-yellow-400 font-bold block">{cust.nextFollowUp || 'TBD'}</span>
                          <span className="text-[8px] text-zinc-500 uppercase">next touch point</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Completed Tasks */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">History logs: Completed team tasks</h3>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {tasks.filter(t => t.completed).slice(0, 3).map((task, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/20 border border-zinc-900 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold text-zinc-300 line-through leading-snug">{task.title}</p>
                          <p className="text-[9px] text-zinc-500 font-mono">Resolved on due date • {task.dueDate}</p>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.completed).length === 0 && (
                      <span className="text-[10px] text-zinc-600 font-mono block">No completed tasks logged in current session.</span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------------
              ROLE 3: SALES EXECUTIVE DASHBOARD
              ---------------------------------------------------------------------- */}
          {userRole === 'Sales Executive' && (
            <div className="space-y-6">
              
              {/* Top Row: My Customers (1) & My Leads (2) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                
                {/* 1. My Customers */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">My Assigned Customers</h3>
                      <p className="text-[10px] text-zinc-500">Corporate entities allocated to your active portfolio.</p>
                    </div>
                    <button onClick={()=>onNavigateToView('sales-customers')} className="text-[10px] text-yellow-400 font-bold hover:underline">View All</button>
                  </div>
                  
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {customers.slice(0, 3).map((cust, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/30 border border-zinc-850 rounded-xl flex justify-between items-center hover:border-yellow-400/20 transition-all">
                        <div>
                          <p className="font-bold text-white">{cust.fullName}</p>
                          <span className="text-[9px] font-mono text-zinc-500">{cust.companyName}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-yellow-400/5 border border-yellow-400/10 text-yellow-400 rounded text-[8px] font-mono uppercase tracking-wider">
                          {cust.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. My Leads */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">My Active Leads</h3>
                      <p className="text-[10px] text-zinc-500">High velocity lead conversion and nurturing sprints.</p>
                    </div>
                    <button onClick={()=>onNavigateToView('sales-leads')} className="text-[10px] text-yellow-400 font-bold hover:underline">View Funnel</button>
                  </div>

                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {leads.slice(0, 3).map((ld, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/30 border border-zinc-850 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{ld.customerName}</p>
                          <span className="text-[9px] font-mono text-zinc-500">Channel: {ld.source}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase ${
                          ld.priority === 'High' ? 'bg-red-950/20 text-red-400 border border-red-900/10' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {ld.priority} PRIORITY
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Middle Row: My Deals (3) & Today's Tasks (4) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                
                {/* 3. My Deals */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
                  <div className="border-b border-zinc-900 pb-2">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">My Active Sales Pipeline</h3>
                    <p className="text-[10px] text-zinc-500">Deals phase, target timelines, and workflow progress checks.</p>
                  </div>
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
                    {deals.slice(0, 3).map((dl, i) => (
                      <div key={i} className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="font-bold text-white text-xs">{dl.title}</p>
                          <span className="px-1.5 py-0.5 bg-yellow-400/5 text-yellow-400 border border-yellow-400/10 rounded font-mono text-[8px] uppercase">{dl.stage}</span>
                        </div>
                        <p className="text-[9px] font-mono text-zinc-500">Customer: {dl.customerName} • Target closing date: {dl.closingDate}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Today's Tasks */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="border-b border-zinc-900 pb-2 mb-3">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">My Tasks Checklist</h3>
                      <p className="text-[10px] text-zinc-500">Tasks allocated to you for daily customer outreach.</p>
                    </div>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {tasks.slice(0, 3).map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => onToggleTask(task.id)}
                          className={`p-2 rounded-xl border flex items-center gap-3 text-xs transition-all cursor-pointer ${
                            task.completed ? 'bg-zinc-950/20 border-zinc-900 text-zinc-500 line-through' : 'bg-zinc-900/40 border-zinc-800 text-zinc-200'
                          }`}
                        >
                          <input type="checkbox" checked={task.completed} readOnly className="rounded border-zinc-700 text-yellow-400 bg-transparent w-3.5 h-3.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold truncate leading-snug">{task.title}</p>
                            <span className="text-[9px] text-zinc-500 font-mono">Due date • {task.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Inline task addition */}
                  <form onSubmit={handleQuickTaskSubmit} className="mt-4 border-t border-zinc-900 pt-3 flex gap-1.5">
                    <input 
                      type="text" required placeholder="Add private checklist item..." value={newTaskTitle}
                      onChange={e=>setNewTaskTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-yellow-400/40"
                    />
                    <button type="submit" className="bg-yellow-400 text-black px-3 rounded-lg text-xs font-black uppercase hover:bg-yellow-300 font-mono">Add</button>
                  </form>
                </div>

              </div>

              {/* Bottom Row: Upcoming Follow-ups (5) & Completed Follow-ups (6) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                
                {/* 5. Upcoming Follow-ups */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">My Scheduled touch points</h3>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {customers.slice(0, 3).map((cust, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/20 border border-zinc-900 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{cust.fullName}</p>
                          <span className="text-[9px] font-mono text-zinc-500">Corporate: {cust.companyName}</span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-yellow-400 font-bold block">{cust.nextFollowUp || 'TBD'}</span>
                          <span className="text-[8px] text-zinc-500 uppercase">touch point timing</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Completed Follow-ups */}
                <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-3">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">Touch point History</h3>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto">
                    {customers.slice(0, 2).map((cust, i) => (
                      <div key={i} className="p-2.5 bg-zinc-900/20 border border-zinc-900 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold text-zinc-300 leading-snug">Outgoing touchpoint finalized for {cust.fullName}</p>
                          <p className="text-[9px] text-zinc-500 font-mono">Action completed on: {cust.lastFollowUp || 'N/A'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: ANALYTICS
          ========================================== */}
      {subView === 'dashboard-analytics' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              CRM ANALYTICS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">METRICS ENGINE</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Detailed breakdown of acquisition velocity, pipeline performance, and operational trends.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Interactive Chart */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Conversion Funnel & Lead Sprints</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={customerGrowthData}>
                    <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                    <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace' }}
                      itemStyle={{ color: '#FACC15', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#71717a' }} />
                    <Bar dataKey="customers" fill="#FACC15" radius={[4, 4, 0, 0]} name="Acquired Customers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="space-y-4">
              <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Lead Conversion Efficiency</span>
                <span className="text-4xl font-black text-yellow-400 block mt-1">94.8%</span>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-yellow-400 h-full" style={{ width: `94.8%` }}></div>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono block mt-1.5">Ratio of Customers onboarded to Leads logged</span>
              </div>

              <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Lead Velocity Score</span>
                <span className="text-3xl font-black text-white block mt-1">
                  Optimal
                </span>
                <span className="text-[9px] text-emerald-400 font-mono mt-1 block">▲ +12% vs previous fiscal quarter</span>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: BUSINESS HEALTH
          ========================================== */}
      {subView === 'dashboard-health' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              BUSINESS HEALTH MATRIX <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DIAGNOSTICS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">System diagnostics, retention margins, operational compliance checks, and hazard assessment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Lead Acquisition Velocity', status: 'Optimal', metric: '+12% MoM' },
              { name: 'Sales Pipeline Leakage', status: 'Minimal', metric: '4.2% exit rate' },
              { name: 'Client Retention Index', status: 'Excellent', metric: '94.8%' },
              { name: 'Average Deal Close Velocity', status: '14 Days', metric: '-3 Days' }
            ].map((chk, i) => (
              <div key={i} className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{chk.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Historical telemetry evaluation status</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider block">
                    {chk.status}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono font-black mt-1 block">{chk.metric}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400" /> Operational Compliance Audit Report
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed mt-2">
              Our automated audits evaluated server logs, active API handshakes, MFA configuration indices, and regional customer databases. All data packages complied with data isolation regulations. Customer information is securely encrypted in transit and at rest.
            </p>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: RECENT ACTIVITY
          ========================================== */}
      {subView === 'dashboard-activity' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              RECENT SYSTEM ACTIVITIES <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">AUDIT LOGS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Real-time log tracing of core modifications, authorization access, and lead progress logs.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono">System Modification Stream</span>
              <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded font-bold font-mono">{activities.length} total entries</span>
            </div>

            <div className="divide-y divide-zinc-900">
              {activities.map((act) => (
                <div key={act.id} className="p-3.5 hover:bg-zinc-900/20 transition-all flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 bg-yellow-400/15 text-yellow-400 rounded-lg">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{act.description}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Triggered by: {act.userName}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded font-mono uppercase font-bold">
                      {act.type}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono block mt-1">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: NOTIFICATIONS
          ========================================== */}
      {subView === 'dashboard-notifications' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              REMINDER NOTIFICATIONS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">ALERTS DECK</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure warning thresholds, notification rules, and trigger live audit warnings.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-400" /> Dynamic Broadcast Reminders
              </h3>
              <button 
                onClick={() => alert('Broadcast telemetry sync completed.')}
                className="px-2.5 py-1 bg-yellow-400 text-black text-[10px] font-mono font-black uppercase rounded hover:bg-yellow-300 cursor-pointer"
              >
                Trigger Manual Broadcast
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Enable Core Deadlines Warnings Toast</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Show real-time alert toast at top when important tasks or lead dates approach.</p>
                </div>
                <div className="w-9 h-5 bg-yellow-400 rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-black rounded-full shadow"></div>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Push API Security Reports</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Notify when unauthorized access attempts or suspicious operations are flagged.</p>
                </div>
                <div className="w-9 h-5 bg-yellow-400 rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                  <div className="w-4 h-4 bg-black rounded-full shadow"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
