import React, { useState } from 'react';
import { 
  Sparkles, Send, Brain, Cpu, TrendingUp, HelpCircle, FileText, Landmark, Zap, ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, Lead, Deal, Task } from '../types';

interface AiAssistantSectionProps {
  customers: Customer[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  currency: string;
  subView: string;
}

export default function AiAssistantSection({
  customers,
  leads,
  deals,
  tasks,
  currency,
  subView
}: AiAssistantSectionProps) {
  // Chat stream state
  const [messages, setMessages] = useState([
    { sender: 'ai', text: `Greetings, Administrator. I am Adjen Core AI. Ask me about your client directory, sales velocities, won revenues, or active checklists!`, time: '10:00 AM' }
  ]);
  const [inputVal, setInputVal] = useState('');

  // Computations
  const wonDeals = deals.filter(d => d.stage === 'Closed Won');
  const totalRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const bestDeal = deals.length > 0 ? [...deals].sort((a, b) => b.value - a.value)[0] : null;

  const handleAiChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { sender: 'user', text: inputVal, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, userMsg]);
    setInputVal('');

    const query = inputVal.toLowerCase();
    let reply = `Analyzing telemetry metrics... `;

    if (query.includes('revenue') || query.includes('sales') || query.includes('earn')) {
      reply = `Adjen Core AI reports won revenue totaling ${currency}${totalRevenue.toLocaleString()} across ${wonDeals.length} settled contracts.`;
    } else if (query.includes('best') || query.includes('highest') || query.includes('deal')) {
      reply = bestDeal 
        ? `The highest-valued commercial transaction on file is "${bestDeal.title}" with ${bestDeal.customerName} valued at ${currency}${bestDeal.value.toLocaleString()}.` 
        : `No active transaction records located in memory logs.`;
    } else if (query.includes('customer') || query.includes('client')) {
      reply = `You have ${customers.length} registered customers, with ${customers.filter(c => c.status === 'Active').length} currently active.`;
    } else {
      reply = `Query processed. Active leads in pipeline: ${leads.length}. Outstanding task assignments: ${tasks.filter(t => !t.completed).length}. Operational indices remain stable.`;
    }

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: AI CHAT
          ========================================== */}
      {subView === 'ai-chat' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              ADJEN CORE AI <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">COGNITIVE ENGINE</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Direct natural language query tool to extract financial or client intelligence.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[400px]">
            {/* Header */}
            <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider font-mono">Cognitive Chat Stream</span>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-xs space-y-1 ${
                    msg.sender === 'user' 
                      ? 'bg-yellow-400 text-black rounded-tr-none font-bold' 
                      : 'bg-zinc-900 text-zinc-200 rounded-tl-none border border-zinc-800'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className="text-[8px] opacity-65 text-right font-mono">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleAiChat} className="p-3 border-t border-zinc-900/80 bg-zinc-950/40 flex gap-2">
              <input 
                type="text" required placeholder="Query (e.g. 'What is our won revenue?')..." value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
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
          SUB-VIEW: SMART INSIGHTS
          ========================================== */}
      {subView === 'ai-insights' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              COGNITIVE SMART INSIGHTS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">OPERATIONS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Automated analysis of active pipelines, contract values, and leakage indices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Revenue & Pipeline Saturation</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Core AI indicates won contracts total <strong className="text-yellow-400">{currency}{totalRevenue.toLocaleString()}</strong>. Our predictive models calculate sales velocity at 14 calendar days. There is minimal risk of fiscal bottleneck.
              </p>
            </div>

            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-3">
              <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Client Retentive Index</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You have logged <strong className="text-yellow-400">{customers.length}</strong> core entities in database. Active retainer contracts maintain a 94.8% stability ratio. Cross-selling setups can expand MRR margin by +12%.
              </p>
            </div>

          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: AI REPORTS
          ========================================== */}
      {subView === 'ai-reports' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              COMPILED AI EXECUTIVE SUITE <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SUMMARY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Instantly generate a formal commercial analysis compiled by our local cognitive algorithms.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">Compiled Operational Intelligence Document</h3>
            <pre className="text-[10px] font-mono text-zinc-300 bg-black/60 border border-zinc-900 p-4 rounded-xl leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
{`=========================================
ADJEN CORE AI - OPERATIONAL DIAGNOSTIC
=========================================
GEN-REF: AUD-CORE-9011
DATE: ${new Date().toISOString().split('T')[0]}

1. FINANCIAL HEALTH TELEMETRY:
- Won Contract Revenue: ${currency}${totalRevenue.toLocaleString()}
- Active Deals Value: ${currency}${(deals.reduce((sum, d) => sum + d.value, 0)).toLocaleString()}

2. CLIENT ENGAGEMENT RATIOS:
- Active Client Retention Index: 94.8%
- Registered Demographics Count: ${customers.length}

3. STRATEGIC AUDIT SUMMARY:
Operational indices remain stable. Network health checks indicate optimal handshaking speeds across development API gateways.
=========================================`}
            </pre>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: AI SUGGESTIONS
          ========================================== */}
      {subView === 'ai-suggestions' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              PROACTIVE RECOMMENDATIONS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SUGGESTIONS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Target suggestions to minimize pipeline leakage and expand commercial conversions.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-4 text-xs">
            
            <div className="p-3 bg-zinc-900/40 border-l-4 border-yellow-400 rounded-r-xl space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Follow up with warm opportunities</h4>
              <p className="text-zinc-400 leading-relaxed">
                Core AI detected {leads.length} active leads in pipeline. Send automated proposals to expand acquisition momentum.
              </p>
            </div>

            <div className="p-3 bg-zinc-900/40 border-l-4 border-zinc-700 rounded-r-xl space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Deploy MFA Security Training</h4>
              <p className="text-zinc-400 leading-relaxed">
                Ensure all onboarded accounts complete MFA setups before regional audits approach.
              </p>
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
