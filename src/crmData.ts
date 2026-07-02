import { Customer, Lead, Deal, Task, Activity, User, CrmSettings } from './types';

// Mock Seed Data
const defaultCustomers: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'Sarah Connor',
    phone: '+1 (555) 234-5678',
    email: 'sarah.connor@aethertech.com',
    companyName: 'Aether Technologies',
    address: '100 Innovation Way, Boston, MA',
    status: 'Active',
    notes: 'Key decision-maker for the cloud transition. Prefers email updates.',
    createdAt: '2026-01-15',
    owner: 'Marcus Chen',
    salesExecutive: 'Elena Rostova',
    leadSource: 'LinkedIn',
    stage: 'Proposal Sent',
    lastFollowUp: '2026-06-20',
    nextFollowUp: '2026-07-05'
  },
  {
    id: 'cust-2',
    fullName: 'David Smith',
    phone: '+1 (555) 876-5432',
    email: 'dsmith@vertexcorp.com',
    companyName: 'Vertex Corporation',
    address: '456 Business Blvd, New York, NY',
    status: 'Active',
    notes: 'Negotiating enterprise license agreement. Looking for a volume discount.',
    createdAt: '2026-02-10',
    owner: 'Elena Rostova',
    salesExecutive: 'Marcus Chen',
    leadSource: 'Website',
    stage: 'Negotiation',
    lastFollowUp: '2026-06-25',
    nextFollowUp: '2026-07-10'
  },
  {
    id: 'cust-3',
    fullName: 'Liam Neeson',
    phone: '+44 20 7946 0958',
    email: 'liam@biosphereltd.co.uk',
    companyName: 'BioSphere Ltd',
    address: '12 Greenery Lane, London, UK',
    status: 'Prospect',
    notes: 'Interested in our sustainable supply-chain tracker product.',
    createdAt: '2026-04-22',
    owner: 'Sarah Connor',
    salesExecutive: 'Marcus Chen',
    leadSource: 'Referral',
    stage: 'Contacted',
    lastFollowUp: '2026-06-18',
    nextFollowUp: '2026-07-12'
  },
  {
    id: 'cust-4',
    fullName: 'Emma Watson',
    phone: '+1 (555) 432-1098',
    email: 'emma@nebulasaas.io',
    companyName: 'Nebula SaaS',
    address: '88 Stellar Dr, San Francisco, CA',
    status: 'Inactive',
    notes: 'Subscription paused due to restructuring. Re-evaluate in Q3.',
    createdAt: '2025-11-05',
    owner: 'Marcus Chen',
    salesExecutive: 'Sarah Connor',
    leadSource: 'Google Ads',
    stage: 'Lost',
    lastFollowUp: '2026-05-10',
    nextFollowUp: '2026-08-01'
  },
  {
    id: 'cust-5',
    fullName: 'Sophia Loren',
    phone: '+39 06 1234567',
    email: 's.loren@milanodesign.it',
    companyName: 'Milano Design',
    address: 'Via Dante 14, Milan, Italy',
    status: 'Prospect',
    notes: 'Warm lead from Milano Fashion Week. Intrigued by analytics dashboards.',
    createdAt: '2026-05-18',
    owner: 'Sarah Connor',
    salesExecutive: 'Elena Rostova',
    leadSource: 'Facebook',
    stage: 'New',
    lastFollowUp: '2026-06-28',
    nextFollowUp: '2026-07-15'
  },
  {
    id: 'cust-6',
    fullName: 'Marcus Aurelius',
    phone: '+1 (555) 999-8888',
    email: 'marcus@romeconsulting.org',
    companyName: 'Rome Consulting Group',
    address: '300 Forum Plaza, Austin, TX',
    status: 'Active',
    notes: 'Long-term client. Always pays on time. Highly values security audits.',
    createdAt: '2026-03-01',
    owner: 'Elena Rostova',
    salesExecutive: 'Sarah Connor',
    leadSource: 'Cold Call',
    stage: 'Won',
    lastFollowUp: '2026-06-29',
    nextFollowUp: '2026-07-08'
  }
];

const defaultLeads: Lead[] = [
  {
    id: 'lead-1',
    customerName: 'Vertex Corporation',
    source: 'LinkedIn Referral',
    status: 'Proposal Sent',
    expectedRevenue: 24000,
    followUpDate: '2026-07-05',
    priority: 'High',
    notes: 'Presented full proposal to Vertex CTO on Friday. Waiting for sign-off.',
    createdAt: '2026-06-15'
  },
  {
    id: 'lead-2',
    customerName: 'BioSphere Ltd',
    source: 'Partner Referral',
    status: 'Contacted',
    expectedRevenue: 15000,
    followUpDate: '2026-07-12',
    priority: 'Medium',
    notes: 'Discussed cloud migration scope. Preparing customized demo.',
    createdAt: '2026-06-20'
  },
  {
    id: 'lead-3',
    customerName: 'Rome Consulting Group',
    source: 'Website Form',
    status: 'New',
    expectedRevenue: 8500,
    followUpDate: '2026-07-10',
    priority: 'Low',
    notes: 'Inbound request for API automation documentation.',
    createdAt: '2026-06-28'
  },
  {
    id: 'lead-4',
    customerName: 'Aether Technologies',
    source: 'Cold Call',
    status: 'Qualified',
    expectedRevenue: 32000,
    followUpDate: '2026-07-01',
    priority: 'High',
    notes: 'Identified major pain points in legacy storage. Decision-maker is onboard.',
    createdAt: '2026-06-10'
  }
];

const defaultDeals: Deal[] = [
  {
    id: 'deal-1',
    title: 'Enterprise ERP Suite Integration',
    customerName: 'Vertex Corporation',
    value: 24000,
    stage: 'Proposal',
    closingDate: '2026-07-20',
    createdAt: '2026-06-15'
  },
  {
    id: 'deal-2',
    title: 'Core Platform Migration',
    customerName: 'Aether Technologies',
    value: 18500,
    stage: 'Closed Won',
    closingDate: '2026-06-22',
    createdAt: '2026-05-10'
  },
  {
    id: 'deal-3',
    title: 'Custom HR Module Expansion',
    customerName: 'Nebula SaaS',
    value: 45000,
    stage: 'Closed Won',
    closingDate: '2026-06-10',
    createdAt: '2026-04-05'
  },
  {
    id: 'deal-4',
    title: 'Analytics Dashboard Trial',
    customerName: 'Milano Design',
    value: 12000,
    stage: 'Negotiation',
    closingDate: '2026-08-05',
    createdAt: '2026-05-18'
  },
  {
    id: 'deal-5',
    title: 'Supply-Chain Pilot Project',
    customerName: 'BioSphere Ltd',
    value: 15000,
    stage: 'Qualification',
    closingDate: '2026-08-15',
    createdAt: '2026-06-20'
  },
  {
    id: 'deal-6',
    title: 'Legacy Database Overhaul',
    customerName: 'Titan Logistics',
    value: 30000,
    stage: 'Closed Lost',
    closingDate: '2026-04-12',
    createdAt: '2026-02-15'
  }
];

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Draft contract for Vertex Corp Deal',
    dueDate: '2026-07-02',
    completed: false,
    customerName: 'Vertex Corporation',
    priority: 'High',
    createdAt: '2026-06-28'
  },
  {
    id: 'task-2',
    title: 'Conduct follow-up call with Liam Neeson',
    dueDate: '2026-07-05',
    completed: false,
    customerName: 'BioSphere Ltd',
    priority: 'Medium',
    createdAt: '2026-06-29'
  },
  {
    id: 'task-3',
    title: 'Review proposal details with Sophia Loren',
    dueDate: '2026-06-28',
    completed: true,
    customerName: 'Milano Design',
    priority: 'High',
    createdAt: '2026-06-25'
  },
  {
    id: 'task-4',
    title: 'Send API authentication guides',
    dueDate: '2026-07-10',
    completed: false,
    customerName: 'Rome Consulting Group',
    priority: 'Low',
    createdAt: '2026-06-30'
  }
];

const defaultActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'customer',
    description: 'Added new customer Marcus Aurelius (Rome Consulting Group)',
    timestamp: '2026-06-30T09:12:00-07:00',
    userName: 'Habeeb Rahman'
  },
  {
    id: 'act-2',
    type: 'deal',
    description: 'Updated Vertex Corporation deal status to Proposal Sent',
    timestamp: '2026-06-29T14:45:00-07:00',
    userName: 'Habeeb Rahman'
  },
  {
    id: 'act-3',
    type: 'task',
    description: 'Completed task: Review proposal details with Sophia Loren',
    timestamp: '2026-06-28T16:30:00-07:00',
    userName: 'Habeeb Rahman'
  },
  {
    id: 'act-4',
    type: 'lead',
    description: 'Received new web lead from Rome Consulting Group',
    timestamp: '2026-06-28T08:05:00-07:00',
    userName: 'System'
  },
  {
    id: 'act-5',
    type: 'auth',
    description: 'User logged in securely from session container',
    timestamp: '2026-06-30T05:52:00-07:00',
    userName: 'Habeeb Rahman'
  }
];

const defaultUser: User = {
  id: 'user-default',
  fullName: 'Habeeb Rahman',
  email: 'habeebrahmanj2006@gmail.com',
  role: 'Sales Director',
  companyName: 'Smart CRM Pro Inc.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
};

const defaultSettings: CrmSettings = {
  currency: '$',
  theme: 'dark',
  enableReminders: true,
  companyName: 'Smart CRM Pro Inc.'
};

// LocalStorage Keys
const KEYS = {
  CUSTOMERS: 'crm_customers',
  LEADS: 'crm_leads',
  DEALS: 'crm_deals',
  TASKS: 'crm_tasks',
  ACTIVITIES: 'crm_activities',
  USER: 'crm_user',
  SETTINGS: 'crm_settings'
};

// Initialize helper
export function initLocalStorage(force = false) {
  const existingCustomers = localStorage.getItem(KEYS.CUSTOMERS);
  let needsReinit = false;
  if (existingCustomers) {
    try {
      const parsed = JSON.parse(existingCustomers);
      if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].owner) {
        needsReinit = true;
      }
    } catch (e) {
      needsReinit = true;
    }
  }
  if (force || !existingCustomers || needsReinit) {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(defaultCustomers));
    localStorage.setItem(KEYS.LEADS, JSON.stringify(defaultLeads));
    localStorage.setItem(KEYS.DEALS, JSON.stringify(defaultDeals));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(defaultTasks));
    localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
    localStorage.removeItem(KEYS.USER);
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }
}

// Getters
export function getCustomers(): Customer[] {
  const list = JSON.parse(localStorage.getItem(KEYS.CUSTOMERS) || '[]');
  return list.map((c: any) => ({
    ...c,
    owner: c.owner || 'Marcus Chen',
    salesExecutive: c.salesExecutive || 'Elena Rostova',
    leadSource: c.leadSource || 'Website',
    stage: c.stage || 'New',
    lastFollowUp: c.lastFollowUp || c.createdAt || '2026-06-20',
    nextFollowUp: c.nextFollowUp || '2026-07-15'
  }));
}

export function getLeads(): Lead[] {
  return JSON.parse(localStorage.getItem(KEYS.LEADS) || '[]');
}

export function getDeals(): Deal[] {
  return JSON.parse(localStorage.getItem(KEYS.DEALS) || '[]');
}

export function getTasks(): Task[] {
  return JSON.parse(localStorage.getItem(KEYS.TASKS) || '[]');
}

export function getActivities(): Activity[] {
  return JSON.parse(localStorage.getItem(KEYS.ACTIVITIES) || '[]');
}

export function getUser(): User | null {
  const userStr = localStorage.getItem(KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
}

export function getSettings(): CrmSettings {
  return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(defaultSettings));
}

// Setters
export function saveCustomers(customers: Customer[]) {
  localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function saveLeads(leads: Lead[]) {
  localStorage.setItem(KEYS.LEADS, JSON.stringify(leads));
}

export function saveDeals(deals: Deal[]) {
  localStorage.setItem(KEYS.DEALS, JSON.stringify(deals));
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export function saveActivities(activities: Activity[]) {
  localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(activities));
}

export function saveUser(user: User | null) {
  if (user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.USER);
  }
}

export function saveSettings(settings: CrmSettings) {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

// Log an Activity
export function addActivity(type: Activity['type'], description: string, userName: string) {
  const activities = getActivities();
  const newActivity: Activity = {
    id: `act-${Date.now()}`,
    type,
    description,
    timestamp: new Date().toISOString(),
    userName
  };
  const updated = [newActivity, ...activities].slice(0, 50); // Keep last 50 activities
  saveActivities(updated);
  return updated;
}

// CSV Export Helper
export function exportCustomersToCsv(customers: Customer[]) {
  const headers = ['Full Name', 'Phone', 'Email', 'Company', 'Address', 'Status', 'Notes', 'Created At'];
  const rows = customers.map(c => [
    `"${c.fullName.replace(/"/g, '""')}"`,
    `"${c.phone.replace(/"/g, '""')}"`,
    `"${c.email.replace(/"/g, '""')}"`,
    `"${c.companyName.replace(/"/g, '""')}"`,
    `"${c.address.replace(/"/g, '""')}"`,
    `"${c.status}"`,
    `"${c.notes.replace(/"/g, '""')}"`,
    `"${c.createdAt}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `CRM_Customers_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// CSV Import Parser
export function parseCustomersCsv(csvText: string): Partial<Customer>[] {
  const lines = csvText.split('\n');
  if (lines.length < 2) return [];

  const results: Partial<Customer>[] = [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split taking care of quotes
    const values: string[] = [];
    let currentVal = '';
    let inQuotes = false;

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line[charIndex];
      if (char === '"') {
        if (inQuotes && line[charIndex + 1] === '"') {
          // escaped quote
          currentVal += '"';
          charIndex++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(currentVal);
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal);

    const customer: any = {};
    headers.forEach((header, index) => {
      const val = values[index] ? values[index].trim() : '';
      if (header.includes('name') || header.includes('full')) {
        customer.fullName = val;
      } else if (header.includes('phone')) {
        customer.phone = val;
      } else if (header.includes('email')) {
        customer.email = val;
      } else if (header.includes('company')) {
        customer.companyName = val;
      } else if (header.includes('address')) {
        customer.address = val;
      } else if (header.includes('status')) {
        customer.status = (val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()) as any;
        if (!['Active', 'Inactive', 'Prospect'].includes(customer.status)) {
          customer.status = 'Prospect';
        }
      } else if (header.includes('note')) {
        customer.notes = val;
      }
    });

    if (customer.fullName && customer.email) {
      customer.id = `cust-imported-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      customer.createdAt = new Date().toISOString().split('T')[0];
      if (!customer.phone) customer.phone = '';
      if (!customer.companyName) customer.companyName = '';
      if (!customer.address) customer.address = '';
      if (!customer.status) customer.status = 'Prospect';
      if (!customer.notes) customer.notes = '';
      customer.owner = 'Marcus Chen';
      customer.salesExecutive = 'Elena Rostova';
      customer.leadSource = 'Website';
      customer.stage = 'New';
      customer.lastFollowUp = customer.createdAt;
      customer.nextFollowUp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      results.push(customer as Customer);
    }
  }

  return results;
}
