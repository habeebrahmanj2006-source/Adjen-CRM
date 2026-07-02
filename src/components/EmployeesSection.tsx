import React, { useState } from 'react';
import { 
  Users, CheckSquare, Sparkles, Award, Star, Clock, FileText, Plus, Check, X, UserPlus, Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface EmployeesSectionProps {
  subView: string;
}

export default function EmployeesSection({ subView }: EmployeesSectionProps) {
  // Employee Directory state
  const [employees, setEmployees] = useState([
    { id: 'EMP-01', name: 'Elena Rostova', role: 'Enterprise Account Executive', salary: 9800, shift: '09:00 - 18:00', rating: 5, closingRate: 94, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128' },
    { id: 'EMP-02', name: 'Marcus Chen', role: 'Solutions Architect', salary: 11000, shift: '10:00 - 19:00', rating: 4, closingRate: 88, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128' },
    { id: 'EMP-03', name: 'Sarah Connor', role: 'Customer Success Analyst', salary: 7200, shift: '09:00 - 18:00', rating: 5, closingRate: 91, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128' }
  ]);

  // Attendance log sheet
  const [attendanceRecords, setAttendanceRecords] = useState([
    { name: 'Elena Rostova', role: 'EAE', time: '08:55 AM', status: 'On Time' },
    { name: 'Marcus Chen', role: 'SA', time: '10:02 AM', status: 'Late' },
    { name: 'Sarah Connor', role: 'CSA', time: '08:48 AM', status: 'On Time' }
  ]);

  // Leave Requests ledger
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LR-101', name: 'Marcus Chen', role: 'Solutions Architect', type: 'Annual Leave', duration: '3 Days', status: 'Pending' }
  ]);

  // Onboarding Form States
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Enterprise Account Executive');
  const [empSalary, setEmpSalary] = useState('');
  const [empShift, setEmpShift] = useState('09:00 - 18:00');

  const handleOnboardEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empSalary) return;
    setEmployees([
      ...employees,
      {
        id: `EMP-${employees.length + 1}`,
        name: empName,
        role: empRole,
        salary: Number(empSalary),
        shift: empShift,
        rating: 4,
        closingRate: 80,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=128'
      }
    ]);
    setEmpName('');
    setEmpSalary('');
    alert('Employee onboarding sequence completed successfully.');
  };

  const handleManualClockIn = () => {
    setAttendanceRecords([
      { name: 'Administrator Portal', role: 'Admin', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'On Time' },
      ...attendanceRecords
    ]);
    alert('Manual Clock-In registered successfully.');
  };

  const handleLeaveDecision = (leaveId: string, decision: 'Approved' | 'Declined') => {
    setLeaveRequests(leaveRequests.map(lr => {
      if (lr.id === leaveId) {
        return { ...lr, status: decision };
      }
      return lr;
    }));
    alert(`Leave request state changed to: ${decision}`);
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: EMPLOYEE LIST
          ========================================== */}
      {subView === 'employees-list' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                STAFF DIRECTORY <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">HUMAN RESOURCES</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Configure user payroll classifications, designations, and shifts.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              {employees.map(emp => (
                <div key={emp.id} className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={emp.avatar} 
                      alt={emp.name} 
                      className="w-12 h-12 rounded-full border border-zinc-800 object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-black text-white">{emp.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">{emp.role}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Shift: {emp.shift}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-white font-mono">${emp.salary.toLocaleString()}/Mo</span>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Appraisal: {emp.rating} ⭐</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4 h-fit">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1">
                <UserPlus className="w-4 h-4 text-yellow-400" /> Onboard Personnel
              </h3>

              <form onSubmit={handleOnboardEmployee} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Full Name</label>
                  <input 
                    type="text" required placeholder="Elena Rostova" value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Designation</label>
                  <select 
                    value={empRole} onChange={(e) => setEmpRole(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Enterprise Account Executive">Enterprise Account Executive</option>
                    <option value="Solutions Architect">Solutions Architect</option>
                    <option value="Customer Success Analyst">Customer Success Analyst</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Monthly Compensation ($)</label>
                  <input 
                    type="number" required placeholder="8500" value={empSalary}
                    onChange={(e) => setEmpSalary(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer uppercase"
                >
                  ✓ Onboard Employee
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: ATTENDANCE
          ========================================== */}
      {subView === 'employees-attendance' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                DAILY ATTENDANCE SHEET <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">CLOCK-IN</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Audit daily check-ins, punctuality ratios, and trigger manual check-in alerts.</p>
            </div>
            
            <button
              onClick={handleManualClockIn}
              className="px-3.5 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-300 transition-all cursor-pointer"
            >
              Manual Clock-In
            </button>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Personnel Name</th>
                    <th className="p-4">Role Abbr.</th>
                    <th className="p-4">Clock-In Time</th>
                    <th className="p-4 text-right">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {attendanceRecords.map((rec, i) => (
                    <tr key={i} className="hover:bg-zinc-900/10 transition-all">
                      <td className="p-4 font-bold text-white">{rec.name}</td>
                      <td className="p-4 font-mono text-zinc-500">{rec.role}</td>
                      <td className="p-4 font-mono text-zinc-400">{rec.time}</td>
                      <td className="p-4 text-right">
                        <span className={`px-2 py-0.5 text-[9px] font-black rounded font-mono uppercase ${
                          rec.status === 'On Time' ? 'bg-emerald-950/30 text-emerald-400' : 'bg-red-950/30 text-red-400'
                        }`}>
                          {rec.status}
                        </span>
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
          SUB-VIEW: LEAVE REQUESTS
          ========================================== */}
      {subView === 'employees-leave' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              LEAVE REQUESTS LEDGER <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">VACATION</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit, approve, or reject team leave applications.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="divide-y divide-zinc-900 text-xs">
              {leaveRequests.map(lr => (
                <div key={lr.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/10 transition-all">
                  <div>
                    <h4 className="font-bold text-white">{lr.name}</h4>
                    <p className="text-zinc-500 text-[10px]">{lr.role} | Type: {lr.type}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Requested duration: {lr.duration}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {lr.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleLeaveDecision(lr.id, 'Approved')}
                          className="px-2.5 py-1 bg-yellow-400 text-black rounded font-mono text-[10px] font-black uppercase cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleLeaveDecision(lr.id, 'Declined')}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded font-mono text-[10px] font-black uppercase cursor-pointer"
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase ${
                        lr.status === 'Approved' ? 'bg-emerald-950/30 text-emerald-400' : 'bg-red-950/30 text-red-400'
                      }`}>
                        {lr.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: PERFORMANCE
          ========================================== */}
      {subView === 'employees-performance' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              STAFF APPRAISAL CARD <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">KPI INDEX</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit individual closing rates, compliance indices, and client ratings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {employees.map(emp => (
              <div key={emp.id} className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-4">
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-zinc-800 shrink-0" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-xs font-black text-white">{emp.name}</h4>
                    <p className="text-[9px] text-zinc-500 font-mono">{emp.role}</p>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-zinc-900/60 pt-3">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>Contract Closing Ratio</span>
                    <span>{emp.closingRate}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: `${emp.closingRate}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                  <span>Star appraisal</span>
                  <span className="text-yellow-400">{'★'.repeat(emp.rating)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}
