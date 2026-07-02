import React, { useState } from 'react';
import { 
  HelpCircle, MessageCircle, Send, Star, CheckCircle2, AlertTriangle, AlertCircle, 
  Trash2, User, History, ShieldCheck, FileText, Search, BookOpen, MessageSquare, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportExecutiveSectionProps {
  subView: string;
}

export default function SupportExecutiveSection({ subView }: SupportExecutiveSectionProps) {
  // --- 1. TICKETS STATE ---
  const [tickets, setTickets] = useState([
    { id: 'TCK-501', name: 'Vertex Corporation', issue: 'Handshake timeout on developer API gateway', priority: 'High', status: 'Open' },
    { id: 'TCK-502', name: 'BioSphere Ltd', issue: 'Custom dashboard visual sorting error', priority: 'Medium', status: 'Resolved' },
    { id: 'TCK-503', name: 'Aether Technologies', issue: 'MFA setup OTP recovery delay', priority: 'High', status: 'In Progress' }
  ]);

  const toggleTicketStatus = (tckId: string) => {
    setTickets(tickets.map(t => {
      if (t.id === tckId) {
        const nextStatus = t.status === 'Open' ? 'In Progress' : t.status === 'In Progress' ? 'Resolved' : 'Open';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // --- 2. LIVE CHAT STATE ---
  const [chatMessages, setChatMessages] = useState([
    { sender: 'client', text: 'Hello, our developer is experiencing an API authentication handshaking timeout. Can you help?', time: '09:30 AM' },
    { sender: 'agent', text: 'Hello! I can certainly assist with that. Could you please provide the endpoint URI?', time: '09:31 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'agent', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'client',
          text: `Auto-Response: Telemetry analyzed. Endpoint verified on socket port 3000. Operational parameters are clear.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 850);
  };

  // --- 3. CUSTOMER ACCOUNT HISTORY ---
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyResult, setHistoryResult] = useState<any>(null);
  const registeredAccounts = [
    { name: 'Sarah Connor', company: 'Aether Technologies', SLA: 'Premium 24/7 Support', pastIssues: 2, contractValue: '$150,000' },
    { name: 'David Smith', company: 'Vertex Corporation', SLA: 'Gold 12/5 Support', pastIssues: 5, contractValue: '$120,000' },
    { name: 'Liam Neeson', company: 'BioSphere Ltd', SLA: 'Silver SLA Support', pastIssues: 1, contractValue: '$45,000' },
  ];

  const handleSearchHistory = (e: React.FormEvent) => {
    e.preventDefault();
    const found = registeredAccounts.find(acc => acc.name.toLowerCase().includes(historyQuery.toLowerCase()) || acc.company.toLowerCase().includes(historyQuery.toLowerCase()));
    setHistoryResult(found || 'not_found');
  };

  // --- 4. TICKET RESOLUTION COMPILER ---
  const [resTicketId, setResTicketId] = useState('TCK-501');
  const [resAction, setResAction] = useState('');
  const [resStatus, setResStatus] = useState('Resolved');
  const [resolutionLogs, setResolutionLogs] = useState<any[]>([]);

  const handleCompileResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resAction) return;
    const log = {
      id: resTicketId,
      action: resAction,
      status: resStatus,
      date: new Date().toISOString().split('T')[0]
    };
    setResolutionLogs([log, ...resolutionLogs]);
    setTickets(tickets.map(t => t.id === resTicketId ? { ...t, status: resStatus } : t));
    setResAction('');
  };

  // --- 5. FAQs & KNOWLEDGE BASE ---
  const [faqQuery, setFaqQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqs = [
    { q: 'How do I resolve a handshake timeout error?', a: 'Instruct the developer client to check their inbound port routing. All reverse proxies route explicitly on port 3000.' },
    { q: 'Where are dynamic MFA recovery indices found?', a: 'Navigate to security controls under Super Admin and trigger a recovery passcode rekey.' },
    { q: 'How do I upgrade an SLA retainer level?', a: 'Open a ticket, assign to billing, and select standard contract override templates.' }
  ];

  const kbArticles = [
    { title: 'Reverse Proxy Routing Guide', category: 'Engineering', description: 'Port 3000 is the ONLY externally accessible port utilizing our Nginx reverse proxy routing systems.' },
    { title: 'MFA Security Compliance', category: 'Compliance', description: 'All operational personnel are mandated to enforce multi-factor authentication passcodes.' },
    { title: 'SLA Support Boundaries', category: 'Support Policy', description: 'Premium levels authorize 24/7 emergency telemetry handshaking support intervals.' },
  ];

  return (
    <div className="space-y-6">
      
      {/* ==========================================
          SUB-VIEW: SUPPORT TICKETS
          ========================================== */}
      {subView === 'support-tickets' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              CUSTOMER TICKETS <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SUPPORT DECK</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit, assign, and transition customer support tickets.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                    <th className="p-4">Ticket Ref</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Issue Description</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Transition Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-zinc-900/10">
                      <td className="p-4 font-mono font-bold text-yellow-400">{t.id}</td>
                      <td className="p-4 font-bold text-white">{t.name}</td>
                      <td className="p-4 text-zinc-400 max-w-xs truncate">{t.issue}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.2 text-[8px] font-black rounded font-mono uppercase ${
                          t.priority === 'High' ? 'bg-red-950/30 text-red-400' : 'bg-zinc-900 text-zinc-500'
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[9px] font-black font-mono rounded uppercase border ${
                          t.status === 'Resolved' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                          t.status === 'In Progress' ? 'bg-amber-950/30 text-amber-400 border-amber-900/20' :
                          'bg-zinc-900 text-zinc-500 border-zinc-850'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => toggleTicketStatus(t.id)}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black border border-zinc-800 text-[9px] font-bold rounded font-mono uppercase tracking-wide cursor-pointer transition-colors"
                        >
                          TRANSITION
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
          SUB-VIEW: LIVE CHAT PORTAL
          ========================================== */}
      {subView === 'support-chat' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              LIVE CONSOLE CHAT <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">LIVE CHAT</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Simulate live customer support conversation threads immediately.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[400px]">
            <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">Live Session Thread</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-xs space-y-1 ${
                    msg.sender === 'agent' 
                      ? 'bg-yellow-400 text-black rounded-tr-none font-bold' 
                      : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className="text-[8px] opacity-65 text-right font-mono">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900 bg-zinc-950/40 flex gap-2">
              <input 
                type="text" required placeholder="Type support message..." value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-850 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/30"
              />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-black px-4.5 rounded-xl flex items-center justify-center cursor-pointer">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: CUSTOMER HISTORY
          ========================================== */}
      {subView === 'support-history' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ACCOUNT HISTORY DECK <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">CUSTOMER HISTORY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit customer past contract values, active SLAs, and previous tickets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">QUERY CORE FILE</h4>
              <form onSubmit={handleSearchHistory} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Account Name or Company</label>
                  <input required type="text" placeholder="Vertex or Sarah" value={historyQuery} onChange={e=>setHistoryQuery(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none focus:border-yellow-400/40" />
                </div>
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer text-center flex items-center justify-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> QUERY FILE
                </button>
              </form>
            </div>

            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl shadow-md min-h-[220px] flex items-center justify-center text-xs">
              {historyResult === 'not_found' ? (
                <div className="text-center text-zinc-500 font-mono">
                  No account matching query was found in historical cache.
                </div>
              ) : historyResult ? (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                    <History className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{historyResult.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">{historyResult.company}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                    <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                      <span className="text-[9px] text-zinc-500 block">SUPPORT AGREEMENT SLA</span>
                      <span className="font-bold text-white mt-1 block">{historyResult.SLA}</span>
                    </div>
                    <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                      <span className="text-[9px] text-zinc-500 block">TOTAL HISTORIC ISSUES</span>
                      <span className="font-bold text-yellow-400 mt-1 block">{historyResult.pastIssues} resolved</span>
                    </div>
                    <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                      <span className="text-[9px] text-zinc-500 block">CONTRACT RETAINER VALUE</span>
                      <span className="font-bold text-white mt-1 block">{historyResult.contractValue}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-zinc-600 font-mono">
                  Input account/company query parameters on left control panel.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: TICKET RESOLUTION COMPILER
          ========================================== */}
      {subView === 'support-resolution' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              RESOLUTION COMPILER <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">RESOLUTION LOG</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Formally draft and register customer ticket resolution parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl space-y-4 text-xs">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">COMPILE RESOLUTION FORM</h4>
              <form onSubmit={handleCompileResolution} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Target Ticket Reference</label>
                  <select value={resTicketId} onChange={e=>setResTicketId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none">
                    {tickets.map(t=>(
                      <option key={t.id} value={t.id}>{t.id} ({t.name})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Action Resolution Summary</label>
                  <textarea required rows={4} placeholder="Summarize fix: e.g. Reconfigured reverse proxy routing parameters..." value={resAction} onChange={e=>setResAction(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none resize-none font-sans" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono">Status transition</label>
                  <select value={resStatus} onChange={e=>setResStatus(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none">
                    <option value="Resolved">Resolved (Complete)</option>
                    <option value="In Progress">In Progress (Nurturing)</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black rounded-lg hover:bg-yellow-300 cursor-pointer text-center">
                  COMPILE RESOLUTION
                </button>
              </form>
            </div>

            <div className="md:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Resolution Summary Actions</th>
                      <th className="p-4">Transition</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {resolutionLogs.length > 0 ? (
                      resolutionLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/10">
                          <td className="p-4 font-mono font-bold text-yellow-400">{log.id}</td>
                          <td className="p-4 text-zinc-300">{log.action}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-emerald-950/30 border border-emerald-900/20 text-emerald-400 rounded text-[9px] font-bold font-mono">
                              {log.status}
                            </span>
                          </td>
                          <td className="p-4 text-zinc-400 font-mono">{log.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-600 font-mono">
                          No resolved logs cataloged in current operational session.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: FAQ & KNOWLEDGE BASE
          ========================================== */}
      {(subView === 'support-faq' || subView === 'support-kb') && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              FAQ & KNOWLEDGE DIRECTORIES <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">KNOWLEDGE PORTAL</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Query developer handbooks, reverse proxy configurations, and SLA guides.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* FAQ */}
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-4">
              <h3 className="font-bold text-white font-mono uppercase tracking-widest text-[10px] border-b border-zinc-900 pb-2">FAQS (ONE-CLICK EXPAND)</h3>
              <div className="space-y-3">
                {faqs.map((f, idx) => (
                  <div key={idx} className="border border-zinc-900 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-3 bg-zinc-900/30 text-left font-bold text-zinc-300 hover:text-white flex justify-between items-center outline-none cursor-pointer"
                    >
                      <span>{f.q}</span>
                      <span className="text-yellow-400 font-mono">{expandedFaq === idx ? '−' : '+'}</span>
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-3 bg-zinc-950/20 border-t border-zinc-900 text-zinc-400 leading-relaxed text-[11px]">
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* KB */}
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl shadow-md space-y-4">
              <h3 className="font-bold text-white font-mono uppercase tracking-widest text-[10px] border-b border-zinc-900 pb-2">KNOWLEDGE BASE ARTICLES</h3>
              <div className="space-y-3.5">
                {kbArticles.map((art, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white leading-none">{art.title}</h4>
                      <span className="px-1.5 py-0.5 bg-yellow-400/5 text-yellow-400 border border-yellow-400/20 rounded font-mono text-[8px] uppercase">{art.category}</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed text-[11px] pt-1">{art.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
