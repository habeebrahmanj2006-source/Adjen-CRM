import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Users, TrendingUp, HelpCircle, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type UserRoleType = 'Super Admin' | 'Admin' | 'Manager' | 'Sales Executive' | 'Support Executive';

interface RoleSelectorProps {
  currentRole: UserRoleType;
  onChangeRole: (role: UserRoleType) => void;
}

export default function RoleSelector({ currentRole, onChangeRole }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const rolesList: { role: UserRoleType; desc: string; icon: any; color: string; bg: string }[] = [
    {
      role: 'Super Admin',
      desc: 'Complete System Control',
      icon: ShieldCheck,
      color: 'text-yellow-400 border-yellow-400/20',
      bg: 'bg-yellow-400/5',
    },
    {
      role: 'Admin',
      desc: 'Operations & Management',
      icon: UserCheck,
      color: 'text-emerald-400 border-emerald-400/20',
      bg: 'bg-emerald-400/5',
    },
    {
      role: 'Manager',
      desc: 'Team & Sales Tracking',
      icon: Users,
      color: 'text-indigo-400 border-indigo-400/20',
      bg: 'bg-indigo-400/5',
    },
    {
      role: 'Sales Executive',
      desc: 'Prospecting & Deals',
      icon: TrendingUp,
      color: 'text-pink-400 border-pink-400/20',
      bg: 'bg-pink-400/5',
    },
    {
      role: 'Support Executive',
      desc: 'Tickets & Customer FAQ',
      icon: HelpCircle,
      color: 'text-sky-400 border-sky-400/20',
      bg: 'bg-sky-400/5',
    },
  ];

  const activeRoleConfig = rolesList.find((r) => r.role === currentRole) || rolesList[0];
  const ActiveIcon = activeRoleConfig.icon;

  return (
    <div className="relative z-50">
      {/* Current Role Indicator Trigger */}
      <button
        id="role-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${activeRoleConfig.color} ${activeRoleConfig.bg} hover:bg-zinc-900/50 cursor-pointer transition-all duration-300 text-xs`}
      >
        <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
        <div className="text-left hidden sm:block">
          <p className="font-black text-[10px] tracking-wider uppercase leading-none text-white">{currentRole}</p>
          <p className="text-[8px] text-zinc-500 font-mono mt-0.5 leading-none">{activeRoleConfig.desc}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 bg-zinc-950 border border-zinc-900 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
            >
              <div className="px-2.5 py-1.5 border-b border-zinc-900">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">SELECT ROLE PROFILE</span>
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {rolesList.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = item.role === currentRole;
                  return (
                    <button
                      key={item.role}
                      onClick={() => {
                        onChangeRole(item.role);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900 text-white border border-zinc-850'
                          : 'hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${item.color} ${item.bg}`}>
                          <ItemIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black tracking-wide leading-tight text-white">{item.role}</p>
                          <p className="text-[9px] text-zinc-500 font-mono leading-none truncate mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-yellow-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
