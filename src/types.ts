export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  companyName: string;
  avatarUrl: string;
}

export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect';
export type LeadSourceType = 'Website' | 'Referral' | 'LinkedIn' | 'Facebook' | 'Google Ads' | 'Cold Call' | 'Email Campaign';
export type CustomerStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost' | 'On Hold';

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  address: string;
  status: CustomerStatus;
  notes: string;
  createdAt: string;
  owner: string;
  salesExecutive: string;
  leadSource: LeadSourceType;
  stage: CustomerStage;
  lastFollowUp: string;
  nextFollowUp: string;
  alternativePhone?: string;
  companyWebsite?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  industry?: string;
  priority?: 'Low' | 'Medium' | 'High';
}

export type LeadStatus = 'New' | 'Contacted' | 'Proposal Sent' | 'Nurturing' | 'Qualified';
export type LeadPriority = 'Low' | 'Medium' | 'High';

export interface Lead {
  id: string;
  customerName: string; // Connected customer
  source: string; // e.g., Website, Referral, Cold Call, LinkedIn
  status: LeadStatus;
  expectedRevenue: number;
  followUpDate: string;
  priority: LeadPriority;
  notes?: string;
  createdAt: string;
}

export type DealStage = 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';

export interface Deal {
  id: string;
  title: string;
  customerName: string;
  value: number;
  stage: DealStage;
  closingDate: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  customerName: string;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'customer' | 'lead' | 'deal' | 'task' | 'auth';
  description: string;
  timestamp: string;
  userName: string;
}

export interface CrmSettings {
  currency: string;
  theme: 'dark' | 'light';
  enableReminders: boolean;
  companyName: string;
}
