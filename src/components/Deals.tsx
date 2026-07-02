import React, { useState } from 'react';
import { BarChart3, Plus, Calendar, ShieldCheck, ShieldAlert, TrendingUp, Edit2, Trash2, ArrowRight, X, Sparkles } from 'lucide-react';
import { Deal, DealStage, Customer } from '../types';

interface DealsProps {
  deals: Deal[];
  customers: Customer[];
  onAddDeal: (deal: Deal) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (id: string) => void;
  currency: string;
}

export default function Deals({
  deals,
  customers,
  onAddDeal,
  onEditDeal,
  onDeleteDeal,
  currency
}: DealsProps) {
  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Deal | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [value, setValue] = useState(15000);
  const [stage, setStage] = useState<DealStage>('Qualification');
  const [closingDate, setClosingDate] = useState('');

  // Define standard stages
  const STAGES: DealStage[] = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  // Computations
  const getDealsByStage = (stg: DealStage) => deals.filter(d => d.stage === stg);
  const getStageTotalValue = (stg: DealStage) => getDealsByStage(stg).reduce((sum, d) => sum + d.value, 0);

  // Win loss calculations
  const wonDealsCount = getDealsByStage('Closed Won').length;
  const lostDealsCount = getDealsByStage('Closed Lost').length;
  const closedCount = wonDealsCount + lostDealsCount;
  const winRate = closedCount > 0 ? Math.round((wonDealsCount / closedCount) * 100) : 0;
  
  const totalPipeline = deals
    .filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);

  const openAddModal = () => {
    setTitle('Enterprise Subscription Suite');
    setCustomerName(customers[0]?.fullName || customers[0]?.companyName || '');
    setValue(25000);
    setStage('Qualification');
    // Default closing date 30 days in future
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setClosingDate(d.toISOString().split('T')[0]);
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName) {
      alert('Deal title and connected customer are required.');
      return;
    }

    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      title,
      customerName,
      value: Number(value),
      stage,
      closingDate,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddDeal(newDeal);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    onEditDeal(editForm);
    setIsEditOpen(false);
    setEditForm(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      onDeleteDeal(id);
    }
  };

  // Helper to advance stage
  const handleAdvanceStage = (deal: Deal) => {
    const currentIndex = STAGES.indexOf(deal.stage);
    if (currentIndex < STAGES.length - 1 && deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost') {
      const nextStage = STAGES[currentIndex + 1];
      onEditDeal({
        ...deal,
        stage: nextStage
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Deals & Revenue Pipelines
          </h1>
          <p className="text-sm text-slate-400 mt-1">Contract staging, active negotiation phases, and closing estimates</p>
        </div>

        <button
          onClick={openAddModal}
          id="btn-add-deal"
          className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Deal
        </button>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4.5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Pipeline</span>
          <span className="text-xl font-black text-slate-100 mt-1 block">{currency}{totalPipeline.toLocaleString()}</span>
        </div>

        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4.5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Won Revenue</span>
          <span className="text-xl font-black text-emerald-400 mt-1 block">
            {currency}{getStageTotalValue('Closed Won').toLocaleString()}
          </span>
        </div>

        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4.5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Win Efficiency Rate</span>
          <span className="text-xl font-black text-indigo-400 mt-1 block">{winRate}%</span>
        </div>

        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4.5 rounded-2xl relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pipeline Count</span>
          <span className="text-xl font-black text-slate-100 mt-1 block">
            {deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length} deals
          </span>
        </div>
      </div>

      {/* Kanban Staging Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map(stageName => {
          const stageDeals = getDealsByStage(stageName);
          const stageVal = getStageTotalValue(stageName);

          return (
            <div
              key={stageName}
              className="backdrop-blur-md bg-slate-900/10 border border-slate-900 rounded-2xl p-4 min-w-[240px] flex flex-col justify-between space-y-4"
            >
              {/* Stage Header */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      stageName === 'Closed Won' ? 'bg-emerald-500' :
                      stageName === 'Closed Lost' ? 'bg-red-500' :
                      stageName === 'Negotiation' ? 'bg-amber-500' :
                      stageName === 'Proposal' ? 'bg-purple-500' :
                      'bg-indigo-500'
                    }`}></span>
                    {stageName}
                  </h3>
                  <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-850 rounded text-[10px] font-bold text-slate-400">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  Value: <span className="text-slate-200">{currency}{stageVal.toLocaleString()}</span>
                </div>
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[480px] pr-0.5">
                {stageDeals.map(deal => (
                  <div
                    key={deal.id}
                    className="p-3.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-xl transition-all relative group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-xs font-bold text-slate-100 leading-snug group-hover:text-purple-400 transition-colors">
                        {deal.title}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium mb-3">{deal.customerName}</p>

                    {/* Financial value banner */}
                    <div className="flex items-center justify-between bg-slate-900/60 p-2 border border-slate-850 rounded-lg mb-3">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Value</span>
                      <span className="text-xs font-bold text-emerald-400">{currency}{deal.value.toLocaleString()}</span>
                    </div>

                    {/* Closing calendar details */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Closing: {deal.closingDate}
                      </span>
                    </div>

                    {/* Quick Stage Progression panel */}
                    <div className="mt-3 pt-3 border-t border-slate-850/60 flex items-center justify-between">
                      {/* Advanced Action triggers */}
                      {deal.stage !== 'Closed Won' && deal.stage !== 'Closed Lost' ? (
                        <button
                          onClick={() => handleAdvanceStage(deal)}
                          className="px-2 py-1 bg-slate-900 hover:bg-purple-950/40 text-purple-400 border border-slate-800/80 hover:border-purple-800/40 text-[10px] font-bold rounded flex items-center gap-1 transition-all cursor-pointer"
                        >
                          Advance <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          {deal.stage === 'Closed Won' ? (
                            <><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Won</>
                          ) : (
                            <><ShieldAlert className="w-3.5 h-3.5 text-red-500" /> Lost</>
                          )}
                        </span>
                      )}

                      {/* Deletes & Edits buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditForm(deal); setIsEditOpen(true); }}
                          className="p-1 text-slate-500 hover:text-white transition-colors"
                          title="Modify Deal"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deal.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Deal"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs border border-dashed border-slate-800/60 rounded-xl">
                    No deals
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute right-4 top-4 p-1.5 bg-slate-950/40 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" /> Create New Revenue Deal
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Deal Title / Opportunity Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  placeholder="e.g. ERP Implementation Suite"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Connected Customer Account *</label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                  required
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.fullName}>{c.fullName} ({c.companyName || 'No Company'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contract Value ({currency}) *</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Close Date *</label>
                  <input
                    type="date"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Funnel Staging Phase</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as DealStage)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  <option value="Qualification">Qualification Phase</option>
                  <option value="Proposal">Proposal Submission</option>
                  <option value="Negotiation">Negotiation / Review</option>
                  <option value="Closed Won">Closed Won (Success)</option>
                  <option value="Closed Lost">Closed Lost (Archived)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Write Secure Deal Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {isEditOpen && editForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => { setIsEditOpen(false); setEditForm(null); }}
              className="absolute right-4 top-4 p-1.5 bg-slate-950/40 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-purple-500" /> Modify Deal Parameters
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Deal Title / Opportunity Name *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Connected Customer Account</label>
                <input
                  type="text"
                  value={editForm.customerName}
                  disabled
                  className="w-full bg-slate-95 border border-slate-850 text-slate-500 rounded-xl px-3.5 py-2 text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Contract Value ({currency}) *</label>
                  <input
                    type="number"
                    value={editForm.value}
                    onChange={(e) => setEditForm({ ...editForm, value: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Close Date *</label>
                  <input
                    type="date"
                    value={editForm.closingDate}
                    onChange={(e) => setEditForm({ ...editForm, closingDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Funnel Staging Phase</label>
                <select
                  value={editForm.stage}
                  onChange={(e) => setEditForm({ ...editForm, stage: e.target.value as DealStage })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  <option value="Qualification">Qualification Phase</option>
                  <option value="Proposal">Proposal Submission</option>
                  <option value="Negotiation">Negotiation / Review</option>
                  <option value="Closed Won">Closed Won (Success)</option>
                  <option value="Closed Lost">Closed Lost (Archived)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm & Overwrite Deal Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
