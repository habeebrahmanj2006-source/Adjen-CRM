import React, { useState } from 'react';
import { 
  HelpCircle, MessageCircle, Send, Star, Play, CheckCircle2, AlertTriangle, AlertCircle, Trash2 
} from 'lucide-react';
import { motion } from 'motion/react';

interface SupportSectionProps {
  subView: string;
}

export default function SupportSection({ subView }: SupportSectionProps) {
  // Support Tickets State
  const [tickets, setTickets] = useState([
    { id: 'TCK-501', name: 'Vertex Corporation', issue: 'Handshake timeout on developer API gateway', priority: 'High', status: 'Open' },
    { id: 'TCK-502', name: 'BioSphere Ltd', issue: 'Custom dashboard visual sorting error', priority: 'Medium', status: 'Resolved' },
    { id: 'TCK-503', name: 'Aether Technologies', issue: 'MFA setup OTP recovery delay', priority: 'High', status: 'In Progress' }
  ]);

  // Live Chat Simulator State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'client', text: 'Hello, our developer is experiencing an API authentication handshaking timeout. Can you help?', time: '09:30 AM' },
    { sender: 'agent', text: 'Hello! I can certainly assist with that. Could you please provide the endpoint URI?', time: '09:31 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // FAQ Expand state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    { q: 'How do I generate a formal quotation?', a: 'Navigate to Sales ➔ Quotations, choose any client, fill in the estimated cost, and click Compile Commercial Bid.' },
    { q: 'How do I promote a lead through the sales funnel?', a: 'Navigate to Leads ➔ Lead Pipeline and use the left/right arrow buttons on any lead card to instantly change its status.' },
    { q: 'How does client-side state persistence work?', a: 'All records (clients, tasks, proposals, and settings) are stored securely in local storage, so they persist across page reloads.' }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'agent', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages([...chatMessages, userMsg]);
    setChatInput('');

    // Trigger auto reply after 800ms
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'client',
          text: `Auto-Response: Telemetry analyzed. Thank you for reporting this. We will sync this with the development team.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 850);
  };

  const toggleTicketStatus = (tckId: string) => {
    setTickets(tickets.map(t => {
      if (t.id === tckId) {
        const nextStatus = t.status === 'Open' ? 'In Progress' : t.status === 'In Progress' ? 'Resolved' : 'Open';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: TICKETS
          ========================================== */}
      {subView === 'support-tickets' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              CUSTOMER TICKETS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SUPPORT LEDGER</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit, assign, and resolve customer support queries.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4">Ticket Ref</th>
                    <th className="p-4">Client Name</th>
                    <th className="p-4">Issue Description</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {tickets.map(t => (
                    <tr key={t.id} className="hover:bg-zinc-900/10 transition-all">
                      <td className="p-4 font-mono font-bold text-yellow-400">{t.id}</td>
                      <td className="p-4 font-bold text-white">{t.name}</td>
                      <td className="p-4 text-zinc-400 max-w-xs truncate" title={t.issue}>{t.issue}</td>
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
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 hover:text-white rounded text-[9px] font-mono cursor-pointer"
                        >
                          Advance State
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
          SUB-VIEW: LIVE CHAT
          ========================================== */}
      {subView === 'support-chat' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              LIVE CHAT BOX <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SIMULATOR</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Simulate real-time messaging with clients using immediate automated replies.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[400px]">
            {/* Header */}
            <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">Simulated Support Channel</span>
              <span className="text-[9px] text-emerald-400 font-mono">● ONLINE</span>
            </div>

            {/* Message window */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-xs space-y-1 ${
                    msg.sender === 'agent' 
                      ? 'bg-yellow-400 text-black rounded-tr-none' 
                      : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'
                  }`}>
                    <p className="leading-relaxed font-sans">{msg.text}</p>
                    <p className="text-[8px] opacity-60 font-mono text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900/80 bg-zinc-950/40 flex gap-2">
              <input 
                type="text" required placeholder="Type manual agent response..." value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-zinc-900/80 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none"
              />
              <button 
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-4.5 rounded-xl flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: FAQ
          ========================================== */}
      {subView === 'support-faq' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              OPERATIONAL FAQS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">GUIDES</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Frequently asked questions regarding CRM and commercial functions.</p>
          </div>

          <div className="space-y-3 text-xs">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-4 rounded-xl cursor-pointer hover:border-yellow-400/20 transition-all"
              >
                <div className="flex justify-between items-center font-bold text-white">
                  <span>{faq.q}</span>
                  <span className="text-yellow-400 font-mono">{expandedFaq === idx ? '▲' : '▼'}</span>
                </div>
                {expandedFaq === idx && (
                  <p className="mt-3.5 text-zinc-400 leading-relaxed pl-1.5 border-l border-yellow-400/40">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}
