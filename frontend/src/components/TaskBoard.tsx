import React, { useState } from 'react';
import { CheckSquare, Square, Clock, Plus, AlertOctagon } from 'lucide-react';
import { TaskItem } from '../types';

interface TaskBoardProps {
  tasks: TaskItem[];
  onToggleTask: (id: number) => Promise<void>;
  onAddTask: (task: Partial<TaskItem>) => Promise<void>;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onToggleTask,
  onAddTask
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('first_15_min');
  const [newTitle, setNewTitle] = useState('');

  const timeframes = [
    { key: 'first_15_min', label: 'FIRST 15 MINUTES', color: 'text-rose-400 border-rose-500/30' },
    { key: 'first_hour', label: 'FIRST HOUR', color: 'text-amber-400 border-amber-500/30' },
    { key: 'first_24_hours', label: 'FIRST 24 HOURS', color: 'text-cyan-400 border-cyan-500/30' },
    { key: 'ongoing', label: 'ONGOING MAINTENANCE', color: 'text-emerald-400 border-emerald-500/30' },
  ];

  const filteredTasks = tasks.filter(t => t.timeframe === selectedTimeframe);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onAddTask({
      timeframe: selectedTimeframe as any,
      title: newTitle,
      priority: 'HIGH',
      completed: false
    });
    setNewTitle('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckSquare className="w-5 h-5" />
          <h2 className="text-lg font-bold font-heading uppercase text-white tracking-wide">
            SURVIVAL TASK BOARD
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Step-by-Step Priority Execution Checklists for Disaster Phases
        </p>
      </div>

      {/* Timeframe Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {timeframes.map(tf => {
          const count = tasks.filter(t => t.timeframe === tf.key && !t.completed).length;
          const isSelected = selectedTimeframe === tf.key;
          return (
            <button
              key={tf.key}
              onClick={() => setSelectedTimeframe(tf.key)}
              className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-lg text-white'
                  : 'bg-[#121824] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className={`text-xs font-mono font-bold tracking-wider ${tf.color}`}>{tf.label}</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold">{count} Pending</span>
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Task Creation & List */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4">
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new emergency task..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD TASK</span>
          </button>
        </form>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              No tasks listed for this timeframe yet.
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => task.id && onToggleTask(task.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  task.completed
                    ? 'bg-slate-900/40 border-slate-800/60 text-slate-500 line-through'
                    : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                  <span className="text-sm font-medium">{task.title}</span>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  task.priority === 'CRITICAL' 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
