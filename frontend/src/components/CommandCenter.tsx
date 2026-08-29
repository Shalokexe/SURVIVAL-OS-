import React, { useState } from 'react';
import { 
  ShieldAlert, Droplets, Utensils, Zap, Home, MapPin, 
  CheckSquare, BookOpen, AlertTriangle, Send, Activity, 
  WifiOff, ArrowRight, ShieldCheck, Flame, Radio, Biohazard, Navigation
} from 'lucide-react';
import { SystemStatus, WaterIQ, FoodIQ, InventoryAlerts } from '../types';

interface CommandCenterProps {
  status: SystemStatus | null;
  waterIQ: WaterIQ | null;
  foodIQ: FoodIQ | null;
  inventoryAlerts: InventoryAlerts | null;
  onNavigate: (tab: string) => void;
  onAskAI: (prompt: string, scenario: string) => void;
  isOfflineMode: boolean;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  status,
  waterIQ,
  foodIQ,
  inventoryAlerts,
  onNavigate,
  onAskAI,
  isOfflineMode
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('power_outage');

  const scenarios = [
    { key: 'power_outage', label: 'POWER OUTAGE', icon: Zap, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { key: 'water_shortage', label: 'WATER SHORTAGE', icon: Droplets, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { key: 'food_shortage', label: 'FOOD SHORTAGE', icon: Utensils, color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
    { key: 'flood', label: 'FLOOD', icon: Activity, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { key: 'earthquake', label: 'EARTHQUAKE', icon: AlertTriangle, color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
    { key: 'pandemic', label: 'OUTBREAK', icon: Biohazard, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { key: 'evacuation', label: 'EVACUATE', icon: Navigation, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
    { key: 'zombie_simulation', label: 'ZOMBIE SIM', icon: Flame, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  ];

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) {
      onAskAI("What should I do right now for maximum survival?", selectedScenario);
    } else {
      onAskAI(quickPrompt, selectedScenario);
    }
  };

  const waterDays = waterIQ?.days_remaining || 0;
  const foodDays = foodIQ?.days_remaining || 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Status */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-950/60 border border-rose-600/40 rounded-lg text-rose-500 glow-red">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-wide text-white uppercase font-heading">
                  APOCALYPSE AI
                </h1>
                <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full border ${
                  isOfflineMode 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isOfflineMode ? '● FULL OFFLINE MODE' : '● ONLINE / CONNECTED'}
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5 font-sans">
                Offline Survival Intelligence & Personal Emergency Navigation System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('prepare')}
              className="flex-1 md:flex-initial px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30"
            >
              <ShieldCheck className="w-4 h-4" />
              PREPARE FOR OFFLINE
            </button>
            <button
              onClick={() => onNavigate('readiness')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              SCORE: {status?.overall_readiness_score || 0}%
            </button>
          </div>
        </div>
      </div>

      {inventoryAlerts && inventoryAlerts.alerts.length > 0 && (
        <button
          onClick={() => onNavigate('inventory')}
          className="w-full text-left bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 hover:border-rose-400/60 transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-300 font-mono text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              INVENTORY ATTENTION REQUIRED
            </div>
            <ArrowRight className="w-4 h-4 text-rose-300" />
          </div>
          <p className="text-sm text-slate-200 mt-2">
            {inventoryAlerts.expired_count > 0 && `${inventoryAlerts.expired_count} expired`}
            {inventoryAlerts.expired_count > 0 && inventoryAlerts.expiring_soon_count > 0 && ', '}
            {inventoryAlerts.expiring_soon_count > 0 && `${inventoryAlerts.expiring_soon_count} expiring soon`}
            {(inventoryAlerts.expired_count > 0 || inventoryAlerts.expiring_soon_count > 0) && inventoryAlerts.shortage_count > 0 && ', '}
            {inventoryAlerts.shortage_count > 0 && `${inventoryAlerts.shortage_count} essential shortages`}
          </p>
          <p className="text-xs text-slate-400 mt-1">Review supplies and restock the highest-priority gaps.</p>
        </button>
      )}

      {/* Preparedness Quick Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('water')}
          className="bg-[#121824] border border-cyan-900/30 hover:border-cyan-500/50 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">WATER IQ</span>
            <Droplets className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{waterIQ?.total_water_liters || 0} L</div>
          <div className="text-xs text-slate-400 mt-1 flex justify-between">
            <span>Supply Duration:</span>
            <span className="font-semibold text-cyan-300">{waterDays} Days</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-cyan-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (waterDays / 14) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('food')}
          className="bg-[#121824] border border-orange-900/30 hover:border-orange-500/50 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-orange-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">FOOD IQ</span>
            <Utensils className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{foodDays} Days</div>
          <div className="text-xs text-slate-400 mt-1 flex justify-between">
            <span>Calorie Pool:</span>
            <span className="font-semibold text-orange-300">{(foodIQ?.total_calories || 0).toLocaleString()} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-orange-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, (foodDays / 14) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-[#121824] border border-amber-900/30 hover:border-amber-500/50 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">POWER & TOOLS</span>
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{status?.inventory_items_count || 0} Items</div>
          <div className="text-xs text-slate-400 mt-1 flex justify-between">
            <span>Shelter Reserves:</span>
            <span className="font-semibold text-amber-300">Stored</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('map')}
          className="bg-[#121824] border border-emerald-900/30 hover:border-emerald-500/50 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">SURVIVAL MAP</span>
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{status?.map_markers_count || 0} Markers</div>
          <div className="text-xs text-slate-400 mt-1 flex justify-between">
            <span>Local Region:</span>
            <span className="font-semibold text-emerald-300">Cached</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>

      {/* Scenario selector */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          WHAT IS HAPPENING RIGHT NOW?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedScenario === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => setSelectedScenario(sc.key)}
                className={`p-3 rounded-lg border transition-all text-left flex items-center gap-3 ${
                  isSelected 
                    ? `${sc.color} ring-2 ring-rose-500/50 font-bold scale-[1.02]` 
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-xs font-mono tracking-wider">{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <button
          onClick={() => onNavigate('map')}
          className="p-4 bg-[#121824] border border-slate-800 hover:border-rose-500/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 group"
        >
          <MapPin className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">MY MAP</span>
        </button>

        <button
          onClick={() => onNavigate('water')}
          className="p-4 bg-[#121824] border border-slate-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 group"
        >
          <Droplets className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">WATER IQ</span>
        </button>

        <button
          onClick={() => onNavigate('inventory')}
          className="p-4 bg-[#121824] border border-slate-800 hover:border-amber-500/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 group"
        >
          <Home className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">INVENTORY</span>
        </button>

        <button
          onClick={() => onNavigate('tasks')}
          className="p-4 bg-[#121824] border border-slate-800 hover:border-emerald-500/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 group"
        >
          <CheckSquare className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">TASKS</span>
        </button>

        <button
          onClick={() => onNavigate('handbook')}
          className="p-4 bg-[#121824] border border-slate-800 hover:border-purple-500/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 group"
        >
          <BookOpen className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">HANDBOOK</span>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className="p-4 bg-[#121824] border border-slate-800 hover:border-blue-500/50 rounded-xl flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-105 group"
        >
          <Radio className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-slate-200">EMERGENCY</span>
        </button>
      </div>

      {/* AI Prompt Box */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            AI COMMAND CENTER
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {status?.active_model || 'Local Model Ready'}
          </span>
        </div>

        <form onSubmit={handleSubmitPrompt} className="flex gap-2">
          <input
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Tell me what is happening right now... (e.g. Water supply cut off, what should I do?)"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-all font-sans"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-all shrink-0 shadow-lg shadow-rose-950/50"
          >
            <span>ASK AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
