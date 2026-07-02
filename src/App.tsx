import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Target, DollarSign, Folder, HelpCircle, Sparkles, 
  Settings as SettingsIcon, LogOut, Bell, Menu, X, Sun, Moon, Search, 
  ChevronDown, ChevronRight, Check, AlertCircle, RefreshCcw, Landmark, User, Cpu, ShieldCheck, Calendar, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  initLocalStorage, getCustomers, getLeads, getDeals, getTasks, getActivities, 
  getUser, getSettings, saveCustomers, saveLeads, saveDeals, saveTasks, 
  saveUser, saveSettings, addActivity 
} from './crmData';
import { Customer, Lead, Deal, Task, User as UserType, CrmSettings, Activity } from './types';

// Modular Sections Imports
import DashboardOverview from './components/DashboardOverview';
import CustomersSection from './components/CustomersSection';
import LeadsSection from './components/LeadsSection';
import SalesSection from './components/SalesSection';
import ProjectsSection from './components/ProjectsSection';
import EmployeesSection from './components/EmployeesSection';
import SupportSection from './components/SupportSection';
import ReportsSection from './components/ReportsSection';
import AiAssistantSection from './components/AiAssistantSection';
import SettingsSection from './components/SettingsSection';
import AdjenWebsite from './components/AdjenWebsite';

// Role-Based Access Control Imports
import RoleSelector from './components/RoleSelector';
import SuperAdminSection from './components/SuperAdminSection';
import ManagerSection from './components/ManagerSection';
import SalesExecutiveSection from './components/SalesExecutiveSection';
import SupportExecutiveSection from './components/SupportExecutiveSection';
import Auth from './components/Auth';

// 403: Access Denied / Unauthorized view component
function AccessDenied({ role, requestedView, onRedirect }: { role: string; requestedView: string; onRedirect: () => void }) {
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onRedirect]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto my-12 backdrop-blur-xl bg-zinc-950/70 border border-red-900/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.07)] text-center space-y-6"
    >
      <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">403: SECURITY DIRECTIVE</h2>
        <p className="text-[10px] text-red-400 font-mono uppercase tracking-widest">ACCESS CLASSIFICATION FORBIDDEN</p>
      </div>
      
      <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto font-sans">
        Your active account classification (<strong className="text-white uppercase">{role}</strong>) does not hold authorization keys to access the section <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-yellow-400 font-mono font-bold">{requestedView}</code>.
      </p>

      <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl font-mono text-[10px] text-zinc-500">
        Automatic rerouting back to secure deck in <strong className="text-white text-xs">{countdown}s</strong>...
      </div>

      <button 
        onClick={onRedirect}
        className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white text-xs font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer"
      >
        ← Return to Safe Workspace
      </button>
    </motion.div>
  );
}

// Global Role-Based Security Validation Helper
export function isViewAllowedForRole(view: string, role: string): boolean {
  if (role === 'Super Admin') return true;
  
  if (role === 'Admin') {
    // Allowed: customers, leads, employees, projects, reports, settings-profile, dashboard-*
    if (view.startsWith('admin-')) return false; // No Role Management, No System Settings
    if (view.startsWith('manager-')) return false;
    if (view.startsWith('sales-')) return false;
    if (view.startsWith('support-')) return false;
    if (view.startsWith('ai-')) return false;
    return true;
  }
  
  if (role === 'Manager') {
    // Allowed: manager-*, calendar-meetings, customers-all, leads-pipeline, reports-sales, settings-profile, dashboard-overview
    if (view.startsWith('admin-')) return false;
    if (view.startsWith('employees-')) return false; // No Employee Management
    if (view.startsWith('sales-')) return false;
    if (view.startsWith('support-')) return false;
    if (view.startsWith('ai-')) return false;
    if (view.startsWith('projects-')) return false;
    
    if (view.startsWith('manager-')) return true;
    if (view === 'calendar-meetings') return true;
    if (view === 'dashboard-overview') return true;
    if (view === 'customers-all') return true;
    if (view === 'leads-pipeline') return true;
    if (view === 'reports-sales') return true;
    if (view === 'settings-profile') return true;
    return false;
  }
  
  if (role === 'Sales Executive') {
    // Allowed: sales-*, settings-profile, dashboard-overview
    if (view === 'dashboard-overview') return true;
    if (view.startsWith('sales-')) return true;
    if (view === 'settings-profile') return true;
    return false;
  }
  
  if (role === 'Support Executive') {
    // Allowed: support-*, settings-profile, dashboard-overview
    if (view === 'dashboard-overview') return true;
    if (view.startsWith('support-')) return true;
    if (view === 'settings-profile') return true;
    return false;
  }
  
  return false;
}

export default function App() {
  const [viewMode, setViewMode] = useState<'website' | 'crm'>('website');
  // Initialize seed database if empty
  useEffect(() => {
    initLocalStorage();
  }, []);

  // Retrieve active session from either persistent localStorage or volatile sessionStorage
  const getActiveSession = (): UserType | null => {
    const localUser = localStorage.getItem('crm_user');
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        if (parsed && parsed.id === 'user-default') {
          localStorage.removeItem('crm_user');
          return null;
        }
        return parsed;
      } catch(e) {}
    }
    const sessionUser = sessionStorage.getItem('crm_user');
    if (sessionUser) {
      try {
        const parsed = JSON.parse(sessionUser);
        if (parsed && parsed.id === 'user-default') {
          sessionStorage.removeItem('crm_user');
          return null;
        }
        return parsed;
      } catch(e) {}
    }
    return null;
  };

  // Global Core CRM states loaded from active session or starts empty for secure login
  const [currentUser, setCurrentUser] = useState<UserType | null>(getActiveSession());
  const [customers, setCustomers] = useState<Customer[]>(getCustomers());
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [deals, setDeals] = useState<Deal[]>(getDeals());
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [activities, setActivities] = useState<Activity[]>(getActivities());
  const [settings, setSettings] = useState<CrmSettings>(getSettings() || {
    currency: '$',
    theme: 'dark',
    enableReminders: true,
    companyName: 'Adjen Technologies'
  });

  // Navigation states
  const [activeSubView, setActiveSubView] = useState<string>('dashboard-overview');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'dashboard': true,
    'customers': true,
    'leads': false,
    'sales': false,
    'projects': false,
    'employees': false,
    'support': false,
    'reports': false,
    'ai': false,
    'settings': false
  });

  // Layout UI states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Authenticate user session with direct role detecting dashboard routing
  const handleLogin = (user: UserType, rememberMe: boolean) => {
    setCurrentUser(user);
    const userStr = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem('crm_user', userStr);
    } else {
      sessionStorage.setItem('crm_user', userStr);
    }

    // Role-based custom redirections
    const defaultViews: Record<string, string> = {
      'Super Admin': 'admin-users',
      'Admin': 'dashboard-overview',
      'Manager': 'manager-assign',
      'Sales Executive': 'sales-customers',
      'Support Executive': 'support-tickets'
    };
    const defaultView = defaultViews[user.role] || 'dashboard-overview';
    setActiveSubView(defaultView);
  };

  // Log out action clears current credentials and relocates back to auth deck
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('crm_user');
    sessionStorage.removeItem('crm_user');
    setActiveSubView('dashboard-overview');
  };

  const handleRoleChange = (newRole: 'Super Admin' | 'Admin' | 'Manager' | 'Sales Executive' | 'Support Executive') => {
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      
      const userStr = JSON.stringify(updatedUser);
      if (localStorage.getItem('crm_user')) {
        localStorage.setItem('crm_user', userStr);
      } else {
        sessionStorage.setItem('crm_user', userStr);
      }
    }
    // Set a default subView for the new role to prevent blank layout matching
    if (newRole === 'Super Admin') {
      setActiveSubView('admin-users');
    } else if (newRole === 'Admin') {
      setActiveSubView('dashboard-overview');
    } else if (newRole === 'Manager') {
      setActiveSubView('manager-assign');
    } else if (newRole === 'Sales Executive') {
      setActiveSubView('sales-customers');
    } else if (newRole === 'Support Executive') {
      setActiveSubView('support-tickets');
    }
  };

  // Authentication locks (simulation)
  const [isAuthLocked, setIsAuthLocked] = useState(false);
  const [authEmail, setAuthEmail] = useState('admin@adjen.io');
  const [authPass, setAuthPass] = useState('password');

  // Trigger base configuration settings
  const currencySymbol = settings.currency || '$';

  // State sync and Activity logging helpers
  const handleUpdateSettings = (updated: CrmSettings) => {
    setSettings(updated);
    saveSettings(updated);
    const updatedActivities = addActivity('customer', 'Workspace settings and default currencies updated', currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleAddCustomer = (cust: Customer) => {
    const updated = [cust, ...customers];
    setCustomers(updated);
    saveCustomers(updated);
    const updatedActivities = addActivity('customer', `Added customer card for ${cust.fullName}`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleEditCustomer = (cust: Customer) => {
    const updated = customers.map(c => c.id === cust.id ? cust : c);
    setCustomers(updated);
    saveCustomers(updated);
    const updatedActivities = addActivity('customer', `Modified parameters for customer ${cust.fullName}`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleDeleteCustomer = (id: string) => {
    const target = customers.find(c => c.id === id);
    const updated = customers.filter(c => c.id !== id);
    setCustomers(updated);
    saveCustomers(updated);
    if (target) {
      const updatedActivities = addActivity('customer', `Removed customer record for ${target.fullName}`, currentUser?.fullName || 'User');
      setActivities(updatedActivities);
    }
  };

  const handleAddLead = (lead: Lead) => {
    const updated = [lead, ...leads];
    setLeads(updated);
    saveLeads(updated);
    const updatedActivities = addActivity('lead', `Added lead opportunity for ${lead.customerName}`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleEditLead = (lead: Lead) => {
    const updated = leads.map(l => l.id === lead.id ? lead : l);
    setLeads(updated);
    saveLeads(updated);
    const updatedActivities = addActivity('lead', `Modified lead progress for ${lead.customerName} status: ${lead.status}`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleDeleteLead = (id: string) => {
    const target = leads.find(l => l.id === id);
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    saveLeads(updated);
    if (target) {
      const updatedActivities = addActivity('lead', `Removed lead opportunity for ${target.customerName}`, currentUser?.fullName || 'User');
      setActivities(updatedActivities);
    }
  };

  const handleAddDeal = (deal: Deal) => {
    const updated = [deal, ...deals];
    setDeals(updated);
    saveDeals(updated);
    const updatedActivities = addActivity('deal', `Created SLA deal: ${deal.title} with capacity of ${deal.value} seats`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleEditDeal = (deal: Deal) => {
    const updated = deals.map(d => d.id === deal.id ? deal : d);
    setDeals(updated);
    saveDeals(updated);
    const updatedActivities = addActivity('deal', `Updated deal: ${deal.title} status to ${deal.stage}`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleDeleteDeal = (id: string) => {
    const target = deals.find(d => d.id === id);
    const updated = deals.filter(d => d.id !== id);
    setDeals(updated);
    saveDeals(updated);
    if (target) {
      const updatedActivities = addActivity('deal', `Removed deal record: ${target.title}`, currentUser?.fullName || 'User');
      setActivities(updatedActivities);
    }
  };

  const handleAddTask = (task: Task) => {
    const updated = [task, ...tasks];
    setTasks(updated);
    saveTasks(updated);
    const updatedActivities = addActivity('task', `Created backlog task check: ${task.title}`, currentUser?.fullName || 'User');
    setActivities(updatedActivities);
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    saveTasks(updated);
    const target = tasks.find(t => t.id === id);
    if (target) {
      const updatedActivities = addActivity('task', `Completed task: ${target.title}`, currentUser?.fullName || 'User');
      setActivities(updatedActivities);
    }
  };

  const handleDeleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
    if (target) {
      const updatedActivities = addActivity('task', `Deleted checklist task: ${target.title}`, currentUser?.fullName || 'User');
      setActivities(updatedActivities);
    }
  };

  // Toggle categories expansion
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Global search results calculation
  const searchResults = globalSearchQuery.trim() ? {
    customers: customers.filter(c => c.fullName.toLowerCase().includes(globalSearchQuery.toLowerCase())),
    leads: leads.filter(l => l.customerName.toLowerCase().includes(globalSearchQuery.toLowerCase())),
    deals: deals.filter(d => d.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) || d.customerName.toLowerCase().includes(globalSearchQuery.toLowerCase()))
  } : null;

  // Categories and Sub-items list
  const getCategoriesForRole = (role: string) => {
    switch (role) {
      case 'Super Admin':
        return [
          {
            id: 'super-admin-users',
            label: 'User Directory',
            icon: Users,
            items: [
              { id: 'admin-users', label: 'User Management' },
              { id: 'admin-roles', label: 'Role Management' },
              { id: 'admin-permissions', label: 'Permission Control' }
            ]
          },
          {
            id: 'super-admin-company',
            label: 'Company Settings',
            icon: Landmark,
            items: [
              { id: 'admin-company', label: 'Company Profile' },
              { id: 'admin-branches', label: 'Branch Management' },
              { id: 'admin-departments', label: 'Departments Index' }
            ]
          },
          {
            id: 'super-admin-ops',
            label: 'System Operations',
            icon: Cpu,
            items: [
              { id: 'admin-crm-settings', label: 'CRM Stage Config' },
              { id: 'admin-backup', label: 'Backup & Restore' },
              { id: 'admin-audit', label: 'Security Audit Logs' },
              { id: 'admin-monitoring', label: 'System Monitoring' },
              { id: 'admin-database', label: 'Database Tuning' }
            ]
          },
          {
            id: 'super-admin-financials',
            label: 'Billing & Licenses',
            icon: DollarSign,
            items: [
              { id: 'admin-billing', label: 'Subscription & Plans' }
            ]
          },
          {
            id: 'dashboard',
            label: 'Executive Deck',
            icon: LayoutDashboard,
            items: [
              { id: 'dashboard-overview', label: 'Overview' },
              { id: 'dashboard-analytics', label: 'Analytics' },
              { id: 'dashboard-health', label: 'Business Health' },
              { id: 'dashboard-activity', label: 'Recent Activity' },
              { id: 'dashboard-notifications', label: 'Notifications' }
            ]
          },
          {
            id: 'customers',
            label: 'CRM Core',
            icon: Users,
            items: [
              { id: 'customers-all', label: 'All Customers' },
              { id: 'leads-pipeline', label: 'Lead Pipeline' },
              { id: 'sales-deals', label: 'Sales Deals' }
            ]
          },
          {
            id: 'ai',
            label: 'AI Core Assistant',
            icon: Sparkles,
            items: [
              { id: 'ai-chat', label: 'AI Chat Cognitive' },
              { id: 'ai-insights', label: 'Smart Insights' },
              { id: 'ai-reports', label: 'AI Reports' },
              { id: 'ai-suggestions', label: 'AI Recommendations' }
            ]
          }
        ];
      case 'Admin':
        return [
          {
            id: 'dashboard',
            label: 'Admin Control Room',
            icon: LayoutDashboard,
            items: [
              { id: 'dashboard-overview', label: 'Dashboard Overview' },
              { id: 'dashboard-analytics', label: 'Analytics' },
              { id: 'dashboard-notifications', label: 'Alert Center' }
            ]
          },
          {
            id: 'customers',
            label: 'Customers Core',
            icon: Users,
            items: [
              { id: 'customers-all', label: 'All Customers' },
              { id: 'customers-add', label: 'Add Customer' }
            ]
          },
          {
            id: 'leads',
            label: 'Leads & Funnels',
            icon: Target,
            items: [
              { id: 'leads-new', label: 'Lead Sprints' },
              { id: 'leads-pipeline', label: 'Lead Pipeline' }
            ]
          },
          {
            id: 'employees',
            label: 'HR & Personnel',
            icon: Users,
            items: [
              { id: 'employees-list', label: 'Employee Registry' },
              { id: 'employees-attendance', label: 'Attendance logs' },
              { id: 'employees-leave', label: 'Leave Approvals' }
            ]
          },
          {
            id: 'projects',
            label: 'Projects & Tasks',
            icon: Folder,
            items: [
              { id: 'projects-all', label: 'All Projects' },
              { id: 'projects-tasks', label: 'Checklist Tasks' }
            ]
          },
          {
            id: 'reports',
            label: 'CRM Intelligence',
            icon: LayoutDashboard,
            items: [
              { id: 'reports-sales', label: 'High-Level Reports' }
            ]
          },
          {
            id: 'settings',
            label: 'CRM Profile',
            icon: SettingsIcon,
            items: [
              { id: 'settings-profile', label: 'Company Profile' }
            ]
          }
        ];
      case 'Manager':
        return [
          {
            id: 'dashboard',
            label: 'Manager Cockpit',
            icon: LayoutDashboard,
            items: [
              { id: 'dashboard-overview', label: 'Team Deck' }
            ]
          },
          {
            id: 'manager-leads',
            label: 'Lead Dispatcher',
            icon: Target,
            items: [
              { id: 'manager-assign', label: 'Assign Incoming Leads' },
              { id: 'manager-monitoring', label: 'Team Activity Monitor' },
              { id: 'manager-sales-tracking', label: 'Sales Progress Charts' }
            ]
          },
          {
            id: 'manager-approvals-sec',
            label: 'Overrides',
            icon: ShieldCheck,
            items: [
              { id: 'manager-approvals', label: 'Approvals Register' }
            ]
          },
          {
            id: 'manager-scheduler',
            label: 'Team Meetings',
            icon: Calendar,
            items: [
              { id: 'calendar-meetings', label: 'Meetings Scheduler' }
            ]
          }
        ];
      case 'Sales Executive':
        return [
          {
            id: 'dashboard',
            label: 'My Desk Workspace',
            icon: LayoutDashboard,
            items: [
              { id: 'dashboard-overview', label: 'Workspace' }
            ]
          },
          {
            id: 'sales-customers-group',
            label: 'My Assigned Pipelines',
            icon: Users,
            items: [
              { id: 'sales-customers', label: 'My Customers' },
              { id: 'sales-leads', label: 'My Leads' },
              { id: 'sales-deals', label: 'My Active Deals' }
            ]
          },
          {
            id: 'sales-tools',
            label: 'Sales Tools',
            icon: DollarSign,
            items: [
              { id: 'sales-quotations', label: 'Quotations Generator' },
              { id: 'sales-notes', label: 'Personal Scratchpad' },
              { id: 'sales-timeline', label: 'Engagement Timeline' }
            ]
          }
        ];
      case 'Support Executive':
        return [
          {
            id: 'dashboard',
            label: 'Support Core Desk',
            icon: LayoutDashboard,
            items: [
              { id: 'dashboard-overview', label: 'Support Overview' }
            ]
          },
          {
            id: 'support-inbound',
            label: 'Inbound Queues',
            icon: HelpCircle,
            items: [
              { id: 'support-tickets', label: 'Support Tickets' },
              { id: 'support-chat', label: 'Live Chat Portal' }
            ]
          },
          {
            id: 'support-account-history',
            label: 'SLA History Lookup',
            icon: Users,
            items: [
              { id: 'support-history', label: 'SLA History Card' }
            ]
          },
          {
            id: 'support-compiler',
            label: 'Resolutions Logging',
            icon: Folder,
            items: [
              { id: 'support-resolution', label: 'Resolution Compiler' }
            ]
          },
          {
            id: 'support-faqs-all',
            label: 'Knowledge Repositories',
            icon: HelpCircle,
            items: [
              { id: 'support-faq', label: 'FAQ Directory' },
              { id: 'support-kb', label: 'Knowledge Base' }
            ]
          }
        ];
      default:
        return [];
    }
  };

  const categories = getCategoriesForRole(currentUser?.role || 'Super Admin');

  // Helper to retrieve category label and icon based on subview
  const getActiveBreadcrumb = () => {
    for (const cat of categories) {
      const match = cat.items.find(item => item.id === activeSubView);
      if (match) {
        return { category: cat.label, item: match.label };
      }
    }
    return { category: 'Executive Deck', item: 'Overview' };
  };

  const breadcrumb = getActiveBreadcrumb();

  if (viewMode === 'website') {
    return <AdjenWebsite onEnterPortal={() => setViewMode('crm')} />;
  }

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#030712] text-zinc-100 font-sans antialiased flex">
      
      {/* ==========================================
          AUTHENTICATION SECURE LOCK SCREEN
          ========================================== */}
      {isAuthLocked ? (
        <div className="fixed inset-0 bg-[#030712] z-50 flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-400 text-black rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Cpu className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white uppercase font-mono tracking-wider">ADJEN SECURE GATE</h2>
              <p className="text-[10px] text-zinc-500 font-mono">AUTHORIZED PERSONNEL AUTHENTICATIONS ONLY</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsAuthLocked(false); }} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 font-mono uppercase">SECURE PASSCODE</label>
                <input 
                  type="password" required placeholder="Enter developer password..." value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-center outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300">
                UNLOCK OPERATING ENVIRONMENT
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {/* ==========================================
          DESKTOP LEFT SIDEBAR
          ========================================== */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-950 border-r border-zinc-900/80 h-screen sticky top-0 overflow-y-auto z-30 select-none shrink-0 scrollbar">
        {/* Brand header */}
        <div className="p-5 border-b border-zinc-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 text-black font-black flex items-center justify-center rounded-lg shadow-md shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black text-white uppercase tracking-widest font-mono">Smart CRM Pro</h1>
            <p className="text-[9px] text-yellow-400 font-mono tracking-widest uppercase">ADJEN LABS</p>
          </div>
        </div>

        {/* Dynamic Role Switcher Controls */}
        <div className="px-5 py-3 border-b border-zinc-900/60 bg-zinc-950/25">
          <RoleSelector currentRole={currentUser?.role as any || 'Super Admin'} onChangeRole={handleRoleChange} />
        </div>

        {/* Sidebar categories */}
        <nav className="flex-1 p-3.5 space-y-2">
          {categories.map((cat) => {
            const isExpanded = expandedCategories[cat.id];
            const CatIcon = cat.icon;
            
            return (
              <div key={cat.id} className="space-y-1">
                {/* Header toggle */}
                <div 
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center justify-between p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/45 transition-all cursor-pointer text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <CatIcon className="w-4 h-4 text-zinc-500" />
                    <span>{cat.label}</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
                </div>

                {/* Sub-items list */}
                {isExpanded && (
                  <div className="pl-6 border-l border-zinc-900 ml-4 space-y-0.5">
                    {cat.items.map((item) => {
                      const isActive = activeSubView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveSubView(item.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full text-left p-1.5 rounded text-[11px] font-medium transition-all block cursor-pointer ${
                            isActive 
                              ? 'text-yellow-400 bg-yellow-400/5 font-black border-l-2 border-yellow-400 pl-2' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:pl-2'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Public Website Switcher */}
        <div className="p-3 border-t border-zinc-900/60">
          <button 
            onClick={() => setViewMode('website')}
            className="w-full py-2 bg-zinc-900 hover:bg-[#FEDC09] text-zinc-300 hover:text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#FEDC09]/20 cursor-pointer"
          >
            ← Public Website
          </button>
        </div>

        {/* Profile Footer */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {currentUser?.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.fullName} 
                className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-mono font-black border border-zinc-800 shrink-0">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-black text-white truncate leading-none">{currentUser?.fullName}</p>
              <p className="text-[9px] text-zinc-500 font-mono truncate mt-1 leading-none uppercase">{currentUser?.role}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-zinc-900 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* ==========================================
          MOBILE SIDEBAR OVERLAY
          ========================================== */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden flex">
            <motion.aside 
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-60 bg-zinc-950 border-r border-zinc-900 h-full overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="p-4 border-b border-zinc-900 flex justify-between items-center">
                  <span className="text-xs font-black text-white font-mono uppercase tracking-widest">Smart CRM Pro</span>
                  <button onClick={() => setIsMobileSidebarOpen(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 border-b border-zinc-900/60">
                  <RoleSelector currentRole={currentUser?.role as any || 'Super Admin'} onChangeRole={handleRoleChange} />
                </div>

                <nav className="p-2.5 space-y-1">
                  {categories.map((cat) => (
                    <div key={cat.id} className="space-y-1">
                      <div className="p-2 text-zinc-400 text-xs font-bold font-mono uppercase tracking-wider">
                        {cat.label}
                      </div>
                      <div className="space-y-0.5">
                        {cat.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveSubView(item.id);
                              setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full text-left p-1.5 rounded text-[11px] block ${
                              activeSubView === item.id 
                                ? 'text-yellow-400 bg-yellow-400/5 font-bold border-l border-yellow-400' 
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </nav>
                <div className="p-3 border-t border-zinc-900/60 mt-auto">
                  <button 
                    onClick={() => {
                      setViewMode('website');
                      setIsMobileSidebarOpen(false);
                    }}
                    className="w-full py-2 bg-zinc-900 hover:bg-[#FEDC09] text-zinc-300 hover:text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-[#FEDC09]/20 cursor-pointer"
                  >
                    ← Public Website
                  </button>
                </div>
              </div>
            </motion.aside>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)}></div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          MAIN AREA CONTENT CONTAINER
          ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP NAVBAR HEADER */}
        <header className="h-14 bg-zinc-950/80 border-b border-zinc-900/60 flex items-center justify-between px-4 sticky top-0 backdrop-blur-xl z-20">
          
          {/* Breadcrumb or burger */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 select-none">
              <span className="font-mono uppercase text-[10px] tracking-widest">{breadcrumb.category}</span>
              <span className="text-zinc-700 font-mono">/</span>
              <span className="text-white font-bold">{breadcrumb.item}</span>
            </div>
          </div>

          {/* Core searches, profile, alarm indicators */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Global search client, lead..." 
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="bg-zinc-900/70 border border-zinc-850 rounded-lg pl-8 pr-3 py-1 text-xs text-zinc-200 outline-none w-52 focus:w-64 focus:border-yellow-400/40 transition-all font-sans"
              />

              {/* Instant Search Popover Results */}
              {searchResults && (
                <div className="absolute right-0 top-9 w-72 bg-zinc-950 border border-zinc-900 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 font-black">Global Search Matches</span>
                    <button onClick={() => setGlobalSearchQuery('')} className="text-zinc-600 hover:text-white text-[9px] font-mono">✕ CLEAR</button>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {/* Customers match */}
                    {searchResults.customers.length > 0 && (
                      <div>
                        <p className="text-[9px] text-yellow-400 uppercase font-mono font-bold tracking-wider">Clients ({searchResults.customers.length})</p>
                        <div className="mt-1 space-y-1">
                          {searchResults.customers.map(c => (
                            <div key={c.id} onClick={() => { setActiveSubView('customers-all'); setGlobalSearchQuery(''); }} className="p-1.5 bg-zinc-900/40 rounded hover:bg-zinc-900 transition-colors cursor-pointer">
                              <p className="font-bold text-white">{c.fullName}</p>
                              <p className="text-[9px] text-zinc-500 font-mono">{c.companyName || 'Private client'}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Leads match */}
                    {searchResults.leads.length > 0 && (
                      <div>
                        <p className="text-[9px] text-zinc-400 uppercase font-mono font-bold tracking-wider">Leads ({searchResults.leads.length})</p>
                        <div className="mt-1 space-y-1">
                          {searchResults.leads.map(l => (
                            <div key={l.id} onClick={() => { setActiveSubView('leads-pipeline'); setGlobalSearchQuery(''); }} className="p-1.5 bg-zinc-900/40 rounded hover:bg-zinc-900 transition-colors cursor-pointer">
                              <p className="font-bold text-white">{l.customerName}</p>
                              <p className="text-[9px] text-zinc-500 font-mono">Channel: {l.source}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.customers.length === 0 && searchResults.leads.length === 0 && (
                      <span className="text-[9px] text-zinc-600 font-mono block text-center">No exact database matches found.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell Alarm */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              </button>

              {/* Popup */}
              {isNotificationsOpen && (
                <div className="absolute right-0 top-9 w-64 bg-zinc-950 border border-zinc-900 rounded-xl p-3 shadow-2xl text-xs z-50">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold">Workspace Warnings</span>
                    <button onClick={() => setIsNotificationsOpen(false)} className="text-zinc-600 hover:text-white text-[9px] font-mono">✕ CLOSE</button>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="p-2 bg-zinc-900/40 rounded border-l-2 border-yellow-400 text-[11px]">
                      <p className="font-bold text-white">MFA Compliance Warning</p>
                      <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Please check settings security OTP indices.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Name & Role Visual Indicators */}
            <div className="hidden md:flex flex-col items-end text-right select-none pr-1">
              <span className="text-[11px] font-black text-white leading-none">{currentUser?.fullName}</span>
              <span className="text-[9px] text-yellow-400 font-mono mt-1 uppercase tracking-wider leading-none font-bold">{currentUser?.role}</span>
            </div>

            {/* User Profile dropdown */}
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 cursor-pointer select-none"
              >
                {currentUser?.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.fullName} 
                    className="w-7 h-7 rounded-full object-cover border border-zinc-800 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold font-mono text-xs shadow-md shrink-0">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-zinc-500 hidden sm:block" />
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 top-9 w-48 bg-zinc-950 border border-zinc-900 rounded-xl p-2 shadow-2xl text-xs z-50 space-y-1.5">
                  <div className="px-2.5 py-2 border-b border-zinc-900">
                    <p className="font-black text-white truncate leading-none">{currentUser?.fullName}</p>
                    <p className="text-[9px] text-zinc-500 font-mono truncate mt-1 leading-none">{currentUser?.email}</p>
                    <span className="inline-block px-1.5 py-0.5 bg-yellow-400/5 text-yellow-400 border border-yellow-400/10 rounded text-[8px] font-mono mt-2 uppercase tracking-wide">
                      {currentUser?.role}
                    </span>
                  </div>
                  <button 
                    onClick={() => { setActiveSubView('settings-profile'); setIsProfileOpen(false); }}
                    className="w-full text-left px-2 py-1.5 hover:bg-zinc-900 rounded text-zinc-300 hover:text-white cursor-pointer block font-semibold transition-colors"
                  >
                    My CRM Profile
                  </button>
                  <button 
                    onClick={() => { handleLogout(); setIsProfileOpen(false); }}
                    className="w-full text-left px-2 py-1.5 hover:bg-zinc-900 rounded text-red-400 hover:text-red-350 font-bold cursor-pointer block flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* WORKSPACE CENTRAL MAIN CONTENT AREA */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          
          <AnimatePresence mode="wait">
            
            {!isViewAllowedForRole(activeSubView, currentUser!.role) ? (
              <div key="access-denied">
                <AccessDenied 
                  role={currentUser!.role} 
                  requestedView={activeSubView} 
                  onRedirect={() => {
                    const defaultViews: Record<string, string> = {
                      'Super Admin': 'admin-users',
                      'Admin': 'dashboard-overview',
                      'Manager': 'manager-assign',
                      'Sales Executive': 'sales-customers',
                      'Support Executive': 'support-tickets'
                    };
                    setActiveSubView(defaultViews[currentUser!.role] || 'dashboard-overview');
                  }}
                />
              </div>
            ) : (
              <>
            
            {/* ⚡ CATEGORY: SUPER ADMIN */}
            {activeSubView.startsWith('admin-') && (
              <div key="super-admin">
                <SuperAdminSection subView={activeSubView} />
              </div>
            )}

            {/* 📋 CATEGORY: MANAGER */}
            {(activeSubView.startsWith('manager-') || activeSubView === 'calendar-meetings') && (
              <div key="manager">
                <ManagerSection subView={activeSubView} />
              </div>
            )}

            {/* 💼 CATEGORY: SALES EXECUTIVE */}
            {currentUser?.role === 'Sales Executive' && activeSubView.startsWith('sales-') && (
              <div key="sales-executive">
                <SalesExecutiveSection 
                  subView={activeSubView} 
                  currentUser={currentUser}
                  customers={customers}
                  onAddCustomer={handleAddCustomer}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  leads={leads}
                  deals={deals}
                  tasks={tasks}
                />
              </div>
            )}

            {/* 🎫 CATEGORY: SUPPORT EXECUTIVE */}
            {currentUser?.role === 'Support Executive' && activeSubView.startsWith('support-') && (
              <div key="support-executive">
                <SupportExecutiveSection subView={activeSubView} />
              </div>
            )}

            {/* 📊 CATEGORY: DASHBOARD */}
            {activeSubView.startsWith('dashboard') && (
              <div key="dashboard">
                <DashboardOverview 
                  customers={customers}
                  leads={leads}
                  deals={deals}
                  tasks={tasks}
                  activities={activities}
                  currency={currencySymbol}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onNavigateToView={setActiveSubView}
                  subView={activeSubView}
                  userRole={currentUser?.role}
                />
              </div>
            )}

            {/* 👥 CATEGORY: CUSTOMERS */}
            {activeSubView.startsWith('customers') && (
              <div key="customers">
                <CustomersSection 
                  customers={customers}
                  onAddCustomer={handleAddCustomer}
                  onEditCustomer={handleEditCustomer}
                  onDeleteCustomer={handleDeleteCustomer}
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 🎯 CATEGORY: LEADS */}
            {activeSubView.startsWith('leads') && (
              <div key="leads">
                <LeadsSection 
                  leads={leads}
                  customers={customers}
                  onAddLead={handleAddLead}
                  onEditLead={handleEditLead}
                  onDeleteLead={handleDeleteLead}
                  currency={currencySymbol}
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 💼 CATEGORY: SALES */}
            {currentUser?.role !== 'Sales Executive' && activeSubView.startsWith('sales') && (
              <div key="sales">
                <SalesSection 
                  deals={deals}
                  customers={customers}
                  onAddDeal={handleAddDeal}
                  onEditDeal={handleEditDeal}
                  onDeleteDeal={handleDeleteDeal}
                  currency={currencySymbol}
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 📁 CATEGORY: PROJECTS */}
            {activeSubView.startsWith('projects') && (
              <div key="projects">
                <ProjectsSection 
                  tasks={tasks}
                  customers={customers}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 👨💼 CATEGORY: EMPLOYEES */}
            {activeSubView.startsWith('employees') && (
              <div key="employees">
                <EmployeesSection 
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 🎫 CATEGORY: SUPPORT */}
            {currentUser?.role !== 'Support Executive' && activeSubView.startsWith('support') && (
              <div key="support">
                <SupportSection 
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 📈 CATEGORY: REPORTS */}
            {activeSubView.startsWith('reports') && (
              <div key="reports">
                <ReportsSection 
                  customers={customers}
                  leads={leads}
                  deals={deals}
                  currency={currencySymbol}
                  subView={activeSubView}
                />
              </div>
            )}

            {/* 🤖 CATEGORY: AI ASSISTANT */}
            {activeSubView.startsWith('ai') && (
              <div key="ai">
                <AiAssistantSection 
                  customers={customers}
                  leads={leads}
                  deals={deals}
                  tasks={tasks}
                  currency={currencySymbol}
                  subView={activeSubView}
                />
              </div>
            )}

            {/* ⚙ CATEGORY: SETTINGS */}
            {activeSubView.startsWith('settings') && (
              <div key="settings">
                <SettingsSection 
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  subView={activeSubView}
                  currentUser={currentUser}
                  onUpdateProfile={(updatedUser: UserType) => {
                    setCurrentUser(updatedUser);
                    const userStr = JSON.stringify(updatedUser);
                    if (localStorage.getItem('crm_user')) {
                      localStorage.setItem('crm_user', userStr);
                    } else {
                      sessionStorage.setItem('crm_user', userStr);
                    }
                    const updatedActivities = addActivity('customer', `Updated personal profile variables for ${updatedUser.fullName}`, updatedUser.fullName);
                    setActivities(updatedActivities);
                  }}
                />
              </div>
            )}

              </>
            )}

          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}
