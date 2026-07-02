import React, { useState } from 'react';
import { 
  Folder, CheckSquare, Layers, Calendar as CalendarIcon, Plus, Trash2, CheckCircle2, 
  ArrowLeft, ArrowRight, Star, Clock, UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { Task, Customer } from '../types';

interface ProjectsSectionProps {
  tasks: Task[];
  customers: Customer[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  subView: string;
}

export default function ProjectsSection({
  tasks,
  customers,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  subView
}: ProjectsSectionProps) {
  // Projects mock list
  const [projects, setProjects] = useState([
    { id: 'PRJ-01', name: 'CRM custom setup rollout', client: 'Aether Technologies', progress: 75, status: 'In Progress', lead: 'Elena Rostova' },
    { id: 'PRJ-02', name: 'MFA Security Compliance Review', client: 'Vertex Corporation', progress: 100, status: 'Completed', lead: 'Marcus Chen' },
    { id: 'PRJ-03', name: 'SaaS Platform Licensing Sync', client: 'BioSphere Ltd', progress: 20, status: 'Planning', lead: 'Sarah Connor' }
  ]);

  // Kanban project stages
  const kanbanColumns = ['Backlog', 'In Progress', 'Review', 'Completed'];

  // Kanban tasks local status mapping
  const [taskStages, setTaskStages] = useState<Record<string, string>>({
    'task-1': 'In Progress',
    'task-2': 'Completed',
    'task-3': 'Review'
  });

  // Task Creator Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCustomer, setNewTaskCustomer] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Calendar parameters
  const [currentMonth, setCurrentMonth] = useState('July 2026');
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const calendarEvents: Record<number, string> = {
    4: 'MFA Review deadline',
    15: 'SaaS licensing sync audit',
    22: 'Aether CRM training'
  };
  const [selectedDayEvent, setSelectedDayEvent] = useState<string | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    
    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      customerName: newTaskCustomer || 'Global Account',
      priority: newTaskPriority,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setNewTaskTitle('');
    alert('Strategic task registered into backlog checklist.');
  };

  const handleMoveKanban = (taskId: string, direction: 'prev' | 'next') => {
    const current = taskStages[taskId] || 'Backlog';
    const idx = kanbanColumns.indexOf(current);
    let nextCol = current;
    if (direction === 'prev' && idx > 0) {
      nextCol = kanbanColumns[idx - 1];
    } else if (direction === 'next' && idx < kanbanColumns.length - 1) {
      nextCol = kanbanColumns[idx + 1];
    }
    setTaskStages({
      ...taskStages,
      [taskId]: nextCol
    });
  };

  return (
    <div className="space-y-6">

      {/* ==========================================
          SUB-VIEW: ALL PROJECTS
          ========================================== */}
      {subView === 'projects-all' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              DELIVERY PROJECTS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">BOARDS</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Configure project deliveries, deployment schedules, and milestone progress percentages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(prj => (
              <div key={prj.id} className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg relative group hover:border-yellow-400/25 transition-all space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-[10px] text-yellow-400 font-bold font-mono uppercase tracking-widest">{prj.id}</span>
                  <span className={`px-2 py-0.2 text-[8px] font-black font-mono rounded uppercase ${
                    prj.status === 'Completed' ? 'bg-emerald-950/30 text-emerald-400' :
                    prj.status === 'In Progress' ? 'bg-amber-950/30 text-amber-400' :
                    'bg-zinc-900 text-zinc-500'
                  }`}>
                    {prj.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{prj.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Account: {prj.client}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>Audit Milestone Completion</span>
                    <span>{prj.progress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full" style={{ width: `${prj.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-zinc-500 border-t border-zinc-900/60 pt-3">
                  <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> PM: {prj.lead}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: TASKS (CHECKLIST)
          ========================================== */}
      {subView === 'projects-tasks' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              TASK ASSIGNMENT CHECKS <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">CHECKLIST</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">Audit high-priority operational targets with custom dates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* List */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500 font-bold">
                Assigned system checklists
              </div>

              <div className="divide-y divide-zinc-900">
                {tasks.map(t => (
                  <div key={t.id} className="p-3.5 flex items-center justify-between hover:bg-zinc-900/10 transition-all text-xs">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={t.completed} 
                        onChange={() => onToggleTask(t.id)}
                        className="rounded border-zinc-700 text-yellow-400 focus:ring-0 focus:ring-offset-0 bg-transparent w-4 h-4 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className={`font-bold ${t.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{t.title}</p>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{t.customerName} • Due: {t.dueDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 text-[8px] font-black rounded font-mono uppercase ${
                        t.priority === 'High' ? 'bg-red-950/30 text-red-400' :
                        t.priority === 'Medium' ? 'bg-amber-950/30 text-amber-400' :
                        'bg-zinc-900 text-zinc-500'
                      }`}>
                        {t.priority}
                      </span>
                      <button 
                        onClick={() => onDeleteTask(t.id)}
                        className="p-1 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creation Form */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-6 rounded-2xl shadow-lg space-y-4 h-fit">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">Create Backlog Task</h3>
              
              <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Task Title</label>
                  <input 
                    type="text" required placeholder="Sync wire transactions" value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-white rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Associated Client</label>
                  <select 
                    value={newTaskCustomer} onChange={(e) => setNewTaskCustomer(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.fullName}>{c.fullName}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-mono uppercase">Task Priority</label>
                  <select 
                    value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 outline-none focus:border-yellow-400/50"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-yellow-400 text-black text-xs font-black rounded-xl hover:bg-yellow-300 transition-all cursor-pointer uppercase"
                >
                  + Add task checks
                </button>
              </form>
            </div>

          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: KANBAN BOARD
          ========================================== */}
      {subView === 'projects-kanban' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              SPRINT KANBAN BOARD <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">DELIVERY</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">One-click scrum sprints transition deck. Organize tasks dynamically by phase.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kanbanColumns.map(col => {
              const columnTasks = tasks.filter(t => {
                const stage = taskStages[t.id] || 'Backlog';
                return stage === col;
              });

              return (
                <div key={col} className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-3 flex flex-col min-h-[300px]">
                  <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-3">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest font-mono">{col}</span>
                    <span className="text-[9px] bg-zinc-900 text-yellow-400 px-2 py-0.2 rounded font-mono font-bold">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {columnTasks.map(task => (
                      <div key={task.id} className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2 relative group text-xs hover:border-yellow-400/30 transition-all">
                        <p className="font-bold text-white leading-snug">{task.title}</p>
                        <p className="text-[9px] text-zinc-500 font-mono">{task.customerName}</p>
                        
                        <div className="flex justify-between items-center border-t border-zinc-900 pt-2 text-[9px] font-mono text-zinc-500">
                          <span>Priority: {task.priority}</span>
                          <div className="flex gap-1 shrink-0">
                            <button 
                              onClick={() => handleMoveKanban(task.id, 'prev')}
                              className="p-0.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded cursor-pointer"
                            >
                              ◀
                            </button>
                            <button 
                              onClick={() => handleMoveKanban(task.id, 'next')}
                              className="p-0.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-yellow-400 rounded cursor-pointer"
                            >
                              ▶
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ==========================================
          SUB-VIEW: CALENDAR
          ========================================== */}
      {subView === 'projects-calendar' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                PROJECT SCHEDULES <span className="text-yellow-400 font-mono text-sm border border-yellow-400/20 px-2 py-0.5 rounded bg-yellow-400/5">CALENDAR</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Audit scheduled follow-ups, meetings, and milestone due dates.</p>
            </div>
            <span className="text-xs text-white font-mono bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">{currentMonth}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Grid */}
            <div className="lg:col-span-3 backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg">
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono text-zinc-500 uppercase border-b border-zinc-900 pb-2 mb-2 font-black">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {/* Empty spacers for alignment */}
                <span></span><span></span><span></span>
                {daysInMonth.map(day => {
                  const dayEvent = calendarEvents[day];
                  return (
                    <div 
                      key={day} 
                      onClick={() => {
                        if (dayEvent) {
                          setSelectedDayEvent(`Day ${day}: ${dayEvent}`);
                        } else {
                          setSelectedDayEvent(`Day ${day}: Rest or General Admin check.`);
                        }
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between h-14 transition-all cursor-pointer ${
                        dayEvent 
                          ? 'border-yellow-400/50 bg-yellow-400/5 text-yellow-400 hover:bg-yellow-400/10' 
                          : 'border-zinc-900 bg-zinc-900/10 text-zinc-400 hover:border-zinc-800 hover:text-white'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold">{day}</span>
                      {dayEvent && <span className="w-2 h-2 bg-yellow-400 rounded-full self-end animate-pulse"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar event picker */}
            <div className="backdrop-blur-xl bg-zinc-950/50 border border-zinc-900 p-5 rounded-2xl shadow-lg h-fit space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono border-b border-zinc-900 pb-2">Calendar Agenda</h3>
              {selectedDayEvent ? (
                <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl text-xs space-y-1.5">
                  <p className="font-mono text-yellow-400 font-bold uppercase tracking-wide text-[9px]">Event details</p>
                  <p className="text-white font-bold leading-relaxed">{selectedDayEvent}</p>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-600 font-mono block">Click any calendar date to view registered agenda.</span>
              )}
            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
