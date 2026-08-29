import React from 'react';
import { Droplets, CloudRain, Sun, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { WaterIQ as WaterIQType } from '../types';

interface WaterIQProps {
  waterIQ: WaterIQType | null;
}

export const WaterIQ: React.FC<WaterIQProps> = ({ waterIQ }) => {
  if (!waterIQ) return <div className="p-8 text-center text-slate-400 font-mono">Calculating Water IQ...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Overview */}
      <div className="bg-[#121824] border border-cyan-900/40 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-cyan-400 glow-cyan">
              <Droplets className="w-10 h-10 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-heading text-white">WATER IQ INTELLIGENCE</h2>
                <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold rounded-full">
                  POTABLE & HYGIENE
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">
                Household Water Consumption, Rationing, Rainwater & Dew Harvest Planner
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-right min-w-[200px]">
            <div className="text-xs font-mono text-slate-400">SUPPLY DURATION</div>
            <div className="text-3xl font-bold font-mono text-cyan-400">{waterIQ.days_remaining} DAYS</div>
            <div className="text-xs text-slate-400 mt-0.5">{waterIQ.total_water_liters} Liters Stored</div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">HOUSEHOLD SIZE</span>
            <span className="text-sm font-bold text-white font-mono">{waterIQ.household_size} People</span>
          </div>
          <div className="text-xl font-bold text-white font-mono">{waterIQ.daily_consumption_liters} L / Day</div>
          <p className="text-xs text-slate-400 mt-2">
            Based on 3.5L per adult daily requirement for drinking & basic sanitation.
          </p>
        </div>

        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">DEW COLLECTION</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-semibold text-cyan-300 font-mono">{waterIQ.dew_collection_estimate}</div>
          <p className="text-xs text-slate-400 mt-2">
            Supplementary atmospheric collection tarp yield in morning humidity.
          </p>
        </div>

        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">RAINWATER CATCHMENT</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-sm font-semibold text-blue-300 font-mono">{waterIQ.rainwater_collection_estimate}</div>
          <p className="text-xs text-slate-400 mt-2">
            Theoretical volume yield based on 100m² clean roof catchment.
          </p>
        </div>
      </div>

      {/* Recommendations & Purification Protocols */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-mono uppercase text-cyan-400 font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          ACTIVE WATER RATIONING & SAFETY ADVISORY
        </h3>
        <div className="space-y-2">
          {waterIQ.recommendations.map((rec, i) => (
            <div key={i} className="p-3 bg-cyan-950/20 border border-cyan-900/40 rounded-lg text-slate-200 text-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
