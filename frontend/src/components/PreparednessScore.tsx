import React from 'react';
import { Activity, ShieldCheck, Droplets, Utensils, Zap, Home, Radio, Compass, HeartPulse } from 'lucide-react';
import { SystemStatus, WaterIQ, FoodIQ } from '../types';

interface PreparednessScoreProps {
  status: SystemStatus | null;
  waterIQ: WaterIQ | null;
  foodIQ: FoodIQ | null;
}

export const PreparednessScore: React.FC<PreparednessScoreProps> = ({ status, waterIQ, foodIQ }) => {
  const overall = status?.overall_readiness_score || 0;

  const categories = [
    { name: 'WATER RESERVES', score: Math.min(100, Math.round(((waterIQ?.days_remaining || 0) / 14) * 100)), icon: Droplets, color: 'text-cyan-400 bg-cyan-500' },
    { name: 'FOOD RESERVES', score: Math.min(100, Math.round(((foodIQ?.days_remaining || 0) / 14) * 100)), icon: Utensils, color: 'text-orange-400 bg-orange-500' },
    { name: 'MEDICAL SURVIVAL', score: 85, icon: HeartPulse, color: 'text-purple-400 bg-purple-500' },
    { name: 'SHELTER INTEGRITY', score: 90, icon: Home, color: 'text-indigo-400 bg-indigo-500' },
    { name: 'POWER & LIGHTING', score: 75, icon: Zap, color: 'text-amber-400 bg-amber-500' },
    { name: 'COMMUNICATION', score: 60, icon: Radio, color: 'text-blue-400 bg-blue-500' },
    { name: 'NAVIGATION & MAPS', score: 95, icon: Compass, color: 'text-emerald-400 bg-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-400 glow-emerald">
              <Activity className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">SURVIVAL READINESS METRICS</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Internal Planning & Audit Index Across 9 Core Preparedness Domains
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center min-w-[180px]">
            <div className="text-xs font-mono text-slate-400">OVERALL INDEX</div>
            <div className="text-4xl font-bold font-mono text-emerald-400">{overall}%</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">APOCALYPSE READY</div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${cat.color.split(' ')[0]}`} />
                  {cat.name}
                </span>
                <span className={`text-sm font-mono font-bold ${cat.color.split(' ')[0]}`}>{cat.score}%</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${cat.color.split(' ')[1]}`} 
                  style={{ width: `${cat.score}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
