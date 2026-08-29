import React from 'react';
import { Utensils, AlertTriangle, CheckCircle, Package, Flame } from 'lucide-react';
import { FoodIQ as FoodIQType } from '../types';

interface FoodIQProps {
  foodIQ: FoodIQType | null;
}

export const FoodIQ: React.FC<FoodIQProps> = ({ foodIQ }) => {
  if (!foodIQ) return <div className="p-8 text-center text-slate-400 font-mono">Calculating Food IQ...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-[#121824] border border-orange-900/40 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-orange-950/60 border border-orange-500/40 rounded-xl text-orange-400">
              <Utensils className="w-10 h-10 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-heading text-white">FOOD IQ NUTRITION ENGINE</h2>
                <span className="px-2.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/30 font-mono text-xs font-bold rounded-full">
                  CALORIE POOL
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">
                Ration Duration, Caloric Density & Perishable Food Rotation Protocol
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl text-right min-w-[200px]">
            <div className="text-xs font-mono text-slate-400">FOOD SUPPLY DURATION</div>
            <div className="text-3xl font-bold font-mono text-orange-400">{foodIQ.days_remaining} DAYS</div>
            <div className="text-xs text-slate-400 mt-0.5">{foodIQ.total_calories.toLocaleString()} Total kcal</div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calorie Requirements */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            DAILY HOUSEHOLD REQUIREMENT
          </h3>
          <div className="text-2xl font-bold text-white font-mono">{foodIQ.daily_calories_needed.toLocaleString()} kcal / day</div>
          <p className="text-xs text-slate-400">
            Calculated for {foodIQ.household_size} family members (2,000 kcal/adult, 1,500 kcal/child).
          </p>
        </div>

        {/* Action Recommendations */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono uppercase text-orange-400 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            STORAGE & PERISHABLE ADVISORY
          </h3>
          <div className="space-y-1.5">
            {foodIQ.recommendations.map((rec, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Items Breakdown */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-mono uppercase text-slate-200 font-bold flex items-center gap-2">
          <Package className="w-4 h-4 text-orange-400" />
          STORED FOOD ITEMS BREAKDOWN
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {foodIQ.items_breakdown.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm text-white">{item.name}</div>
                <div className="text-xs text-slate-400">{item.quantity} {item.unit}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-orange-400">{item.estimated_calories.toLocaleString()} kcal</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
