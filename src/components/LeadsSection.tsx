import React, { useState } from 'react';
import { 
  Target, Plus, Play, ChevronLeft, ChevronRight, Search, Mail, Phone, Calendar, 
  TrendingUp, AlertCircle, Trash2, CheckCircle2, Star, Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Lead, LeadStatus, LeadPriority, Customer } from '../types';

interface LeadsSectionProps {
  leads: Lead[];
  customers: Customer[];
  onAddLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  currency: string;
  subView: string;
}

export default function LeadsSection({
  leads,
  customers,
  onAddLead,
  onEditLead,
  onDeleteLead,
  currency,
  subView
}: LeadsSectionProps) {
  // New Lead state
  const [customerName, setCustomerName] = useState('');
  const [source, setSource] = useState('Website Form');
  const [expectedRevenue, setExpectedRevenue] = useState('');
  const [priority, setPriority] = useState<LeadPriority>('Medium');
  const [notes, setNotes] = useState('');

  // Local follow-up actions logger
  const [followedUpLeads, setFollowedUpLeads] = useState<string[]>([]);

  // Pipeline stages list
  const stages: LeadStatus[] = ['New', 'Contacted', 'Nurturing', 'Proposal Sent', 'Qualified'];

  const resetForm = () => {
    setCustomerName('');
    setSource('Website Form');
    setExpectedRevenue('');
    setPriority('Medium');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert('Associated client name is required.');
      return;
    }
    onAddLead({
      id: `lead-${Date.now()}`,
      customerName,
      source,
      status: 'New',
      expectedRevenue: Number(expectedRevenue) || 5000,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      priority,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    });
    resetForm();
    alert('Lead registered successfully into Core Pipeline.');
  };

  const handleMoveStage = (leadId: string, currentStatus: LeadStatus, direction: 'prev' | 'next') => {
    const idx = stages.indexOf(currentStatus);
    let nextStatus = currentStatus;
    if (direction === 'prev' && idx > 0) {
      nextStatus = stages[idx - 1];
    } else if (direction === 'next' && idx < stages.length - 1) {
      nextStatus = stages[idx + 1];
    }

    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      onEditLead({
        ...lead,
        status: nextStatus
      });
    }
  };

  const triggerFollowUp = (leadId: string) => {
    setFollowedUpLeads([...followedUpLeads, leadId]);
    alert('Strategic follow-up transaction logged securely.');
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: NEW LEADS (INTAKE)
          ========================================== */}
      {subView === 'leads-new' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              LEAD INTAKE <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">OPPORTUNITY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Onboard potential sales and contract negotiations securely.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono">Select Client / Lead Name *</label>
                <select 
                  required
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.fullName}>{c.fullName} ({c.companyName || 'Private'})</option>
                  ))}
                  <option value="Anonymous Enterprise Lead">Add Guest Enterprise Lead</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-mono">Lead Acquisition Channel</label>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  >
                    <option value="Website Form">Website Form</option>
                    <option value="LinkedIn Referral">LinkedIn Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Partner Referral">Partner Referral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase font-mono">Expected Pipeline Value ({currency})</label>
                  <input 
                    type="number" 
                    placeholder="E.g. 15000" 
                    value={expectedRevenue} 
                    onChange={(e) => setExpectedRevenue(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono">Opportunity Priority Status</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as LeadPriority[]).map(pr => (
                    <button
                      key={pr}
                      type="button"
                      onClick={() => setPriority(pr)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        priority === pr 
                          ? 'bg-yellow-400 text-black border-yellow-400' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {pr} Priority
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase font-mono">Internal Briefing Details</label>
                <textarea 
                  placeholder="Record deal pain points, core team priorities, setup metrics..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl p-3 outline-none focus:border-yellow-400/50 h-24 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer uppercase tracking-wider"
              >
                + Register Lead Opportunity
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: LEAD PIPELINE (BOARD)
          ========================================== */}
      {subView === 'leads-pipeline' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SALES LEAD PIPELINE <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">KANBAN BOARD</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">One-click stage advancement, pipeline metrics tracking, and expected value estimations.</p>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {stages.map(col => {
              const colLeads = leads.filter(l => l.status === col);
              return (
                <div key={col} className="bg-zinc-950/60 border border-zinc-900/60 rounded-2xl p-2.5 flex flex-col min-h-[350px]">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3 px-1">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">{col}</span>
                    <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-yellow-400 px-2 py-0.2 rounded-full font-bold font-mono">
                      {colLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {colLeads.map(lead => (
                      <div key={lead.id} className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl relative group text-xs space-y-2 hover:border-yellow-400/30 transition-all">
                        <div>
                          <p className="font-bold text-white line-clamp-1">{lead.customerName}</p>
                          <p className="text-[9px] text-zinc-500 font-mono mt-0.5">{lead.source}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-bold font-mono text-[10px]">{currency}{lead.expectedRevenue.toLocaleString()}</span>
                          <span className={`px-1.5 py-0.2 text-[8px] font-black rounded font-mono uppercase ${
                            lead.priority === 'High' ? 'bg-red-950/30 text-red-400 border border-red-900/20' : 
                            lead.priority === 'Medium' ? 'bg-amber-950/30 text-amber-400 border border-amber-900/20' : 
                            'bg-zinc-900 text-zinc-500 border border-zinc-850'
                          }`}>
                            {lead.priority}
                          </span>
                        </div>

                        {/* Slide-control indicators */}
                        <div className="flex items-center justify-between border-t border-zinc-900/80 pt-2 text-[9px] font-mono text-zinc-500">
                          <span>Due: {lead.followUpDate}</span>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleMoveStage(lead.id, lead.status, 'prev')}
                              className="p-0.5 bg-zinc-900 rounded text-zinc-500 hover:text-white cursor-pointer"
                              title="Previous stage"
                            >
                              ◀
                            </button>
                            <button
                              onClick={() => handleMoveStage(lead.id, lead.status, 'next')}
                              className="p-0.5 bg-zinc-900 rounded text-zinc-500 hover:text-yellow-400 cursor-pointer"
                              title="Next stage"
                            >
                              ▶
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {colLeads.length === 0 && (
                      <div className="h-full border border-dashed border-zinc-900 rounded-xl flex items-center justify-center p-4">
                        <span className="text-[9px] text-zinc-700 font-mono text-center">No leads</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: FOLLOW-UPS
          ========================================== */}
      {subView === 'leads-followups' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              OPPORTUNITIES FOLLOW-UPS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SCHEDULER</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Never lose communication with hot prospects. Dynamic alert intervals based on contact priority.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-wider font-mono">Lead Follow-Up Agenda</span>
            </div>

            <div className="divide-y divide-zinc-900">
              {leads.map(lead => {
                const isDispatched = followedUpLeads.includes(lead.id);
                return (
                  <div key={lead.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-white text-sm">{lead.customerName}</h4>
                        <span className="px-1.5 py-0.2 bg-zinc-900 text-zinc-500 text-[8px] font-mono rounded">
                          Interval: Weekly
                        </span>
                      </div>
                      <p className="text-zinc-400 mt-1">Lead Source: {lead.source} | Pipeline valuation: {currency}{lead.expectedRevenue.toLocaleString()}</p>
                      <p className="text-[9px] text-zinc-600 font-mono mt-1">Follow-up schedule target: {lead.followUpDate}</p>
                    </div>

                    <button
                      onClick={() => triggerFollowUp(lead.id)}
                      disabled={isDispatched}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-black uppercase transition-all shrink-0 cursor-pointer ${
                        isDispatched 
                          ? 'bg-zinc-900 text-zinc-600 border border-zinc-800' 
                          : 'bg-yellow-400 text-black hover:bg-yellow-300'
                      }`}
                    >
                      {isDispatched ? '✓ Follow-Up Logged' : 'Log Quick Touchpoint'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: LEAD SOURCES
          ========================================== */}
      {subView === 'leads-sources' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ACQUISITION SOURCES <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">MARKETING METRICS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Visual indicators, referral counts, conversion values, and channel efficiency margins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Website Form */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-2">
              <div className="flex justify-between text-xs font-bold text-white font-mono uppercase">
                <span>Website Form Channel</span>
                <span className="text-yellow-400">{leads.filter(l => l.source === 'Website Form').length} Leads</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full" style={{ width: '45%' }}></div>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono block">Estimated segment value: {currency}34,500</span>
            </div>

            {/* LinkedIn Referral */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-2">
              <div className="flex justify-between text-xs font-bold text-white font-mono uppercase">
                <span>LinkedIn Outreach</span>
                <span className="text-yellow-400">{leads.filter(l => l.source === 'LinkedIn Referral').length} Leads</span>
              </div>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full" style={{ width: '30%' }}></div>
              </div>
              <span className="text-[9px] text-zinc-500 font-mono block">Estimated segment value: {currency}18,000</span>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
