import React from 'react';
import { 
  BarChart3, FileSpreadsheet, TrendingUp, Sparkles, Award, ArrowUpRight, ShieldAlert 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion } from 'motion/react';
import { Customer, Lead, Deal } from '../types';

interface ReportsSectionProps {
  customers: Customer[];
  leads: Lead[];
  deals: Deal[];
  currency: string;
  subView: string;
}

export default function ReportsSection({
  customers,
  leads,
  deals,
  currency,
  subView
}: ReportsSectionProps) {
  // Aggregate data (non-financial)
  const wonDeals = deals.filter(d => d.stage === 'Closed Won');
  const totalAllocatedSeats = wonDeals.reduce((sum, d) => sum + d.value, 0);

  // SLA capacity projections over time
  const capacityData = [
    { month: 'Jan', seats: Math.round(totalAllocatedSeats * 0.15 + 10) },
    { month: 'Feb', seats: Math.round(totalAllocatedSeats * 0.3 + 15) },
    { month: 'Mar', seats: Math.round(totalAllocatedSeats * 0.45 + 20) },
    { month: 'Apr', seats: Math.round(totalAllocatedSeats * 0.65 + 35) },
    { month: 'May', seats: Math.round(totalAllocatedSeats * 0.8 + 50) },
    { month: 'Jun', seats: totalAllocatedSeats || 120 }
  ];

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: SALES REPORT
          ========================================== */}
      {subView === 'reports-sales' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SLA DEALS PERFORMANCE REPORT <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">AUDITS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Direct tabular audit of corporate SLA wins and total allocated seat scopes.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Report Identifier</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">SLA Commencement Date</th>
                    <th className="p-4 text-right">Allocated Seat Capacity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {wonDeals.map((dl, idx) => (
                    <tr key={dl.id} className="hover:bg-zinc-900/10 transition-all">
                      <td className="p-4 font-mono text-zinc-500">SLA-0{idx + 1}</td>
                      <td className="p-4 font-bold text-white">{dl.customerName}</td>
                      <td className="p-4 font-mono text-zinc-400">{dl.closingDate}</td>
                      <td className="p-4 text-right font-bold text-yellow-400 font-mono">{dl.value} seats</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: CUSTOMER REPORT
          ========================================== */}
      {subView === 'reports-customer' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              CLIENT AUDIT REPORT <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DEMOGRAPHICS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit client account status, touchpoints, and regional allocations.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Company Entity</th>
                    <th className="p-4">Onboarding Target Date</th>
                    <th className="p-4 text-right">MFA Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {customers.map(cust => (
                    <tr key={cust.id} className="hover:bg-zinc-900/10 transition-all">
                      <td className="p-4 font-bold text-white">{cust.fullName}</td>
                      <td className="p-4 text-zinc-400">{cust.companyName || 'Private client'}</td>
                      <td className="p-4 font-mono text-zinc-500">{cust.createdAt}</td>
                      <td className="p-4 text-right font-mono text-emerald-400 font-bold">✓ Enabled</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: REVENUE REPORT (RE-ENGINEERED AS ACTIVE SLA CAPACITY SEATS REPORT)
          ========================================== */}
      {subView === 'reports-revenue' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ACTIVE SEATS ALLOCATION INDEX <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">CAPACITY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Interactive account seat provisions and cumulative operational workload coverage trends.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Monitored Client Seats Provision Trend</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={capacityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSeats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FACC15" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#18181b" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                  <YAxis stroke="#71717a" fontSize={10} fontClassName="font-mono" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace' }}
                    itemStyle={{ color: '#FACC15', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="seats" stroke="#FACC15" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSeats)" name="Allocated Seats" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: OTHER FINANCIAL REPORTS (RE-ROUTED)
          ========================================== */}
      {(subView === 'reports-employee' || subView === 'reports-project' || subView === 'reports-support') && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-12 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="p-4 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-sans uppercase">Audits Aggregated</h2>
            <p className="text-xs text-zinc-400 max-w-md mt-2">
              HR rosters, active product sprints, and helpdesk SLA queues have been consolidated under dedicated operational sidebar boards.
            </p>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: PERFORMANCE REPORT
          ========================================== */}
      {subView === 'reports-performance' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              STAFF CLOSING LEADERS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">LEADERBOARDS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit closing ratios, deals won, and team conversion rates.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg divide-y divide-zinc-900 text-xs">
            
            <div className="p-4 flex items-center justify-between hover:bg-zinc-900/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-400 text-black font-black flex items-center justify-center rounded-full font-mono">1</div>
                <div>
                  <h4 className="font-bold text-white">Elena Rostova</h4>
                  <p className="text-zinc-500 text-[10px]">Enterprise Account Executive</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-white font-mono">94% Closing Ratio</span>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">⭐ top closing executive</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-zinc-900/10 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-900 border border-zinc-850 text-zinc-400 font-black flex items-center justify-center rounded-full font-mono">2</div>
                <div>
                  <h4 className="font-bold text-white">Sarah Connor</h4>
                  <p className="text-zinc-500 text-[10px]">Customer Success Analyst</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-white font-mono">91% Closing Ratio</span>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Excellent satisfaction index</p>
              </div>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
