import React, { useState } from 'react';
import { Target, Search, Plus, Calendar, AlertTriangle, User, Edit2, Trash2, X } from 'lucide-react';
import { Lead, LeadStatus, LeadPriority, Customer } from '../types';

interface LeadsProps {
  leads: Lead[];
  customers: Customer[];
  onAddLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  currency: string;
}

export default function Leads({
  leads,
  customers,
  onAddLead,
  onEditLead,
  onDeleteLead,
  currency
}: LeadsProps) {
  // Filters & Searching
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Lead | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [expectedRevenue, setExpectedRevenue] = useState(5000);
  const [followUpDate, setFollowUpDate] = useState('');
  const [priority, setPriority] = useState<LeadPriority>('Medium');
  const [notes, setNotes] = useState('');

  // Computations
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || l.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const totalExpectedRevenue = filteredLeads.reduce((acc, curr) => acc + curr.expectedRevenue, 0);

  const openAddModal = () => {
    // Default to first customer if available
    setCustomerName(customers[0]?.fullName || customers[0]?.companyName || '');
    setSource('Website Form');
    setStatus('New');
    setExpectedRevenue(5000);
    // Default follow up to 7 days in future
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setFollowUpDate(d.toISOString().split('T')[0]);
    setPriority('Medium');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) {
      alert('A valid associated customer or organization name is required.');
      return;
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customerName,
      source,
      status,
      expectedRevenue: Number(expectedRevenue),
      followUpDate,
      priority,
      notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddLead(newLead);
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    onEditLead(editForm);
    setIsEditOpen(false);
    setEditForm(null);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      onDeleteLead(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Leads & Inbounds
          </h1>
          <p className="text-sm text-slate-400 mt-1">Acquisition channels, prioritization filters, and potential deal values</p>
        </div>

        <button
          onClick={openAddModal}
          id="btn-add-lead"
          className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Top statistics banners */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtered Pipeline Value</div>
          <div className="text-xl font-bold text-slate-100 mt-1">{currency}{totalExpectedRevenue.toLocaleString()}</div>
        </div>
        <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unresolved Leads</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{filteredLeads.filter(l => l.status === 'New' || l.status === 'Contacted').length}</div>
        </div>
        <div className="col-span-2 sm:col-span-1 backdrop-blur-md bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">High Priority Actions</div>
          <div className="text-xl font-bold text-red-400 mt-1">{filteredLeads.filter(l => l.priority === 'High').length}</div>
        </div>
      </div>

      {/* Filters Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-11 pr-4 py-2.5 text-slate-100 outline-none text-sm transition-all"
            placeholder="Search leads by customer name or source..."
          />
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-950/60 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-slate-300 text-xs outline-none cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority Only</option>
          <option value="Medium">Medium Priority Only</option>
          <option value="Low">Low Priority Only</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950/60 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2.5 text-slate-300 text-xs outline-none cursor-pointer"
        >
          <option value="All">All Lead Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Nurturing">Nurturing</option>
          <option value="Qualified">Qualified</option>
        </select>
      </div>

      {/* Grid List of Leads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map(lead => (
          <div
            key={lead.id}
            className="backdrop-blur-md bg-slate-900/30 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl relative overflow-hidden group transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-purple-400 transition-colors">{lead.customerName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Source: {lead.source}</p>
                </div>
              </div>

              {/* Priority Tag */}
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                lead.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                lead.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {lead.priority}
              </span>
            </div>

            {/* Financial & Status Data grids */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950/40 p-3.5 border border-slate-800 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[9px] tracking-wide">Expected Value</span>
                <span className="text-slate-200 font-bold text-sm mt-1 block">{currency}{lead.expectedRevenue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block uppercase text-[9px] tracking-wide">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold mt-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span> {lead.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Follow-up: <span className="font-semibold text-slate-300">{lead.followUpDate}</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditForm(lead); setIsEditOpen(true); }}
                  className="p-1.5 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-purple-400 rounded-lg border border-slate-800 transition-colors"
                  title="Modify Lead"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteClick(lead.id)}
                  className="p-1.5 bg-slate-950/40 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-800 hover:border-red-900/50 transition-colors"
                  title="Delete Lead"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {lead.notes && (
              <p className="mt-3 text-slate-400 text-xs border-t border-slate-800/60 pt-3 leading-relaxed italic">
                {lead.notes}
              </p>
            )}
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 text-sm">
            No active leads found matching filters.
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
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
              <Plus className="w-5 h-5 text-indigo-500" /> Register Inbound Lead
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Connected Account / Customer Name *</label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                  required
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.fullName}>{c.fullName} ({c.companyName || 'No Company'})</option>
                  ))}
                  {customers.length === 0 && (
                    <option value="">-- No Customers registered --</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Acquisition Source</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    placeholder="e.g. LinkedIn, Referral"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Expected Revenue ({currency})</label>
                  <input
                    type="number"
                    value={expectedRevenue}
                    onChange={(e) => setExpectedRevenue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Follow-up Due Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as LeadPriority)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Lead Progress Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  <option value="New">New Inbound</option>
                  <option value="Contacted">Contact Conducted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Nurturing">Nurturing Flow</option>
                  <option value="Qualified">Qualified Prospect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Brief Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                  placeholder="Summarize key talking points or user needs..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm & Write Lead Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
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
              <Edit2 className="w-5 h-5 text-indigo-500" /> Edit Lead opportunity
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Customer Name</label>
                <input
                  type="text"
                  value={editForm.customerName}
                  disabled
                  className="w-full bg-slate-950 border border-slate-850 text-slate-400 rounded-xl px-3.5 py-2 text-sm outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Acquisition Source</label>
                  <input
                    type="text"
                    value={editForm.source}
                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Expected Revenue ({currency})</label>
                  <input
                    type="number"
                    value={editForm.expectedRevenue}
                    onChange={(e) => setEditForm({ ...editForm, expectedRevenue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Follow-up Due Date</label>
                  <input
                    type="date"
                    value={editForm.followUpDate}
                    onChange={(e) => setEditForm({ ...editForm, followUpDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as LeadPriority })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Lead Progress Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as LeadStatus })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  <option value="New">New Inbound</option>
                  <option value="Contacted">Contact Conducted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Nurturing">Nurturing Flow</option>
                  <option value="Qualified">Qualified Prospect</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Brief Notes</label>
                <textarea
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm & Overwrite Lead Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
