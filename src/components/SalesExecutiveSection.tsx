import React, { useState } from 'react';
import { 
  Users, Target, Calendar, Clock, Edit2, FileText, Send, Plus, Trash2, 
  ChevronRight, BookOpen, Clock3, Archive, MessageSquare, PlusCircle, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, Lead, Deal, Task, User as UserType } from '../types';
import SalesExecutiveCustomers from './SalesExecutiveCustomers';

interface SalesExecutiveSectionProps {
  subView: string;
  currentUser: UserType | null;
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
}

export default function SalesExecutiveSection({ 
  subView,
  currentUser,
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  leads,
  deals,
  tasks
}: SalesExecutiveSectionProps) {
  // --- 1. PERSONAL NOTE WORKSPACE STATE ---
  const [notes, setNotes] = useState<{ id: string; title: string; body: string; date: string }[]>([
    { id: '1', title: 'Vertex Deal Strategy', body: 'David is looking for a custom SLA exception tier. Need Manager approval for SLA overrides.', date: '2026-07-01' },
    { id: '2', title: 'Sarah Connor Call Prep', body: 'Sarah prefers email briefings. Confirm if we have integrated the developer API gate.', date: '2026-06-30' },
  ]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteBody) return;
    setNotes([{
      id: Date.now().toString(),
      title: noteTitle,
      body: noteBody,
      date: new Date().toISOString().split('T')[0]
    }, ...notes]);
    setNoteTitle('');
    setNoteBody('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // --- 2. SLA SPECIFICATION BUILDER (NON-FINANCIAL QUOTE EXPLAINER) ---
  const [quoteClient, setQuoteClient] = useState('Vertex Corporation');
  const [quoteItem, setQuoteItem] = useState('Enterprise SLA Support');
  const [quoteSlaLevel, setQuoteSlaLevel] = useState('Level-1 Platinum');
  const [quoteUsersCount, setQuoteUsersCount] = useState(100);
  const [compiledQuotes, setCompiledQuotes] = useState([
    { id: 'SLA-901', client: 'Aether Technologies', item: 'Dev API Ingress Integration', coverage: 'Level-1 Platinum', date: '2026-07-01' },
    { id: 'SLA-902', client: 'BioSphere Ltd', item: 'Sustainable Supply-chain Module', coverage: 'Level-2 Gold', date: '2026-06-29' },
  ]);

  const handleCompileQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteClient || !quoteItem) return;
    const nQuote = {
      id: `SLA-${Math.floor(Math.random() * 900) + 100}`,
      client: quoteClient,
      item: quoteItem,
      coverage: quoteSlaLevel,
      date: new Date().toISOString().split('T')[0]
    };
    setCompiledQuotes([nQuote, ...compiledQuotes]);
  };

  // --- 3. PERSONAL ASSIGNED CUSTOMERS ---
  const [myCustomers] = useState([
    { id: 'cust-1', name: 'Sarah Connor', company: 'Aether Technologies', email: 'sarah.connor@aethertech.com', phone: '+1 555-234-5678', stage: 'Proposal Sent', lastF: '2026-06-20' },
    { id: 'cust-2', name: 'David Smith', company: 'Vertex Corporation', email: 'dsmith@vertexcorp.com', phone: '+1 555-876-5432', stage: 'Negotiation', lastF: '2026-06-25' },
    { id: 'cust-3', name: 'Sophia Loren', company: 'Milano Design', email: 's.loren@milanodesign.it', phone: '+39 06 1234567', stage: 'New', lastF: '2026-06-28' },
  ]);

  // --- 4. PERSONAL LEADS (NON-FINANCIAL VALUE) ---
  const [myLeads] = useState([
    { id: 'ld-101', name: 'Sarah Connor', score: 88, source: 'LinkedIn', date: '2026-06-20', status: 'Warm' },
    { id: 'ld-102', name: 'David Smith', score: 95, source: 'Website', date: '2026-06-25', status: 'Hot' },
  ]);

  return (
    <div className="space-y-6">
      
      {/* ==========================================
          SUB-VIEW: MY CUSTOMERS
          ========================================== */}
      {subView === 'sales-customers' && (
        <SalesExecutiveCustomers 
          currentUser={currentUser}
          customers={customers}
          onAddCustomer={onAddCustomer}
          onEditCustomer={onEditCustomer}
          onDeleteCustomer={onDeleteCustomer}
          leads={leads}
          deals={deals}
          tasks={tasks}
        />
      )}

      {/* ==========================================
          SUB-VIEW: MY LEADS
          ========================================== */}
      {subView === 'sales-leads' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              MY LEAD CONVERSION SPRINT <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">LEAD DECK</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Nurture leads and map commercial engagement values.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myLeads.map(l => (
              <div key={l.id} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-3 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all">
                  <Target className="w-12 h-12 text-yellow-400" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-xs leading-none">{l.name}</h4>
                    <span className="text-[9px] font-mono text-zinc-500 mt-1 block">Acquisition: {l.source}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider border ${
                    l.status === 'Hot' ? 'bg-red-950/30 text-red-400 border-red-900/20' : 'bg-amber-950/30 text-amber-400 border-amber-900/20'
                  }`}>
                    {l.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-zinc-900 pt-2.5 text-zinc-500">
                  <span>Logged {l.date}</span>
                  <span className="text-yellow-400 font-black">Quality Score: {l.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: MY DEALS
          ========================================== */}
      {subView === 'sales-deals' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              MY ACTIVE SALES PIPELINE <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DEALS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Track pending negotiations and closed won transactions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'dl-901', title: 'Enterprise SLA Contract', client: 'Vertex Corporation', priority: 'Critical Level-1', date: '2026-07-20', stage: 'Negotiation' },
              { id: 'dl-902', title: 'Security Audit Consulting', client: 'Aether Technologies', priority: 'High Priority', date: '2026-07-15', stage: 'Proposal Sent' },
            ].map(d => (
              <div key={d.id} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-3 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all">
                  <FileText className="w-12 h-12 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-none">{d.title}</h4>
                  <span className="text-[9px] text-zinc-500 font-mono mt-1 block">Client: {d.client}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-zinc-900 pt-2.5 text-zinc-500">
                  <span className="text-yellow-400 font-black">SLA Priority: {d.priority}</span>
                  <span className="px-2 py-0.5 bg-yellow-400/5 border border-yellow-400/20 text-yellow-400 rounded uppercase font-bold">{d.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: QUOTATIONS (RE-ENGINEERED AS SLA COMPILER)
          ========================================== */}
      {subView === 'sales-quotations' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SLA SPECIFICATION COMPILER <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SPECIFICATIONS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Compile client SLA requirements and specify tier levels immediately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">COMPILE SLA DETAILS</h4>
              <form onSubmit={handleCompileQuote} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Target Enterprise Client</label>
                  <input required type="text" value={quoteClient} onChange={e=>setQuoteClient(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">SLA Line Item Description</label>
                  <input required type="text" value={quoteItem} onChange={e=>setQuoteItem(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono">Coverage Tier</label>
                    <select value={quoteSlaLevel} onChange={e=>setQuoteSlaLevel(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40 text-zinc-300">
                      <option value="Level-1 Platinum">Level-1 Platinum</option>
                      <option value="Level-2 Gold">Level-2 Gold</option>
                      <option value="Level-3 Silver">Level-3 Silver</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-mono">Account Seats</label>
                    <input required type="number" value={quoteUsersCount} onChange={e=>setQuoteUsersCount(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40 font-mono" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer text-center font-mono">
                  COMPILE SLA SPEC
                </button>
              </form>
            </div>

            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                      <th className="p-4">Specification ID</th>
                      <th className="p-4">Target Account</th>
                      <th className="p-4">SLA Line Description</th>
                      <th className="p-4">Coverage Tier</th>
                      <th className="p-4">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {compiledQuotes.map(q => (
                      <tr key={q.id} className="hover:bg-zinc-900/10">
                        <td className="p-4 font-mono font-bold text-yellow-400">{q.id}</td>
                        <td className="p-4 font-bold text-white">{q.client}</td>
                        <td className="p-4 text-zinc-400">{q.item}</td>
                        <td className="p-4 font-mono font-bold text-white">{q.coverage}</td>
                        <td className="p-4 text-zinc-400 font-mono">{q.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: PERSONAL NOTE SCRATCHPAD
          ========================================== */}
      {subView === 'sales-notes' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              PERSONAL SCRATCHPAD <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">WORKSPACE NOTES</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Store key client triggers, call preparation logs, and pipeline strategies privately.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">ADD STRATEGY NOTE</h4>
              <form onSubmit={handleAddNote} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Note Title</label>
                  <input required type="text" placeholder="Vertex pricing logic" value={noteTitle} onChange={e=>setNoteTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Note Description</label>
                  <textarea required rows={4} placeholder="Discuss custom override options..." value={noteBody} onChange={e=>setNoteBody(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40 font-sans text-xs resize-none" />
                </div>
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer text-center font-mono">
                  STORE NOTE IN STATE
                </button>
              </form>
            </div>

            <div className="md:col-span-2 space-y-4 max-h-[420px] overflow-y-auto pr-1">
              <AnimatePresence>
                {notes.map(n => (
                  <motion.div key={n.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-2 relative group">
                    <button 
                      onClick={() => handleDeleteNote(n.id)}
                      className="absolute top-4 right-4 p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[9px] font-mono text-yellow-400 font-bold uppercase">{n.date}</span>
                    <h4 className="font-bold text-white text-xs leading-none mt-1">{n.title}</h4>
                    <p className="text-zinc-400 text-[11px] leading-relaxed pr-8">{n.body}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: ACTIVITY TIMELINE
          ========================================== */}
      {subView === 'sales-timeline' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              PERSONAL ENGAGEMENT STREAM <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">ACTIVITY TIMELINE</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit timeline activities registered on assigned leads and accounts.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-8 border-r border-zinc-900"></div>
            
            <div className="space-y-6 relative text-xs">
              {[
                { time: '10:14 AM', title: 'Vertex SLA Specification Compiled', desc: 'Itemized SLA proposal of Platinum Tier coverage sent to David for review.', icon: FileText },
                { time: '09:02 AM', title: 'Sarah Connor Discovery Call', desc: 'Confirmed key specifications. Discussed API gateway latency questions.', icon: Phone },
                { time: 'Yesterday', title: 'Sophia Loren Lead Allocated', desc: 'New inbound lead assigned by Sales Manager.', icon: Target },
              ].map((ev, idx) => {
                const EvIcon = ev.icon;
                return (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 z-10 text-yellow-400 shadow-md">
                      <EvIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-zinc-900/20 border border-zinc-900 p-4.5 rounded-2xl flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white text-xs leading-none">{ev.title}</h4>
                        <span className="text-[9px] font-mono text-zinc-500">{ev.time}</span>
                      </div>
                      <p className="text-zinc-400 leading-relaxed text-[11px]">{ev.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
