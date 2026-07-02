import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Target, BarChart3, TrendingUp, Calendar, CheckSquare, 
  Clock, ArrowRight, ArrowUpRight, Brain, Sparkles, Send, 
  HelpCircle, MessageSquare, Plus, Bell, X, Check, Trash2, 
  Award, ShieldAlert, ChevronRight, Play, AlertCircle, Zap, Activity, Info, Star, ChevronLeft, ChevronDown,
  DollarSign, Search, Briefcase, FileText, Lock, Cpu, Mail, Phone, Video, Layers, LayoutDashboard
} from 'lucide-react';
import { Customer, Lead, Deal, Task, Activity as ActivityType } from '../types';

interface DashboardProps {
  customers: Customer[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: ActivityType[];
  currency: string;
  onToggleTask: (taskId: string) => void;
  onNavigateToTab: (tab: string) => void;
  onAddLead?: (l: Lead) => void;
  onAddDeal?: (d: Deal) => void;
  onAddTask?: (t: Task) => void;
  onEditDeal?: (d: Deal) => void;
  onEditLead?: (l: Lead) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function Dashboard({
  customers,
  leads,
  deals,
  tasks,
  activities,
  currency,
  onToggleTask,
  onNavigateToTab,
  onAddLead,
  onAddDeal,
  onAddTask,
  onEditDeal,
  onEditLead
}: DashboardProps) {

  // Global UI States
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState<string[]>([
    'deal-risk', 'follow-up-biosphere', 'lead-vertex'
  ]);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<'lead' | 'deal' | 'task' | null>(null);

  // Calendar State
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default to July 2nd 2026

  // Business Operating System Multi-Workspace switcher
  const [subWorkspace, setSubWorkspace] = useState<'overview' | 'erp' | 'hrm' | 'projects' | 'support' | 'marketing' | 'security' | 'extras'>('overview');

  // --- ERP & FINANCE MODULE ---
  const [erpInvoices, setErpInvoices] = useState([
    { id: 'INV-1004', client: 'Aether Technologies', amount: 32000, date: '2026-06-28', status: 'Paid', tax: 1600 },
    { id: 'INV-1005', client: 'Vertex Corporation', amount: 24000, date: '2026-06-30', status: 'Pending', tax: 1200 },
    { id: 'INV-1006', client: 'BioSphere Ltd', amount: 15000, date: '2026-07-01', status: 'Overdue', tax: 750 }
  ]);
  const [invoiceForm, setInvoiceForm] = useState({ client: '', amount: '', tax: '' });
  const [inventoryProducts, setInventoryProducts] = useState([
    { barcode: 'ADJ-PROC-99X', name: 'Adjen Quantum Core Core-9', stock: 142, threshold: 20, price: 1499, warehouse: 'Warehouse A' },
    { barcode: 'ADJ-AI-800', name: 'Neural Acceleration Tensor TPU', stock: 12, threshold: 15, price: 3499, warehouse: 'Warehouse B' },
    { barcode: 'ADJ-MEM-512', name: 'Adjen Optane Memory Module 512GB', stock: 85, threshold: 10, price: 599, warehouse: 'Warehouse A' }
  ]);
  const [budgetLimit, setBudgetLimit] = useState(120000);
  const [budgetSpent, setBudgetSpent] = useState(48200);

  // --- HRM MODULE ---
  const [hrmEmployees, setHrmEmployees] = useState([
    { id: 'EMP-001', name: 'Habeeb Rahman', role: 'Sales Director', dept: 'Commercial', designation: 'Director', salary: 14500, attendance: 99, shift: '09:00 - 18:00', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128' },
    { id: 'EMP-002', name: 'Elena Rostova', role: 'Enterprise AE', dept: 'Commercial', designation: 'Senior AE', salary: 9800, attendance: 95, shift: '09:00 - 18:00', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128' },
    { id: 'EMP-003', name: 'Marcus Chen', role: 'Technical Consultant', dept: 'Engineering', designation: 'Consultant', salary: 11000, attendance: 92, shift: '10:00 - 19:00', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128' },
    { id: 'EMP-004', name: 'Sarah Connor', role: 'Support Specialist', dept: 'Customer Support', designation: 'Analyst', salary: 6500, attendance: 97, shift: '08:00 - 17:00', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=128' }
  ]);
  const [newEmployeeForm, setNewEmployeeForm] = useState({ name: '', role: '', dept: '', salary: '', shift: '' });
  const [jobOpenings, setJobOpenings] = useState([
    { title: 'AI Automation Engineer', dept: 'Engineering', status: 'Active Interviews', applicants: 24 },
    { title: 'Senior Solutions Architect', dept: 'Solutions', status: 'Sourcing Resumes', applicants: 15 }
  ]);

  // --- PROJECTS & SCRUM MODULE ---
  const [scrumTasks, setScrumTasks] = useState([
    { id: 'SCRUM-1', title: 'Provision AWS Sandbox', column: 'Done', points: 3, asignee: 'Marcus Chen' },
    { id: 'SCRUM-2', title: 'Draft Security Compliance Matrix', column: 'Review', points: 5, asignee: 'Habeeb Rahman' },
    { id: 'SCRUM-3', title: 'Build CRM Custom Heatmap Widget', column: 'In Progress', points: 8, asignee: 'Elena Rostova' },
    { id: 'SCRUM-4', title: 'Refactor Auth Endpoint Middleware', column: 'Backlog', points: 2, asignee: 'Marcus Chen' }
  ]);
  const [scrumComments, setScrumComments] = useState<string[]>([
    'Habeeb Rahman: Let’s pull SCRUM-2 into Review for Q3 verification.',
    'Elena Rostova: Custom Heatmap SVG integration successfully loaded.'
  ]);
  const [newComment, setNewComment] = useState('');

  // --- CUSTOMER SUPPORT TICKETS ---
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TCK-201', client: 'Vertex Corporation', title: 'Intermittent API handshake dropouts', priority: 'High', status: 'Open', created: '2026-07-01' },
    { id: 'TCK-202', client: 'Aether Technologies', title: 'Portal MFA reset request', priority: 'Medium', status: 'In Progress', created: '2026-07-01' },
    { id: 'TCK-203', client: 'Nebula SaaS', title: 'Billing invoices discrepancy clarification', priority: 'Low', status: 'Resolved', created: '2026-06-30' }
  ]);
  const [ticketForm, setTicketForm] = useState({ client: '', title: '', priority: 'High' });
  const [supportSearch, setSupportSearch] = useState('');
  const [chatLogs, setChatLogs] = useState([
    { id: 1, sender: 'Client', text: 'Hi, we are having trouble configuring the single sign-on parameters on the developer gateway.' },
    { id: 2, sender: 'Support Agent (AI)', text: 'Hello, please verify your authorized callback URLs. They must match exactly with the domain configured in the Adjen workspace client panel.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // --- MARKETING CAMPAIGNS ---
  const [marketingCampaigns, setMarketingCampaigns] = useState([
    { id: 'CMP-1', name: 'Q3 Enterprise Core Upgrade Launch', type: 'Email Campaign', status: 'Sending', sent: 1200, opens: 840, clicks: 320 },
    { id: 'CMP-2', name: 'Cybersecurity Compliance Webinar Invite', type: 'WhatsApp Campaign', status: 'Draft', sent: 0, opens: 0, clicks: 0 },
    { id: 'CMP-3', name: 'Emergency Server Maintenance Update', type: 'SMS Campaign', status: 'Completed', sent: 500, opens: 495, clicks: 110 }
  ]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState('Email Campaign');

  // --- SECURITY & PERMISSIONS ---
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [rolePermissions, setRolePermissions] = useState([
    { role: 'Administrator', read: true, write: true, delete: true, config: true },
    { role: 'Sales Specialist', read: true, write: true, delete: false, config: false },
    { role: 'Support Analyst', read: true, write: true, delete: false, config: false }
  ]);

  // --- SANDBOX EXTRA WIDGETS ---
  const [stickyNotes, setStickyNotes] = useState([
    { id: 'note-1', text: 'Meeting with Vertex CTO set for Friday 3PM.' },
    { id: 'note-2', text: 'Low stock detected: Neural Acceleration Tensor TPU (only 12 pieces remaining).' }
  ]);
  const [newStickyText, setNewStickyText] = useState('');
  const [calculatorInput, setCalculatorInput] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  
  // AI Assistant States
  const [aiInput, setAiInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Welcome back. I am the Adjen AI Business Brain. I've analyzed your current enterprise CRM records (6 accounts, 4 active leads, 6 high-value deals). How shall I optimize your sales velocity or workflow intelligence today?",
      timestamp: new Date()
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of AI chat on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Calculations for Key metrics
  const totalCustomers = customers.length;
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;
  const totalLeads = leads.length;
  const activeDeals = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const activeDealsCount = activeDeals.length;
  const wonDeals = deals.filter(d => d.stage === 'Closed Won');
  const totalRevenue = wonDeals.reduce((acc, curr) => acc + curr.value, 0);
  const activePipeline = activeDeals.reduce((acc, curr) => acc + curr.value, 0);

  // Win rate computation
  const closedDealsCount = deals.filter(d => d.stage === 'Closed Won' || d.stage === 'Closed Lost').length;
  const winRate = closedDealsCount > 0 
    ? Math.round((wonDeals.length / closedDealsCount) * 100) 
    : 83; // default aesthetic high-performance benchmark

  // Business Growth Score computation (weighted parameters)
  const taskCompletionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 75;
  const customerConversionRatio = customers.length > 0 ? Math.round((activeCustomersCount / customers.length) * 100) : 80;
  const businessGrowthScore = Math.min(100, Math.round((winRate * 0.4) + (customerConversionRatio * 0.3) + (taskCompletionRate * 0.3)));

  // Format utility
  const formatValue = (num: number) => {
    if (num >= 1000000) return `${currency}${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${currency}${(num / 1000).toFixed(0)}K`;
    return `${currency}${num}`;
  };

  // Pre-calculated target goal
  const revenueTarget = 100000; // $100K target
  const revenueGoalPercentage = Math.min(100, Math.round((totalRevenue / revenueTarget) * 100));

  // Lead Funnel and Priority Statistics
  const leadStatuses = {
    'New': leads.filter(l => l.status === 'New').length,
    'Contacted': leads.filter(l => l.status === 'Contacted').length,
    'Proposal Sent': leads.filter(l => l.status === 'Proposal Sent').length,
    'Nurturing': leads.filter(l => l.status === 'Nurturing').length,
    'Qualified': leads.filter(l => l.status === 'Qualified').length
  };

  const leadPriorityColors = {
    'High': 'bg-[#FFD600]/20 text-[#FFD600] border-[#FFD600]/30',
    'Medium': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Low': 'bg-slate-800 text-slate-400 border-slate-700/50'
  };

  // Local state forms for Quick Create Modals
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: '',
    source: 'LinkedIn Referral',
    expectedRevenue: 10000,
    priority: 'High' as 'High' | 'Medium' | 'Low',
    notes: ''
  });

  const [newDealForm, setNewDealForm] = useState({
    title: '',
    customerName: '',
    value: 15000,
    stage: 'Qualification' as any,
    closingDate: '2026-07-31'
  });

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    customerName: '',
    dueDate: '2026-07-05',
    priority: 'High' as 'High' | 'Medium' | 'Low'
  });

  // Handle AI Prompt Selection
  const triggerAiResponse = (userPrompt: string, customText?: string) => {
    const textMsg = customText || userPrompt;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textMsg,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMsg]);
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponseText = "";

      if (userPrompt === "ANALYZE_PIPELINE") {
        aiResponseText = `### Adjen Pipeline Velocity Analysis\n\n* **Active Volume:** You have **${activeDealsCount} active deals** in play, generating a pipeline value of **${formatValue(activePipeline)}**.\n* **Close Probability:** With an outstanding average conversion win rate of **${winRate}%**, we predict an estimated **${formatValue(activePipeline * (winRate/100))}** in near-term realized capital.\n* **Accelerators:** Your largest pending opportunity is **Vertex Corporation Enterprise Integration** valued at **${currency}24,000**. If negotiation succeeds, you will immediately hit 87% of your quarterly targets.`;
      } else if (userPrompt === "GROWTH_ACTIONS") {
        aiResponseText = `### High-Yield Tactical Actions Recommended\n\n1. **High-Priority Lead Nurture:** Contact **BioSphere Ltd** (Liam Neeson). Expected revenue is **${currency}15,000**. No touchpoints have occurred in 5 days; follow up date is set for July 12.\n2. **Task Clearance:** Resolve the pending high-priority task **"Draft contract for Vertex Corp Deal"**. It was due on July 2nd. This unblocks the $24,000 integration pipeline.\n3. **Qualified Pipeline Capture:** Move Milano Design's Analytics Dashboard trial from Qualification to Negotiation to capture **${currency}12,000** in active pipeline.`;
      } else if (userPrompt === "RISK_FACTORS") {
        aiResponseText = `### Critical Workspace Risks Flagged\n\n* ⚠️ **Past Due Actions:** 1 high-priority task is overdue (**"Draft contract for Vertex Corp Deal"**, due July 2nd). This directly bottlenecks closing dates.\n* ⚠️ **High-Value Lead Stagnation:** **Aether Technologies** ($32,000 inbound value) has had no activity logged for 10 days. Recommend immediate executive alignment outreach.\n* ⚠️ **CSAT Watchlist:** Though average CSAT is premium at **94.8%**, Nebula SaaS's subscription pause indicates a restructuring risk. Keep close watch.`;
      } else if (userPrompt === "DAILY_SUMMARY") {
        aiResponseText = `### Enterprise Summary - July 1st, 2026\n\n* **Active Revenue Won:** **${formatValue(totalRevenue)}** towards your target of **${formatValue(revenueTarget)}** (${revenueGoalPercentage}% Quota Attainment).\n* **Growth Index:** **${businessGrowthScore}/100** indicating strong commercial health, propelled by high win ratios.\n* **Client Health Meter:** CSAT is currently averaging **94.8%** across active tiers.\n* **Action Pipeline:** You have ${tasks.filter(t => !t.completed).length} pending items. Focus resources on closing the Vertex Corp contract immediately.`;
      } else {
        // Simple NLP Keyword matching
        const inputLower = textMsg.toLowerCase();
        if (inputLower.includes('revenue') || inputLower.includes('sales') || inputLower.includes('money')) {
          aiResponseText = `Based on current records, you've closed **${formatValue(totalRevenue)}** in total revenue. You have another **${formatValue(activePipeline)}** actively negotiating. To accelerate cash-flow, I recommend prioritizing the Vertex Corp deal ($24k) and the Titan Logistics database rebuild.`;
        } else if (inputLower.includes('lead') || inputLower.includes('prospect')) {
          aiResponseText = `You are currently tracking **${totalLeads} active leads**. The highest priority lead is Aether Technologies with an expected value of **${currency}32,000**. The primary marketing referral source driving conversion is LinkedIn Referrals, followed closely by Partner Networks.`;
        } else if (inputLower.includes('adjen') || inputLower.includes('tech') || inputLower.includes('company')) {
          aiResponseText = `Adjen Technologies has pioneered an innovation-driven, premium corporate footprint. Applying this ethos to your CRM boosts business velocity, visual branding compliance, and secure data orchestration. Our metrics are optimized for exponential commercial growth.`;
        } else {
          aiResponseText = `I have logged your request. Our automated analysis algorithm has checked the workspace. It recommends keeping our focus on closing the $24K Vertex Corporation integration contract and resolving the ${tasks.filter(t => !t.completed).length} pending items due this week to guarantee our target revenue path.`;
        }
      }

      setChatMessages(prev => [...prev, {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        text: aiResponseText,
        timestamp: new Date()
      }]);
      setIsAiThinking(false);
    }, 1200);
  };

  const handleCustomAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const input = aiInput;
    setAiInput('');
    triggerAiResponse("CUSTOM_QUERY", input);
  };

  // Quick Create Handlers
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddLead) {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        customerName: newLeadForm.customerName,
        source: newLeadForm.source,
        status: 'New',
        expectedRevenue: Number(newLeadForm.expectedRevenue),
        followUpDate: '2026-07-15',
        priority: newLeadForm.priority,
        notes: newLeadForm.notes,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddLead(newLead);
      setActiveModal(null);
      setNewLeadForm({ customerName: '', source: 'LinkedIn Referral', expectedRevenue: 10000, priority: 'High', notes: '' });
      // Add custom notification
      setUnreadNotifications(prev => ['new-lead-alert', ...prev]);
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddDeal) {
      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        title: newDealForm.title,
        customerName: newDealForm.customerName,
        value: Number(newDealForm.value),
        stage: newDealForm.stage,
        closingDate: newDealForm.closingDate,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddDeal(newDeal);
      setActiveModal(null);
      setNewDealForm({ title: '', customerName: '', value: 15000, stage: 'Qualification', closingDate: '2026-07-31' });
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddTask) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskForm.title,
        dueDate: newTaskForm.dueDate,
        completed: false,
        customerName: newTaskForm.customerName,
        priority: newTaskForm.priority,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddTask(newTask);
      setActiveModal(null);
      setNewTaskForm({ title: '', customerName: '', dueDate: '2026-07-05', priority: 'High' });
    }
  };

  // Mini-Kanban Pipeline stage modifier helper
  const updateDealStage = (dealId: string, newStage: Deal['stage']) => {
    const targetDeal = deals.find(d => d.id === dealId);
    if (targetDeal && onEditDeal) {
      onEditDeal({
        ...targetDeal,
        stage: newStage
      });
    }
  };

  // Team performance seed data (Quotas and statuses)
  const teamPerformance = [
    { name: 'Habeeb Rahman', role: 'Sales Director', closed: totalRevenue, quota: 100000, activeDeals: activeDealsCount, status: 'Online', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128' },
    { name: 'Elena Rostova', role: 'Enterprise AE', closed: 35000, quota: 80000, activeDeals: 2, status: 'Online', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128' },
    { name: 'Marcus Chen', role: 'Strategic AE', closed: 18500, quota: 60000, activeDeals: 1, status: 'Offline', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128' }
  ];

  // Projects Deliverables Progress Tracker
  const recentProjects = [
    { id: 'proj-1', name: 'Aether Cloud Migration (Phase 1)', client: 'Aether Technologies', progress: 85, status: 'In Review' },
    { id: 'proj-2', name: 'Vertex ERP Enterprise Integration', client: 'Vertex Corporation', progress: 40, status: 'Active Development' },
    { id: 'proj-3', name: 'BioSphere Green Supply PoC', client: 'BioSphere Ltd', progress: 15, status: 'Planning Phase' }
  ];

  // Lead Heatmap data grid calculations (Source vs Priority mapping)
  const heatmapSources = ['LinkedIn Referral', 'Partner Referral', 'Website Form', 'Cold Call'];
  const heatmapPriorities: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low'];

  const getHeatmapCellData = (source: string, priority: 'High' | 'Medium' | 'Low') => {
    const matchedLeads = leads.filter(l => l.source === source && l.priority === priority);
    const count = matchedLeads.length;
    const value = matchedLeads.reduce((acc, curr) => acc + curr.expectedRevenue, 0);
    return { count, value, matchedLeads };
  };

  // Task Due Highlighting for mini-Calendar (July 2026)
  const getTasksForDay = (day: number) => {
    const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  return (
    <div className="space-y-6 relative pb-16">
      
      {/* Dynamic Top Dashboard Branding Ribbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-black via-slate-950 to-black border border-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow corner elements reminiscent of Adjen brand */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD600]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFEA00]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.25em] text-[#FFD600] uppercase font-mono bg-[#FFD600]/10 border border-[#FFD600]/20 px-2 py-0.5 rounded-md font-extrabold">ADJEN INTELLIGENCE LAYER</span>
            <span className="text-[10px] text-slate-400 font-mono">• v3.8 ACTIVE</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-1">
            EXECUTIVE CONTROL DECK <span className="text-[#FFD600] text-sm animate-pulse">●</span>
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Real-time multi-dimensional orchestration of key accounts, lead densities, automated workflows, and corporate growth factors.
          </p>
        </div>

        {/* Dynamic Summary Micro Widget */}
        <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-2xl shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">GROWTH DECK</span>
            <span className="text-lg font-black text-[#FFD600] flex items-center gap-1">
              <Award className="w-5 h-5 text-[#FFD600]" /> {businessGrowthScore}%
            </span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">PIPELINE REACH</span>
            <span className="text-lg font-black text-white">{formatValue(activePipeline)}</span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          {/* Notifications Bell with badge counts */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-[#FFD600] rounded-xl border border-slate-800/80 transition-all relative group cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD600] rounded-full animate-ping"></span>
            )}
          </button>
        </div>
      </div>

      {/* Slide-out Notification Drawer Panel */}
      {showNotifications && (
        <div className="fixed inset-y-0 right-0 w-80 backdrop-blur-2xl bg-black/95 border-l border-slate-800/90 z-50 p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FFD600]" /> System Notifications
              </h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[80vh]">
              {unreadNotifications.includes('deal-risk') && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl relative">
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <div className="flex gap-2 text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-200">Contract Overdue Risk</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Task "Draft contract for Vertex Corp Deal" was due July 2nd.</p>
                    </div>
                  </div>
                </div>
              )}

              {unreadNotifications.includes('follow-up-biosphere') && (
                <div className="p-3 bg-[#FFD600]/5 border border-[#FFD600]/20 rounded-xl relative">
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FFD600] rounded-full"></span>
                  <div className="flex gap-2 text-xs">
                    <Zap className="w-4 h-4 text-[#FFD600] shrink-0" />
                    <div>
                      <p className="font-bold text-slate-200">AI Follow-up Recommended</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Liam Neeson (BioSphere Ltd) expects follow-up soon. $15K target.</p>
                    </div>
                  </div>
                </div>
              )}

              {unreadNotifications.includes('lead-vertex') && (
                <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-xl relative">
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <div className="flex gap-2 text-xs">
                    <Target className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-200">New High-value Lead Added</p>
                      <p className="text-slate-400 text-[10px] mt-0.5">Marcus Aurelius from Rome Consulting Group initialized inbound log.</p>
                    </div>
                  </div>
                </div>
              )}

              {unreadNotifications.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No active system alerts at this moment.
                </div>
              )}
            </div>
          </div>

          {unreadNotifications.length > 0 && (
            <button 
              onClick={() => setUnreadNotifications([])}
              className="w-full py-2 bg-slate-900 hover:bg-[#FFD600] text-slate-400 hover:text-black font-extrabold text-[10px] uppercase tracking-widest font-mono rounded-xl border border-slate-800 transition-all cursor-pointer"
            >
              Clear All System Alerts
            </button>
          )}
        </div>
      )}

      {/* Premium Workspace Selector Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-900/60">
        {[
          { id: 'overview', label: 'Overview Hub', icon: LayoutDashboard },
          { id: 'erp', label: 'ERP & Finance', icon: DollarSign },
          { id: 'hrm', label: 'HRM & Directory', icon: Briefcase },
          { id: 'projects', label: 'Scrum Sprints', icon: Layers },
          { id: 'support', label: 'Support Desk', icon: HelpCircle },
          { id: 'marketing', label: 'Campaigns', icon: Mail },
          { id: 'security', label: 'Role & 2FA Security', icon: Lock },
          { id: 'extras', label: 'Extras Sandbox', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subWorkspace === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubWorkspace(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer border ${
                isActive 
                  ? 'bg-[#FFD600] text-black border-[#FFD600] font-black shadow-[0_0_15px_rgba(255,214,0,0.25)]' 
                  : 'bg-black/40 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-900/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {subWorkspace === 'overview' && (
        <>
          {/* Bento-style KPI & Statistics Metric Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Revenue Goal Attainment */}
        <div className="backdrop-blur-xl bg-black/80 border border-slate-800/85 p-5 rounded-3xl relative overflow-hidden group hover:border-[#FFD600]/30 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD600]/5 rounded-full blur-2xl group-hover:bg-[#FFD600]/10 transition-all"></div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Revenue Won</span>
            <div className="p-2 bg-[#FFD600]/10 rounded-xl text-[#FFD600] border border-[#FFD600]/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="text-2xl font-black text-white">{formatValue(totalRevenue)}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Closed Won target of {formatValue(revenueTarget)}</p>
            </div>
            
            {/* Revenue goal bar tracker */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
                <span>REVENUE PROGRESS</span>
                <span>{revenueGoalPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="h-full bg-[#FFD600] rounded-full transition-all duration-1000" 
                  style={{ width: `${revenueGoalPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Pipeline velocity */}
        <div className="backdrop-blur-xl bg-black/80 border border-slate-800/85 p-5 rounded-3xl relative overflow-hidden group hover:border-slate-700/65 transition-all duration-300 shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/2 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Active Pipeline</span>
            <div className="p-2 bg-slate-900 rounded-xl text-slate-300 border border-slate-800 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-2xl font-black text-white">{formatValue(activePipeline)}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">{activeDealsCount} deals actively negotiating</p>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2 py-1 rounded-lg w-max">
              <Zap className="w-3.5 h-3.5 text-[#FFD600] animate-pulse" /> Close Potential: {formatValue(activePipeline * 0.75)}
            </div>
          </div>
        </div>

        {/* Metric 3: Lead Status Summary */}
        <div className="backdrop-blur-xl bg-black/80 border border-slate-800/85 p-5 rounded-3xl relative overflow-hidden group hover:border-slate-700/65 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Active Lead Intake</span>
            <div className="p-2 bg-slate-900 rounded-xl text-slate-300 border border-slate-800 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-2xl font-black text-white">{totalLeads}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">Leads awaiting further progression</p>
            </div>

            {/* Micro segments display */}
            <div className="grid grid-cols-5 gap-1 pt-1.5">
              {Object.entries(leadStatuses).map(([st, val]) => (
                <div key={st} className="flex flex-col items-center group/seg cursor-pointer" title={`${st}: ${val}`}>
                  <div className={`w-full h-1 rounded ${val > 0 ? 'bg-[#FFD600]' : 'bg-slate-800'}`}></div>
                  <span className="text-[7px] font-mono text-slate-500 font-black mt-1 uppercase truncate max-w-full">{st.charAt(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metric 4: Customer Satisfaction Gauge (Meter) */}
        <div className="backdrop-blur-xl bg-black/80 border border-slate-800/85 p-5 rounded-3xl relative overflow-hidden group hover:border-[#FFD600]/20 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Customer Health</span>
            <div className="p-2 bg-[#FFD600]/10 rounded-xl text-[#FFD600] border border-[#FFD600]/20">
              <Users className="w-4 h-4" />
            </div>
          </div>

          {/* Semicircular Gauge satisfaction meter */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-10 mt-2 shrink-0">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                {/* 94.8% Arc */}
                <path d="M 10 50 A 40 40 0 0 1 85 18" fill="none" stroke="#FFD600" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-end justify-center">
                <span className="text-xs font-mono font-black text-[#FFD600] pb-1">94%</span>
              </div>
            </div>
            <div>
              <div className="text-md font-black text-white">94.8% CSAT</div>
              <p className="text-[9px] text-slate-500 font-mono mt-0.5">OUTSTANDING RETENTION</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Core Widgets Section (Split into Chat Assistant & Timeline / Analytics Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Widget 1: Dynamic AI Business Assistant (Chat + Quick Insights panel) */}
        <div className="lg:col-span-1 backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-5 flex flex-col h-[520px] justify-between shadow-2xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/30 rounded-lg">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono">Adjen AI Core</h2>
                  <p className="text-[9px] text-[#FFD600] font-mono tracking-widest">REAL-TIME TELEMETRY</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[9px] text-[#FFD600] font-mono bg-[#FFD600]/10 px-2 py-0.5 rounded-full border border-[#FFD600]/20 font-bold">
                <Activity className="w-3 h-3 text-[#FFD600]" /> ONLINE
              </span>
            </div>

            {/* Chat message streams */}
            <div className="space-y-3 overflow-y-auto h-[290px] pr-1.5 text-xs scrollbar-thin">
              {chatMessages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#FFD600] text-black font-semibold rounded-tr-none' 
                      : 'bg-slate-950 border border-slate-900 text-slate-300 rounded-tl-none font-mono text-[11px]'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="text-[8px] font-bold text-slate-500 font-mono tracking-widest uppercase mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#FFD600]" /> ADJEN COGNITION ENGINE
                      </div>
                    )}
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={line.startsWith('*') ? 'ml-2 py-0.5' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              
              {isAiThinking && (
                <div className="flex justify-start">
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl rounded-tl-none text-slate-400 font-mono text-[10px] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FFD600] rounded-full animate-ping"></span>
                    <span>Adjen AI is calculating metrics...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>
          </div>

          {/* Quick AI Trigger Action Buttons / Custom Prompt Box */}
          <div className="space-y-2 border-t border-slate-900 pt-3">
            <div className="flex flex-wrap gap-1">
              <button 
                onClick={() => triggerAiResponse('ANALYZE_PIPELINE')}
                className="text-[9px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-800/80 transition-all cursor-pointer"
              >
                📊 Pipeline Velocity
              </button>
              <button 
                onClick={() => triggerAiResponse('GROWTH_ACTIONS')}
                className="text-[9px] font-mono bg-slate-900 hover:bg-[#FFD600] text-slate-300 hover:text-black px-2.5 py-1.5 rounded-lg border border-slate-800/80 transition-all cursor-pointer"
              >
                💡 Growth Actions
              </button>
              <button 
                onClick={() => triggerAiResponse('RISK_FACTORS')}
                className="text-[9px] font-mono bg-slate-900 hover:bg-red-950/40 text-slate-300 hover:text-red-400 px-2.5 py-1.5 rounded-lg border border-slate-800/80 transition-all cursor-pointer"
              >
                ⚠️ Flag Risks
              </button>
            </div>

            <form onSubmit={handleCustomAiSubmit} className="flex gap-1.5 relative">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask Adjen AI anything about accounts..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3 py-2 text-slate-100 text-[11px] outline-none transition-all font-mono"
              />
              <button 
                type="submit"
                className="p-2 bg-[#FFD600] hover:brightness-110 text-black rounded-xl border border-[#FFD600] transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Widget 2: Interactive Real-time Sales Pipeline Grid */}
        <div className="lg:col-span-2 backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-5 h-[520px] flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-900 text-[#FFD600] border border-slate-800 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono">Sales Cycle Board</h2>
                  <p className="text-[9px] text-slate-400 font-mono">Move deals across stages dynamically</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal('deal')}
                className="text-[10px] font-mono bg-[#FFD600]/10 hover:bg-[#FFD600] text-[#FFD600] hover:text-black font-extrabold px-3 py-1 rounded-lg border border-[#FFD600]/30 transition-all cursor-pointer"
              >
                + NEW DEAL
              </button>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-4 gap-2">
              {(['Qualification', 'Proposal', 'Negotiation', 'Closed Won'] as Deal['stage'][]).map(stage => {
                const stageDeals = deals.filter(d => d.stage === stage);
                const stageTotal = stageDeals.reduce((sum, current) => sum + current.value, 0);

                return (
                  <div key={stage} className="bg-slate-950/60 border border-slate-900/80 rounded-2xl p-2.5 h-[390px] overflow-y-auto pr-1">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white uppercase truncate font-mono">{stage === 'Closed Won' ? 'WON' : stage}</p>
                        <p className="text-[8px] text-[#FFD600] font-bold font-mono mt-0.5">{formatValue(stageTotal)}</p>
                      </div>
                      <span className="text-[8px] font-bold bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded-full">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {stageDeals.map(deal => (
                        <div 
                          key={deal.id} 
                          className="p-2.5 bg-black border border-slate-800 hover:border-[#FFD600]/30 rounded-xl transition-all relative group"
                        >
                          <div className="text-[10px] font-bold text-white tracking-tight line-clamp-2">{deal.title}</div>
                          <div className="text-[8px] text-slate-500 font-medium font-mono mt-1 uppercase">{deal.customerName}</div>
                          
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-900">
                            <span className="text-[10px] font-black text-[#FFD600] font-mono">{formatValue(deal.value)}</span>
                            
                            {/* Cycle controller stage shift buttons */}
                            <div className="flex items-center gap-1">
                              {stage !== 'Qualification' && (
                                <button
                                  onClick={() => {
                                    const stages: Deal['stage'][] = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
                                    const currentIdx = stages.indexOf(stage);
                                    if (currentIdx > 0) updateDealStage(deal.id, stages[currentIdx - 1]);
                                  }}
                                  className="p-1 hover:bg-[#FFD600]/10 hover:text-[#FFD600] rounded bg-slate-950 text-slate-500 transition-all cursor-pointer"
                                  title="Move Left"
                                >
                                  <ChevronLeft className="w-2.5 h-2.5" />
                                </button>
                              )}
                              {stage !== 'Closed Won' && (
                                <button
                                  onClick={() => {
                                    const stages: Deal['stage'][] = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
                                    const currentIdx = stages.indexOf(stage);
                                    if (currentIdx < stages.length - 1) updateDealStage(deal.id, stages[currentIdx + 1]);
                                  }}
                                  className="p-1 hover:bg-[#FFD600] hover:text-black rounded bg-slate-950 text-slate-500 transition-all cursor-pointer"
                                  title="Move Right"
                                >
                                  <ChevronRight className="w-2.5 h-2.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {stageDeals.length === 0 && (
                        <div className="text-center py-10 text-slate-700 text-[9px] font-mono uppercase">
                          EMPTY ZONE
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Interactive SVG Revenue Analytics Area Graph Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Premium Graph Card - MRR Trend Grid */}
        <div className="lg:col-span-2 backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-6 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#FFD600] rounded-full animate-ping"></span>
                <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono">Corporate Monthly Revenue Index</h2>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Dual-layer projection tracker for Q1-Q2 fiscal cycles</p>
            </div>
            
            <div className="flex items-center gap-4 text-[9px] font-mono font-bold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 bg-[#FFD600] rounded-full"></span> MRR Achieved
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 bg-slate-800 rounded-full border border-slate-700"></span> Projections
              </span>
            </div>
          </div>

          {/* Premium Custom Area SVG */}
          <div className="h-60 w-full relative">
            <svg viewBox="0 0 600 220" className="w-full h-full text-slate-800">
              <defs>
                <linearGradient id="yellowGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD600" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FFD600" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#111" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#111" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#111" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#111" strokeWidth="1" strokeDasharray="3 3" />

              {/* SVG coordinates calculations */}
              {(() => {
                const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
                const values = [15000, 22000, 31000, 48000, 62000, totalRevenue > 0 ? totalRevenue : 74000];
                const maxVal = 90000;

                const points = values.map((v, idx) => {
                  const x = 40 + idx * 108;
                  const y = 170 - (v / maxVal) * 140;
                  return { x, y, v };
                });

                const pathString = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const fillString = `${pathString} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`;

                return (
                  <>
                    {/* Glowing Area Fill */}
                    <path d={fillString} fill="url(#yellowGlow)" />
                    {/* Primary Curve */}
                    <path d={pathString} fill="none" stroke="#FFD600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Nodes Tooltips */}
                    {points.map((p, idx) => (
                      <g key={idx} className="group/dot cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="5" fill="#111" stroke="#FFD600" strokeWidth="3" className="transition-all hover:r-7" />
                        <text x={p.x} y={p.y - 14} fill="#FFD600" fontSize="10" className="font-mono font-bold opacity-0 group-hover/dot:opacity-100 transition-opacity" textAnchor="middle">
                          {formatValue(p.v)}
                        </text>
                        <text x={p.x} y="195" fill="#64748b" fontSize="10" className="font-mono font-bold" textAnchor="middle">
                          {monthsList[idx]}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* Axis markers */}
              <text x="35" y="24" fill="#475569" fontSize="9" className="font-mono" textAnchor="end">90K</text>
              <text x="35" y="74" fill="#475569" fontSize="9" className="font-mono" textAnchor="end">60K</text>
              <text x="35" y="124" fill="#475569" fontSize="9" className="font-mono" textAnchor="end">30K</text>
              <text x="35" y="174" fill="#475569" fontSize="9" className="font-mono" textAnchor="end">0</text>
            </svg>
          </div>
        </div>

        {/* Lead Heatmap Matrix */}
        <div className="backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
              <div className="p-1 bg-[#FFD600]/10 text-[#FFD600] rounded">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Referral Density Heatmap</h3>
                <p className="text-[9px] text-slate-500 font-mono">Priority vs Marketing Intake source</p>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-mono">
              <div className="text-[8px] text-slate-600 font-bold self-end uppercase">SRC / PRIO</div>
              {heatmapPriorities.map(p => (
                <div key={p} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p}</div>
              ))}

              {heatmapSources.map(source => (
                <React.Fragment key={source}>
                  <div className="text-[8px] text-slate-500 font-bold text-left self-center truncate max-w-full uppercase" title={source}>
                    {source.replace(' Referral', '').replace(' Form', '')}
                  </div>
                  {heatmapPriorities.map(priority => {
                    const cell = getHeatmapCellData(source, priority);
                    // Decide background scale based on lead value
                    const intensityClass = cell.count > 0 
                      ? cell.value > 20000 
                        ? 'bg-[#FFD600] border-[#FFD600] text-black shadow-[0_0_12px_rgba(255,214,0,0.3)] font-black'
                        : 'bg-[#FFD600]/20 border-[#FFD600]/30 text-[#FFD600] font-bold'
                      : 'bg-slate-950 border-slate-900 text-slate-700';

                    return (
                      <div 
                        key={priority}
                        className={`py-3.5 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center relative group/cell cursor-pointer ${intensityClass}`}
                      >
                        <span className="text-xs">{cell.count}</span>
                        {cell.count > 0 && (
                          <span className="text-[7px] font-bold block mt-0.5 opacity-90">{formatValue(cell.value)}</span>
                        )}

                        {/* Hovering Cell Tooltip */}
                        {cell.count > 0 && (
                          <div className="absolute bottom-full mb-1.5 hidden group-hover/cell:block z-50 bg-black border border-slate-800 p-2 rounded-lg text-[9px] text-slate-300 w-32 shadow-2xl text-left font-mono">
                            {cell.matchedLeads.map(l => (
                              <div key={l.id} className="border-b border-slate-900 pb-1 mb-1 last:border-0 last:pb-0">
                                <p className="font-extrabold text-white truncate">{l.customerName}</p>
                                <p className="text-[#FFD600] text-[8px]">{formatValue(l.expectedRevenue)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-4 border-t border-slate-900 mt-2">
            <span>LOW CONCENTRATION</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-slate-950 border border-slate-900 rounded-sm"></span>
              <span className="w-2 h-2 bg-[#FFD600]/20 border border-[#FFD600]/30 rounded-sm"></span>
              <span className="w-2 h-2 bg-[#FFD600] rounded-sm"></span>
            </div>
            <span>HIGH CONCENTRATION</span>
          </div>
        </div>

      </div>

      {/* Grid: Task Priorities & Follow-ups Calendar, Performance Deck & Timeline logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Mini-Calendar & Follow-up scheduler */}
        <div className="backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#FFD600]/10 text-[#FFD600] rounded">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">July 2026 Grid</h3>
                <p className="text-[9px] text-slate-500 font-mono">Task deadline & client appointment locator</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveModal('task')}
              className="text-[9px] font-mono bg-[#FFD600]/10 hover:bg-[#FFD600] text-[#FFD600] hover:text-black font-extrabold px-2.5 py-1 rounded-md border border-[#FFD600]/30 transition-all cursor-pointer"
            >
              + ADD TASK
            </button>
          </div>

          {/* Month Calendar representation (Starts on Wednesday July 1st 2026) */}
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-slate-600 font-bold uppercase">
              {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((dw, idx) => (
                <div key={idx}>{dw}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                const dayTasks = getTasksForDay(day);
                const hasTask = dayTasks.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`p-1.5 rounded-lg flex flex-col items-center justify-between h-9 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#FFD600] text-black font-black' 
                        : 'bg-slate-950 border border-slate-900/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{day}</span>
                    {hasTask && (
                      <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-black' : 'bg-[#FFD600]'}`}></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected day task summary details */}
            <div className="bg-slate-950/80 border border-slate-900 p-3 rounded-2xl min-h-[74px]">
              <div className="text-[9px] font-mono font-bold text-slate-500 uppercase">EVENTS ON JULY {selectedDay}, 2026</div>
              {getTasksForDay(selectedDay).length === 0 ? (
                <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase">No direct actions scheduled this day.</p>
              ) : (
                <div className="space-y-1.5 mt-2">
                  {getTasksForDay(selectedDay).map(t => (
                    <div key={t.id} className="flex items-center justify-between text-[11px] group">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CheckSquare className="w-3.5 h-3.5 text-[#FFD600] shrink-0" />
                        <span className="text-slate-300 truncate font-semibold">{t.title}</span>
                      </div>
                      <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.2 rounded border ${
                        t.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employees Quota Performance Grid */}
        <div className="backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
              <div className="p-1 bg-[#FFD600]/10 text-[#FFD600] rounded">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Executive Quota Deck</h3>
                <p className="text-[9px] text-slate-500 font-mono">Team performance & task velocity</p>
              </div>
            </div>

            <div className="space-y-3">
              {teamPerformance.map(rep => {
                const quotaPercent = Math.min(100, Math.round((rep.closed / rep.quota) * 100));
                
                return (
                  <div key={rep.name} className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rep.avatar} alt={rep.name} className="w-7 h-7 rounded-lg object-cover border border-slate-800" />
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{rep.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{rep.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono uppercase ${
                          rep.status === 'Online' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-slate-900 text-slate-500'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress tracking bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[8px] font-mono text-slate-400">
                        <span>CLOSED: {formatValue(rep.closed)}</span>
                        <span className="text-[#FFD600] font-black">{quotaPercent}% OF QUOTA</span>
                      </div>
                      <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FFD600] rounded-full" 
                          style={{ width: `${quotaPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3">
            <button 
              onClick={() => onNavigateToTab('reports')}
              className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-[#FFD600] font-bold text-[10px] uppercase tracking-widest font-mono rounded-xl border border-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Analyze Productivity Analytics <ArrowUpRight className="w-3.5 h-3.5 text-[#FFD600]" />
            </button>
          </div>
        </div>

        {/* Widget 5: Recent Projects Progress tracker */}
        <div className="backdrop-blur-xl bg-black/85 border border-slate-800/90 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
              <div className="p-1 bg-[#FFD600]/10 text-[#FFD600] rounded">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Recent Deliverables</h3>
                <p className="text-[9px] text-slate-500 font-mono">Active setup and client compliance scopes</p>
              </div>
            </div>

            <div className="space-y-3">
              {recentProjects.map(proj => (
                <div key={proj.id} className="p-3 bg-slate-950/60 border border-slate-900 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-100 tracking-tight leading-snug">{proj.name}</h4>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{proj.client}</p>
                    </div>
                    <span className="text-[8px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded uppercase font-black shrink-0">
                      {proj.status}
                    </span>
                  </div>

                  {/* Progress tracker bar */}
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                      <div className="h-full bg-[#FFD600] rounded-full" style={{ width: `${proj.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-slate-500">
                      <span>PROJECT INDEXING</span>
                      <span className="text-slate-300 font-bold">{proj.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <button 
              onClick={() => onNavigateToTab('customers')}
              className="w-full py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white font-bold text-[10px] uppercase tracking-widest font-mono rounded-xl border border-slate-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Consult Account Directories <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
      </>)}

      {/* ==========================================
          ERP & FINANCE WORKSPACE PANEL
          ========================================== */}
      {subWorkspace === 'erp' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Capital Liquidity P&L</span>
              <span className="text-2xl font-black text-[#FFD600] mt-1 block">{currency}{(totalRevenue + 56000).toLocaleString()}</span>
              <span className="text-[9px] text-emerald-400 font-mono font-bold mt-1 block">▲ +14.2% Growth index</span>
            </div>

            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Active Operating Budget</span>
              <span className="text-2xl font-black text-white mt-1 block">{currency}{(budgetLimit - budgetSpent).toLocaleString()}</span>
              <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-800">
                <div className="bg-[#FFD600] h-full" style={{ width: `${(budgetSpent / budgetLimit) * 100}%` }}></div>
              </div>
              <span className="text-[8px] text-slate-500 font-mono mt-1 block">Spent: {currency}{budgetSpent.toLocaleString()} of {currency}{budgetLimit.toLocaleString()}</span>
            </div>

            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Inventory Risk Index</span>
              <span className="text-2xl font-black text-red-500 mt-1 block">LOW STOCK</span>
              <span className="text-[9px] text-slate-400 font-mono block mt-1">1 essential SKU requires restocking sequence</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice ledger */}
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FFD600]" /> Enterprise Invoice Ledger
                </h3>
                <span className="text-[9px] bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded-full font-bold">3 records</span>
              </div>

              <div className="space-y-3">
                {erpInvoices.map(inv => (
                  <div key={inv.id} className="p-3 bg-slate-950 border border-slate-900/60 rounded-2xl flex items-center justify-between text-xs hover:border-[#FFD600]/20 transition-all">
                    <div>
                      <p className="font-bold text-white">{inv.id} - {inv.client}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Issued: {inv.date}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-extrabold text-[#FFD600] font-mono">{currency}{inv.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-600 font-mono">Tax: {currency}{inv.tax.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-black font-mono rounded uppercase ${
                        inv.status === 'Paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/20' : 
                        inv.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/20' : 
                        'bg-red-950/40 text-red-400 border border-red-900/20'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add invoice form inline */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!invoiceForm.client || !invoiceForm.amount) return;
                setErpInvoices([...erpInvoices, {
                  id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                  client: invoiceForm.client,
                  amount: Number(invoiceForm.amount),
                  tax: Number(invoiceForm.tax || (Number(invoiceForm.amount) * 0.05)),
                  date: new Date().toISOString().split('T')[0],
                  status: 'Pending'
                }]);
                setInvoiceForm({ client: '', amount: '', tax: '' });
              }} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 pt-4">
                <p className="text-[10px] font-bold text-[#FFD600] uppercase font-mono tracking-wider">Generate New Sales Invoice</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Client Entity"
                    value={invoiceForm.client}
                    onChange={(e) => setInvoiceForm({...invoiceForm, client: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Amount"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({...invoiceForm, amount: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  />
                  <button type="submit" className="bg-[#FFD600] text-black font-extrabold uppercase font-mono tracking-wider text-[10px] rounded-xl hover:brightness-110 cursor-pointer">
                    + EXECUTE INVOICE
                  </button>
                </div>
              </form>
            </div>

            {/* Warehouse Stock alerts */}
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#FFD600]" /> Core Inventory & Low Stock Monitors
                </h3>
                <span className="text-[9px] bg-red-950 text-red-400 border border-red-900 px-2.5 py-0.5 rounded-full font-bold">1 ALERT</span>
              </div>

              <div className="space-y-3">
                {inventoryProducts.map(prod => {
                  const isLow = prod.stock < prod.threshold;
                  return (
                    <div key={prod.barcode} className={`p-3 border rounded-2xl flex items-center justify-between text-xs transition-all ${
                      isLow ? 'bg-red-950/10 border-red-900/40' : 'bg-slate-950 border-slate-900/60'
                    }`}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{prod.name}</p>
                          {isLow && (
                            <span className="px-1.5 py-0.2 bg-red-500 text-black text-[8px] font-black rounded uppercase animate-pulse">Low stock</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">Barcode: {prod.barcode} | Loc: {prod.warehouse}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-slate-200">{prod.stock} Units</p>
                        <p className="text-[9px] text-[#FFD600] font-mono">{currency}{prod.price.toLocaleString()}/unit</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-slate-300 uppercase tracking-widest font-mono text-[9px]">Supplier Node Integration</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">Automated re-order dispatching when SKU drops past safety threshold.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInventoryProducts(inventoryProducts.map(p => p.barcode === 'ADJ-AI-800' ? { ...p, stock: 45 } : p));
                  }}
                  className="px-3 py-1.5 bg-[#FFD600]/10 hover:bg-[#FFD600] text-[#FFD600] hover:text-black font-extrabold uppercase font-mono tracking-wider text-[10px] border border-[#FFD600]/30 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Dispatch Re-order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          HRM & EMPLOYEE DIRECTORY WORKSPACE
          ========================================== */}
      {subWorkspace === 'hrm' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Employee Directory Column */}
            <div className="lg:col-span-2 backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#FFD600]" /> HRM Operational Staff Directory
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Designations, shift rotations, and current metrics</p>
                </div>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-3 py-0.5 rounded-full font-bold uppercase font-mono">{hrmEmployees.length} EMPLOYEES</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hrmEmployees.map(emp => (
                  <div key={emp.id} className="p-3 bg-slate-950 border border-slate-900 hover:border-[#FFD600]/30 rounded-2xl relative transition-all">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-xl object-cover border border-slate-800" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{emp.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono truncate">{emp.role} • {emp.dept}</p>
                        <p className="text-[9px] text-[#FFD600] font-mono mt-0.5 font-bold">Base: {currency}{emp.salary.toLocaleString()}/mo</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-900/85 mt-3 pt-2 text-[9px] font-mono">
                      <span className="text-slate-500">Shift: {emp.shift}</span>
                      <span className="text-emerald-400 font-bold">Att: {emp.attendance}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add staff form inline */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newEmployeeForm.name || !newEmployeeForm.role) return;
                setHrmEmployees([...hrmEmployees, {
                  id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
                  name: newEmployeeForm.name,
                  role: newEmployeeForm.role,
                  dept: newEmployeeForm.dept || 'Engineering',
                  designation: 'Specialist',
                  salary: Number(newEmployeeForm.salary || 5500),
                  shift: newEmployeeForm.shift || '09:00 - 18:00',
                  attendance: 100,
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128'
                }]);
                setNewEmployeeForm({ name: '', role: '', dept: '', salary: '', shift: '' });
              }} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 pt-4">
                <p className="text-[10px] font-bold text-[#FFD600] uppercase font-mono tracking-wider">Onboard New Team Specialist</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newEmployeeForm.name}
                    onChange={(e) => setNewEmployeeForm({...newEmployeeForm, name: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Role"
                    value={newEmployeeForm.role}
                    onChange={(e) => setNewEmployeeForm({...newEmployeeForm, role: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  />
                  <input
                    type="text"
                    placeholder="Dept (Commercial)"
                    value={newEmployeeForm.dept}
                    onChange={(e) => setNewEmployeeForm({...newEmployeeForm, dept: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  />
                  <button type="submit" className="bg-[#FFD600] text-black font-extrabold uppercase font-mono tracking-wider text-[10px] rounded-xl hover:brightness-110 cursor-pointer">
                    + EXECUTE ONBOARD
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column HRM - Security Badges & Talent openings */}
            <div className="space-y-6">
              
              {/* Security ID Badge Generator Panel */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Corporate ID Badge Generator</h3>
                  <p className="text-[8px] text-slate-500 font-mono uppercase">Instant NFC Access verification</p>
                </div>

                <div className="p-4 bg-gradient-to-b from-slate-950 via-black to-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center space-y-3">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD600] to-amber-500"></div>
                  
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128" alt="NFC Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD600]/40 p-0.5" />
                  
                  <div className="text-center">
                    <p className="text-sm font-black text-white">Habeeb Rahman</p>
                    <p className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest mt-0.5">Sales Director</p>
                    <p className="text-[8px] font-mono text-[#FFD600] bg-[#FFD600]/10 px-2 py-0.5 rounded-full border border-[#FFD600]/20 mt-2 font-black inline-block">ADJEN SECURE CORE AUTH</p>
                  </div>

                  <div className="w-full border-t border-slate-900 pt-2 text-center text-[7px] font-mono text-slate-600">
                    NFC-ID: 35f542e8-c765-4f53-a6df-e24faf5d67b7
                  </div>
                </div>
              </div>

              {/* Recruitment Candidates Pipeline */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Talent Recruitment Portal</h3>
                  <p className="text-[8px] text-slate-500 font-mono">Candidate tracking and open designations</p>
                </div>

                <div className="space-y-2">
                  {jobOpenings.map(job => (
                    <div key={job.title} className="p-3 bg-slate-950/60 border border-slate-900 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{job.title}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{job.dept} • {job.applicants} Applied</p>
                      </div>
                      <span className="text-[8px] bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/20 px-2 py-0.5 rounded-md font-mono font-bold uppercase">
                        {job.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          AGILE PROJECTS & KANBAN WORKSPACE
          ========================================== */}
      {subWorkspace === 'projects' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Agile Kanban Board columns */}
            <div className="lg:col-span-2 backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#FFD600]" /> Agile Scrum Kanban Sprints
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Move actions dynamically between delivery columns</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const titleInput = prompt('Enter Scrum Task Title:');
                    if (titleInput) {
                      setScrumTasks([...scrumTasks, {
                        id: `SCRUM-${Date.now()}`,
                        title: titleInput,
                        column: 'Backlog',
                        points: 5,
                        asignee: 'Habeeb Rahman'
                      }]);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#FFD600] text-black font-extrabold uppercase font-mono tracking-wider text-[10px] rounded-xl hover:brightness-110 cursor-pointer"
                >
                  + Add SPRINT TASK
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['Backlog', 'In Progress', 'Review', 'Done'].map(col => {
                  const colTasks = scrumTasks.filter(t => t.column === col);
                  return (
                    <div key={col} className="bg-slate-950/60 border border-slate-900/60 rounded-2xl p-2 min-h-[280px]">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 mb-2 px-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">{col}</span>
                        <span className="text-[8px] bg-slate-900 text-slate-500 px-1.5 py-0.2 rounded-full font-bold font-mono">{colTasks.length}</span>
                      </div>

                      <div className="space-y-2">
                        {colTasks.map(task => (
                          <div key={task.id} className="p-2 bg-black border border-slate-800 rounded-xl relative group text-xs space-y-1.5">
                            <p className="font-bold text-slate-200 line-clamp-2 leading-relaxed">{task.title}</p>
                            <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1.5 border-t border-slate-900/60">
                              <span>{task.points} pts • {task.asignee.split(' ')[0]}</span>
                              
                              <div className="flex gap-1">
                                {col !== 'Backlog' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cols = ['Backlog', 'In Progress', 'Review', 'Done'];
                                      const idx = cols.indexOf(col);
                                      setScrumTasks(scrumTasks.map(t => t.id === task.id ? { ...t, column: cols[idx - 1] } : t));
                                    }}
                                    className="p-0.5 bg-slate-900 rounded text-slate-400 hover:text-white cursor-pointer"
                                  >
                                    ◀
                                  </button>
                                )}
                                {col !== 'Done' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cols = ['Backlog', 'In Progress', 'Review', 'Done'];
                                      const idx = cols.indexOf(col);
                                      setScrumTasks(scrumTasks.map(t => t.id === task.id ? { ...t, column: cols[idx + 1] } : t));
                                    }}
                                    className="p-0.5 bg-slate-900 rounded text-slate-400 hover:text-[#FFD600] cursor-pointer"
                                  >
                                    ▶
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sprints Gantt and Discussion sandbox */}
            <div className="space-y-6">
              
              {/* Gantt Timelines */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Deliverables Gantt Timelines</h3>
                  <p className="text-[8px] text-slate-500 font-mono uppercase">Fiscal schedule roadmap progress</p>
                </div>

                <div className="space-y-3 font-mono text-[9px]">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Phase 1: DB Infrastructure</span>
                      <span className="text-emerald-400">85% Complete</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-emerald-500" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Phase 2: CRM Heatmap Integration</span>
                      <span className="text-[#FFD600]">40% Complete</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-[#FFD600]" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Phase 3: Automated Invoice Deployment</span>
                      <span className="text-slate-500">Scheduled (July 15)</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-[#FFD600]" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discussion comments board */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Team Sprints Discussions</h3>
                  <p className="text-[8px] text-slate-500 font-mono">Real-time developer log comments</p>
                </div>

                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 text-[10px] font-mono leading-relaxed text-slate-400">
                  {scrumComments.map((com, idx) => (
                    <p key={idx} className="border-b border-slate-900 pb-1.5 last:border-0">{com}</p>
                  ))}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newComment.trim()) return;
                  setScrumComments([...scrumComments, `You: ${newComment.trim()}`]);
                  setNewComment('');
                }} className="flex gap-1.5 pt-2">
                  <input
                    type="text"
                    placeholder="Contribute to discussion..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[10px] text-slate-200 font-mono outline-none focus:border-[#FFD600]"
                  />
                  <button type="submit" className="p-1.5 bg-[#FFD600] text-black rounded-xl border border-[#FFD600] hover:brightness-110 cursor-pointer font-bold font-mono text-[9px] uppercase">
                    Send
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          CUSTOMER SUPPORT DESK WORKSPACE
          ========================================== */}
      {subWorkspace === 'support' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Help desk Ticket registry */}
            <div className="lg:col-span-2 backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#FFD600]" /> Enterprise Help Desk Ticket Registry
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Track and resolve inbound complaints securely</p>
                </div>

                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={supportSearch}
                  onChange={(e) => setSupportSearch(e.target.value)}
                  className="bg-black border border-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600] font-mono text-slate-200"
                />
              </div>

              <div className="space-y-3">
                {supportTickets
                  .filter(t => t.title.toLowerCase().includes(supportSearch.toLowerCase()) || t.client.toLowerCase().includes(supportSearch.toLowerCase()))
                  .map(tck => (
                    <div key={tck.id} className="p-3 bg-slate-950 border border-slate-900 rounded-2xl flex items-center justify-between text-xs hover:border-[#FFD600]/20 transition-all">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-slate-200 truncate">{tck.client}</p>
                          <span className={`px-1.5 py-0.2 rounded text-[7px] font-black uppercase border ${
                            tck.priority === 'High' ? 'bg-red-950/40 text-red-400 border-red-900/30' : 
                            tck.priority === 'Medium' ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' :
                            'bg-slate-900 text-slate-500 border-slate-850'
                          }`}>
                            {tck.priority}
                          </span>
                        </div>
                        <p className="text-slate-400 font-semibold truncate leading-snug">{tck.title}</p>
                        <p className="text-[9px] text-slate-600 font-mono">Logged: {tck.created} | Ticket: {tck.id}</p>
                      </div>

                      <div className="text-right flex items-center gap-3.5">
                        <span className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded ${
                          tck.status === 'Resolved' ? 'bg-emerald-950/40 text-emerald-400' :
                          tck.status === 'In Progress' ? 'bg-indigo-950/40 text-indigo-400' :
                          'bg-red-950/40 text-red-400'
                        }`}>
                          {tck.status}
                        </span>
                        
                        {tck.status !== 'Resolved' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSupportTickets(supportTickets.map(t => t.id === tck.id ? { ...t, status: 'Resolved' } : t));
                            }}
                            className="p-1 hover:bg-[#FFD600] text-slate-400 hover:text-black rounded bg-slate-900 transition-colors cursor-pointer text-[10px]"
                            title="Mark Resolved"
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Log new ticket form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!ticketForm.client || !ticketForm.title) return;
                setSupportTickets([
                  {
                    id: `TCK-${Math.floor(200 + Math.random() * 800)}`,
                    client: ticketForm.client,
                    title: ticketForm.title,
                    priority: ticketForm.priority,
                    status: 'Open',
                    created: new Date().toISOString().split('T')[0]
                  },
                  ...supportTickets
                ]);
                setTicketForm({ client: '', title: '', priority: 'High' });
              }} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 pt-4">
                <p className="text-[10px] font-bold text-[#FFD600] uppercase font-mono tracking-wider font-black">Log New Inbound Ticket</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Client Name"
                    value={ticketForm.client}
                    onChange={(e) => setTicketForm({...ticketForm, client: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Summary of Issue"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600] sm:col-span-2"
                  />
                  <button type="submit" className="bg-[#FFD600] text-black font-extrabold uppercase font-mono tracking-wider text-[10px] rounded-xl hover:brightness-110 cursor-pointer whitespace-nowrap">
                    + LOG TICKET
                  </button>
                </div>
              </form>
            </div>

            {/* Support Live Chat Simulation and Knowledge base */}
            <div className="space-y-6">
              
              {/* Interactive Live Chat Sim */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl h-[280px] flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-900 pb-2 flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Live Support Simulation</h3>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>

                  <div className="space-y-2 mt-3 overflow-y-auto max-h-[160px] pr-1 text-[10px]">
                    {chatLogs.map(log => (
                      <div key={log.id} className={`flex flex-col ${log.sender === 'Client' ? 'items-start' : 'items-end'}`}>
                        <span className="text-[8px] text-slate-500 font-mono font-bold uppercase">{log.sender}</span>
                        <p className={`p-2 rounded-xl mt-0.5 leading-relaxed font-mono ${
                          log.sender === 'Client' ? 'bg-slate-950 border border-slate-900 text-slate-300' : 'bg-[#FFD600]/10 text-[#FFD600] border border-[#FFD600]/25'
                        }`}>
                          {log.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatInput.trim()) return;
                  const uMsg = chatInput;
                  setChatInput('');
                  setChatLogs(prev => [...prev, { id: Date.now(), sender: 'Client', text: uMsg }]);
                  
                  // Auto reply simulation
                  setTimeout(() => {
                    setChatLogs(prev => [...prev, {
                      id: Date.now() + 1,
                      sender: 'Support Agent (AI)',
                      text: `Thanks for querying Adjen Tech. We have categorized your query and dispatched notification payload TCK-201 to the strategic engineering channel.`
                    }]);
                  }, 1200);
                }} className="flex gap-1 border-t border-slate-900 pt-2.5">
                  <input
                    type="text"
                    placeholder="Simulate customer chat query..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] text-slate-200 font-mono outline-none focus:border-[#FFD600]"
                  />
                  <button type="submit" className="p-1 bg-[#FFD600] text-black rounded-lg hover:brightness-110 cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* FAQ and knowledge base */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-3.5">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">FAQ Core Guidelines</h3>
                  <p className="text-[8px] text-slate-500 font-mono font-bold uppercase">General corporate resolving protocols</p>
                </div>

                <div className="space-y-2 text-[10px] leading-relaxed text-slate-400 font-mono">
                  <p className="border-b border-slate-900/60 pb-1.5"><strong className="text-slate-200">Q: How to authorize developer credentials?</strong> Use the roles dashboard panel under workspace configurations matrix.</p>
                  <p className="pb-1"><strong className="text-slate-200">Q: Where are CRM audit log histories kept?</strong> Kept securely in the security compliance ledger with MFA restrictions.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          MARKETING & CAMPAIGNS WORKSPACE
          ========================================== */}
      {subWorkspace === 'marketing' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Campaigns registry */}
            <div className="lg:col-span-2 backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FFD600]" /> Marketing Automation Sprints
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Email, WhatsApp, and SMS campaigns status dashboard</p>
                </div>
                <span className="text-[9px] bg-slate-900 text-[#FFD600] border border-slate-800 px-2 py-0.5 rounded-full font-mono font-bold uppercase">3 CAMPAIGNS ACTIVE</span>
              </div>

              <div className="space-y-3">
                {marketingCampaigns.map(cmp => {
                  const clickRate = cmp.sent > 0 ? Math.round((cmp.clicks / cmp.sent) * 100) : 0;
                  const openRate = cmp.sent > 0 ? Math.round((cmp.opens / cmp.sent) * 100) : 0;

                  return (
                    <div key={cmp.id} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 text-xs hover:border-[#FFD600]/20 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-bold text-white text-[13px]">{cmp.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{cmp.type} • ID: {cmp.id}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[8px] font-mono font-black uppercase rounded ${
                          cmp.status === 'Sending' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/20' :
                          cmp.status === 'Completed' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/20' :
                          'bg-slate-900 text-slate-500 border-slate-850'
                        }`}>
                          {cmp.status}
                        </span>
                      </div>

                      {cmp.sent > 0 && (
                        <div className="grid grid-cols-3 gap-2 text-center bg-black/60 border border-slate-900 p-2 rounded-xl font-mono text-[10px]">
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase">Dispatched</p>
                            <p className="font-extrabold text-slate-200 mt-0.5">{cmp.sent}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase">Open Efficiency</p>
                            <p className="font-extrabold text-emerald-400 mt-0.5">{openRate}%</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-[8px] uppercase">Click rate</p>
                            <p className="font-extrabold text-[#FFD600] mt-0.5">{clickRate}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Campaign builder form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newCampaignName) return;
                setMarketingCampaigns([
                  ...marketingCampaigns,
                  {
                    id: `CMP-${Math.floor(10 + Math.random() * 90)}`,
                    name: newCampaignName,
                    type: newCampaignType,
                    status: 'Draft',
                    sent: 0, opens: 0, clicks: 0
                  }
                ]);
                setNewCampaignName('');
              }} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3 pt-4">
                <p className="text-[10px] font-bold text-[#FFD600] uppercase font-mono tracking-wider font-black">Configure Marketing Campaign</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Campaign Name (e.g. Q3 Upgrade Webinar)"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600] sm:col-span-2"
                  />
                  <select
                    value={newCampaignType}
                    onChange={(e) => setNewCampaignType(e.target.value)}
                    className="bg-black border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#FFD600]"
                  >
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="WhatsApp Campaign">WhatsApp Campaign</option>
                    <option value="SMS Campaign">SMS Campaign</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-2 bg-[#FFD600] text-black font-extrabold uppercase font-mono tracking-wider text-[10px] rounded-xl hover:brightness-110 cursor-pointer">
                  + REGISTER MARKETING CAMPAIGN
                </button>
              </form>
            </div>

            {/* Campaign Analytics and target audience groups */}
            <div className="space-y-6">
              
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Audience Groupings</h3>
                  <p className="text-[8px] text-slate-500 font-mono uppercase">Segment lists for targeted broadcasts</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-xl flex justify-between items-center">
                    <p className="font-bold text-slate-200">VIP Enterprise Directors</p>
                    <span className="text-[10px] font-mono font-black text-[#FFD600]">14 Contacts</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-xl flex justify-between items-center">
                    <p className="font-bold text-slate-200">Warm Inbound Signups</p>
                    <span className="text-[10px] font-mono font-black text-slate-400">85 Contacts</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          ROLE BASED SECURITY & 2FA AUDIT WORKSPACE
          ========================================== */}
      {subWorkspace === 'security' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Roles and permissions grid */}
            <div className="lg:col-span-2 backdrop-blur-md bg-black/80 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="border-b border-slate-900 pb-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#FFD600]" /> Role-Based Access Permissions Matrix
                </h3>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">Control read, write, and security configurations matrix globally</p>
              </div>

              <div className="space-y-3">
                {rolePermissions.map(perm => (
                  <div key={perm.role} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-xs">{perm.role}</p>
                      <span className="text-[8px] bg-[#FFD600]/10 text-[#FFD600] px-2 py-0.5 rounded border border-[#FFD600]/25 font-mono uppercase font-black">active status</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono">
                      <div className={`p-1.5 rounded-lg border ${perm.read ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/20' : 'bg-slate-900 text-slate-600 border-slate-850'}`}>READ ACCESS</div>
                      <div className={`p-1.5 rounded-lg border ${perm.write ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/20' : 'bg-slate-900 text-slate-600 border-slate-850'}`}>WRITE ACCESS</div>
                      <div className={`p-1.5 rounded-lg border ${perm.delete ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/20' : 'bg-slate-900 text-slate-600 border-slate-850'}`}>DELETE RECORDS</div>
                      <div className={`p-1.5 rounded-lg border ${perm.config ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/20' : 'bg-slate-900 text-slate-600 border-slate-850'}`}>CONFIG SETTINGS</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - 2FA code generator and Security Audit Logs */}
            <div className="space-y-6">
              
              {/* 2FA OTP simulator */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Secure Multi-Factor Simulator</h3>
                  <p className="text-[8px] text-slate-500 font-mono">Request and verify OTP authorization seeds</p>
                </div>

                <div className="space-y-3">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(true);
                        setIsOtpVerified(false);
                        const code = Math.floor(100000 + Math.random() * 900000).toString();
                        setOtpInput('');
                        alert(`SIMULATED OTP SENT TO YOUR GIVEN ACCESS DECK: ${code}`);
                        (window as any)._simOtp = code;
                      }}
                      className="w-full py-2 bg-[#FFD600] text-black font-extrabold uppercase font-mono tracking-widest text-[10px] rounded-xl hover:brightness-110 cursor-pointer"
                    >
                      Request MFA Code
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[9px] text-slate-400 font-mono text-center uppercase">Simulated Code Sent. Check alert prompt.</p>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="######"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="bg-black border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs text-center font-mono focus:border-[#FFD600] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (otpInput === (window as any)._simOtp) {
                              setIsOtpVerified(true);
                              setOtpSent(false);
                            } else {
                              alert('Verification failed. Incorrect secure secret.');
                            }
                          }}
                          className="bg-slate-900 text-[#FFD600] border border-slate-800 px-3 py-1.5 rounded-xl font-bold font-mono text-xs cursor-pointer hover:bg-slate-800"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {isOtpVerified && (
                    <p className="text-[10px] text-emerald-400 font-mono font-bold text-center uppercase tracking-wider animate-pulse">✓ VERIFIED: MFA SECURE ORCHESTRATION LOCKED</p>
                  )}
                </div>
              </div>

              {/* Real-time Audit Logs timeline list */}
              <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-3">
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Workspace Audit Ledgers</h3>
                  <p className="text-[8px] text-slate-500 font-mono">Recent critical telemetry actions log</p>
                </div>

                <div className="space-y-2 text-[8px] font-mono text-slate-500 leading-normal max-h-[160px] overflow-y-auto pr-1">
                  <p className="border-b border-slate-900/60 pb-1.5"><span className="text-[#FFD600]">23:01:54:</span> Auth Token generated for habeebrahmanj2006@gmail.com</p>
                  <p className="border-b border-slate-900/60 pb-1.5"><span className="text-slate-400">22:45:10:</span> Updated customer account information for Sarah Connor</p>
                  <p className="pb-1"><span className="text-slate-400">22:30:15:</span> Invoice generated INV-1006 worth $15,000</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          EXTRAS, WIDGETS & SANDBOX EXPERIENCES
          ========================================== */}
      {subWorkspace === 'extras' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* World Branch Clock Widget */}
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4">
              <div className="border-b border-slate-900 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#FFD600]" /> World Branch Clocks
                </h3>
                <p className="text-[8px] text-slate-500 font-mono font-bold uppercase">Corporate multi-branch temporal nodes</p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Adjen HQ - Boston, USA', zone: 'America/New_York' },
                  { name: 'Milano R&D - Milan, Italy', zone: 'Europe/Rome' },
                  { name: 'Tech Hub - London, UK', zone: 'Europe/London' }
                ].map(branch => {
                  const localT = new Date().toLocaleTimeString('en-US', { timeZone: branch.zone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return (
                    <div key={branch.name} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{branch.name}</p>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">{branch.zone}</p>
                      </div>
                      <span className="text-sm font-black text-[#FFD600] font-mono">{localT}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Notes Sandbox */}
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4 flex flex-col justify-between h-[280px]">
              <div>
                <div className="border-b border-slate-900 pb-2 flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#FFD600]" /> Workspace Sticky Notes
                  </h3>
                  <span className="text-[8px] bg-[#FFD600]/15 text-[#FFD600] px-2 py-0.2 rounded font-mono font-bold">{stickyNotes.length} notes</span>
                </div>

                <div className="space-y-2 mt-3 overflow-y-auto max-h-[140px] pr-1">
                  {stickyNotes.map(note => (
                    <div key={note.id} className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[11px] text-slate-300 font-mono flex items-center justify-between">
                      <p className="leading-relaxed truncate max-w-[85%]">{note.text}</p>
                      <button
                        type="button"
                        onClick={() => setStickyNotes(stickyNotes.filter(n => n.id !== note.id))}
                        className="text-red-400 hover:text-red-300 font-bold cursor-pointer text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newStickyText.trim()) return;
                setStickyNotes([...stickyNotes, { id: `note-${Date.now()}`, text: newStickyText }]);
                setNewStickyText('');
              }} className="flex gap-1.5 pt-2 border-t border-slate-900">
                <input
                  type="text"
                  placeholder="New sticky reminder..."
                  value={newStickyText}
                  onChange={(e) => setNewStickyText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-[10px] text-slate-200 font-mono outline-none focus:border-[#FFD600]"
                />
                <button type="submit" className="p-1 bg-[#FFD600] text-black font-bold text-xs rounded-lg hover:brightness-110 cursor-pointer">
                  +
                </button>
              </form>
            </div>

            {/* Elegant glassmorphism calculator widget */}
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4">
              <div className="border-b border-slate-900 pb-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Revenue Workspace Calculator</h3>
                <p className="text-[8px] text-slate-500 font-mono">Execute math calculations directly</p>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-2xl text-right font-mono text-sm text-slate-100 min-h-[40px] flex flex-col justify-center">
                  <p className="text-[9px] text-slate-600 truncate">{calculatorInput || '0'}</p>
                  <p className="font-extrabold text-[#FFD600] truncate mt-0.5">{calculatorResult || '0'}</p>
                </div>

                <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs text-slate-300">
                  {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => (
                    <button
                      type="button"
                      key={btn}
                      onClick={() => {
                        if (btn === '=') {
                          try {
                            // Safe math calculation evaluation (no dangerous eval of raw elements)
                            const sanitized = calculatorInput.replace(/[^0-9+\-*/.]/g, '');
                            const result = new Function(`return ${sanitized}`)();
                            setCalculatorResult(String(result));
                          } catch (err) {
                            setCalculatorResult('ERR');
                          }
                        } else {
                          setCalculatorInput(prev => prev + btn);
                        }
                      }}
                      className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 rounded-xl hover:text-white transition-all cursor-pointer font-black"
                    >
                      {btn}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setCalculatorInput(''); setCalculatorResult(''); }}
                    className="col-span-4 p-2 bg-red-950/20 hover:bg-red-900/20 text-red-400 hover:text-red-300 border border-red-900/30 font-bold rounded-xl text-[10px] uppercase cursor-pointer transition-colors"
                  >
                    Clear Workspace Calculator
                  </button>
                </div>
              </div>
            </div>

            {/* Live Weather Widget */}
            <div className="backdrop-blur-md bg-black/80 border border-slate-800 p-5 rounded-3xl space-y-4 flex flex-col justify-between h-[280px]">
              <div>
                <div className="border-b border-slate-900 pb-2">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Live Corporate Weather</h3>
                  <p className="text-[8px] text-slate-500 font-mono uppercase">HQ microclimate conditions tracker</p>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="w-12 h-12 bg-[#FFD600]/10 border border-[#FFD600]/30 rounded-2xl flex items-center justify-center text-2xl text-[#FFD600]">
                    ☀️
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">74°F</p>
                    <p className="text-xs text-slate-400 font-mono">Sunny & Ambient Humidity 42%</p>
                    <p className="text-[9px] text-[#FFD600] font-mono mt-0.5 font-bold">Adjen HQ - Boston, MA</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-3 text-[9px] font-mono text-slate-500 leading-relaxed uppercase">
                Weather conditions updated dynamically against localized localized sensor array.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Action Menu (FAB) in the corner of CRM for speedy triggers */}
      <div className="fixed bottom-6 right-6 z-40">
        {showFABMenu && (
          <div className="absolute bottom-16 right-0 space-y-2.5 animate-in fade-in slide-in-from-bottom duration-200">
            <button
              onClick={() => { setActiveModal('lead'); setShowFABMenu(false); }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-black border border-slate-800 text-slate-100 hover:text-[#FFD600] hover:border-[#FFD600]/30 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold transition-all w-max cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-[#FFD600]" /> + Inbound Lead
            </button>
            <button
              onClick={() => { setActiveModal('deal'); setShowFABMenu(false); }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-black border border-slate-800 text-slate-100 hover:text-[#FFD600] hover:border-[#FFD600]/30 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold transition-all w-max cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#FFD600]" /> + Revenue Deal
            </button>
            <button
              onClick={() => { setActiveModal('task'); setShowFABMenu(false); }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-black border border-slate-800 text-slate-100 hover:text-[#FFD600] hover:border-[#FFD600]/30 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-bold transition-all w-max cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#FFD600]" /> + Action Task
            </button>
          </div>
        )}

        <button
          onClick={() => setShowFABMenu(!showFABMenu)}
          className="p-4 bg-[#FFD600] text-black hover:brightness-110 rounded-full shadow-[0_0_24px_rgba(255,214,0,0.4)] transition-all cursor-pointer group"
          id="dashboard-fab"
        >
          <Plus className={`w-5 h-5 transition-transform duration-300 ${showFABMenu ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {/* Quick Create Lead Dialog Modal */}
      {activeModal === 'lead' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#FFD600]" /> Initialize Inbound Lead
            </h3>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Customer / Entity Name</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.customerName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, customerName: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Expected Valuation</label>
                  <input
                    type="number"
                    required
                    value={newLeadForm.expectedRevenue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, expectedRevenue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Lead Priority</label>
                  <select
                    value={newLeadForm.priority}
                    onChange={(e: any) => setNewLeadForm({ ...newLeadForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-300 text-sm outline-none transition-all"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Ingress Source Referrals</label>
                <input
                  type="text"
                  value={newLeadForm.source}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Workflow Notes</label>
                <textarea
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Primary requirements described by CTO..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all h-20"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD600] hover:brightness-110 text-black font-extrabold text-xs tracking-wider uppercase font-mono rounded-xl transition-all cursor-pointer"
              >
                Log Inbound Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Create Deal Dialog Modal */}
      {activeModal === 'deal' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#FFD600]" /> Log Revenue Deal
            </h3>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  value={newDealForm.title}
                  onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                  placeholder="e.g. ERP Expansion"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Customer / Entity Name</label>
                <input
                  type="text"
                  required
                  value={newDealForm.customerName}
                  onChange={(e) => setNewDealForm({ ...newDealForm, customerName: e.target.value })}
                  placeholder="e.g. Vertex Corporation"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Valuation Value</label>
                  <input
                    type="number"
                    required
                    value={newDealForm.value}
                    onChange={(e) => setNewDealForm({ ...newDealForm, value: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Closing Target Date</label>
                  <input
                    type="date"
                    required
                    value={newDealForm.closingDate}
                    onChange={(e) => setNewDealForm({ ...newDealForm, closingDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-300 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Initial Funnel Stage</label>
                <select
                  value={newDealForm.stage}
                  onChange={(e: any) => setNewDealForm({ ...newDealForm, stage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-300 text-sm outline-none transition-all"
                >
                  <option value="Qualification">Qualification</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD600] hover:brightness-110 text-black font-extrabold text-xs tracking-wider uppercase font-mono rounded-xl transition-all cursor-pointer"
              >
                Launch Deal Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Create Task Dialog Modal */}
      {activeModal === 'task' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-black border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#FFD600]" /> Organize Workflow Task
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Task Action Description</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g. Conduct alignment follow-up call"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Target Account Name</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.customerName}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, customerName: e.target.value })}
                  placeholder="e.g. BioSphere Ltd"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Due Deadline</label>
                  <input
                    type="date"
                    required
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-300 text-sm outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono mb-1">Priority Rating</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e: any) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] rounded-xl px-3.5 py-2 text-slate-300 text-sm outline-none transition-all"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD600] hover:brightness-110 text-black font-extrabold text-xs tracking-wider uppercase font-mono rounded-xl transition-all cursor-pointer"
              >
                Log Workflow Task
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
