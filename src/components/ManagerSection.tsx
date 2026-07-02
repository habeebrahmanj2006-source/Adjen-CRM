import React, { useState } from 'react';
import { 
  Users, Target, Clock, Calendar, CheckSquare, Sparkles, Plus, Check, X,
  Video, UserPlus, TrendingUp, AlertCircle, HelpCircle, Mail, Phone, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ManagerSectionProps {
  subView: string;
}

export default function ManagerSection({ subView }: ManagerSectionProps) {
  // --- 1. LEAD ASSIGNMENT STATE (NON-FINANCIAL LEAD SCORE / ENGAGEMENT STATUS) ---
  const [unassignedLeads, setUnassignedLeads] = useState([
    { id: 'ld-401', customerName: 'Cyberdyne Systems', source: 'Website', status: 'New', leadScore: 85, date: '2026-07-01' },
    { id: 'ld-402', customerName: 'Tyrell Corporation', source: 'Cold Call', status: 'New', leadScore: 92, date: '2026-06-30' },
    { id: 'ld-403', customerName: 'Weyland-Yutani', source: 'LinkedIn', status: 'New', leadScore: 98, date: '2026-07-01' },
  ]);

  const [assignedLogs, setAssignedLogs] = useState<string[]>([]);

  // Team list
  const salesReps = ['Elena Rostova', 'Marcus Chen', 'Sarah Connor'];

  const handleAssignLead = (leadId: string, rep: string) => {
    const lead = unassignedLeads.find(l => l.id === leadId);
    if (!lead) return;
    setUnassignedLeads(unassignedLeads.filter(l => l.id !== leadId));
    setAssignedLogs(prev => [`Lead opportunity "${lead.customerName}" (Score: ${lead.leadScore}) assigned to ${rep}.`, ...prev]);
  };

  // --- 2. TEAM MONITORING STATE (OPERATIONAL FOCUS) ---
  const [teamMembers] = useState([
    { name: 'Elena Rostova', role: 'Sales Executive', status: 'Online', assignedLeads: 14, dealsWon: 8, lastActive: 'Just Now' },
    { name: 'Marcus Chen', role: 'Sales Executive', status: 'Online', assignedLeads: 12, dealsWon: 6, lastActive: '5 mins ago' },
    { name: 'Sarah Connor', role: 'Sales Executive', status: 'Away', assignedLeads: 9, dealsWon: 4, lastActive: '1 hr ago' },
  ]);

  // --- 3. TEAM PERFORMANCE CHART DATA (TASKS WORKLOAD VS ACQUIRED CONVERSIONS) ---
  const repPerformanceData = [
    { name: 'Elena Rostova', TargetWorkload: 20, CompletedTasks: 24 },
    { name: 'Marcus Chen', TargetWorkload: 18, CompletedTasks: 15 },
    { name: 'Sarah Connor', TargetWorkload: 15, CompletedTasks: 12 },
  ];

  // --- 4. APPROVALS STATE (SLA AND QUALITY CONTROLS OVERRIDES) ---
  const [approvals, setApprovals] = useState([
    { id: 'app-301', requester: 'Elena Rostova', item: '15% Volume Discount for Vertex Corporation', type: 'SLA Discount Override', amount: 'High-Priority Tier 1', status: 'Pending' },
    { id: 'app-302', requester: 'Marcus Chen', item: 'Enterprise License Custom SLA for BioSphere Ltd', type: 'SLA Customization', amount: 'SLA Level-2 Custom', status: 'Pending' },
  ]);

  const handleProcessApproval = (appId: string, status: 'Approved' | 'Rejected') => {
    setApprovals(approvals.map(a => a.id === appId ? { ...a, status } : a));
  };

  // --- 5. MEETINGS STATE ---
  const [meetings, setMeetings] = useState([
    { id: 'meet-1', title: 'Q3 Enterprise Strategy Briefing', date: '2026-07-02', time: '10:00 AM', rep: 'All Sales Reps', platform: 'Google Meet' },
    { id: 'meet-2', title: 'Vertex Deal Auditing', date: '2026-07-03', time: '02:30 PM', rep: 'Elena Rostova', platform: 'Microsoft Teams' },
  ]);
  const [newMeetTitle, setNewMeetTitle] = useState('');
  const [newMeetDate, setNewMeetDate] = useState('');
  const [newMeetTime, setNewMeetTime] = useState('');
  const [newMeetRep, setNewMeetRep] = useState('All Sales Reps');

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetTitle || !newMeetDate || !newMeetTime) return;
    setMeetings([...meetings, {
      id: `meet-${Date.now()}`,
      title: newMeetTitle,
      date: newMeetDate,
      time: newMeetTime,
      rep: newMeetRep,
      platform: 'Google Meet'
    }]);
    setNewMeetTitle('');
    setNewMeetDate('');
    setNewMeetTime('');
  };

  return (
    <div className="space-y-6">
      
      {/* ==========================================
          SUB-VIEW: ASSIGN LEADS
          ========================================== */}
      {subView === 'manager-assign' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              LEAD OPPORTUNITY DISPATCHER <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">ASSIGN LEADS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Surgically dispatch newly generated commercial leads to designated Sales Executives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold font-mono">
                      <th className="p-4">Lead Candidate</th>
                      <th className="p-4">Acquisition Channel</th>
                      <th className="p-4">Lead Quality Score</th>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4 text-right">Assign Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {unassignedLeads.length > 0 ? (
                      unassignedLeads.map(l => (
                        <tr key={l.id} className="hover:bg-zinc-900/10">
                          <td className="p-4">
                            <p className="font-bold text-white">{l.customerName}</p>
                            <span className="text-[9px] text-zinc-500 font-mono">Ref ID: {l.id}</span>
                          </td>
                          <td className="p-4 text-zinc-400 font-mono">{l.source}</td>
                          <td className="p-4 font-bold text-yellow-400 font-mono">{l.leadScore}/100</td>
                          <td className="p-4 text-zinc-400 font-mono">{l.date}</td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-1.5">
                              {salesReps.map(rep => (
                                <button
                                  key={rep}
                                  onClick={() => handleAssignLead(l.id, rep)}
                                  className="px-2 py-1 bg-zinc-900 hover:bg-yellow-400 text-zinc-400 hover:text-black font-semibold text-[9px] font-mono uppercase tracking-wide rounded-lg border border-zinc-800 hover:border-yellow-400 transition-all cursor-pointer"
                                >
                                  {rep.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-zinc-600 font-mono text-xs">
                          All incoming lead queues have been assigned. Status: Clear.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assignment action logs */}
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">DISPATCH AUDITS</h4>
              <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-[10px]">
                {assignedLogs.length > 0 ? (
                  assignedLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-zinc-900/50 border border-zinc-850 rounded text-zinc-400">
                      {log}
                    </div>
                  ))
                ) : (
                  <span className="text-zinc-600">Pending operations...</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: TEAM MONITORING
          ========================================== */}
      {subView === 'manager-monitoring' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              TEAM CONSOLE MONITOR <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">MONITORING</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit active team member allocations, and representative performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map(m => (
              <div key={m.name} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold flex items-center justify-center text-zinc-400">
                      {m.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs leading-none">{m.name}</h4>
                      <span className="text-[9px] text-zinc-500 font-mono mt-1 block">{m.role}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider border ${
                    m.status === 'Online' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' : 'bg-amber-950/30 text-amber-400 border-amber-900/20'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-zinc-900/30 p-2 rounded-xl border border-zinc-850">
                    <span className="text-zinc-500 text-[9px] uppercase">Assigned Leads</span>
                    <p className="font-bold text-white text-sm mt-0.5">{m.assignedLeads}</p>
                  </div>
                  <div className="bg-zinc-900/30 p-2 rounded-xl border border-zinc-850">
                    <span className="text-zinc-500 text-[9px] uppercase">Deals Won</span>
                    <p className="font-bold text-yellow-400 text-sm mt-0.5">{m.dealsWon}</p>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 font-mono text-right">
                  Last telemetry update: {m.lastActive}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: SALES PROGRESS CHARTS (NON-FINANCIAL PERFORMANCE)
          ========================================== */}
      {subView === 'manager-sales-tracking' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              REPRESENTATIVE WORKLOAD MONITORS <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">TRACKING</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Inspect representatives targets tasks vs actual completed tasks.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Tasks target workload vs Completed Checklist Tasks</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                  <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Bar dataKey="TargetWorkload" fill="#3f3f46" name="Target Workload" />
                  <Bar dataKey="CompletedTasks" fill="#FACC15" name="Completed Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: APPROVALS
          ========================================== */}
      {subView === 'manager-approvals' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SLA EXCEPTIONS & APPROVALS <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">APPROVALS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Review discount authorization requests, SLA adjustments, or high-tier deal status.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Executive Requester</th>
                    <th className="p-4">Parameters Description</th>
                    <th className="p-4">Validation Class</th>
                    <th className="p-4">Priority Class</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Authorize Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {approvals.map(a => (
                    <tr key={a.id} className="hover:bg-zinc-900/10">
                      <td className="p-4 font-bold text-white">{a.requester}</td>
                      <td className="p-4 text-zinc-400">{a.item}</td>
                      <td className="p-4 font-mono font-bold text-zinc-500 text-[10px] uppercase">{a.type}</td>
                      <td className="p-4 font-mono font-bold text-yellow-400">{a.amount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider border ${
                          a.status === 'Approved' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                          a.status === 'Rejected' ? 'bg-red-950/30 text-red-400 border-red-900/20' :
                          'bg-zinc-900 text-zinc-500 border-zinc-850'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono">
                        {a.status === 'Pending' ? (
                          <div className="inline-flex gap-1.5">
                            <button 
                              onClick={() => handleProcessApproval(a.id, 'Approved')}
                              className="p-1.5 bg-zinc-900 hover:bg-emerald-500 text-zinc-400 hover:text-black rounded-lg border border-zinc-800 hover:border-emerald-500 cursor-pointer transition-all"
                              title="Approve Request"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleProcessApproval(a.id, 'Rejected')}
                              className="p-1.5 bg-zinc-900 hover:bg-red-500 text-zinc-400 hover:text-black rounded-lg border border-zinc-800 hover:border-red-500 cursor-pointer transition-all"
                              title="Reject Request"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-600 text-[10px] font-mono uppercase">Processed</span>
                        )}
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
          SUB-VIEW: MEETINGS SCHEDULER
          ========================================== */}
      {subView === 'calendar-meetings' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                TEAM MEETINGS & SYNC INDEX <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">MEETINGS</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Schedule pipeline calibrations, discount audits, and target assessments.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                      <th className="p-4">Meeting Title</th>
                      <th className="p-4">Assigned reps</th>
                      <th className="p-4">Date / Time</th>
                      <th className="p-4">SLA Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {meetings.map(m => (
                      <tr key={m.id} className="hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <Video className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span>{m.title}</span>
                        </td>
                        <td className="p-4 text-zinc-400">{m.rep}</td>
                        <td className="p-4 font-mono font-bold text-zinc-300">
                          {m.date} at {m.time}
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-yellow-400/5 border border-yellow-400/10 text-yellow-400 rounded text-[9px] font-bold font-mono uppercase tracking-wide">
                            {m.platform}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">SCHEDULE TEAM SESSION</h4>
              <form onSubmit={handleAddMeeting} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Session Agenda</label>
                  <input required type="text" placeholder="Weekly Target Calibration" value={newMeetTitle} onChange={e=>setNewMeetTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono">Date</label>
                    <input required type="date" value={newMeetDate} onChange={e=>setNewMeetDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40 text-zinc-300" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono">Time</label>
                    <input required type="text" placeholder="11:00 AM" value={newMeetTime} onChange={e=>setNewMeetTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40 text-zinc-300" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Attendees</label>
                  <select value={newMeetRep} onChange={e=>setNewMeetRep(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40 text-zinc-300">
                    <option value="All Sales Reps">All Sales Reps</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Marcus Chen">Marcus Chen</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer text-center font-mono">
                  TRIGGER SYNC REQUEST
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
