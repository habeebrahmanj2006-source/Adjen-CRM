import React, { useState, useEffect } from 'react';
import { 
  Cpu, ArrowRight, Check, Shield, Zap, Layers, MessageSquare, 
  Mail, Phone, MapPin, ExternalLink, Code, Cloud, Lock, Sparkles, 
  Monitor, Award, BarChart3, ChevronRight, Menu, X, Users, Globe, Play,
  HelpCircle, Send, Star, ArrowLeft, Terminal, Settings, Activity, Database, Server, Plus, Minus, Info, Calendar, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdjenWebsiteProps {
  onEnterPortal: () => void;
}

interface Project {
  id: number;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  metric: string;
  metricLabel: string;
  timeline: string;
  tags: string[];
  architecture: string[];
  solutionDetails: string[];
  accentColor: string;
}

export default function AdjenWebsite({ onEnterPortal }: AdjenWebsiteProps) {
  // Navigation tracking
  const [activeTab, setActiveTab] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active Interactive States
  const [activeWhyStep, setActiveWhyStep] = useState(0);
  const [techCategory, setTechCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Interactive global office map nodes
  const [activeOffice, setActiveOffice] = useState('boston');

  // Form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 5000);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
      setMobileMenuOpen(false);
    }
  };

  // Portfolio items data
  const projects: Project[] = [
    {
      id: 1,
      title: 'StripeFlow Analytics Engine',
      category: 'FINTECH DATA LAYER',
      shortDesc: 'A high-volume real-time data visualizer pulling millions of records with sub-second latency.',
      fullDesc: 'Adjen designed and engineered StripeFlow, a real-time data streaming dashboard that hooks directly into distributed financial systems. By rebuilding their cache architecture using state-of-the-art Drizzle mappings and optimized PostgreSQL shards, we reduced average reporting time from 14.2s to just 320ms.',
      metric: '320ms',
      metricLabel: 'Average Query Speed',
      timeline: '3 Months Deployed',
      tags: ['React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'GraphQL'],
      architecture: [
        'Dynamically partitioned PostgreSQL ledger',
        'Redis query caching layer for sub-millisecond lookups',
        'Express.js backend with auto-scaling Node clusters'
      ],
      solutionDetails: [
        'Analyzed query bottlenecks in real-time financial ledger tables.',
        'Migrated massive static data indices to active distributed memory queues.',
        'Engineered responsive charting elements using fully responsive D3 frameworks.'
      ],
      accentColor: '#FEDC09'
    },
    {
      id: 2,
      title: 'AeroCloud Logistics Core',
      category: 'CLOUD LOGISTICS CLUSTERS',
      shortDesc: 'Auto-scaling international package flight coordination network built over Kubernetes.',
      fullDesc: 'We rebuilt a massive legacy logistics terminal into a highly modular Docker-orchestrated cloud system. Using multi-zone AWS Kubernetes deployments combined with real-time tracking streams, the application coordinates cargo transit over 12 global airports without a single minute of latency.',
      metric: '99.999%',
      metricLabel: 'Guaranteed Live Uptime',
      timeline: '5 Months Deployed',
      tags: ['Node.js', 'Docker', 'Kubernetes', 'AWS Lambda', 'Terraform'],
      architecture: [
        'Multi-region AWS EKS (Elastic Kubernetes) setups',
        'Kafka events queuing infrastructure',
        'Infrastructure as Code (IaC) configurations in Terraform'
      ],
      solutionDetails: [
        'Replaced monolith routing scripts with decoupled Go-based microservices.',
        'Implemented automatic failover architectures preventing routing data loss during power grids outages.',
        'Configured detailed health monitors triggering auto-scaling actions within 5 seconds.'
      ],
      accentColor: '#000000'
    },
    {
      id: 3,
      title: 'Securitas AI Automated Shield',
      category: 'CYBERSECURITY BOT NETWORK',
      shortDesc: 'Proactive vulnerability intrusion scanner operating with automated Gemini security logic.',
      fullDesc: 'Our cybersecurity laboratory designed an elite automated defense shield for Securitas. The platform scans active firewall routes, analyses log telemetry using custom Gemini AI pipelines, and deploys rapid-patch configurations instantly to mitigate complex multi-stage attacks.',
      metric: '0.2s',
      metricLabel: 'Threat Patch Response',
      timeline: '2 Months Deployed',
      tags: ['Python', 'Gemini SDK', 'Terraform', 'SecOps', 'Docker'],
      architecture: [
        'Integrated Google Gemini SDK for intelligent threat pattern recognition',
        'Real-time network packet analyzer built on Go',
        'Automated isolated patch deployment pipelines'
      ],
      solutionDetails: [
        'Trained security categorization models to bypass false alarms by 98.4%.',
        'Built sandboxed containers executing live tests on detected anomalies before deployment.',
        'Deployed strict alert matrix notify security executives on critical compromises.'
      ],
      accentColor: '#FEDC09'
    },
    {
      id: 4,
      title: 'Aura Premium E-Commerce Hub',
      category: 'MODULAR COMMERCE ARCHITECTURE',
      shortDesc: 'Ultra-fast global lifestyle hub with localized inventory routing and elegant fluid animation.',
      fullDesc: 'Aura requested an eye-catching luxury e-commerce platform. Adjen integrated dynamic Next.js layouts, elegant Framer Motion transitions, and decentralized local inventory caching algorithms. The shop provides a continuous, premium editorial shopping experience in 14 languages.',
      metric: '96/100',
      metricLabel: 'Lighthouse Performance Score',
      timeline: '4 Months Deployed',
      tags: ['Next.js', 'Tailwind CSS', 'Redux', 'Drizzle ORM', 'Stripe'],
      architecture: [
        'Decentralized Vercel Edge caching configuration',
        'Dynamic local CDN static image asset delivery',
        'Secure multi-currency Stripe payment integrations'
      ],
      solutionDetails: [
        'Optimized bundle size by lazy loading secondary tabs and high-fidelity graphics.',
        'Created high-end responsive animations mimicking touch physical feel.',
        'Built automatic local warehouse API trackers routing shipments.'
      ],
      accentColor: '#2B2B2B'
    }
  ];

  // Why Choose Us steps
  const whySteps = [
    {
      title: 'Zero-Monolith Philosophy',
      desc: 'We strictly engineering with modular microservices. Every piece of your code is highly structured, fully sandboxed, heavily documented, and completely independent.',
      metric: '100%',
      metricLabel: 'Type-Safe Modular Codebases'
    },
    {
      title: 'Uncompromised SOC-2 Defense',
      desc: 'Security-by-design is embedded in every layout and API route. We write fully audited token gateways, cryptography layers, and automatic threat scanners.',
      metric: 'Zero',
      metricLabel: 'Critical Security Vulnerabilities'
    },
    {
      title: 'Absolute Latency Optimization',
      desc: 'Your clients demand speed. We configure CDN edge nodes, custom query indexing, and light bundle layouts to score maximum performance metrics.',
      metric: '<15ms',
      metricLabel: 'Global Database Edge Latency'
    },
    {
      title: 'Elite Technical Craftsmen',
      desc: 'We do not hire generic coders. Your projects are architected and developed by master-level software specialists with decades of combined experience.',
      metric: '10+ Yrs',
      metricLabel: 'Average Engineer Seniority'
    }
  ];

  // Process steps
  const processSteps = [
    {
      number: '01',
      title: 'Architectural Discovery',
      phase: 'ANALYSIS PHASE',
      desc: 'We audit your legacy systems, load challenges, database schemas, and formulate a detailed multi-cloud structural blueprint.',
      time: '1-2 Weeks',
      deliverable: 'Technical Roadmap & UML Architecture diagrams'
    },
    {
      number: '02',
      title: 'High-Fidelity Prototyping',
      phase: 'UX/UI DESIGN',
      desc: 'We build beautiful, highly responsive Figma assets and interactive layouts with luxurious typography matching your brand identity.',
      time: '2-3 Weeks',
      deliverable: 'Figma mockups & CSS animation blueprints'
    },
    {
      number: '03',
      title: 'Elite Type-Safe Development',
      phase: 'ENGINEERING',
      desc: 'Our senior developers write type-safe, optimized code, establishing microservices, database relations, and secure API networks.',
      time: '4-8 Weeks',
      deliverable: 'Production-ready GitHub repos & documented API endpoints'
    },
    {
      number: '04',
      title: 'SOC-2 Integrity Audits',
      phase: 'QA & PEN-TESTS',
      desc: 'We execute intense load-tests simulating millions of visits, scan active server ports, and verify strict data level cryptography.',
      time: '1-2 Weeks',
      deliverable: 'Pentest logs, load reports, & compliance checklist'
    },
    {
      number: '05',
      title: 'Decentralized Cloud Launch',
      phase: 'PRODUCTION DEPLOY',
      desc: 'We deploy your platform live using modern Infrastructure as Code setups over AWS or GCP with auto-scaling rules and live monitors.',
      time: '1 Week',
      deliverable: 'Terraform scripts, EKS setups, & 24/7 SLA logs'
    }
  ];

  // FAQ Items
  const faqItems = [
    {
      q: 'How does Adjen Technologies guarantee software security?',
      a: 'We integrate advanced security protocols directly at the development phase. This includes implementing complete JWT authorization patterns, automated SQL-injection defenses through type-safe ORMs like Drizzle, static analysis scanners inside CI/CD pipelines, and secure secret key storage via HSMs or Google Cloud Secret Manager. Your keys are never exposed to public repositories.'
    },
    {
      q: 'Can we migrate our slow legacy monolith to your microservice architecture?',
      a: 'Absolutely. We specialize in zero-downtime database and code migrations. We split your monolithic legacy system into high-performing independent Dockerized nodes, wrap them with a centralized API Gateway, and route users incrementally. This ensures your active enterprise service remains online 100% of the time.'
    },
    {
      q: 'Do you provide direct technical support under an SLA?',
      a: 'Yes, we offer premium SLAs tailored for corporate operations. Our support features 24/7 monitoring logs, immediate responses from on-duty cloud architects via slack or direct telephone channels, and proactive performance checkups every single month.'
    },
    {
      q: 'Are your interfaces compatible with mobile platforms?',
      a: 'Every interface we ship is fully responsive, mobile-first tested, and visually attractive across different devices. We pair lightweight Tailwind utility configurations with optimized media assets to guarantee instant loads on standard mobile networks.'
    }
  ];

  // Office location data
  const offices: Record<string, { city: string; address: string; phone: string; timezone: string; coordinates: string }> = {
    boston: {
      city: 'Boston, USA',
      address: '100 Innovation Way, Suite 400, Boston, MA 02110',
      phone: '+1 (855) ADJEN-BOS',
      timezone: 'EST (UTC-5)',
      coordinates: '42.3601° N, 71.0589° W'
    },
    london: {
      city: 'London, UK',
      address: '88 Tech Boulevard, Shoreditch, London EC1A 1BB',
      phone: '+44 20 7946 0192',
      timezone: 'GMT (UTC+0)',
      coordinates: '51.5074° N, 0.1278° W'
    },
    tokyo: {
      city: 'Tokyo, Japan',
      address: '4-10-3 Roppongi, Minato-ku, Tokyo 106-0032',
      phone: '+81 3 5555 0142',
      timezone: 'JST (UTC+9)',
      coordinates: '35.6762° N, 139.6503° E'
    },
    frankfurt: {
      city: 'Frankfurt, Germany',
      address: 'Mainzer Landstraße 250, 60326 Frankfurt am Main',
      phone: '+49 69 9876 5432',
      timezone: 'CET (UTC+1)',
      coordinates: '50.1109° N, 8.6821° E'
    }
  };

  // Tech items filtered logic
  const techItems = [
    { name: 'TypeScript', category: 'frontend', icon: Code, desc: 'Pure type safety.' },
    { name: 'React / Next.js', category: 'frontend', icon: Layers, desc: 'Fluid user components.' },
    { name: 'Tailwind CSS', category: 'frontend', icon: Sparkles, desc: 'Precision styling.' },
    { name: 'Framer Motion', category: 'frontend', icon: Activity, desc: 'Liquid animation.' },
    { name: 'PostgreSQL', category: 'backend', icon: Database, desc: 'Highly indexed tables.' },
    { name: 'Node.js / Express', category: 'backend', icon: Server, desc: 'Ultra-fast API gateways.' },
    { name: 'Go Language', category: 'backend', icon: Terminal, desc: 'Microsecond operations.' },
    { name: 'Docker Containers', category: 'devops', icon: Cpu, desc: 'Sandboxed code nodes.' },
    { name: 'Kubernetes', category: 'devops', icon: Globe, desc: 'Cluster automation.' },
    { name: 'AWS Cloud', category: 'devops', icon: Cloud, desc: 'International servers.' },
    { name: 'Terraform IaC', category: 'devops', icon: Settings, desc: 'Infrastructure scripts.' },
    { name: 'Gemini SDK', category: 'ai', icon: Zap, desc: 'Intelligent inference.' },
    { name: 'Redis Cache', category: 'backend', icon: Activity, desc: 'Fast key-value streams.' },
    { name: 'Drizzle ORM', category: 'backend', icon: Database, desc: 'Type-safe SQL schema.' }
  ];

  const filteredTech = techCategory === 'all' 
    ? techItems 
    : techItems.filter(t => t.category === techCategory);

  // Testimonials list
  const testimonials = [
    {
      quote: 'Adjen redesigned our cloud infrastructure from scratch. The transition was smooth, our SOC-2 audit passed in weeks, and we slashed our cloud expenditure by 40% while doubling API response speeds. Truly an exceptional development team.',
      author: 'Jean-Laurent Dupere',
      role: 'VP of Tech, Securitas Global',
      company: 'Securitas',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128'
    },
    {
      quote: 'The team at Adjen is incredibly disciplined. They do not just write code; they design robust systems. Their zero-monolith engineering standard allows our in-house developers to comfortably scale new modules within minutes.',
      author: 'Sarah Jenkins',
      role: 'VP of Product, StripeFlow',
      company: 'StripeFlow Corp',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128'
    },
    {
      quote: 'Integrating the Gemini AI nodes into our database query analyzer transformed how our clients request support logs. Adjen delivered the fully responsive interface and backend strictly on schedule.',
      author: 'Hiroshi Tanaka',
      role: 'CTO, Aura Commerce Inc.',
      company: 'Aura Premium',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#2B2B2B] font-sans selection:bg-[#FEDC09] selection:text-[#000000]">
      
      {/* 🚀 STICKY NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E5E5E5] py-3 shadow-sm' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-9 h-9 bg-[#000000] rounded-xl flex items-center justify-center shadow-md border border-[#FEDC09]/30 hover:scale-105 transition-transform duration-200">
                <Cpu className="w-5 h-5 text-[#FEDC09]" />
              </div>
              <div>
                <span className="text-base font-black text-[#000000] tracking-tight">ADJEN</span>
                <span className="text-[10px] text-[#8A8A8A] font-mono tracking-wider block -mt-1 uppercase">TECHNOLOGIES</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
              {['about', 'services', 'why-us', 'portfolio', 'process', 'tech', 'testimonials', 'faq', 'contact'].map((sect) => (
                <button
                  key={sect}
                  onClick={() => scrollToSection(sect)}
                  className={`relative py-1 cursor-pointer hover:text-[#000000] transition-colors ${
                    activeTab === sect ? 'text-[#000000] font-bold' : 'text-[#8A8A8A]'
                  }`}
                >
                  {sect.replace('-', ' ')}
                  {activeTab === sect && (
                    <motion.div 
                      layoutId="activeIndicator" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FEDC09]" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={onEnterPortal}
                className="px-4 py-2 bg-[#000000] hover:bg-[#F5C400] text-[#FFFFFF] hover:text-[#000000] text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm border border-[#000000]"
              >
                Client Portal
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-xl text-[#000000] hover:bg-[#E5E5E5] transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#FFFFFF] border-b border-[#E5E5E5] px-4 pt-2 pb-6 space-y-4"
            >
              <div className="flex flex-col gap-3 font-semibold text-xs uppercase tracking-wider">
                {['about', 'services', 'why-us', 'portfolio', 'process', 'tech', 'testimonials', 'faq', 'contact'].map((sect) => (
                  <button
                    key={sect}
                    onClick={() => scrollToSection(sect)}
                    className={`text-left py-2 border-b border-[#E5E5E5]/40 ${
                      activeTab === sect ? 'text-[#000000] font-bold pl-2 border-l-2 border-[#FEDC09]' : 'text-[#8A8A8A]'
                    }`}
                  >
                    {sect.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <button
                  onClick={onEnterPortal}
                  className="w-full text-center py-3 bg-[#000000] hover:bg-[#F5C400] text-[#FFFFFF] hover:text-[#000000] text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300"
                >
                  Client Portal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 🌟 HERO SECTION (KEPT EXACTLY AS REQUESTED) */}
      <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center overflow-hidden bg-gradient-to-b from-[#FEDC09]/10 via-[#FFFFFF] to-[#FFFFFF]">
        {/* Soft yellow radial backdrops and grid lines */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-20 right-10 w-[400px] h-[400px] rounded-full bg-[#FEDC09] filter blur-[130px]" />
          <div className="absolute bottom-10 left-10 w-[300px] h-[300px] rounded-full bg-[#F5C400] filter blur-[120px]" />
          <div className="w-full h-full bg-[linear-gradient(to_right,#E5E5E5_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E5_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#000000] text-white text-[10px] font-black uppercase tracking-widest font-mono"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FEDC09]" />
                <span>Next-Gen Enterprise Solutions</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#000000] tracking-tight leading-[1.08] font-sans"
              >
                Engineering the <br className="hidden sm:inline" />
                <span className="relative">
                  Future of Tech
                  <span className="absolute left-0 bottom-1 w-full h-2.5 bg-[#FEDC09] -z-10 transform scale-x-105" />
                </span> for Enterprises.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base text-[#2B2B2B]/85 leading-relaxed max-w-xl"
              >
                Adjen Technologies designs, integrates, and builds premium digital products. 
                From cloud ecosystems and enterprise software to custom AI automation 
                and uncompromised cyber security infrastructure.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-3"
              >
                <button
                  onClick={() => scrollToSection('services')}
                  className="px-6 py-3.5 bg-[#000000] hover:bg-[#F5C400] text-[#FFFFFF] hover:text-[#000000] text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg flex items-center gap-2 group cursor-pointer"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onEnterPortal}
                  className="px-6 py-3.5 bg-[#FFFFFF] hover:bg-[#E5E5E5] text-[#000000] text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm border border-[#E5E5E5] flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Partner Portal</span>
                  <ExternalLink className="w-4 h-4 text-[#8A8A8A]" />
                </button>
              </motion.div>

              {/* Badges / Tech list summary */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-8 border-t border-[#E5E5E5] flex flex-wrap items-center gap-6 text-[#8A8A8A]"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold font-mono">
                  <Check className="w-4 h-4 text-[#FEDC09]" />
                  <span>99.99% Enterprise Uptime</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold font-mono">
                  <Check className="w-4 h-4 text-[#FEDC09]" />
                  <span>SOC-2 Compliant Security</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold font-mono">
                  <Check className="w-4 h-4 text-[#FEDC09]" />
                  <span>ISO-9001 ISO-27001 certified</span>
                </div>
              </motion.div>
            </div>

            {/* Hero graphics / representation */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative bg-gradient-to-tr from-[#000000] to-[#2B2B2B] p-5 rounded-3xl shadow-2xl border-4 border-[#000000]/10 overflow-hidden"
              >
                {/* Decorative particles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FEDC09]/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FEDC09]/10 rounded-full blur-xl" />

                {/* Simulated IDE / Software dashboard for Adjen Tech */}
                <div className="flex items-center justify-between border-b border-[#2B2B2B] pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 block"></span>
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] font-mono tracking-widest">ADJEN_OS_V4.8</span>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#FEDC09] text-black rounded-lg">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Adjen Secure Shield</p>
                        <p className="text-[10px] text-[#8A8A8A] font-mono">THREATS PREVENTED: ACTIVE</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-green-500/15 text-green-400 font-mono text-[9px] rounded font-bold">99.9% SECURE</span>
                  </div>

                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#FEDC09] text-black rounded-lg">
                        <Cloud className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Cloud Node Optimizer</p>
                        <p className="text-[10px] text-[#8A8A8A] font-mono">LATENCY: 12ms GLOBAL</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 font-mono text-[9px] rounded font-bold">OPTIMIZED</span>
                  </div>

                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#8A8A8A]">RESOURCE ALLOCATION</span>
                      <span className="text-[10px] font-mono text-yellow-400 font-bold">98.2% EFFICIENCY</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#FEDC09] h-full rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2B2B2B] flex items-center justify-between text-[10px] font-mono text-[#8A8A8A]">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[#FEDC09]" /> ENGINE ONLINE</span>
                    <span className="text-white hover:text-[#FEDC09] transition-colors cursor-pointer flex items-center gap-0.5" onClick={onEnterPortal}>LAUNCH CRM <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </motion.div>
              
              {/* Outer floating badge */}
              <div className="absolute -bottom-6 -right-4 bg-white border border-[#E5E5E5] p-3.5 rounded-2xl shadow-xl flex items-center gap-3 max-w-[180px] animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="p-2 bg-[#FEDC09] text-black rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-black uppercase font-mono tracking-wider">Top Integrator</h4>
                  <p className="text-[9px] text-[#8A8A8A]">Enterprise Tech Awards 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 1. ABOUT US SECTION (REDESIGNED: Two-Column with floating stat cards & large technical vector mock) */}
      <section id="about" className="py-24 bg-gradient-to-br from-[#FFFFFF] via-[#E5E5E5]/10 to-[#FFFFFF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Tech Graphic + Floating Statistics Cards */}
            <div className="lg:col-span-6 relative">
              <div className="relative p-6 bg-[#000000] rounded-3xl border border-zinc-800 shadow-2xl h-[420px] overflow-hidden flex flex-col justify-between group">
                {/* Background circuitry lines / glow */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-[#FEDC09] filter blur-[100px]" />
                  <div className="w-full h-full bg-[linear-gradient(to_right,rgba(254,220,9,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(254,220,9,0.15)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2B2B2B] text-[#FEDC09] text-[9px] font-mono uppercase font-black tracking-widest rounded-full border border-zinc-700">
                    <Terminal className="w-3 h-3" />
                    <span>SYSTEM ARCHITECTURE DIAGRAM</span>
                  </div>
                </div>

                {/* Simulated Server Grid Visual Representation */}
                <div className="relative z-10 my-auto grid grid-cols-4 gap-3 max-w-sm mx-auto w-full">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
                      className={`h-12 rounded-xl flex flex-col items-center justify-center border font-mono text-[9px] font-bold transition-colors ${
                        i % 3 === 0 
                          ? 'bg-[#FEDC09]/20 text-[#FEDC09] border-[#FEDC09]/30' 
                          : 'bg-[#2B2B2B] text-zinc-400 border-zinc-800'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 mb-1 text-[#FEDC09]" />
                      <span>NODE_{i+10}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="relative z-10 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Globe className="w-4 h-4 text-[#FEDC09]" /> CLOUD REGION: EU-CENTRAL-1
                  </span>
                  <span className="text-[#FEDC09] font-bold">STABLE READY</span>
                </div>
              </div>

              {/* FLOATING STATS CARD 1: 100+ Enterprise Clients */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute -top-6 -right-6 bg-white border-2 border-[#E5E5E5] p-5 rounded-2xl shadow-xl flex items-center gap-4 max-w-[200px] z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FEDC09] text-black flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-black leading-tight">100+</h4>
                  <p className="text-[10px] text-[#8A8A8A] font-semibold uppercase font-mono tracking-wider">Enterprise Clients</p>
                </div>
              </motion.div>

              {/* FLOATING STATS CARD 2: 99.9% Uptime */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -left-6 bg-[#000000] border border-zinc-800 p-5 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[210px] z-20 text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2B2B2B] text-[#FEDC09] flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-[#FEDC09]" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-[#FEDC09] leading-tight">99.99%</h4>
                  <p className="text-[9px] text-zinc-400 font-semibold uppercase font-mono tracking-wider">High SLA Uptime</p>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Editorial Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FEDC09] text-black text-[9px] font-black uppercase font-mono tracking-wider">
                <Users className="w-3 h-3" />
                <span>Our Engineering Legacy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight leading-[1.12]">
                Crafting Technical Masterpieces with Absolute Mathematical Precision.
              </h2>
              <p className="text-sm text-[#2B2B2B]/85 leading-relaxed">
                Founded on the pillars of transparency, engineering brilliance, and uncompromising security, Adjen Technologies has transitioned from a custom hardware engineering laboratory to an elite global software consultancy.
              </p>
              <p className="text-sm text-[#2B2B2B]/85 leading-relaxed">
                We believe that software is an intricate craft. Every microservice cluster, code node, and database query is meticulously designed to support maximum enterprise performance. We replace high-maintenance legacy code with beautifully compiled systems that scale gracefully on command.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E5E5E5]">
                <div>
                  <h4 className="text-sm font-black text-black">Decentralized Trust</h4>
                  <p className="text-xs text-[#8A8A8A] mt-1">We configure SOC-2 ready infrastructure across multiple cloud nodes.</p>
                </div>
                <div>
                  <h4 className="text-sm font-black text-black">Uncompromised Speed</h4>
                  <p className="text-xs text-[#8A8A8A] mt-1">Our API setups are fully index-optimized for millisecond queries.</p>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="px-5 py-3 bg-[#000000] hover:bg-[#F5C400] text-white hover:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>Request System Audit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 2. SERVICES SECTION (REDESIGNED: Zig-Zag layout with custom vector interactive modules & unique hover states per card) */}
      <section id="services" className="py-24 bg-[#FFFFFF] border-t border-b border-[#E5E5E5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-20">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-black text-[#FEDC09] rounded-md">Architectural Directory</span>
            <h2 className="text-3xl font-black text-[#000000] tracking-tight">Decoupled Microservices & Digital Shipments</h2>
            <p className="text-sm text-[#8A8A8A]">
              We don't build standard websites. We engineer high-scale corporate architectures optimized to perform under extreme pressure.
            </p>
          </div>

          {/* Zig-Zag Alternating Layout */}
          <div className="space-y-28">

            {/* Service 1: Custom software (Image left, content right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Custom Interactive Illustration: Code Schema Grid */}
              <div className="lg:col-span-6">
                <motion.div 
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className="p-8 bg-[#E5E5E5]/20 border-2 border-[#E5E5E5] rounded-3xl h-80 flex flex-col justify-between relative overflow-hidden group/serv1 transition-all duration-300 hover:border-[#000000]"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-black text-[#FEDC09] flex items-center justify-center">
                      <Code className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-[#8A8A8A]">MODULES: COMPACT</span>
                  </div>
                  {/* Glowing custom Code Line Visuals */}
                  <div className="space-y-3 font-mono text-[10px] text-[#2B2B2B] bg-[#FFFFFF] p-4 rounded-xl border border-[#E5E5E5] shadow-inner relative overflow-hidden">
                    <div className="flex gap-2 text-green-600"><span className="text-zinc-400">1</span><span>import {"{ createNode }"} from "@adjen/core";</span></div>
                    <div className="flex gap-2 text-[#000000] font-black"><span className="text-zinc-400">2</span><span>const server = createNode({"{ port: 3000 }"});</span></div>
                    <div className="flex gap-2 text-blue-600"><span className="text-zinc-400">3</span><span>server.deployLedger("SOC2_GATEWAY");</span></div>
                    <div className="absolute top-0 right-0 p-1.5 bg-[#FEDC09] text-[8px] font-black tracking-widest text-black rounded-bl">COMPILE_SUCCESS</div>
                  </div>
                  <p className="text-[10px] text-[#8A8A8A] font-bold font-mono uppercase tracking-widest">HOVER STATE: EXPAND BORDER GLOW</p>
                </motion.div>
              </div>
              {/* Content */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase tracking-widest">01 / SOFTWARE ARCHITECTURE</span>
                <h3 className="text-2xl font-black text-black tracking-tight">Custom Enterprise Platforms</h3>
                <p className="text-sm text-[#2B2B2B]/85 leading-relaxed">
                  We construct modular, type-safe software platforms from scratch. No bloated pre-made CMS tools. Everything is custom compiled to manage concurrent user databases securely.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-[#E5E5E5]/60 text-black text-[10px] font-mono font-black uppercase rounded-lg">99.9% UPTIME</span>
                  <span className="px-2.5 py-1 bg-[#E5E5E5]/60 text-black text-[10px] font-mono font-black uppercase rounded-lg">TYPE-SAFE APIs</span>
                  <span className="px-2.5 py-1 bg-[#E5E5E5]/60 text-black text-[10px] font-mono font-black uppercase rounded-lg">REST & GRAPHQL</span>
                </div>
              </div>
            </div>

            {/* Service 2: Cloud Systems (Content left, image right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Content */}
              <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase tracking-widest">02 / INFRASTRUCTURE</span>
                <h3 className="text-2xl font-black text-black tracking-tight">Cloud Systems & Kubernetes DevOps</h3>
                <p className="text-sm text-[#2B2B2B]/85 leading-relaxed">
                  Decouple your software from local server clusters. We set up high-redundancy, auto-scaling instances on AWS, Google Cloud, and Cloud Run, structured with Dockerized Kubernetes clusters.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] font-mono font-black uppercase rounded-lg">AWS & GCP</span>
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] font-mono font-black uppercase rounded-lg">TERRAFORM IaC</span>
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] font-mono font-black uppercase rounded-lg">DOCKER SPACES</span>
                </div>
              </div>
              {/* Custom Interactive Illustration: Concentric Pulsing Nodes */}
              <div className="lg:col-span-6 order-1 lg:order-2">
                <motion.div 
                  whileHover={{ scale: 1.03, rotate: -1, boxShadow: '0 20px 40px rgba(254, 220, 9, 0.15)' }}
                  className="p-8 bg-[#000000] border border-zinc-800 rounded-3xl h-80 flex flex-col justify-between relative overflow-hidden group/serv2"
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="w-10 h-10 rounded-xl bg-[#2B2B2B] text-[#FEDC09] flex items-center justify-center">
                      <Cloud className="w-5 h-5 text-[#FEDC09]" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">INFRA_MAP: LIVE</span>
                  </div>

                  {/* Pulsing Concentric Circles */}
                  <div className="relative my-auto flex items-center justify-center h-28 w-full">
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute w-24 h-24 rounded-full border border-[#FEDC09]/20"
                    />
                    <motion.div 
                      animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute w-16 h-16 rounded-full border border-zinc-700"
                    />
                    <div className="w-10 h-10 rounded-full bg-[#FEDC09] flex items-center justify-center text-black font-black font-mono text-[9px] relative z-10 shadow-lg">
                      CORE
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-bold font-mono uppercase tracking-widest">HOVER STATE: SHADOW PULSE & TILT</p>
                </motion.div>
              </div>
            </div>

            {/* Service 3: Cybersecurity (Image left, content right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Custom Interactive Illustration: Glowing security shield outline */}
              <div className="lg:col-span-6">
                <motion.div 
                  whileHover={{ y: -8, backgroundColor: '#2B2B2B', borderColor: '#FEDC09' }}
                  className="p-8 bg-[#FFFFFF] border-2 border-[#E5E5E5] rounded-3xl h-80 flex flex-col justify-between relative overflow-hidden group/serv3 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FEDC09] text-black flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase font-black group-hover/serv3:text-[#FEDC09]">Shield Active</span>
                  </div>

                  <div className="my-auto flex flex-col items-center justify-center">
                    <Lock className="w-12 h-12 text-[#000000] group-hover/serv3:text-[#FEDC09] transition-colors duration-300 mb-2" />
                    <span className="text-xs font-mono font-black uppercase text-[#2B2B2B] group-hover/serv3:text-[#FFFFFF] transition-colors">DECRYPTED_ENVELOPE: LOCKED</span>
                  </div>

                  <p className="text-[10px] text-[#8A8A8A] font-bold font-mono uppercase tracking-widest group-hover/serv3:text-[#FEDC09]">HOVER STATE: COLOR INVERSION & LIFT</p>
                </motion.div>
              </div>
              {/* Content */}
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase tracking-widest">03 / CYBERSECURITY CORE</span>
                <h3 className="text-2xl font-black text-black tracking-tight">Cybersecurity Architecture</h3>
                <p className="text-sm text-[#2B2B2B]/85 leading-relaxed">
                  We deploy military-grade network protection protocols. From complete penetration testing of your active endpoints to compiling secure token systems preventing data spoofing.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-[#E5E5E5]/60 text-black text-[10px] font-mono font-black uppercase rounded-lg">SOC-2 COMPLIANT</span>
                  <span className="px-2.5 py-1 bg-[#E5E5E5]/60 text-black text-[10px] font-mono font-black uppercase rounded-lg">PEN-TEST CERTIFIED</span>
                  <span className="px-2.5 py-1 bg-[#E5E5E5]/60 text-black text-[10px] font-mono font-black uppercase rounded-lg">ENVELOPE CRYPTO</span>
                </div>
              </div>
            </div>

            {/* Service 4: AI & ML (Content left, image right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Content */}
              <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase tracking-widest">04 / INTELLIGENT COMPILING</span>
                <h3 className="text-2xl font-black text-black tracking-tight">AI & Intelligent Gemini Pipelines</h3>
                <p className="text-sm text-[#2B2B2B]/85 leading-relaxed">
                  Supercharge your core enterprise operations with modern AI pipelines. We implement server-side Gemini SDK layers to process big data, classify support files, and automate reporting metrics.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-[#FEDC09] text-black text-[10px] font-mono font-black uppercase rounded-lg">GEMINI PRO MODELING</span>
                  <span className="px-2.5 py-1 bg-[#FEDC09] text-black text-[10px] font-mono font-black uppercase rounded-lg">SEMANTIC GRAPH</span>
                  <span className="px-2.5 py-1 bg-[#FEDC09] text-black text-[10px] font-mono font-black uppercase rounded-lg">LLM AUTOMATION</span>
                </div>
              </div>
              {/* Custom Interactive Illustration: AI Nodes */}
              <div className="lg:col-span-6 order-1 lg:order-2">
                <motion.div 
                  whileHover={{ scale: 0.98 }}
                  className="p-8 bg-gradient-to-tr from-[#FEDC09] to-[#F5C400] text-black rounded-3xl h-80 flex flex-col justify-between relative overflow-hidden group/serv4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#FEDC09]" />
                    </div>
                    <span className="text-[10px] font-mono font-black uppercase">LLM_ENGINE: ACTIVE</span>
                  </div>

                  {/* AI Connections */}
                  <div className="relative my-auto flex items-center justify-around h-24 w-full">
                    <div className="p-2.5 bg-black text-white rounded-lg font-mono text-[9px] font-black shadow-lg">INPUT</div>
                    <div className="w-12 h-0.5 border-t-2 border-dashed border-black" />
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="w-14 h-14 rounded-full border-4 border-black border-t-[#FFFFFF] flex items-center justify-center"
                    >
                      <Cpu className="w-5 h-5 text-black" />
                    </motion.div>
                    <div className="w-12 h-0.5 border-t-2 border-dashed border-black" />
                    <div className="p-2.5 bg-black text-[#FEDC09] rounded-lg font-mono text-[9px] font-black shadow-lg">INTELLIGENCE</div>
                  </div>

                  <p className="text-[10px] text-black font-black font-mono uppercase tracking-widest">HOVER STATE: SCALE DOWN & CONTRACT</p>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 3. WHY CHOOSE US SECTION (REDESIGNED: Premium vertical timeline stream instead of simple cards) */}
      <section id="why-us" className="py-24 bg-[#000000] text-white relative overflow-hidden">
        {/* Abstract cyber backdrop layout */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] rounded-full bg-[#FEDC09] filter blur-[200px]" />
          <div className="w-full h-full bg-[radial-gradient(#E5E5E5_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left side: Heading and dynamic status tracker */}
            <div className="lg:col-span-5 space-y-6">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-[#FEDC09] text-black rounded-md">The Adjen Standard</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                The Core Pillars of Our Architecture.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We design and ship robust systems matching the strict specifications of high-tech companies like Stripe, Vercel, and Apple. Our timeline is transparent, our metrics are verified, and our code is pristine.
              </p>

              {/* Dynamic status box displaying active state specification */}
              <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                <span className="text-[9px] font-mono font-bold text-[#FEDC09] uppercase tracking-wider block">Currently Inspecting Metric:</span>
                <h4 className="text-lg font-black text-white">{whySteps[activeWhyStep].title}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#FEDC09] font-mono">{whySteps[activeWhyStep].metric}</span>
                  <span className="text-xs text-zinc-400">{whySteps[activeWhyStep].metricLabel}</span>
                </div>
              </div>
            </div>

            {/* Right side: Interactive Vertical Process Timeline */}
            <div className="lg:col-span-7 relative">
              {/* Connecting vertical line */}
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-zinc-800" />

              <div className="space-y-8 relative">
                {whySteps.map((step, idx) => {
                  const isActive = activeWhyStep === idx;
                  return (
                    <motion.div 
                      key={idx}
                      onClick={() => setActiveWhyStep(idx)}
                      className={`flex gap-6 pl-1.5 cursor-pointer relative group transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                      }`}
                    >
                      {/* Timeline Node */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-black border transition-all relative z-10 ${
                        isActive 
                          ? 'bg-[#FEDC09] text-black border-[#FEDC09] scale-110 shadow-lg shadow-[#FEDC09]/20' 
                          : 'bg-zinc-950 text-zinc-500 border-zinc-800 group-hover:border-zinc-500'
                      }`}>
                        0{idx + 1}
                      </div>

                      {/* Timeline Card */}
                      <div className={`p-6 rounded-2xl border transition-all duration-300 flex-1 ${
                        isActive 
                          ? 'bg-zinc-900 border-[#FEDC09] shadow-xl' 
                          : 'bg-zinc-950 border-zinc-900'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-black text-white">{step.title}</h3>
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-[#FEDC09]' : 'text-zinc-500'}`}>
                            {step.metric}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 4. TECHNOLOGIES SECTION (REDESIGNED: Interactive filter tabs, glass-frosted cards, infinite scrolling marquee) */}
      <section id="tech" className="py-24 bg-[#FFFFFF] border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
            <div className="lg:col-span-6 space-y-3">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-[#FEDC09] text-black rounded-md">Advanced Stack</span>
              <h2 className="text-3xl font-black text-[#000000] tracking-tight">An Elite Stack Engineered for Continuous Load</h2>
              <p className="text-sm text-[#8A8A8A]">
                We strictly avoid obsolete legacy engines. We compile platforms using modern, modular languages ensuring instantaneous operations.
              </p>
            </div>
            
            {/* Tech Category Filtering Navigation */}
            <div className="lg:col-span-6 flex flex-wrap gap-2 justify-start lg:justify-end">
              {[
                { id: 'all', label: 'All Tech' },
                { id: 'frontend', label: 'Frontend Fidelity' },
                { id: 'backend', label: 'API Backend' },
                { id: 'devops', label: 'Cloud DevOps' },
                { id: 'ai', label: 'Gemini AI' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTechCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 border cursor-pointer ${
                    techCategory === cat.id 
                      ? 'bg-[#000000] text-[#FFFFFF] border-black shadow-sm' 
                      : 'bg-white text-[#2B2B2B] border-[#E5E5E5] hover:bg-[#E5E5E5]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Stack Grid inside glass cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTech.map((tech, idx) => {
                const IconComp = tech.icon;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={tech.name}
                    className="p-4 border border-[#E5E5E5] bg-gradient-to-b from-[#FFFFFF] to-[#E5E5E5]/20 rounded-2xl hover:border-black hover:shadow-md transition-all flex flex-col justify-between h-32 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-[#FEDC09]/20 text-black flex items-center justify-center group-hover:bg-[#FEDC09] transition-colors duration-300">
                        <IconComp className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-[8px] font-mono text-[#8A8A8A] font-bold uppercase">{tech.category}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-black tracking-tight">{tech.name}</h4>
                      <p className="text-[9px] text-[#8A8A8A] mt-0.5 leading-tight">{tech.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Infinite Scrolling Logo Marquee built using Framer Motion */}
          <div className="mt-20 pt-10 border-t border-[#E5E5E5] overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono font-bold text-[#8A8A8A] uppercase tracking-widest">PROUD INTEGRATION PARTNERS</span>
            </div>

            <div className="flex w-full">
              {/* Infinite Marquee Container */}
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="flex gap-16 flex-none whitespace-nowrap pr-16"
              >
                {[...Array(2)].map((_, mainIdx) => (
                  <React.Fragment key={mainIdx}>
                    {['AMAZON WEB SERVICES', 'GOOGLE CLOUD PLATFORM', 'VERCEL DEPLOY', 'STRIPE PAY', 'GITHUB ENTERPRISE', 'DOCKER CLUSTERS', 'KUBERNETES SECURE', 'NEXTJS EDGE', 'POSTGRES SQL'].map((partner, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs font-black font-mono tracking-widest text-[#8A8A8A] hover:text-[#FEDC09] cursor-default transition-colors">
                        <Cpu className="w-4 h-4 text-[#FEDC09]" />
                        <span>{partner}</span>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* 🌟 5. PORTFOLIO SECTION (REDESIGNED: Asymmetrical Masonry/Grid gallery with modal case studies) */}
      <section id="portfolio" className="py-24 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-[#FEDC09] text-black rounded-md">Shipments Log</span>
            <h2 className="text-3xl font-black text-[#000000] tracking-tight">Technical Case Blueprints & Metrics</h2>
            <p className="text-sm text-[#8A8A8A]">
              Click on any case file below to expand its architectural schema, code variables, and performance reports.
            </p>
          </div>

          {/* Asymmetrical Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {projects.map((proj, idx) => {
              // Create asymmetrical sizing spans
              const colSpan = idx === 0 || idx === 3 ? 'md:col-span-7' : 'md:col-span-5';
              return (
                <motion.div
                  layoutId={`proj-container-${proj.id}`}
                  onClick={() => setSelectedProject(proj)}
                  key={proj.id}
                  className={`${colSpan} group border border-[#E5E5E5] bg-[#FFFFFF] rounded-3xl overflow-hidden hover:shadow-2xl hover:border-black cursor-pointer transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className="p-8 bg-[#000000] text-white relative h-52 flex flex-col justify-between overflow-hidden">
                    {/* Glowing mesh effect inside header */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-[#FEDC09]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 relative z-10">
                      <span className="text-[9px] font-black font-mono tracking-wider text-[#FEDC09]">{proj.category}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">CODE_ID_0{proj.id}</span>
                    </div>
                    <h3 className="text-xl font-black text-white relative z-10 group-hover:text-[#FEDC09] transition-colors">
                      {proj.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 relative z-10">
                      {proj.tags.slice(0, 3).map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[8px] rounded font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#2B2B2B]/85 leading-relaxed">
                      {proj.shortDesc}
                    </p>
                    <div className="flex items-baseline gap-2 pt-2 border-t border-[#E5E5E5]">
                      <span className="text-2xl font-black text-black font-mono">{proj.metric}</span>
                      <span className="text-[10px] text-[#8A8A8A] font-bold uppercase font-mono">{proj.metricLabel}</span>
                    </div>
                    <span className="text-xs font-black text-black flex items-center gap-1 group-hover:text-[#F5C400] transition-colors">
                      <span>Expand Architecture Blueprint</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Modal Case Study Details (Premium immersive popup) */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <motion.div 
                layoutId={`proj-container-${selectedProject.id}`}
                className="bg-[#FFFFFF] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-[#E5E5E5] shadow-2xl relative"
              >
                {/* Header Banner */}
                <div className="p-8 bg-black text-white relative">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 bg-zinc-900 hover:bg-[#FEDC09] hover:text-black text-white rounded-xl transition-all border border-zinc-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="text-[9px] font-black font-mono tracking-wider text-[#FEDC09] block mb-2">{selectedProject.category}</span>
                  <h3 className="text-2xl font-black">{selectedProject.title}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">TIMELINE: {selectedProject.timeline}</p>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#8A8A8A] uppercase tracking-wider mb-2">SYSTEM CHALLENGE & SCOPE</h4>
                    <p className="text-sm text-[#2B2B2B] leading-relaxed">
                      {selectedProject.fullDesc}
                    </p>
                  </div>

                  {/* Tech variables list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E5E5E5]">
                    <div>
                      <h4 className="text-xs font-mono font-bold text-[#8A8A8A] uppercase tracking-wider mb-3">DEPLOYED ARCHITECTURE NODES</h4>
                      <ul className="space-y-2">
                        {selectedProject.architecture.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#2B2B2B]">
                            <Check className="w-4 h-4 text-[#FEDC09] flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono font-bold text-[#8A8A8A] uppercase tracking-wider mb-3">ENGINEERING ACTION STEPS</h4>
                      <ul className="space-y-2">
                        {selectedProject.solutionDetails.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-[#2B2B2B]">
                            <span className="w-4.5 h-4.5 rounded bg-black text-[#FEDC09] font-mono text-[9px] flex items-center justify-center font-black flex-shrink-0 mt-0.5">0{i+1}</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Highlights Metric Box */}
                  <div className="p-5 bg-[#FEDC09]/10 border border-[#FEDC09] rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-yellow-600 uppercase">AUDITED SYSTEM PERFORMANCE LEVEL</span>
                      <h4 className="text-lg font-black text-black">{selectedProject.metricLabel}</h4>
                    </div>
                    <span className="text-3xl font-black text-black font-mono">{selectedProject.metric}</span>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-[#E5E5E5]">
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2 bg-[#E5E5E5] hover:bg-black hover:text-white text-black text-xs font-bold uppercase rounded-xl transition-colors"
                    >
                      Close Case File
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedProject(null);
                        scrollToSection('contact');
                      }}
                      className="px-4 py-2 bg-black hover:bg-[#FEDC09] text-white hover:text-black text-xs font-black uppercase rounded-xl transition-colors border border-black"
                    >
                      Build Similar Platform
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 🌟 6. PROCESS SECTION (REDESIGNED: Modern horizontal timeline with interactive card detail navigation) */}
      <section id="process" className="py-24 bg-gradient-to-r from-zinc-50 via-[#FFFFFF] to-zinc-50 border-t border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-[#000000] text-white rounded-md">How We Ship</span>
            <h2 className="text-3xl font-black text-[#000000] tracking-tight">The Modular Engineering Pipeline</h2>
            <p className="text-sm text-[#8A8A8A]">
              We adhere to strict milestones from audits to launches. Click a step to review expected deliverables.
            </p>
          </div>

          {/* Horizontal connecting line timeline */}
          <div className="relative mb-12">
            {/* Background bar */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E5E5E5] -translate-y-1/2 z-0" />
            
            {/* Active connecting line filling dynamically */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-[#FEDC09] -translate-y-1/2 z-10 transition-all duration-500"
              style={{ width: `${(activeProcessStep / (processSteps.length - 1)) * 100}%` }}
            />

            <div className="relative z-20 flex justify-between">
              {processSteps.map((step, idx) => {
                const isActive = activeProcessStep === idx;
                return (
                  <button 
                    key={idx}
                    onClick={() => setActiveProcessStep(idx)}
                    className="flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all ${
                      isActive 
                        ? 'bg-black text-[#FEDC09] scale-110 shadow-lg' 
                        : 'bg-white text-[#8A8A8A] border-2 border-[#E5E5E5] group-hover:border-black'
                    }`}>
                      {step.number}
                    </div>
                    <span className={`text-[10px] font-bold font-mono uppercase mt-2 hidden sm:block ${
                      isActive ? 'text-black' : 'text-[#8A8A8A]'
                    }`}>
                      {step.title.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Process Step Specifications Detail Card */}
          <div className="p-8 bg-white border border-[#E5E5E5] rounded-3xl shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-2 py-0.5 bg-[#FEDC09] text-black text-[9px] font-black uppercase font-mono tracking-widest rounded">
                {processSteps[activeProcessStep].phase}
              </span>
              <h3 className="text-xl font-black text-black tracking-tight">{processSteps[activeProcessStep].title}</h3>
              <p className="text-xs text-[#2B2B2B] leading-relaxed">
                {processSteps[activeProcessStep].desc}
              </p>
            </div>
            <div className="lg:col-span-4 bg-[#E5E5E5]/30 p-5 rounded-2xl border border-[#E5E5E5] space-y-3">
              <div>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">TYPICAL TIMESCALE:</span>
                <span className="text-xs font-black text-black">{processSteps[activeProcessStep].time}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">CORE DELIVERABLE:</span>
                <span className="text-xs font-semibold text-black">{processSteps[activeProcessStep].deliverable}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 🌟 7. TESTIMONIALS SECTION (REDESIGNED: Premium slider layout with custom photo ratings) */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-[#FEDC09]/5 via-[#FFFFFF] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading and Navigation Arrows */}
            <div className="lg:col-span-5 space-y-6">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-black text-[#FEDC09] rounded-md">Validated Trust</span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#000000] tracking-tight leading-tight">
                Highly Endorsed by Software Executives.
              </h2>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                We design with absolute care. Read how global engineering executives scale and protect databases using Adjen Technologies.
              </p>
              
              {/* Controls */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="p-3 bg-white border border-[#E5E5E5] text-black hover:bg-black hover:text-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="p-3 bg-white border border-[#E5E5E5] text-black hover:bg-black hover:text-white rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Sliding quotes and executive photos */}
            <div className="lg:col-span-7">
              <div className="bg-[#FFFFFF] border border-[#E5E5E5] p-8 sm:p-12 rounded-3xl shadow-xl relative overflow-hidden min-h-[300px] flex flex-col justify-between">
                {/* Visual Quotation mark graphics */}
                <div className="absolute -top-10 -left-6 text-9xl font-serif text-[#FEDC09]/15 font-black pointer-events-none select-none">
                  “
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(testimonials[activeTestimonial].stars)].map((_, i) => (
                      <Star key={i} className="w-4.5 h-4.5 text-[#FEDC09] fill-[#FEDC09]" />
                    ))}
                  </div>

                  <p className="text-sm text-[#2B2B2B] font-medium leading-relaxed italic">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                </div>

                <div className="relative z-10 pt-6 border-t border-[#E5E5E5] flex items-center gap-4 mt-6">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FEDC09]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-sm font-black text-black leading-tight">{testimonials[activeTestimonial].author}</h5>
                    <p className="text-[10px] font-mono text-[#8A8A8A] font-bold uppercase">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 8. FAQ SECTION (REDESIGNED: Elegant two-column Accordion layout with rotation icons) */}
      <section id="faq" className="py-24 bg-[#FFFFFF] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: FAQ Info Call */}
            <div className="lg:col-span-5 space-y-5">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-[#FEDC09] text-black rounded-md">Common Queries</span>
              <h2 className="text-3xl font-black text-[#000000] tracking-tight leading-none">
                Frequently Asked <br />System Questions.
              </h2>
              <p className="text-xs text-[#8A8A8A] leading-relaxed max-w-sm">
                Review core specifications detailing legacy code refactoring, SLA guarantees, and how we implement military-grade cybersecurity layers.
              </p>
              
              <div className="p-5 bg-[#E5E5E5]/30 rounded-2xl border border-[#E5E5E5] max-w-sm space-y-2">
                <p className="text-xs font-semibold text-black">Still have queries?</p>
                <p className="text-[10px] text-zinc-500 font-mono">Our lead software architects are standing by to audit your codebase logs.</p>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-xs font-black text-black hover:underline flex items-center gap-1.5"
                >
                  Contact Architect <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Accordion */}
            <div className="lg:col-span-7 space-y-4">
              {faqItems.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border border-[#E5E5E5] bg-[#FFFFFF] rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-6 flex justify-between items-center hover:bg-zinc-50 transition-colors"
                    >
                      <span className="text-sm font-black text-black pr-4">{item.q}</span>
                      <div className={`w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#FEDC09]' : ''}`}>
                        {isOpen ? <Minus className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-[#8A8A8A]" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6 border-t border-zinc-50 pt-3"
                        >
                          <p className="text-xs text-[#2B2B2B]/90 leading-relaxed font-medium">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 9. CONTACT SECTION (REDESIGNED: Interactive Abstract world map office locator, visual forms) */}
      <section id="contact" className="py-24 bg-[#000000] text-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Abstract world map office selector */}
            <div className="lg:col-span-5 space-y-6">
              <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase font-mono bg-[#FEDC09] text-black rounded-md">Start the Audit</span>
              <h2 className="text-3xl font-black text-white tracking-tight leading-none">
                Let's Modernize <br />Your Architecture.
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
                Click on any of our global offices in the matrix below to instantly update coordinates and direct technical SLA dial-in phone numbers.
              </p>

              {/* Matrix of Office Selectors */}
              <div className="grid grid-cols-2 gap-2 max-w-sm">
                {Object.keys(offices).map((key) => {
                  const node = offices[key];
                  const isActive = activeOffice === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveOffice(key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isActive 
                          ? 'bg-zinc-900 border-[#FEDC09] text-white' 
                          : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <p className="text-[10px] font-mono font-bold">{node.city}</p>
                      <p className="text-[8px] font-mono text-zinc-500 mt-0.5">{node.timezone}</p>
                    </button>
                  );
                })}
              </div>

              {/* Deployed Office Specs details card */}
              <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 max-w-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FEDC09] font-mono uppercase">
                  <MapPin className="w-4 h-4 text-[#FEDC09]" />
                  <span>{offices[activeOffice].city} COORDINATES</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-tight">
                  {offices[activeOffice].address}
                </p>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-800 text-[10px] font-mono">
                  <div>
                    <span className="text-zinc-500 uppercase block">DIRECT DIAL:</span>
                    <span className="text-white font-bold">{offices[activeOffice].phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase block">GEO_POINT:</span>
                    <span className="text-white font-bold">{offices[activeOffice].coordinates.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Premium dark styled corporate brief form */}
            <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 p-8 rounded-3xl shadow-2xl relative">
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-zinc-600 tracking-widest">TRANSMISSION_MATRIX: ACTIVE</div>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#FEDC09] font-mono uppercase font-black tracking-wider">Full Name</label>
                    <input 
                      type="text" required placeholder="Marcus Aurelius"
                      value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FEDC09] transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#FEDC09] font-mono uppercase font-black tracking-wider">Corporate Email</label>
                    <input 
                      type="email" required placeholder="marcus@empire.io"
                      value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FEDC09] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#FEDC09] font-mono uppercase font-black tracking-wider">Project Subject</label>
                  <input 
                    type="text" placeholder="DevOps Migrations & Cloud Security"
                    value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FEDC09] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] text-[#FEDC09] font-mono uppercase font-black tracking-wider">Project Brief & Technical Stack</label>
                  <textarea 
                    rows={4} required placeholder="Please details your software brief, load expectations, and target timeframe..."
                    value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FEDC09] transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-[#FEDC09] hover:bg-[#F5C400] text-black hover:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm border border-[#FEDC09] cursor-pointer"
                >
                  Send Consultation Request
                </button>

                <AnimatePresence>
                  {formSubmitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Thank you! Your technical brief was transmitted successfully. A lead architect will contact you.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 🌟 10. FOOTER (REDESIGNED: Premium layout, detailed columns, quick navigation links, newsletter alerts) */}
      <footer className="bg-[#000000] text-white py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-zinc-900">
            
            {/* Logo and company info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#FEDC09] text-black rounded-lg flex items-center justify-center">
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-black text-white tracking-widest font-mono">ADJEN TECH</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Premium corporate software engineering, cloud configurations, and high-performance technical consulting for industry leaders.
              </p>
              <div className="flex gap-3 pt-2">
                {['linkedin', 'github', 'twitter'].map((soc) => (
                  <a 
                    href={`#${soc}`} 
                    key={soc}
                    className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-[#FEDC09] hover:border-[#FEDC09] transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links 1: Enterprise Services */}
            <div className="space-y-4 text-xs">
              <h4 className="font-mono text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Enterprise Services</h4>
              <ul className="space-y-2 text-zinc-400 font-medium">
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Custom Software</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Cloud Migrations</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Cybersecurity Core</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">AI & ML Pipelines</button></li>
              </ul>
            </div>

            {/* Links 2: Corporate Pillars */}
            <div className="space-y-4 text-xs">
              <h4 className="font-mono text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Company Pillars</h4>
              <ul className="space-y-2 text-zinc-400 font-medium">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About our Team</button></li>
                <li><button onClick={() => scrollToSection('why-us')} className="hover:text-white transition-colors">Engineering Manifesto</button></li>
                <li><button onClick={() => scrollToSection('portfolio')} className="hover:text-white transition-colors">Case Blueprints</button></li>
                <li><button onClick={onEnterPortal} className="text-[#FEDC09] hover:underline font-bold">Secure Partner Portal</button></li>
              </ul>
            </div>

            {/* Newsletter form */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Newsletter Brief</h4>
              <p className="text-[11px] text-zinc-400">Subscribe for weekly architectural models, DevOps updates, and high-scale software analysis.</p>
              <div className="flex gap-2 text-xs">
                <input 
                  type="email" placeholder="mail@example.com"
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs outline-none focus:border-[#FEDC09] flex-1"
                />
                <button className="px-3.5 py-2 bg-[#FEDC09] text-black font-black uppercase tracking-wider rounded-xl hover:bg-[#F5C400] transition-colors">
                  Join
                </button>
              </div>
            </div>

          </div>

          {/* Copyright section */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>© 2026 ADJEN TECHNOLOGIES. ALL RIGHTS RESERVED. REGISTERED IN USA.</span>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <a href="#privacy" className="hover:text-white transition-colors">PRIVACY CODE</a>
              <a href="#sla" className="hover:text-white transition-colors">SLA GUARANTEES</a>
              <a href="#security" className="hover:text-white transition-colors">SECURITY DISCLOSURES</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
