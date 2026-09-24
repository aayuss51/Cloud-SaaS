import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { getTasks, addTask, toggleTask, deleteTask } from '../../services/mockDb';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Search, Clock, Tag } from 'lucide-react';
import { useTenant } from '../../context/TenantContext';

export const Tasks: React.FC = () => {
  const { currentProperty } = useTenant();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('MEDIUM');
  const [category, setCategory] = useState<Task['category']>('FRONT_DESK');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    if (!currentProperty) return;
    const data = await getTasks(currentProperty.id);
    setTasks(data);
  };

  useEffect(() => {
    loadData();
  }, [currentProperty]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !currentProperty) return;
    await addTask({
      propertyId: currentProperty.id,
      text: newTaskText,
      assignedTo: assignedTo || 'General Staff',
      priority,
      category,
    });
    setNewTaskText('');
    setAssignedTo('');
    await loadData();
  };

  const handleToggle = async (id: string) => {
    await toggleTask(id);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    await loadData();
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ACTIVE' && t.isCompleted) return false;
    if (filter === 'COMPLETED' && !t.isCompleted) return false;
    if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white font-sans">
              Operational Tasks & Work Orders
            </h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Live Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track daily duty manager tasks, VIP preparations, maintenance requests, and turn-down assignments.
          </p>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
        <div className="font-bold text-white uppercase tracking-wider text-[11px]">
          Create Dispatch Task
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              placeholder="Task instructions (e.g., Deliver welcome champagne to PH-1)"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-white placeholder:text-slate-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Assignee (e.g. Aayush)"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-850 border border-slate-700 rounded-xl text-white placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Task['priority'])}
              className="w-full px-2.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shrink-0"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filter === 'ALL' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filter === 'ACTIVE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({tasks.filter(t => !t.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              filter === 'COMPLETED' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({tasks.filter(t => t.isCompleted).length})
          </button>
        </div>

        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            No operational tasks found.
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-slate-900 border rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs transition-all ${
                task.isCompleted ? 'border-slate-800/50 opacity-60' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => handleToggle(task.id)}
                  className="text-slate-500 hover:text-blue-400 transition-colors"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 size={18} className="text-blue-400" />
                  ) : (
                    <Circle size={18} />
                  )}
                </button>
                <div className="flex-1">
                  <p
                    className={`font-medium text-white ${
                      task.isCompleted ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>Assigned: {task.assignedTo || 'Staff'}</span>
                    <span>•</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-500/20 text-rose-300'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
