import React, { useState } from 'react';
import { 
  Users, Search, UserPlus, Edit2, Trash2, Mail, Phone, Building2, MapPin, Plus, 
  CheckCircle2, Folder, Clock, Calendar, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, CustomerStatus } from '../types';

interface CustomersSectionProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  subView: string;
}

export default function CustomersSection({
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  subView
}: CustomersSectionProps) {
  // Filters and queries
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Input states for Add / Edit
  const [isAddMode, setIsAddMode] = useState(false);
  const [editCustId, setEditCustId] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Prospect');
  const [notes, setNotes] = useState('');
  const [owner, setOwner] = useState('Marcus Chen');
  const [salesExecutive, setSalesExecutive] = useState('Elena Rostova');
  const [leadSource, setLeadSource] = useState<any>('Website');
  const [stage, setStage] = useState<any>('New');
  const [lastFollowUp, setLastFollowUp] = useState(new Date().toISOString().split('T')[0]);
  const [nextFollowUp, setNextFollowUp] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [createdAtState, setCreatedAtState] = useState('');

  // Search filter calculation
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setAddress('');
    setStatus('Prospect');
    setNotes('');
    setOwner('Marcus Chen');
    setSalesExecutive('Elena Rostova');
    setLeadSource('Website');
    setStage('New');
    setLastFollowUp(new Date().toISOString().split('T')[0]);
    setNextFollowUp(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setCreatedAtState('');
    setEditCustId(null);
    setIsAddMode(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Full Name and Email are mandatory.');
      return;
    }

    if (editCustId) {
      // Edit mode
      onEditCustomer({
        id: editCustId,
        fullName,
        phone,
        email,
        companyName,
        address,
        status,
        notes,
        createdAt: createdAtState || new Date().toISOString().split('T')[0],
        owner,
        salesExecutive,
        leadSource,
        stage,
        lastFollowUp,
        nextFollowUp
      });
    } else {
      // Create mode
      onAddCustomer({
        id: `cust-${Date.now()}`,
        fullName,
        phone,
        email,
        companyName,
        address,
        status,
        notes,
        createdAt: new Date().toISOString().split('T')[0],
        owner,
        salesExecutive,
        leadSource,
        stage,
        lastFollowUp,
        nextFollowUp
      });
    }
    resetForm();
  };

  const startEdit = (cust: Customer) => {
    setFullName(cust.fullName);
    setPhone(cust.phone);
    setEmail(cust.email);
    setCompanyName(cust.companyName);
    setAddress(cust.address);
    setStatus(cust.status);
    setNotes(cust.notes);
    setOwner(cust.owner || 'Marcus Chen');
    setSalesExecutive(cust.salesExecutive || 'Elena Rostova');
    setLeadSource(cust.leadSource || 'Website');
    setStage(cust.stage || 'New');
    setLastFollowUp(cust.lastFollowUp || cust.createdAt || new Date().toISOString().split('T')[0]);
    setNextFollowUp(cust.nextFollowUp || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setCreatedAtState(cust.createdAt);
    setEditCustId(cust.id);
    setIsAddMode(true);
  };

  return (
    <div className="space-y-6">
      
      {/* ==========================================
          SUB-VIEW: ALL CUSTOMERS
          ========================================== */}
      {(subView === 'customers-all' || subView === 'customers-add' && !isAddMode) && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                CUSTOMER LEDGER <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DATABASE</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Audit, edit, and filter corporate and private clients.</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsAddMode(true);
              }}
              className="px-4 py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
            >
              <UserPlus className="w-4 h-4" /> ADD CLIENT CARD
            </button>
          </div>

          {/* Form Expansion if requested */}
          {isAddMode && (
            <div className="backdrop-blur-xl bg-zinc-950/60 border border-yellow-400/30 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  {editCustId ? 'Modify Selected Client' : 'Onboard New Customer Card'}
                </h3>
                <button onClick={resetForm} className="text-zinc-500 hover:text-white text-xs font-mono">✕ CANCEL</button>
              </div>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Full Name *</label>
                  <input 
                    type="text" required placeholder="E.g. Sarah Connor" value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Email Address *</label>
                  <input 
                    type="email" required placeholder="E.g. sarah@cyberdyne.io" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Phone Number</label>
                  <input 
                    type="text" placeholder="+1 (555) 019-2831" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Company Entity</label>
                  <input 
                    type="text" placeholder="Cyberdyne Systems" value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Physical Address</label>
                  <input 
                    type="text" placeholder="101 Tech Way, Los Angeles, CA" value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Subscription Status</label>
                  <select 
                    value={status} onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  >
                    <option value="Prospect">Prospect</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Account Owner</label>
                  <select 
                    value={owner} onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  >
                    <option value="Marcus Chen">Marcus Chen</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                    <option value="Habeeb Rahman">Habeeb Rahman</option>
                    <option value="David Smith">David Smith</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Sales Executive</label>
                  <select 
                    value={salesExecutive} onChange={(e) => setSalesExecutive(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  >
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Marcus Chen">Marcus Chen</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                    <option value="Habeeb Rahman">Habeeb Rahman</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Lead Source</label>
                  <select 
                    value={leadSource} onChange={(e) => setLeadSource(e.target.value as any)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Stage</label>
                  <select 
                    value={stage} onChange={(e) => setStage(e.target.value as any)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Last Follow-up</label>
                  <input 
                    type="date" value={lastFollowUp} onChange={(e) => setLastFollowUp(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Next Follow-up</label>
                  <input 
                    type="date" value={nextFollowUp} onChange={(e) => setNextFollowUp(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] text-zinc-400 uppercase font-mono">Strategic Notes</label>
                  <textarea 
                    placeholder="Enter customer details, preferred contact schedule..." value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl p-3 text-xs outline-none focus:border-yellow-400/50 h-20 resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer md:col-span-2"
                >
                  {editCustId ? 'SAVE AND UPDATE CLIENT' : 'EXECUTE CUSTOMER ONBOARDING'}
                </button>
              </form>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-950/40 p-4 border border-zinc-900 rounded-2xl">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search ledger by name, email, company..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-yellow-400/40"
              />
            </div>
            
            <div className="flex gap-1.5 self-stretch sm:self-auto">
              {['All', 'Active', 'Prospect', 'Inactive'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === st 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-zinc-900 text-zinc-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Customers Table / Grid */}
          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    <th className="p-4 font-bold">Customer</th>
                    <th className="p-4 font-bold">Company</th>
                    <th className="p-4 font-bold">Contact</th>
                    <th className="p-4 font-bold">Owner</th>
                    <th className="p-4 font-bold">Sales Executive</th>
                    <th className="p-4 font-bold">Lead Source</th>
                    <th className="p-4 font-bold">Stage</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold">Last Follow-up</th>
                    <th className="p-4 font-bold">Next Follow-up</th>
                    <th className="p-4 font-bold">Created Date</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/70 text-xs">
                  {filteredCustomers.map(cust => (
                    <tr key={cust.id} className="hover:bg-zinc-900/20 transition-all">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 flex items-center justify-center font-bold text-xs uppercase font-mono">
                            {cust.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-snug">{cust.fullName}</p>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5" title={cust.notes}>ID: {cust.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-zinc-300 font-semibold">{cust.companyName || 'Private client'}</span>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{cust.address || 'No registered location'}</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="text-zinc-300 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-zinc-500" />
                            <span>{cust.email}</span>
                          </p>
                          {cust.phone && (
                            <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-zinc-500" />
                              <span>{cust.phone}</span>
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 flex items-center justify-center font-bold font-mono">
                            {cust.owner ? cust.owner.split(' ').map(n => n[0]).join('').slice(0, 2) : 'MC'}
                          </div>
                          <span className="text-zinc-300 font-medium">{cust.owner || 'Marcus Chen'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-center font-bold font-mono">
                            {cust.salesExecutive ? cust.salesExecutive.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ER'}
                          </div>
                          <span className="text-zinc-400 font-medium">{cust.salesExecutive || 'Elena Rostova'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[9px] font-bold rounded-lg font-mono border ${
                          cust.leadSource === 'Website' ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/20' :
                          cust.leadSource === 'Referral' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                          cust.leadSource === 'LinkedIn' ? 'bg-blue-950/30 text-blue-400 border-blue-900/20' :
                          cust.leadSource === 'Facebook' ? 'bg-sky-950/30 text-sky-400 border-sky-900/20' :
                          cust.leadSource === 'Google Ads' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/20' :
                          cust.leadSource === 'Cold Call' ? 'bg-orange-950/30 text-orange-400 border-orange-900/20' :
                          'bg-purple-950/30 text-purple-400 border-purple-900/20' // Email Campaign
                        }`}>
                          {cust.leadSource || 'Website'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[9px] font-black rounded-full font-mono uppercase tracking-wide border ${
                          cust.stage === 'New' ? 'bg-blue-950/30 text-blue-400 border-blue-900/20' :
                          cust.stage === 'Contacted' ? 'bg-sky-950/30 text-sky-400 border-sky-900/20' :
                          cust.stage === 'Qualified' ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/20' :
                          cust.stage === 'Proposal Sent' ? 'bg-purple-950/30 text-purple-400 border-purple-900/20' :
                          cust.stage === 'Negotiation' ? 'bg-amber-950/30 text-amber-400 border-amber-900/20' :
                          cust.stage === 'Won' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                          cust.stage === 'Lost' ? 'bg-rose-950/30 text-rose-400 border-rose-900/20' :
                          'bg-zinc-900 text-zinc-400 border-zinc-800' // On Hold
                        }`}>
                          {cust.stage || 'New'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[9px] font-black rounded-full font-mono uppercase tracking-wide border ${
                          cust.status === 'Active' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                          cust.status === 'Prospect' ? 'bg-amber-950/30 text-amber-400 border-amber-900/20' :
                          'bg-zinc-900 text-zinc-400 border-zinc-800' // Inactive
                        }`}>
                          {cust.status || 'Prospect'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{cust.lastFollowUp || cust.createdAt || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-yellow-500" />
                          <span>{cust.nextFollowUp || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-500 font-mono text-xs">
                        <span>{cust.createdAt}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => startEdit(cust)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-yellow-400 rounded-lg transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm(`Delete client record for ${cust.fullName}?`)) {
                                onDeleteCustomer(cust.id);
                              }
                            }}
                            className="p-1.5 hover:bg-red-950/30 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-zinc-500 font-mono">
                        No clients located within current search parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: CUSTOMER GROUPS
          ========================================== */}
      {subView === 'customers-groups' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              CLIENT COHORTS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">SEGMENTATION</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Group clients dynamically to deliver target newsletters and campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* VIP ENTERPRISE */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-xs font-black text-yellow-400 font-mono uppercase tracking-wider">Enterprise VIP</span>
                <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded font-bold font-mono">
                  {customers.filter(c => c.status === 'Active' && c.companyName).length} clients
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Strategic corporate entities that contribute the majority of recurring software revenues. Handled by Account Executives.
              </p>
            </div>

            {/* SME / STARTUP */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-xs font-black text-white font-mono uppercase tracking-wider">SME / Startup</span>
                <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded font-bold font-mono">
                  {customers.filter(c => c.status === 'Prospect').length} clients
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Highly active prospective customers interested in volume discounts and customized platform expansion modules.
              </p>
            </div>

            {/* STRATEGIC PARTNERS */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg space-y-3">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <span className="text-xs font-black text-zinc-500 font-mono uppercase tracking-wider">Strategic Partners</span>
                <span className="text-[10px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded font-bold font-mono">
                  {customers.filter(c => c.status === 'Inactive').length} clients
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Paused or inactive customer segments compiled for potential feedback surveys or promotional discount reactivation campaigns.
              </p>
            </div>

          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: CUSTOMER TIMELINE
          ========================================== */}
      {subView === 'customers-timeline' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              CLIENT HISTORY TIMELINE <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">JOURNEY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Chronological touchpoints, account setup, and conversion logs of registered entities.</p>
          </div>

          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-6">
            <div className="relative border-l border-zinc-800 ml-4 pl-6 space-y-6">
              
              {customers.slice(0, 5).map((cust, idx) => (
                <div key={cust.id} className="relative">
                  <div className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 bg-yellow-400 text-black font-black text-[9px] rounded-full flex items-center justify-center font-mono border-4 border-black">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
                      {cust.createdAt}
                    </span>
                    <h4 className="text-xs font-extrabold text-white mt-1">Onboarded: {cust.fullName}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      New record logged for <strong className="text-yellow-400">{cust.companyName || 'Private client'}</strong>. Status configured as <span className="underline">{cust.status}</span>.
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
