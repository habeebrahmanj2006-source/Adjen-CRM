import React, { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Edit2, Trash2, Mail, Phone, Building2, MapPin, Plus, 
  CheckCircle2, Folder, Clock, Calendar, ArrowRight, ShieldCheck, ChevronRight,
  ChevronLeft, ArrowLeft, Filter, Check, X, ChevronDown, Download, UserCheck, 
  Activity, File, Upload, ShieldAlert, AlertCircle, MoreVertical, ExternalLink, RefreshCw,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Customer, CustomerStatus, CustomerStage, LeadSourceType, User as UserType, Lead, Deal, Task } from '../types';

interface SalesExecutiveCustomersProps {
  currentUser: UserType | null;
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
}

// Helper to get initials
const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

// Helper to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateString;
  }
};

// Helper to check overdue
const isOverdue = (dateString: string) => {
  if (!dateString) return false;
  try {
    const today = new Date('2026-07-02');
    const d = new Date(dateString);
    return d < today;
  } catch {
    return false;
  }
};

export default function SalesExecutiveCustomers({
  currentUser,
  customers,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  leads,
  deals,
  tasks
}: SalesExecutiveCustomersProps) {
  // --- 1. SELECTION & TABS ---
  const [selectedDetailedCustomerId, setSelectedDetailedCustomerId] = useState<string | null>(null);
  const [activeDetailsTab, setActiveDetailsTab] = useState<'timeline' | 'followups' | 'notes' | 'documents'>('timeline');

  // --- 2. SEARCH & FILTERS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');

  // --- 3. SORTING ---
  const [sortColumn, setSortColumn] = useState<string>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // --- 4. PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // --- 5. ROW SELECTION & BULK ACTIONS ---
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRep, setBulkRep] = useState('');
  const [bulkStage, setBulkStage] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  // --- 6. MODALS / INTERACTION STATES ---
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCustData, setEditCustData] = useState<Customer | null>(null);

  const [isAddFollowUpOpen, setIsAddFollowUpOpen] = useState(false);
  const [followUpCust, setFollowUpCust] = useState<Customer | null>(null);
  const [newFollowUpDate, setNewFollowUpDate] = useState('');
  const [newFollowUpType, setNewFollowUpType] = useState('Call');
  const [newFollowUpNote, setNewFollowUpNote] = useState('');

  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailCust, setEmailCust] = useState<Customer | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callCust, setCallCust] = useState<Customer | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callNote, setCallNote] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // --- 7. PERSISTED CUSTOMER DETAILS (Notes, Timeline, Docs, Followups) ---
  const [extraDataRefresh, setExtraDataRefresh] = useState(0);
  
  const getCustomerExtra = (id: string, cust: Customer) => {
    const key = `adjen_crm_extra_${id}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    const defaultExtra = {
      notes: [
        { id: 'n-1', body: cust.notes || 'Onboarded into CRM.', date: cust.createdAt || '2026-01-15', author: cust.owner || 'Marcus Chen' }
      ],
      documents: [
        { id: 'doc-1', name: 'SLA_Contract_Draft.pdf', size: '2.4 MB', type: 'PDF', date: cust.createdAt || '2026-01-15' },
        { id: 'doc-2', name: 'Requirements_Discovery.docx', size: '1.2 MB', type: 'DOCX', date: cust.createdAt || '2026-01-15' }
      ],
      followups: [
        { id: 'f-1', date: cust.lastFollowUp || '2026-06-20', note: 'Initial requirement elicitation call completed.', type: 'Call', status: 'Completed' }
      ],
      timeline: [
        { id: 't-1', type: 'System', description: 'Account registered in central CRM ledger.', date: cust.createdAt || '2026-01-15', author: 'System' },
        { id: 't-2', type: 'Call', description: 'Completed discovery phone call. Logged initial notes.', date: cust.lastFollowUp || '2026-06-20', author: cust.salesExecutive || 'Elena Rostova' }
      ]
    };
    localStorage.setItem(key, JSON.stringify(defaultExtra));
    return defaultExtra;
  };

  const saveCustomerExtra = (id: string, data: any) => {
    localStorage.setItem(`adjen_crm_extra_${id}`, JSON.stringify(data));
    setExtraDataRefresh(prev => prev + 1);
  };

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (isCallActive) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCallActive]);

  // --- 8. ROW FILTERING, SORTING, PAGINATION ---
  const myAssignedCustomers = customers.filter(c => c.salesExecutive === currentUser?.fullName);

  const filtered = myAssignedCustomers.filter(c => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      c.fullName.toLowerCase().includes(query) ||
      c.companyName.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query);

    const matchesStage = stageFilter === 'All' || c.stage === stageFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || c.leadSource === sourceFilter;

    let matchesDate = true;
    if (dateFilter !== 'All' && c.createdAt) {
      const today = new Date('2026-07-02');
      const itemDate = new Date(c.createdAt);
      const diffTime = Math.abs(today.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'Today') matchesDate = diffDays <= 1;
      else if (dateFilter === 'Last7') matchesDate = diffDays <= 7;
      else if (dateFilter === 'Last30') matchesDate = diffDays <= 30;
      else if (dateFilter === 'Last90') matchesDate = diffDays <= 90;
    }

    return matchesSearch && matchesStage && matchesStatus && matchesSource && matchesDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA: any = a[sortColumn as keyof Customer] || '';
    let valB: any = b[sortColumn as keyof Customer] || '';

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalRecords = sorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginated.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  // --- 9. CRUD ACTIONS ---
  // Add Customer Form states
  const [addName, setAddName] = useState('');
  const [addCompany, setAddCompany] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addAddress, setAddAddress] = useState('');
  const [addStage, setAddStage] = useState<CustomerStage>('New');
  const [addStatus, setAddStatus] = useState<CustomerStatus>('Prospect');
  const [addSource, setAddSource] = useState<LeadSourceType>('Website');
  const [addOwner, setAddOwner] = useState('Marcus Chen');
  const [addNotes, setAddNotes] = useState('');
  
  // Upgraded fields state
  const [addAlternativePhone, setAddAlternativePhone] = useState('');
  const [addWebsite, setAddWebsite] = useState('');
  const [addCity, setAddCity] = useState('');
  const [addState, setAddState] = useState('');
  const [addCountry, setAddCountry] = useState('');
  const [addPostalCode, setAddPostalCode] = useState('');
  const [addIndustry, setAddIndustry] = useState('');
  const [addPriority, setAddPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [addNextFollowUp, setAddNextFollowUp] = useState('');
  const [addAndAnother, setAddAndAnother] = useState(false);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addCompany || !addEmail || !addPhone) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const nextFollowUpDateString = addNextFollowUp || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      fullName: addName,
      companyName: addCompany,
      email: addEmail,
      phone: addPhone,
      address: addAddress,
      stage: addStage,
      status: addStatus,
      leadSource: addSource,
      owner: addOwner,
      salesExecutive: currentUser?.fullName || 'Elena Rostova',
      notes: addNotes,
      createdAt: new Date().toISOString().split('T')[0],
      lastFollowUp: new Date().toISOString().split('T')[0],
      nextFollowUp: nextFollowUpDateString,
      alternativePhone: addAlternativePhone,
      companyWebsite: addWebsite,
      city: addCity,
      state: addState,
      country: addCountry,
      postalCode: addPostalCode,
      industry: addIndustry,
      priority: addPriority
    };

    onAddCustomer(newCust);

    // Automatically seed extra records (notes, documents, followups, timeline)
    const customExtra = {
      notes: [
        { id: `n-${Date.now()}`, body: addNotes || 'Onboarded into CRM.', date: new Date().toISOString().split('T')[0], author: currentUser?.fullName || 'System' }
      ],
      documents: [
        { id: 'doc-1', name: 'SLA_Contract_Draft.pdf', size: '2.4 MB', type: 'PDF', date: new Date().toISOString().split('T')[0] },
        { id: 'doc-2', name: 'Requirements_Discovery.docx', size: '1.2 MB', type: 'DOCX', date: new Date().toISOString().split('T')[0] }
      ],
      followups: addNextFollowUp ? [
        { id: `f-${Date.now()}`, date: addNextFollowUp, note: 'Scheduled next touchpoint.', type: 'Call', status: 'Scheduled' }
      ] : [],
      timeline: [
        { id: `t-sys-${Date.now()}`, type: 'System', description: 'Account registered in central CRM ledger.', date: new Date().toISOString().split('T')[0], author: 'System' },
        ...(addNextFollowUp ? [{ id: `t-follow-${Date.now()}`, type: 'Follow-up', description: `Scheduled next follow-up call for ${addNextFollowUp}`, date: new Date().toISOString().split('T')[0], author: currentUser?.fullName || 'System' }] : [])
      ]
    };
    localStorage.setItem(`adjen_crm_extra_${newCust.id}`, JSON.stringify(customExtra));

    // Clear form states
    setAddName('');
    setAddCompany('');
    setAddEmail('');
    setAddPhone('');
    setAddAddress('');
    setAddNotes('');
    setAddAlternativePhone('');
    setAddWebsite('');
    setAddCity('');
    setAddState('');
    setAddCountry('');
    setAddPostalCode('');
    setAddIndustry('');
    setAddPriority('Medium');
    setAddNextFollowUp('');

    if (addAndAnother) {
      alert(`Customer "${newCust.fullName}" has been created successfully. You can now add another customer.`);
    } else {
      setIsAddOpen(false);
    }
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustData) return;
    onEditCustomer(editCustData);
    setIsEditOpen(false);
    setEditCustData(null);
  };

  const handleDeleteIndividual = (id: string) => {
    const hasPermission = currentUser?.role === 'Manager' || currentUser?.role === 'Super Admin' || currentUser?.role === 'Managing Director';
    if (!hasPermission) {
      setIsPermissionModalOpen(true);
      return;
    }
    if (confirm('Are you sure you want to delete this customer record?')) {
      onDeleteCustomer(id);
      setSelectedDetailedCustomerId(null);
    }
  };

  // --- 10. BULK OPERATIONS ---
  const handleBulkAssign = (rep: string) => {
    if (!rep) return;
    selectedIds.forEach(id => {
      const c = customers.find(x => x.id === id);
      if (c) {
        onEditCustomer({ ...c, salesExecutive: rep });
      }
    });
    setSelectedIds([]);
    setBulkRep('');
    alert(`Reassigned selected accounts to ${rep}.`);
  };

  const handleBulkStage = (stage: CustomerStage) => {
    if (!stage) return;
    selectedIds.forEach(id => {
      const c = customers.find(x => x.id === id);
      if (c) {
        onEditCustomer({ ...c, stage });
        const extra = getCustomerExtra(id, c);
        extra.timeline.unshift({
          id: `t-bulk-${Date.now()}`,
          type: 'Transition',
          description: `Stage updated bulk-wise to ${stage}.`,
          date: new Date().toISOString().split('T')[0],
          author: currentUser?.fullName || 'System'
        });
        saveCustomerExtra(id, extra);
      }
    });
    setSelectedIds([]);
    setBulkStage('');
    alert(`Updated stage of selected accounts to ${stage}.`);
  };

  const handleBulkStatus = (status: CustomerStatus) => {
    if (!status) return;
    selectedIds.forEach(id => {
      const c = customers.find(x => x.id === id);
      if (c) {
        onEditCustomer({ ...c, status });
        const extra = getCustomerExtra(id, c);
        extra.timeline.unshift({
          id: `t-bulk-${Date.now()}`,
          type: 'Transition',
          description: `Status updated bulk-wise to ${status}.`,
          date: new Date().toISOString().split('T')[0],
          author: currentUser?.fullName || 'System'
        });
        saveCustomerExtra(id, extra);
      }
    });
    setSelectedIds([]);
    setBulkStatus('');
    alert(`Updated status of selected accounts to ${status}.`);
  };

  const handleBulkExport = () => {
    const selected = customers.filter(c => selectedIds.includes(c.id));
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(selected, null, 2)
    )}`;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', jsonString);
    anchor.setAttribute('download', `crm_bulk_export_${Date.now()}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setSelectedIds([]);
    alert('Downloaded export package.');
  };

  const handleBulkDelete = () => {
    const hasPermission = currentUser?.role === 'Manager' || currentUser?.role === 'Super Admin' || currentUser?.role === 'Managing Director';
    if (!hasPermission) {
      setIsPermissionModalOpen(true);
      return;
    }
    if (confirm(`Are you sure you want to purge ${selectedIds.length} customer accounts? This action is irreversible.`)) {
      selectedIds.forEach(id => onDeleteCustomer(id));
      setSelectedIds([]);
      alert('Selected customer cards removed.');
    }
  };

  // --- 11. DETAILED PROFILE HELPERS ---
  const detailedCust = customers.find(c => c.id === selectedDetailedCustomerId);
  const extra = detailedCust ? getCustomerExtra(detailedCust.id, detailedCust) : null;

  // Interactions logged locally
  const [detailNewNote, setDetailNewNote] = useState('');
  const handleAddDetailNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailNewNote || !detailedCust || !extra) return;
    const newNoteObj = {
      id: `n-${Date.now()}`,
      body: detailNewNote,
      date: new Date().toISOString().split('T')[0],
      author: currentUser?.fullName || 'Elena Rostova'
    };
    const updated = {
      ...extra,
      notes: [newNoteObj, ...extra.notes],
      timeline: [{
        id: `t-${Date.now()}`,
        type: 'Notes',
        description: `Logged a note: "${detailNewNote.substring(0, 45)}..."`,
        date: new Date().toISOString().split('T')[0],
        author: currentUser?.fullName || 'Elena Rostova'
      }, ...extra.timeline]
    };
    saveCustomerExtra(detailedCust.id, updated);
    setDetailNewNote('');
  };

  const [docNameInput, setDocNameInput] = useState('');
  const handleUploadDocumentSimulated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNameInput || !detailedCust || !extra) return;
    const newDocObj = {
      id: `doc-${Date.now()}`,
      name: docNameInput.endsWith('.pdf') || docNameInput.endsWith('.xlsx') || docNameInput.endsWith('.docx') ? docNameInput : `${docNameInput}.pdf`,
      size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`,
      type: 'PDF',
      date: new Date().toISOString().split('T')[0]
    };
    const updated = {
      ...extra,
      documents: [newDocObj, ...extra.documents],
      timeline: [{
        id: `t-${Date.now()}`,
        type: 'Document',
        description: `Attached document: "${newDocObj.name}"`,
        date: new Date().toISOString().split('T')[0],
        author: currentUser?.fullName || 'Elena Rostova'
      }, ...extra.timeline]
    };
    saveCustomerExtra(detailedCust.id, updated);
    setDocNameInput('');
    alert('Document added successfully.');
  };

  // Add Follow up Action
  const handleTriggerFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpCust || !newFollowUpDate) return;
    
    // Update Customer Next Follow-up
    onEditCustomer({
      ...followUpCust,
      nextFollowUp: newFollowUpDate,
      lastFollowUp: new Date().toISOString().split('T')[0]
    });

    // Save extra data log
    const extraInfo = getCustomerExtra(followUpCust.id, followUpCust);
    const newFollowUpLog = {
      id: `f-${Date.now()}`,
      date: newFollowUpDate,
      note: newFollowUpNote || 'Scheduled next touchpoint.',
      type: newFollowUpType,
      status: 'Scheduled'
    };
    
    const updatedExtra = {
      ...extraInfo,
      followups: [newFollowUpLog, ...extraInfo.followups],
      timeline: [{
        id: `t-${Date.now()}`,
        type: 'Follow-up',
        description: `Scheduled ${newFollowUpType} for ${newFollowUpDate}: "${newFollowUpNote || 'N/A'}"`,
        date: new Date().toISOString().split('T')[0],
        author: currentUser?.fullName || 'Elena Rostova'
      }, ...extraInfo.timeline]
    };

    saveCustomerExtra(followUpCust.id, updatedExtra);
    setIsAddFollowUpOpen(false);
    setFollowUpCust(null);
    setNewFollowUpDate('');
    setNewFollowUpNote('');
    alert('Follow-up scheduled and synchronized.');
  };

  // Email Action
  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCust || !emailSubject || !emailBody) return;

    // Save to extra timeline
    const extraInfo = getCustomerExtra(emailCust.id, emailCust);
    const updatedExtra = {
      ...extraInfo,
      timeline: [{
        id: `t-${Date.now()}`,
        type: 'Email',
        description: `Sent Email: Subject: "${emailSubject}" | Body: "${emailBody.substring(0, 60)}..."`,
        date: new Date().toISOString().split('T')[0],
        author: currentUser?.fullName || 'Elena Rostova'
      }, ...extraInfo.timeline]
    };

    saveCustomerExtra(emailCust.id, updatedExtra);
    setIsEmailOpen(false);
    setEmailCust(null);
    setEmailSubject('');
    setEmailBody('');
    alert('Simulation complete: Email dispatched securely via CRM outgoing relay.');
  };

  // Call Action
  const handleLogCallSubmit = () => {
    if (!callCust) return;
    
    // Save to timeline and followups
    const extraInfo = getCustomerExtra(callCust.id, callCust);
    const durationMin = Math.floor(callDuration / 60);
    const durationSec = callDuration % 60;
    const durationStr = `${durationMin}:${durationSec < 10 ? '0' : ''}${durationSec}`;

    const newCallLog = {
      id: `f-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      note: `Call duration: ${durationStr}. Summary: ${callNote || 'No summary notes logged.'}`,
      type: 'Call',
      status: 'Completed'
    };

    const updatedExtra = {
      ...extraInfo,
      followups: [newCallLog, ...extraInfo.followups],
      timeline: [{
        id: `t-${Date.now()}`,
        type: 'Call',
        description: `Completed outbound call (${durationStr}). Notes: "${callNote || 'None'}"`,
        date: new Date().toISOString().split('T')[0],
        author: currentUser?.fullName || 'Elena Rostova'
      }, ...extraInfo.timeline]
    };

    saveCustomerExtra(callCust.id, updatedExtra);
    setIsCallActive(false);
    setIsCallOpen(false);
    setCallCust(null);
    setCallNote('');
    alert('Call session completed and logs committed to database.');
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <AnimatePresence mode="wait">
        {!selectedDetailedCustomerId ? (
          <motion.div 
            key="list-header" 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                MY ASSIGNED CUSTOMERS <span className="text-yellow-400 font-mono text-xs border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">CLIENT DIRECTORY</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Directly manage accounts allocated to your active pipeline.</p>
            </div>
            <button 
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-yellow-400/10 self-start sm:self-auto font-mono uppercase"
            >
              <UserPlus className="w-4 h-4" />
              Add Customer
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="details-header" 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedDetailedCustomerId(null)}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">Customer Profile / ID: {detailedCust?.id}</span>
                <h1 className="text-2xl font-black text-white">{detailedCust?.fullName}</h1>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{detailedCust?.companyName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => { if (detailedCust) { setEditCustData(detailedCust); setIsEditOpen(true); } }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-yellow-400" />
                EDIT PROFILE
              </button>
              <button 
                onClick={() => { if (detailedCust) { setFollowUpCust(detailedCust); setNewFollowUpDate(detailedCust.nextFollowUp || ''); setIsAddFollowUpOpen(true); } }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                ADD FOLLOW-UP
              </button>
              <button 
                onClick={() => { if (detailedCust) { setEmailCust(detailedCust); setIsEmailOpen(true); } }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                SEND EMAIL
              </button>
              <button 
                onClick={() => { if (detailedCust) { setCallCust(detailedCust); setIsCallOpen(true); setIsCallActive(true); } }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-purple-400" />
                DIAL CUSTOMER
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- RENDER main LIST VIEW --- */}
      {!selectedDetailedCustomerId && (
        <div className="space-y-4">
          
          {/* SEARCH, FILTER & STATS CONTROL PANEL */}
          <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl space-y-3 shadow-md">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search text input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder="Search by Customer Name, Company, Email, or Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-850 focus:border-yellow-400/40 outline-none text-xs text-white rounded-xl pl-10 pr-4 py-2.5 transition-all font-mono"
                />
              </div>

              {/* Advanced filter select menus */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                {/* Stage */}
                <div className="flex items-center bg-zinc-900/50 border border-zinc-850 rounded-xl px-2.5">
                  <span className="text-zinc-500 mr-1.5 uppercase text-[9px] font-black">Stage:</span>
                  <select 
                    value={stageFilter} 
                    onChange={(e) => setStageFilter(e.target.value)}
                    className="bg-transparent text-zinc-300 outline-none cursor-pointer flex-1 py-2 font-bold"
                  >
                    <option value="All" className="bg-zinc-950 text-white">All</option>
                    <option value="New" className="bg-zinc-950 text-white">New</option>
                    <option value="Contacted" className="bg-zinc-950 text-white">Contacted</option>
                    <option value="Qualified" className="bg-zinc-950 text-white">Qualified</option>
                    <option value="Proposal Sent" className="bg-zinc-950 text-white">Proposal</option>
                    <option value="Negotiation" className="bg-zinc-950 text-white">Negotiation</option>
                    <option value="Won" className="bg-zinc-950 text-white">Won</option>
                    <option value="Lost" className="bg-zinc-950 text-white">Lost</option>
                    <option value="On Hold" className="bg-zinc-950 text-white">On Hold</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex items-center bg-zinc-900/50 border border-zinc-850 rounded-xl px-2.5">
                  <span className="text-zinc-500 mr-1.5 uppercase text-[9px] font-black">Status:</span>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-zinc-300 outline-none cursor-pointer flex-1 py-2 font-bold"
                  >
                    <option value="All" className="bg-zinc-950 text-white">All</option>
                    <option value="Active" className="bg-zinc-950 text-white">Active</option>
                    <option value="Inactive" className="bg-zinc-950 text-white">Inactive</option>
                    <option value="Prospect" className="bg-zinc-950 text-white">Prospect</option>
                  </select>
                </div>

                {/* Lead Source */}
                <div className="flex items-center bg-zinc-900/50 border border-zinc-850 rounded-xl px-2.5">
                  <span className="text-zinc-500 mr-1.5 uppercase text-[9px] font-black">Source:</span>
                  <select 
                    value={sourceFilter} 
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-transparent text-zinc-300 outline-none cursor-pointer flex-1 py-2 font-bold"
                  >
                    <option value="All" className="bg-zinc-950 text-white">All</option>
                    <option value="Website" className="bg-zinc-950 text-white">Website</option>
                    <option value="LinkedIn" className="bg-zinc-950 text-white">LinkedIn</option>
                    <option value="Referral" className="bg-zinc-950 text-white">Referral</option>
                    <option value="Facebook" className="bg-zinc-950 text-white">Facebook</option>
                    <option value="Google Ads" className="bg-zinc-950 text-white">Google Ads</option>
                    <option value="Cold Call" className="bg-zinc-950 text-white">Cold Call</option>
                    <option value="Email Campaign" className="bg-zinc-950 text-white">Email</option>
                  </select>
                </div>

                {/* Onboarding date */}
                <div className="flex items-center bg-zinc-900/50 border border-zinc-850 rounded-xl px-2.5">
                  <span className="text-zinc-500 mr-1.5 uppercase text-[9px] font-black">Onboard:</span>
                  <select 
                    value={dateFilter} 
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-transparent text-zinc-300 outline-none cursor-pointer flex-1 py-2 font-bold"
                  >
                    <option value="All" className="bg-zinc-950 text-white">All Time</option>
                    <option value="Today" className="bg-zinc-950 text-white">Today</option>
                    <option value="Last7" className="bg-zinc-950 text-white">Last 7 Days</option>
                    <option value="Last30" className="bg-zinc-950 text-white">Last 30 Days</option>
                    <option value="Last90" className="bg-zinc-950 text-white">Last 90 Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clear filters trigger */}
            {(searchQuery || stageFilter !== 'All' || statusFilter !== 'All' || sourceFilter !== 'All' || dateFilter !== 'All') && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setSearchQuery(''); setStageFilter('All'); setStatusFilter('All'); setSourceFilter('All'); setDateFilter('All');
                  }}
                  className="text-[10px] font-mono font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  RESET FILTERS
                </button>
              </div>
            )}
          </div>

          {/* BULK ACTIONS BANNER */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-hidden text-xs font-mono text-white"
              >
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert className="w-4 h-4 text-yellow-400" />
                  <span>{selectedIds.length} customer(s) selected</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  {/* Reassign Rep */}
                  <select 
                    value={bulkRep}
                    onChange={(e) => handleBulkAssign(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 outline-none font-bold text-zinc-300 cursor-pointer"
                  >
                    <option value="">Assign To...</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="Marcus Chen">Marcus Chen</option>
                    <option value="Sarah Connor">Sarah Connor</option>
                  </select>

                  {/* Change Stage */}
                  <select 
                    value={bulkStage}
                    onChange={(e) => handleBulkStage(e.target.value as CustomerStage)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 outline-none font-bold text-zinc-300 cursor-pointer"
                  >
                    <option value="">Change Stage...</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                    <option value="On Hold">On Hold</option>
                  </select>

                  {/* Change Status */}
                  <select 
                    value={bulkStatus}
                    onChange={(e) => handleBulkStatus(e.target.value as CustomerStatus)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 outline-none font-bold text-zinc-300 cursor-pointer"
                  >
                    <option value="">Change Status...</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Prospect">Prospect</option>
                  </select>

                  <button 
                    onClick={handleBulkExport}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold rounded-lg cursor-pointer flex items-center gap-1 uppercase"
                  >
                    <Download className="w-3 h-3 text-blue-400" />
                    Export
                  </button>

                  <button 
                    onClick={handleBulkDelete}
                    className="px-2.5 py-1 bg-red-950/30 border border-red-900/30 hover:bg-red-950/50 text-red-400 font-bold rounded-lg cursor-pointer flex items-center gap-1 uppercase"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete (Admin)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN DATA TABLE */}
          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/30 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                    <th className="p-4 w-10 text-center">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={paginated.length > 0 && paginated.every(c => selectedIds.includes(c.id))}
                        className="rounded border-zinc-800 bg-zinc-950 accent-yellow-400 cursor-pointer"
                      />
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('fullName')}>
                      Customer {sortColumn === 'fullName' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('companyName')}>
                      Company {sortColumn === 'companyName' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('email')}>
                      Contact {sortColumn === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('owner')}>
                      Owner {sortColumn === 'owner' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('salesExecutive')}>
                      Sales Exec {sortColumn === 'salesExecutive' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('leadSource')}>
                      Source {sortColumn === 'leadSource' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('stage')}>
                      Stage {sortColumn === 'stage' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('status')}>
                      Status {sortColumn === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('lastFollowUp')}>
                      Last Follow-up {sortColumn === 'lastFollowUp' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('nextFollowUp')}>
                      Next Follow-up {sortColumn === 'nextFollowUp' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort('createdAt')}>
                      Created Date {sortColumn === 'createdAt' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {paginated.length > 0 ? (
                    paginated.map((c, index) => {
                      const overdue = isOverdue(c.nextFollowUp) && c.stage !== 'Won' && c.stage !== 'Lost';
                      const isMenuOpen = actionMenuId === c.id;

                      return (
                        <tr key={c.id} className="hover:bg-zinc-900/10 group transition-all">
                          {/* CHECKBOX */}
                          <td className="p-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(c.id)}
                              onChange={(e) => handleSelectRow(c.id, e.target.checked)}
                              className="rounded border-zinc-800 bg-zinc-950 accent-yellow-400 cursor-pointer"
                            />
                          </td>

                          {/* CUSTOMER NAME + AVATAR + ID */}
                          <td className="p-4 font-bold text-white">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-400 shrink-0">
                                {getInitials(c.fullName)}
                              </div>
                              <div className="cursor-pointer hover:text-yellow-400 transition-colors" onClick={() => setSelectedDetailedCustomerId(c.id)}>
                                <p className="leading-tight">{c.fullName}</p>
                                <span className="text-[9px] text-zinc-500 font-mono block mt-0.5 uppercase tracking-wide">ID: {c.id}</span>
                              </div>
                            </div>
                          </td>

                          {/* COMPANY */}
                          <td className="p-4 font-semibold text-zinc-300">{c.companyName || 'N/A'}</td>

                          {/* CONTACT DETAILS */}
                          <td className="p-4 font-mono">
                            <p className="text-zinc-300 hover:text-yellow-400 transition-colors cursor-pointer">{c.email}</p>
                            <p className="text-zinc-500 text-[10px] mt-0.5">{c.phone || 'No Phone'}</p>
                          </td>

                          {/* OWNER */}
                          <td className="p-4 text-zinc-400 font-medium">{c.owner}</td>

                          {/* SALES EXECUTIVE */}
                          <td className="p-4 font-medium text-zinc-400">
                            <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-850 font-mono text-[10px] text-zinc-300">
                              {c.salesExecutive}
                            </span>
                          </td>

                          {/* LEAD SOURCE */}
                          <td className="p-4 font-mono text-[11px] text-zinc-400">{c.leadSource}</td>

                          {/* STAGE BADGE */}
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black font-mono uppercase tracking-wide border ${
                              c.stage === 'New' ? 'bg-zinc-900 text-zinc-400 border-zinc-800' :
                              c.stage === 'Contacted' ? 'bg-indigo-950/30 text-indigo-400 border-indigo-900/20' :
                              c.stage === 'Qualified' ? 'bg-purple-950/30 text-purple-400 border-purple-900/20' :
                              c.stage === 'Proposal Sent' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/20' :
                              c.stage === 'Negotiation' ? 'bg-amber-950/30 text-amber-400 border-amber-900/20' :
                              c.stage === 'Won' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                              c.stage === 'Lost' ? 'bg-red-950/30 text-red-400 border-red-900/20' :
                              'bg-zinc-900 text-zinc-500 border-zinc-850'
                            }`}>
                              {c.stage}
                            </span>
                          </td>

                          {/* STATUS BADGE */}
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider border ${
                              c.status === 'Active' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' :
                              c.status === 'Prospect' ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/20' :
                              'bg-zinc-900 text-zinc-500 border-zinc-850'
                            }`}>
                              {c.status}
                            </span>
                          </td>

                          {/* LAST FOLLOW UP */}
                          <td className="p-4 text-zinc-400 font-mono">{formatDate(c.lastFollowUp)}</td>

                          {/* NEXT FOLLOW UP (ALERT HIGHLIGHT) */}
                          <td className="p-4 font-mono">
                            {overdue ? (
                              <div className="flex items-center gap-1 text-red-400 font-bold bg-red-950/20 border border-red-900/20 px-2 py-0.5 rounded w-fit">
                                <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />
                                <span>{formatDate(c.nextFollowUp)}</span>
                              </div>
                            ) : (
                              <span className="text-zinc-300">{formatDate(c.nextFollowUp)}</span>
                            )}
                          </td>

                          {/* CREATED DATE */}
                          <td className="p-4 text-zinc-400 font-mono">{formatDate(c.createdAt)}</td>

                          {/* ACTIONS DOTS BUTTON */}
                          <td className="p-4 text-right font-mono relative">
                            <button 
                              onClick={() => setActionMenuId(isMenuOpen ? null : c.id)}
                              className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-zinc-800"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown panel */}
                            {isMenuOpen && (
                              <div className="absolute right-4 top-12 w-44 bg-zinc-950 border border-zinc-900 rounded-xl p-1.5 shadow-2xl text-left z-30 space-y-0.5 text-xs">
                                <button 
                                  onClick={() => { setSelectedDetailedCustomerId(c.id); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Users className="w-3.5 h-3.5 text-yellow-400" /> View Customer
                                </button>
                                <button 
                                  onClick={() => { setEditCustData(c); setIsEditOpen(true); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-blue-400" /> Edit Customer
                                </button>
                                <button 
                                  onClick={() => { setFollowUpCust(c); setNewFollowUpDate(c.nextFollowUp || ''); setIsAddFollowUpOpen(true); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Add Follow-up
                                </button>
                                <button 
                                  onClick={() => { setSelectedDetailedCustomerId(c.id); setActiveDetailsTab('timeline'); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Activity className="w-3.5 h-3.5 text-indigo-400" /> View Timeline
                                </button>
                                <button 
                                  onClick={() => { setSelectedDetailedCustomerId(c.id); setActiveDetailsTab('notes'); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <BookOpen className="w-3.5 h-3.5 text-purple-400" /> View Notes
                                </button>
                                <button 
                                  onClick={() => { setEmailCust(c); setIsEmailOpen(true); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Send Email
                                </button>
                                <button 
                                  onClick={() => { setCallCust(c); setIsCallOpen(true); setIsCallActive(true); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-zinc-900 hover:text-white rounded-lg text-zinc-400 font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Phone className="w-3.5 h-3.5 text-green-400" /> Call Customer
                                </button>
                                <div className="border-t border-zinc-900 my-1"></div>
                                <button 
                                  onClick={() => { handleDeleteIndividual(c.id); setActionMenuId(null); }}
                                  className="w-full text-left p-2 hover:bg-red-950/20 text-red-400 hover:text-red-300 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-2"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={13} className="p-8 text-center text-zinc-600 font-mono">
                        No customer logs found matching filtering parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION PANEL FOOTER */}
            <div className="p-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/10 text-zinc-500 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select 
                  value={pageSize} 
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>records</span>
              </div>

              <div>
                <span>Showing {totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} accounts</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- RENDER DETAILED PROFILE SCREEN --- */}
      {selectedDetailedCustomerId && detailedCust && extra && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* LEFT METADATA CARD (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Primary Profile Summary */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-zinc-900">
                <div className="w-16 h-16 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center text-xl font-mono shadow-xl shadow-yellow-400/5">
                  {getInitials(detailedCust.fullName)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{detailedCust.fullName}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">CLIENT IDENTIFICATION: {detailedCust.id}</span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black font-mono border ${
                    detailedCust.status === 'Active' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/20' : 'bg-yellow-950/30 text-yellow-400 border-yellow-900/20'
                  }`}>
                    STATUS: {detailedCust.status}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-bold font-mono text-zinc-400 uppercase">
                    STAGE: {detailedCust.stage}
                  </span>
                </div>
              </div>

              {/* CRM System Specifics */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Account Owner</span>
                  <span className="text-white font-semibold">{detailedCust.owner}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Sales Executive</span>
                  <span className="text-yellow-400 font-bold font-mono text-[11px] bg-yellow-400/5 px-2 py-0.5 rounded border border-yellow-400/10">
                    {detailedCust.salesExecutive}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Lead Acquisition</span>
                  <span className="text-zinc-300 font-mono">{detailedCust.leadSource}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Record Logged</span>
                  <span className="text-zinc-400 font-mono">{formatDate(detailedCust.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Corporate / Company Specs */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">COMPANY DETAILS</h4>
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> REGISTERED ENTITY
                  </span>
                  <p className="text-white font-bold pl-4">{detailedCust.companyName || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 font-mono text-[10px] uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> CORPORATE ADDRESS
                  </span>
                  <p className="text-zinc-300 pl-4 leading-relaxed font-mono text-[11px]">{detailedCust.address || 'No physical address logged.'}</p>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-4">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-900 pb-2">CONTACT ENDPOINTS</h4>
              <div className="space-y-3.5 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" /> ELECTRONIC MAIL
                  </span>
                  <p className="text-white font-bold pl-4 hover:text-yellow-400 cursor-pointer">{detailedCust.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" /> MOBILE / VOICE
                  </span>
                  <p className="text-white font-bold pl-4">{detailedCust.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {/* Destructive override */}
            <div className="pt-2 text-right">
              <button 
                onClick={() => handleDeleteIndividual(detailedCust.id)}
                className="text-xs font-mono font-bold text-red-500 hover:text-red-400 flex items-center justify-end gap-1.5 ml-auto cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                PURGE CUSTOMER CARD (RESTRICTED)
              </button>
            </div>
          </div>

          {/* RIGHT TABBED AREA (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Selector Bar */}
            <div className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-xl font-mono text-xs overflow-x-auto whitespace-nowrap">
              <button
                onClick={() => setActiveDetailsTab('timeline')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  activeDetailsTab === 'timeline' ? 'bg-zinc-900 text-yellow-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                TIMELINE / ACTIVITIES
              </button>
              <button
                onClick={() => setActiveDetailsTab('followups')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  activeDetailsTab === 'followups' ? 'bg-zinc-900 text-yellow-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                FOLLOW-UP LOGS
              </button>
              <button
                onClick={() => setActiveDetailsTab('notes')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  activeDetailsTab === 'notes' ? 'bg-zinc-900 text-yellow-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                NOTES SCRATCHPAD
              </button>
              <button
                onClick={() => setActiveDetailsTab('documents')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold transition-all cursor-pointer text-center ${
                  activeDetailsTab === 'documents' ? 'bg-zinc-900 text-yellow-400' : 'text-zinc-400 hover:text-white'
                }`}
              >
                DOCUMENTS ({extra.documents.length})
              </button>
            </div>

            {/* TAB PANES */}
            <div className="backdrop-blur-xl bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl shadow-xl min-h-[400px]">
              
              {/* TIMELINE */}
              {activeDetailsTab === 'timeline' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-black text-white font-mono uppercase">Chronological Engagement Timeline</h3>
                    <span className="text-[10px] font-mono text-zinc-500">{extra.timeline.length} operations compiled</span>
                  </div>

                  <div className="space-y-5 relative pl-6 before:absolute before:top-0 before:bottom-0 before:left-2 before:border-r before:border-zinc-900">
                    {extra.timeline.map((t: any) => (
                      <div key={t.id} className="relative group text-xs">
                        <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] font-mono text-yellow-400 font-bold">
                          {t.type ? t.type[0] : '•'}
                        </div>
                        <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl space-y-1.5 hover:bg-zinc-900/50 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-yellow-400 font-bold font-mono uppercase text-[9px] tracking-wider">{t.type}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">{formatDate(t.date)}</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed font-sans text-[11px]">{t.description}</p>
                          <div className="text-right text-[9px] text-zinc-500 font-mono">
                            Logged by: {t.author}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FOLLOW-UP LOGS */}
              {activeDetailsTab === 'followups' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-black text-white font-mono uppercase">Scheduled & historic Touchpoints</h3>
                    <button 
                      onClick={() => { setFollowUpCust(detailedCust); setNewFollowUpDate(detailedCust.nextFollowUp || ''); setIsAddFollowUpOpen(true); }}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-yellow-400 font-bold text-[10px] font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      + SCHEDULE TOUCHPOINT
                    </button>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* Active next follow-up callout */}
                    <div className="p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest font-black">Designated Next Touchpoint</span>
                        <p className="text-white font-bold font-mono">{formatDate(detailedCust.nextFollowUp)}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${
                        isOverdue(detailedCust.nextFollowUp) ? 'bg-red-950/30 text-red-400 border-red-900/20 animate-pulse' : 'bg-zinc-900 text-zinc-400 border-zinc-850'
                      }`}>
                        {isOverdue(detailedCust.nextFollowUp) ? 'OVERDUE' : 'SCHEDULED'}
                      </span>
                    </div>

                    <div className="divide-y divide-zinc-900">
                      {extra.followups.map((f: any) => (
                        <div key={f.id} className="py-3 flex justify-between gap-4 font-mono text-[11px]">
                          <div>
                            <span className="text-zinc-500 text-[10px] block uppercase font-bold">{f.type} • {f.status}</span>
                            <p className="text-zinc-200 mt-0.5 font-sans text-xs">{f.note}</p>
                          </div>
                          <span className="text-zinc-500 text-right whitespace-nowrap">{formatDate(f.date)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* NOTES */}
              {activeDetailsTab === 'notes' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-black text-white font-mono uppercase">Private CRM Notes log</h3>
                  </div>

                  <form onSubmit={handleAddDetailNote} className="space-y-2">
                    <textarea
                      placeholder="Type private customer briefing, conversation notes, or next-step tactics..."
                      value={detailNewNote}
                      onChange={(e) => setDetailNewNote(e.target.value)}
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-850 text-white rounded-xl p-3 outline-none text-xs focus:border-yellow-400/40 font-sans resize-none"
                    />
                    <div className="flex justify-end">
                      <button 
                        type="submit" 
                        disabled={!detailNewNote}
                        className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-[10px] rounded-lg font-mono disabled:opacity-35 cursor-pointer uppercase"
                      >
                        Commit Note
                      </button>
                    </div>
                  </form>

                  <div className="space-y-4 pt-2">
                    {extra.notes.map((n: any) => (
                      <div key={n.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between items-center font-mono text-[10px] border-b border-zinc-900 pb-1.5 text-zinc-500">
                          <span>{n.author}</span>
                          <span>{formatDate(n.date)}</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed font-sans">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DOCUMENTS */}
              {activeDetailsTab === 'documents' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <h3 className="text-sm font-black text-white font-mono uppercase">Attached Contractual & Discovery Briefings</h3>
                  </div>

                  {/* Simulated Upload widget */}
                  <form onSubmit={handleUploadDocumentSimulated} className="p-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10 flex flex-col items-center justify-center text-center space-y-3">
                    <Upload className="w-8 h-8 text-zinc-600" />
                    <div>
                      <p className="text-[11px] font-bold text-zinc-300">Drag & drop corporate briefings or click to select</p>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Supported types: .pdf, .docx, .xlsx, .zip</p>
                    </div>
                    <div className="flex gap-1.5 max-w-sm w-full font-mono">
                      <input 
                        type="text" 
                        required 
                        placeholder="Document name (e.g. SLA_Addendum.pdf)"
                        value={docNameInput}
                        onChange={(e) => setDocNameInput(e.target.value)}
                        className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-lg p-1.5 outline-none text-[10px]"
                      />
                      <button 
                        type="submit"
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-yellow-400 font-bold text-[10px] rounded-lg cursor-pointer uppercase"
                      >
                        Upload
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {extra.documents.map((d: any) => (
                      <div key={d.id} className="p-3 bg-zinc-900/20 border border-zinc-900 rounded-xl flex items-center justify-between text-xs hover:bg-zinc-900/40 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-500 text-[10px] font-black font-mono">
                            {d.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-200">{d.name}</p>
                            <span className="text-[9px] text-zinc-500 font-mono">{d.size} • Attached on {formatDate(d.date)}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => alert(`Simulating file download request: ${d.name}`)}
                          className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg cursor-pointer border border-transparent hover:border-zinc-800"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}

      {/* --- ADD CUSTOMER SLIDEOVER/MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/25">
              <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider">Log New Customer Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 overflow-y-auto text-xs text-zinc-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Contact & Company Profile */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold border-b border-zinc-900 pb-1.5">CONTACT & COMPANY</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Customer Name *</label>
                    <input required type="text" placeholder="Sarah Connor" value={addName} onChange={e=>setAddName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Company Name *</label>
                    <input required type="text" placeholder="Aether Technologies" value={addCompany} onChange={e=>setAddCompany(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Email Address *</label>
                      <input required type="email" placeholder="sarah@aethertech.com" value={addEmail} onChange={e=>setAddEmail(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Phone Number *</label>
                      <input required type="text" placeholder="+1 (555) 234-5678" value={addPhone} onChange={e=>setAddPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Alternative Phone</label>
                      <input type="text" placeholder="+1 (555) 987-6543" value={addAlternativePhone} onChange={e=>setAddAlternativePhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Company Website</label>
                      <input type="text" placeholder="https://aethertech.com" value={addWebsite} onChange={e=>setAddWebsite(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Industry</label>
                    <input type="text" placeholder="e.g. Aerospace, SaaS, Healthcare" value={addIndustry} onChange={e=>setAddIndustry(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold border-b border-zinc-900 pb-1.5 pt-2">GEOGRAPHIC INFO</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Street Address</label>
                      <input type="text" placeholder="100 Innovation Way" value={addAddress} onChange={e=>setAddAddress(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">City</label>
                        <input type="text" placeholder="Boston" value={addCity} onChange={e=>setAddCity(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">State / Province</label>
                        <input type="text" placeholder="MA" value={addState} onChange={e=>setAddState(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Country</label>
                        <input type="text" placeholder="United States" value={addCountry} onChange={e=>setAddCountry(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Postal / ZIP Code</label>
                        <input type="text" placeholder="02110" value={addPostalCode} onChange={e=>setAddPostalCode(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: CRM Segments & Schedule */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold border-b border-zinc-900 pb-1.5">CRM METRICS & TARGETS</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Lead Source</label>
                      <select value={addSource} onChange={e=>setAddSource(e.target.value as LeadSourceType)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
                        <option value="Website">Website</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Referral</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Email Campaign">Email Campaign</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Priority</label>
                      <select value={addPriority} onChange={e=>setAddPriority(e.target.value as 'Low' | 'Medium' | 'High')} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Stage</label>
                      <select value={addStage} onChange={e=>setAddStage(e.target.value as CustomerStage)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
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
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Status</label>
                      <select value={addStatus} onChange={e=>setAddStatus(e.target.value as CustomerStatus)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
                        <option value="Prospect">Prospect</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Assigned Sales Executive</label>
                      <input disabled type="text" value={currentUser?.fullName || 'Elena Rostova'} className="w-full bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-lg p-2 outline-none font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Next Follow-up Date</label>
                      <input type="date" value={addNextFollowUp} onChange={e=>setAddNextFollowUp(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono focus:border-yellow-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Internal Notes / CRM Objectives</label>
                    <textarea rows={4} placeholder="Brief outline on requirements..." value={addNotes} onChange={e=>setAddNotes(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 focus:border-yellow-400 outline-none resize-none font-sans" />
                  </div>
                </div>

              </div>

              {/* Action Buttons Panel */}
              <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  onClick={() => setAddAndAnother(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-yellow-400 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  SAVE & ADD ANOTHER
                </button>
                <button
                  type="submit"
                  onClick={() => setAddAndAnother(false)}
                  className="w-full sm:w-auto px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-mono font-black rounded-lg transition-colors cursor-pointer"
                >
                  SAVE CUSTOMER
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- EDIT CUSTOMER MODAL --- */}
      {isEditOpen && editCustData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/25">
              <h3 className="text-sm font-black font-mono text-white uppercase tracking-wider">Modify Customer Details</h3>
              <button onClick={() => { setIsEditOpen(false); setEditCustData(null); }} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleUpdateCustomer} className="p-6 space-y-4 overflow-y-auto text-xs text-zinc-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Contact & Company Profile */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold border-b border-zinc-900 pb-1.5">CONTACT & COMPANY</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Customer Name *</label>
                    <input required type="text" value={editCustData.fullName} onChange={e=>setEditCustData({...editCustData, fullName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Company Name *</label>
                    <input required type="text" value={editCustData.companyName} onChange={e=>setEditCustData({...editCustData, companyName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Email Address *</label>
                      <input required type="email" value={editCustData.email} onChange={e=>setEditCustData({...editCustData, email: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Phone Number *</label>
                      <input required type="text" value={editCustData.phone} onChange={e=>setEditCustData({...editCustData, phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Alternative Phone</label>
                      <input type="text" value={editCustData.alternativePhone || ''} onChange={e=>setEditCustData({...editCustData, alternativePhone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Company Website</label>
                      <input type="text" value={editCustData.companyWebsite || ''} onChange={e=>setEditCustData({...editCustData, companyWebsite: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Industry</label>
                    <input type="text" value={editCustData.industry || ''} onChange={e=>setEditCustData({...editCustData, industry: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold border-b border-zinc-900 pb-1.5 pt-2">GEOGRAPHIC INFO</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Street Address</label>
                      <input type="text" value={editCustData.address || ''} onChange={e=>setEditCustData({...editCustData, address: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">City</label>
                        <input type="text" value={editCustData.city || ''} onChange={e=>setEditCustData({...editCustData, city: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">State / Province</label>
                        <input type="text" value={editCustData.state || ''} onChange={e=>setEditCustData({...editCustData, state: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Country</label>
                        <input type="text" value={editCustData.country || ''} onChange={e=>setEditCustData({...editCustData, country: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Postal / ZIP Code</label>
                        <input type="text" value={editCustData.postalCode || ''} onChange={e=>setEditCustData({...editCustData, postalCode: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: CRM Segments & Schedule */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-yellow-400 font-bold border-b border-zinc-900 pb-1.5">CRM METRICS & TARGETS</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Lead Source</label>
                      <select value={editCustData.leadSource} onChange={e=>setEditCustData({...editCustData, leadSource: e.target.value as LeadSourceType})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
                        <option value="Website">Website</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Referral">Referral</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Email Campaign">Email Campaign</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Priority</label>
                      <select value={editCustData.priority || 'Medium'} onChange={e=>setEditCustData({...editCustData, priority: e.target.value as 'Low' | 'Medium' | 'High'})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Stage</label>
                      <select value={editCustData.stage} onChange={e=>setEditCustData({...editCustData, stage: e.target.value as CustomerStage})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
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
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Status</label>
                      <select value={editCustData.status} onChange={e=>setEditCustData({...editCustData, status: e.target.value as CustomerStatus})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono">
                        <option value="Prospect">Prospect</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Assigned Sales Executive</label>
                      <input disabled type="text" value={editCustData.salesExecutive || 'Elena Rostova'} className="w-full bg-zinc-950 border border-zinc-900 text-zinc-500 rounded-lg p-2 outline-none font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Next Follow-up Date</label>
                      <input type="date" value={editCustData.nextFollowUp || ''} onChange={e=>setEditCustData({...editCustData, nextFollowUp: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none font-mono focus:border-yellow-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-zinc-500">Internal Notes / Scope Summary</label>
                    <textarea rows={4} value={editCustData.notes || ''} onChange={e=>setEditCustData({...editCustData, notes: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 focus:border-yellow-400 outline-none resize-none font-sans" />
                  </div>
                </div>

              </div>

              {/* Action Buttons Panel */}
              <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsEditOpen(false); setEditCustData(null); }}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-mono font-black rounded-lg transition-colors cursor-pointer"
                >
                  COMMIT PROFILE UPDATES
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- ADD FOLLOW-UP MODAL --- */}
      {isAddFollowUpOpen && followUpCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/25">
              <h3 className="text-xs font-black font-mono text-white uppercase tracking-wider">Schedule Next Client Touchpoint</h3>
              <button onClick={() => { setIsAddFollowUpOpen(false); setFollowUpCust(null); }} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleTriggerFollowUpSubmit} className="p-4 space-y-4 text-xs text-zinc-400">
              <div className="space-y-1 font-mono">
                <label className="text-[10px] uppercase text-zinc-500">Target Customer</label>
                <p className="text-white font-bold text-xs">{followUpCust.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-zinc-500">Touchpoint Type</label>
                  <select value={newFollowUpType} onChange={e=>setNewFollowUpType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 outline-none">
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase text-zinc-500">Schedule Date</label>
                  <input required type="date" value={newFollowUpDate} onChange={e=>setNewFollowUpDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-1.5 outline-none font-mono" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Objective / Discussion Brief</label>
                <textarea rows={3} placeholder="SLA tiers proposal, customized demo, volume discount sign-off..." value={newFollowUpNote} onChange={e=>setNewFollowUpNote(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 focus:border-yellow-400 outline-none resize-none font-sans" />
              </div>

              <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-black text-xs rounded-lg hover:bg-yellow-300 transition-colors uppercase font-mono cursor-pointer">
                Commit Schedule
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- SEND EMAIL SIMULATION --- */}
      {isEmailOpen && emailCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/25">
              <h3 className="text-xs font-black font-mono text-white uppercase tracking-wider">Secure Outgoing Electronic Mail</h3>
              <button onClick={() => { setIsEmailOpen(false); setEmailCust(null); }} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            
            <form onSubmit={handleSendEmailSubmit} className="p-4 space-y-3.5 text-xs text-zinc-400">
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">FROM:</span>
                  <span className="text-zinc-300 font-bold">{currentUser?.email || 'sales@adjen.io'}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-900 pt-1.5">
                  <span className="text-zinc-500">TO:</span>
                  <span className="text-yellow-400 font-bold">{emailCust.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Subject Line</label>
                <input required type="text" placeholder="Adjen CRM - Custom Enterprise SLA Proposal" value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2 focus:border-yellow-400 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-500">Mail Body Content</label>
                <textarea required rows={5} placeholder="Dear client, following our last briefing..." value={emailBody} onChange={e=>setEmailBody(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 focus:border-yellow-400 outline-none resize-none font-sans" />
              </div>

              <button type="submit" className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-lg transition-colors font-mono uppercase cursor-pointer">
                🚀 TRANSMIT MAIL DISPATCH
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* --- PHONE CALL SIMULATION --- */}
      {isCallOpen && callCust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl p-5 text-center space-y-4"
          >
            <div className="flex justify-between items-start">
              <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[9px] font-bold font-mono text-green-400 uppercase tracking-widest">
                {isCallActive ? 'VOICE DIRECT-LINE ACTIVE' : 'CALL SUSPENDED'}
              </span>
              <button onClick={() => { setIsCallActive(false); setIsCallOpen(false); setCallCust(null); }} className="text-zinc-500 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-1">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mx-auto animate-pulse">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-white text-base mt-2">{callCust.fullName}</h3>
              <p className="text-xs text-zinc-500 font-mono">{callCust.phone || 'No phone number'}</p>
            </div>

            {/* CALL TIMER */}
            <div className="py-2">
              <p className="text-2xl font-black text-white font-mono">
                {Math.floor(callDuration / 60)}:{callDuration % 60 < 10 ? '0' : ''}{callDuration % 60}
              </p>
              <p className="text-[10px] text-zinc-500 font-mono uppercase mt-0.5">ESTABLISHED CLIENT ENCRYPTED TRUNK</p>
            </div>

            <div className="space-y-1 text-left text-xs">
              <label className="text-[9px] font-mono uppercase text-zinc-500">Commit Conversation Notes</label>
              <textarea rows={2.5} placeholder="Discussed SLA platinum tier, customer agreed to review documents..." value={callNote} onChange={e=>setCallNote(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg p-2.5 focus:border-yellow-400 outline-none resize-none text-[11px]" />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setIsCallActive(!isCallActive)} 
                className={`flex-1 py-2 font-mono text-xs font-bold rounded-lg border ${
                  isCallActive ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-green-500 text-black hover:bg-green-400'
                } cursor-pointer`}
              >
                {isCallActive ? 'PAUSE SESSION' : 'RESUME CALL'}
              </button>
              <button 
                onClick={handleLogCallSubmit} 
                className="flex-1 py-2 bg-red-500 text-white hover:bg-red-400 font-mono text-xs font-bold rounded-lg cursor-pointer"
              >
                END & LOG CALL
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- ACCESS DENIED WARNING MODAL --- */}
      {isPermissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl p-5 text-center space-y-4 shadow-2xl"
          >
            <div className="w-12 h-12 bg-red-950/40 border border-red-900/35 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Administrative Privilege Required</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans px-2">
                Action Denied: Customer purging requires Managing Director or Manager role access levels. Your active identity (Sales Executive) has read/write boundaries.
              </p>
            </div>

            <button 
              onClick={() => setIsPermissionModalOpen(false)}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono font-bold rounded-lg border border-zinc-800 transition-all cursor-pointer"
            >
              ACKNOWLEDGE PROTOCOL
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
