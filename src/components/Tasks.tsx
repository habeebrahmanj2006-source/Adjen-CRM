import React, { useState } from 'react';
import { CheckSquare, Square, Calendar, Plus, Trash2, ShieldAlert, Clock, X } from 'lucide-react';
import { Task, Customer } from '../types';

interface TasksProps {
  tasks: Task[];
  customers: Customer[];
  onAddTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function Tasks({
  tasks,
  customers,
  onAddTask,
  onToggleTask,
  onDeleteTask
}: TasksProps) {
  // Filters State
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Add Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Computations
  const filteredTasks = tasks.filter(t => {
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'pending' && !t.completed) || 
      (filterType === 'completed' && t.completed);

    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesType && matchesPriority;
  });

  const openAddModal = () => {
    setTitle('');
    setCustomerName(customers[0]?.fullName || customers[0]?.companyName || '');
    // Due tomorrow by default
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    setDueDate(tom.toISOString().split('T')[0]);
    setPriority('Medium');
    setIsAddOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      dueDate,
      completed: false,
      customerName,
      priority,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onAddTask(newTask);
    setIsAddOpen(false);
  };

  const isPastDue = (dateStr: string) => {
    return new Date(dateStr) < new Date() && !dateStr.includes(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Tasks & Action Checklists
          </h1>
          <p className="text-sm text-slate-400 mt-1">Due deadlines, calendar follow-ups, and customer-associated reminders</p>
        </div>

        <button
          onClick={openAddModal}
          id="btn-add-task"
          className="px-3.5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Task Filters & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/30 border border-slate-800 p-4 rounded-2xl">
        <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-xl">
          <button
            onClick={() => setFilterType('pending')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filterType === 'pending'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filterType === 'completed'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs
          </button>
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className="bg-slate-950 border border-slate-850 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-4 py-2 text-slate-300 text-xs outline-none cursor-pointer"
        >
          <option value="All">All Priorities</option>
          <option value="High">High Only</option>
          <option value="Medium">Medium Only</option>
          <option value="Low">Low Only</option>
        </select>
      </div>

      {/* Checklist layout */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const pastDue = isPastDue(task.dueDate) && !task.completed;

          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-slate-950/20 border-slate-900/60 opacity-60'
                  : pastDue
                  ? 'bg-red-950/5 border-red-900/40 hover:border-red-800/60'
                  : 'bg-slate-900/30 border-slate-800 hover:border-slate-700/80'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="text-purple-400 hover:text-purple-300 transition-colors shrink-0 cursor-pointer"
                >
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <h3 className={`text-sm font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span className="font-semibold text-slate-500">{task.customerName}</span>
                    <span>•</span>
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Delete */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`text-xs font-semibold flex items-center gap-1.5 justify-end ${pastDue ? 'text-red-400' : 'text-slate-400'}`}>
                    <Calendar className="w-3.5 h-3.5" /> Due: {task.dueDate}
                  </span>
                  {pastDue && (
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1 block flex items-center gap-1 justify-end animate-pulse">
                      <ShieldAlert className="w-3 h-3" /> Past Due Deadline
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 bg-slate-950/40 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded-lg border border-slate-800 hover:border-red-900/40 transition-all shrink-0 cursor-pointer"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No checklist items found matching current filters.
          </div>
        )}
      </div>

      {/* Add Task Modal */}
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
              <Plus className="w-5 h-5 text-purple-500" /> Create Task Entry
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Task Description / Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-sm outline-none transition-all"
                  placeholder="e.g. Call client back regarding licensing proposal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Linked Customer Account</label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.fullName}>{c.fullName} ({c.companyName || 'No Company'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl px-3.5 py-2 text-slate-100 text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Create Task Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
