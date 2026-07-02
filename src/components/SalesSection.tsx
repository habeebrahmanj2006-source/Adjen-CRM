import React, { useState } from 'react';
import { 
  Sparkles, Plus, Trash2, Edit2, CheckCircle2, FileText, Send, 
  ArrowRight, Search, Landmark, ShoppingBag, CreditCard, ChevronDown, ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { Deal, Customer, DealStage } from '../types';

interface SalesSectionProps {
  deals: Deal[];
  customers: Customer[];
  onAddDeal: (deal: Deal) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
  currency: string;
  subView: string;
}

export default function SalesSection({
  deals,
  customers,
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
  currency,
  subView
}: SalesSectionProps) {
  // Form states
  const [dealTitle, setDealTitle] = useState('');
  const [dealCustomer, setDealCustomer] = useState('');
  const [accountSeats, setAccountSeats] = useState('');
  const [dealStage, setDealStage] = useState<DealStage>('Qualification');

  // SLA Spec builder states
  const [selectedClient, setSelectedClient] = useState('');
  const [proposalScope, setProposalScope] = useState('');
  const [slaPriority, setSlaPriority] = useState('Level-1 Platinum');
  const [generatedProposal, setGeneratedProposal] = useState('');

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCustomer || !accountSeats) {
      alert('Deal details are incomplete.');
      return;
    }
    // We reuse Deal model, mapping 'value' field as 'seats' (non-monetary capacity count)
    onAddDeal({
      id: `deal-${Date.now()}`,
      title: dealTitle,
      customerName: dealCustomer,
      value: Number(accountSeats), // mapping to seats
      stage: dealStage,
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0]
    });
    setDealTitle('');
    setDealCustomer('');
    setAccountSeats('');
    alert('SLA Deal logged securely under CRM pipeline.');
  };

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !slaPriority) {
      alert('SLA compilation parameters are incomplete.');
      return;
    }

    const proposalText = `
=========================================
ADJEN ENTERPRISE AI CRM - SLA SPECIFICATION
Ref ID: SLA-${Math.floor(1000 + Math.random() * 9000)}
Date: ${new Date().toISOString().split('T')[0]}
=========================================
CLIENT ENTITY:
${selectedClient}

PROPOSAL SCOPE OF OPERATIONS:
${proposalScope || 'Custom software provisioning, API integration testing, and localized database sync support.'}

SLA COVERAGE CLASSIFICATION:
Designated Tier: ${slaPriority}
Incident Response Time: Under 2 Hours
Compliance Isolation Level: Premium Multi-Tenant SOC2
=========================================
Valid for immediate deployment upon signature.
`;
    setGeneratedProposal(proposalText.trim());
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: DEALS
          ========================================== */}
      {subView === 'sales-deals' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                ACTIVE SLA DEALS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">PIPELINE</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Audit, register, and close enterprise SLA client agreements.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Deals table */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      <th className="p-4">Deal Title</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Stage</th>
                      <th className="p-4">Allocated Seats</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {deals.map(dl => (
                      <tr key={dl.id} className="hover:bg-zinc-900/20 transition-all">
                        <td className="p-4">
                          <p className="font-bold text-white">{dl.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {dl.id} | SLA Date: {dl.closingDate}</p>
                        </td>
                        <td className="p-4 font-bold text-zinc-300">{dl.customerName}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-black font-mono rounded uppercase border ${
                            dl.stage === 'Closed Won' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/25' : 
                            dl.stage === 'Closed Lost' ? 'bg-red-950/40 text-red-400 border-red-900/25' : 
                            'bg-amber-950/40 text-amber-400 border-amber-900/25'
                          }`}>
                            {dl.stage}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-yellow-400 font-mono">{dl.value} seats</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => onDeleteDeal(dl.id)}
                            className="p-1 hover:bg-red-950/30 text-zinc-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                            title="Delete Deal"
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

            {/* Deal form */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4 h-fit">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Log New SLA Deal</h3>
              <form onSubmit={handleCreateDeal} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Deal Subject</label>
                  <input 
                    type="text" required placeholder="Custom API Support SLA" value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Select Customer</label>
                  <select 
                    required value={dealCustomer} onChange={(e) => setDealCustomer(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.fullName}>{c.fullName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Allocated Account Seats</label>
                  <input 
                    type="number" required placeholder="120" value={accountSeats}
                    onChange={(e) => setAccountSeats(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">SLA Phase</label>
                  <select 
                    value={dealStage} onChange={(e) => setDealStage(e.target.value as DealStage)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  >
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer uppercase font-mono"
                >
                  + Add SLA Deal
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: QUOTATIONS (SLA EXPLAINER)
          ========================================== */}
      {subView === 'sales-quotations' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SLA SPECIFICATIONS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">PROPOSAL BUILDER</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Generate comprehensive formal SLA requirement briefs for strategic client entities instantly.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Quotation Setup Parameters</h3>
              
              <form onSubmit={handleGenerateQuote} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Target Client</label>
                  <select 
                    value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  >
                    <option value="">-- Choose Client Entity --</option>
                    {customers.map(c => (
                      <option key={c.id} value={`${c.fullName} - ${c.companyName || 'Private client'}`}>{c.fullName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Project Scope Summary</label>
                  <textarea 
                    placeholder="Describe custom line items, support intervals, cloud sync triggers..." 
                    value={proposalScope} onChange={(e) => setProposalScope(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl p-3 outline-none focus:border-yellow-400/50 h-24 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Designated SLA Coverage Tier</label>
                  <select 
                    value={slaPriority} onChange={(e) => setSlaPriority(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50 text-zinc-300"
                  >
                    <option value="Level-1 Platinum">Level-1 Platinum</option>
                    <option value="Level-2 Gold">Level-2 Gold</option>
                    <option value="Level-3 Silver">Level-3 Silver</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer uppercase font-mono"
                >
                  ⚙ COMPILE SLA SPEC
                </button>
              </form>
            </div>

            {/* Proposal Text box */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">Compiled SLA Document</h3>
                {generatedProposal ? (
                  <pre className="text-[10px] font-mono text-zinc-300 bg-black/60 border border-zinc-900 p-4 rounded-xl mt-4 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[250px]">
                    {generatedProposal}
                  </pre>
                ) : (
                  <div className="h-44 border border-dashed border-zinc-900 rounded-xl flex items-center justify-center mt-4">
                    <span className="text-[10px] text-zinc-600 font-mono">Fill parameters on the left to compile SLA document.</span>
                  </div>
                )}
              </div>

              {generatedProposal && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedProposal);
                    alert('SLA proposal copied to clipboard!');
                  }}
                  className="w-full py-2 mt-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer font-mono"
                >
                  📋 COPY PROPOSAL PLAINTEXT
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEWS: OTHER BILLING (UNSUPPORTED)
          ========================================== */}
      {(subView === 'sales-invoices' || subView === 'sales-payments') && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-12 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="p-4 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-sans uppercase">Module Deactivated</h2>
            <p className="text-xs text-zinc-400 max-w-md mt-2">
              Financial ledger operations, invoices, and payment registries are consolidated under the Corporate Administration module in Compliance settings.
            </p>
          </div>
        </motion.div>
      )}

    </div>
  );
}
