import React, { useState } from 'react';
import { Search, UserPlus, FileDown, FileUp, Edit2, Trash2, Eye, X, Phone, Mail, Building2, MapPin, Check, Plus } from 'lucide-react';
import { Customer, CustomerStatus, Lead, Deal, Task } from '../types';
import { exportCustomersToCsv, parseCustomersCsv } from '../crmData';

interface CustomersProps {
  customers: Customer[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  onAddCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onImportCustomers: (imported: Partial<Customer>[]) => void;
  currency: string;
}

export default function Customers({
  customers,
  leads,
  deals,
  tasks,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onImportCustomers,
  currency
}: CustomersProps) {
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Detail sidebar state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add / Edit Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Customer | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('Prospect');
  const [notes, setNotes] = useState('');

  // Search/Filter computation
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle opening add modal
  const openAddModal = () => {
    setFullName('');
    setPhone('');
    setEmail('');
    setCompanyName('');
    setAddress('');
    setStatus('Prospect');
    setNotes('');
    setIsAddOpen(true);
  };

  // Handle Add Customer Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Full Name and Email Address are required.');
      return;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      fullName,
      phone,
      email,
      companyName,
      address,
      status,
      notes,
      createdAt: new Date().toISOString().split('T')[0],
      owner: 'Marcus Chen',
      salesExecutive: 'Elena Rostova',
      leadSource: 'Website',
      stage: 'New',
      lastFollowUp: new Date().toISOString().split('T')[0],
      nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onAddCustomer(newCust);
    setIsAddOpen(false);
  };

  // Handle opening edit modal
  const openEditModal = (cust: Customer, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening detail page
    setEditForm(cust);
    setIsEditOpen(true);
  };

  // Handle Edit Customer Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    onEditCustomer(editForm);
    setIsEditOpen(false);
    setEditForm(null);
  };

  // Handle Deleting customer
  const handleDeleteClick = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to permanently delete customer ${name}?`)) {
      onDeleteCustomer(id);
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    }
  };

  // Handle CSV Import
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCustomersCsv(text);
      if (parsed.length > 0) {
        onImportCustomers(parsed);
        alert(`Successfully imported ${parsed.length} customers!`);
      } else {
        alert('Could not find any valid customer entries in CSV. Ensure columns include Name and Email.');
      }
    };
    reader.readAsText(file);
  };

  // Connected data for Detail view
  const customerLeads = selectedCustomer 
    ? leads.filter(l => l.customerName.toLowerCase() === selectedCustomer.fullName.toLowerCase() || l.customerName.toLowerCase() === selectedCustomer.companyName.toLowerCase())
    : [];

  const customerDeals = selectedCustomer
    ? deals.filter(d => d.customerName.toLowerCase() === selectedCustomer.fullName.toLowerCase() || d.customerName.toLowerCase() === selectedCustomer.companyName.toLowerCase())
    : [];

  const customerTasks = selectedCustomer
    ? tasks.filter(t => t.customerName.toLowerCase() === selectedCustomer.fullName.toLowerCase() || t.customerName.toLowerCase() === selectedCustomer.companyName.toLowerCase())
    : [];

  return (
    <div className="space-y-6 relative">
      {/* Directory Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Customers & Accounts
          </h1>
          <p className="text-sm text-slate-400 mt-1">Full lifecycle customer directory with quick search and contact actions</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Button */}
          <button
            onClick={() => exportCustomersToCsv(customers)}
            id="btn-export-csv"
            className="px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-purple-400" /> Export CSV
          </button>

          {/* Import Label and Button */}
          <label
            id="btn-import-csv"
            className="px-3.5 py-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileUp className="w-4 h-4 text-indigo-400" /> Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
            />
          </label>

          {/* Add Customer Button */}
          <button
            onClick={openAddModal}
            id="btn-add-customer"
            className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800/60 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pl-11 pr-4 py-2.5 text-slate-100 outline-none text-sm transition-all"
            placeholder="Search by full name, email or company..."
          />
        </div>

        {/* Filter Status */}
        <div className="flex gap-1 bg-slate-950/60 p-1 border border-slate-800 rounded-xl">
          {['All', 'Active', 'Prospect', 'Inactive'].map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => setStatusFilter(statusOption)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                statusFilter === statusOption 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {statusOption}
            </button>
          ))}
        </div>
      </div>

      {/* Customer List Directory Table */}
      <div className="backdrop-blur-md bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/60 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/20">
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {filteredCustomers.map(cust => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="hover:bg-slate-900/40 transition-colors cursor-pointer group"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 border border-purple-500/10 flex items-center justify-center font-bold text-purple-400 text-xs uppercase shrink-0">
                        {cust.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 group-hover:text-purple-400 transition-colors">{cust.fullName}</div>
                        <div className="text-xs text-slate-500">{cust.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {cust.companyName || <span className="text-slate-600">No Company</span>}
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="text-slate-300 text-xs">{cust.email}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{cust.phone || 'No phone'}</div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                      cust.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      cust.status === 'Prospect' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {cust.status}
                    </span>
                  </td>

                  {/* Created At */}
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                    {cust.createdAt}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedCustomer(cust); }}
                        className="p-2 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg border border-slate-800 transition-colors"
                        title="View Detailed Records"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => openEditModal(cust, e)}
                        className="p-2 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-purple-400 rounded-lg border border-slate-800 transition-colors"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(cust.id, cust.fullName, e)}
                        className="p-2 bg-slate-950/40 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded-lg border border-slate-800 hover:border-red-900/50 transition-colors"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No customers found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Overlay (Satisfies "Customer Details Page") */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl p-6 relative flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer Details Panel</span>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 bg-slate-950/40 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Contact Card */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                  {selectedCustomer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-100">{selectedCustomer.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedCustomer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      selectedCustomer.status === 'Prospect' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {selectedCustomer.status}
                    </span>
                    <span className="text-xs text-slate-500">• Added {selectedCustomer.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Grid Profile info fields */}
              <div className="space-y-4 bg-slate-950/40 border border-slate-800 p-4 rounded-2xl mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                  <div className="grid grid-cols-3 w-full">
                    <span className="text-slate-400 font-medium">Company</span>
                    <span className="col-span-2 text-slate-200 font-semibold">{selectedCustomer.companyName || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                  <div className="grid grid-cols-3 w-full">
                    <span className="text-slate-400 font-medium">Email</span>
                    <span className="col-span-2 text-slate-200 font-semibold truncate hover:underline">{selectedCustomer.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                  <div className="grid grid-cols-3 w-full">
                    <span className="text-slate-400 font-medium">Phone</span>
                    <span className="col-span-2 text-slate-200 font-semibold">{selectedCustomer.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                  <div className="grid grid-cols-3 w-full">
                    <span className="text-slate-400 font-medium">Address</span>
                    <span className="col-span-2 text-slate-200 text-xs font-semibold leading-relaxed">{selectedCustomer.address || 'No Address Listed'}</span>
                  </div>
                </div>
              </div>

              {/* Profile Notes */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Notes</h3>
                <div className="bg-slate-950/30 border border-slate-800/80 p-3.5 rounded-xl text-slate-300 text-xs leading-relaxed italic">
                  {selectedCustomer.notes || 'No notes currently written.'}
                </div>
              </div>

              {/* Connected Relationships metrics */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Opportunities</h3>
                
                {/* Linked Leads count */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                    <div className="text-sm font-bold text-indigo-400">{customerLeads.length}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Active Leads</div>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                    <div className="text-sm font-bold text-amber-400">{customerDeals.length}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Total Deals</div>
                  </div>
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                    <div className="text-sm font-bold text-purple-400">{customerTasks.length}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Total Tasks</div>
                  </div>
                </div>

                {/* Micro Deals table */}
                {customerDeals.length > 0 && (
                  <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/20 text-xs">
                    <div className="font-bold text-slate-300 mb-2">Linked Deals</div>
                    <div className="space-y-1">
                      {customerDeals.map(d => (
                        <div key={d.id} className="flex justify-between items-center text-slate-400 p-1 hover:bg-slate-850 rounded">
                          <span>{d.title}</span>
                          <span className="font-bold text-emerald-400">{currency}{d.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-8">
              <button
                onClick={(e) => { openEditModal(selectedCustomer, e); }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-purple-400" /> Edit Customer Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
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
              <Plus className="w-5 h-5 text-purple-500" /> Add New Customer
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  placeholder="Jane Miller"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    placeholder="jane@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  placeholder="Miller Design Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Physical Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                  placeholder="742 Evergreen Terrace, Springfield"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Account Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  <option value="Active">Active Relationship</option>
                  <option value="Prospect">Leaning Prospect</option>
                  <option value="Inactive">Paused / Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Private Memo / Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                  placeholder="E.g. Met at expo conference. High enthusiasm."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Confirm & Write Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
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
              <Edit2 className="w-5 h-5 text-purple-500" /> Modify Customer Record
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={editForm.companyName}
                  onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Physical Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Account Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as CustomerStatus })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  <option value="Active">Active Relationship</option>
                  <option value="Prospect">Leaning Prospect</option>
                  <option value="Inactive">Paused / Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Private Memo / Notes</label>
                <textarea
                  value={editForm.notes}
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
                  Confirm & Overwrite Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
