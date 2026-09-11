import React, { useState } from 'react';
import { 
  Scale, AlertTriangle, ArrowRightLeft, ShieldAlert, Sparkles, 
  Thermometer, Sun, Wind, Droplets, CheckCircle, RefreshCw, Info, HelpCircle
} from 'lucide-react';

interface TradeItem {
  id: string;
  name: string;
  category: 'WATER' | 'FOOD' | 'MEDICAL' | 'POWER' | 'TOOLS' | 'DEFENSE';
  unit: string;
  trade_value: number; // Value points per unit
  scarcity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EXTREME';
}

const TRADE_CATALOG: TradeItem[] = [
  { id: 'water', name: 'Potable Drinking Water', category: 'WATER', unit: 'Liter', trade_value: 100, scarcity: 'RARE' },
  { id: 'canned_food', name: 'Canned Beans / Meat', category: 'FOOD', unit: 'Can', trade_value: 45, scarcity: 'UNCOMMON' },
  { id: 'rice_grain', name: 'Dry Rice / Lentils', category: 'FOOD', unit: 'kg', trade_value: 70, scarcity: 'COMMON' },
  { id: 'first_aid', name: 'Trauma First Aid Kit', category: 'MEDICAL', unit: 'Kit', trade_value: 200, scarcity: 'RARE' },
  { id: 'antibiotics', name: 'Broad-Spectrum Antibiotics', category: 'MEDICAL', unit: 'Pack', trade_value: 250, scarcity: 'EXTREME' },
  { id: 'aa_battery', name: 'Heavy Duty AA Battery', category: 'POWER', unit: 'Pair', trade_value: 25, scarcity: 'COMMON' },
  { id: 'power_bank', name: '30,000mAh Power Bank', category: 'POWER', unit: 'Piece', trade_value: 180, scarcity: 'RARE' },
  { id: 'solar_panel', name: 'Portable 20W Solar Panel', category: 'POWER', unit: 'Piece', trade_value: 350, scarcity: 'EXTREME' },
  { id: 'multi_tool', name: 'Tactical Multi-tool Knife', category: 'TOOLS', unit: 'Piece', trade_value: 220, scarcity: 'RARE' },
  { id: 'bleach', name: 'Unscented Bleach (5%)', category: 'WATER', unit: 'Liter', trade_value: 120, scarcity: 'RARE' },
];

export const WastelandExchange: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'barter' | 'fallout' | 'exposure'>('barter');

  // Trade State
  const [offeredItems, setOfferedItems] = useState<Array<{ item: TradeItem; qty: number }>>([
    { item: TRADE_CATALOG[1], qty: 3 } // 3 Canned Foods = 135 pts
  ]);
  const [receivedItems, setReceivedItems] = useState<Array<{ item: TradeItem; qty: number }>>([
    { item: TRADE_CATALOG[0], qty: 1 } // 1 L Water = 100 pts
  ]);

  // Fallout Radiation State
  const [initialRadiation, setInitialRadiation] = useState<number>(100); // R/hr at hour 1
  const [hoursPostDetonation, setHoursPostDetonation] = useState<number>(7);

  // Exposure / Weather State
  const [airTempC, setAirTempC] = useState<number>(38);
  const [relativeHumidity, setRelativeHumidity] = useState<number>(65);
  const [windSpeedKmH, setWindSpeedKmH] = useState<number>(15);

  // Calculate Trade Values
  const totalOfferedValue = offeredItems.reduce((acc, curr) => acc + (curr.item.trade_value * curr.qty), 0);
  const totalReceivedValue = receivedItems.reduce((acc, curr) => acc + (curr.item.trade_value * curr.qty), 0);

  const tradeRatio = totalOfferedValue > 0 ? (totalReceivedValue / totalOfferedValue) : 1;

  let dealAssessment = 'BALANCED FAIR DEAL';
  let dealBadgeColor = 'bg-emerald-950 border-emerald-700 text-emerald-400';

  if (tradeRatio > 1.25) {
    dealAssessment = 'GREAT BARGAIN FOR YOU (+25% VALUE)';
    dealBadgeColor = 'bg-cyan-950 border-cyan-700 text-cyan-400';
  } else if (tradeRatio < 0.75) {
    dealAssessment = 'EXPLOITATIVE OFFER (YOU ARE LOSING VALUE)';
    dealBadgeColor = 'bg-rose-950 border-rose-700 text-rose-400';
  }

  // Calculate Fallout Decay: R_t = R_1 * (t ^ -1.2)
  const currentRadiation = initialRadiation * Math.pow(hoursPostDetonation, -1.2);
  const percentDecayed = ((initialRadiation - currentRadiation) / initialRadiation) * 100;

  // Calculate Wet Bulb Temperature (Stull's formula approximation)
  const T = airTempC;
  const RH = relativeHumidity;
  const wetBulbC = T * Math.atan(0.151977 * Math.pow(RH + 8.313659, 0.5)) +
    Math.atan(T + RH) - Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) - 4.686035;

  let heatDanger = 'SAFE / NORMAL';
  if (wetBulbC >= 35) {
    heatDanger = 'FATAL EXPOSURE THRESHOLD (WET-BULB 35°C+)';
  } else if (wetBulbC >= 31) {
    heatDanger = 'CRITICAL HYPERTHERMIA RISK';
  } else if (wetBulbC >= 28) {
    heatDanger = 'CAUTION: HEAVY HEAT STRESS';
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-950/80 border border-amber-700/60 rounded-xl text-amber-400">
              <Scale className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-amber-950/80 border border-amber-700/60 text-amber-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                WASTELAND ECONOMY & HAZARD CALCULATOR
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Barter Trade & Fallout Physics Engine
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Evaluate post-collapse trade fairness rates without currency and compute nuclear fallout radiation decay schedules using the 7-10 rule.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-800 pb-3 md:pb-0">
            <button
              onClick={() => setActiveSubTab('barter')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeSubTab === 'barter' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              BARTER MATRIX
            </button>
            <button
              onClick={() => setActiveSubTab('fallout')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeSubTab === 'fallout' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              FALLOUT DECAY
            </button>
            <button
              onClick={() => setActiveSubTab('exposure')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeSubTab === 'exposure' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              WET-BULB TEMP
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: WASTELAND BARTER MATRIX */}
      {activeSubTab === 'barter' && (
        <div className="space-y-6">
          {/* Deal Evaluation Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${dealBadgeColor}`}>
            <div className="flex items-center gap-3">
              <ArrowRightLeft className="w-6 h-6" />
              <div>
                <div className="text-[10px] font-mono uppercase font-bold">TRADE DEAL ASSESSMENT</div>
                <div className="text-base font-bold font-mono">{dealAssessment}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs">
              <div>OFFERED: <span className="font-bold text-white">{totalOfferedValue} PTS</span></div>
              <div>RECEIVED: <span className="font-bold text-white">{totalReceivedValue} PTS</span></div>
              <div>RATIO: <span className="font-bold text-white">{(tradeRatio * 100).toFixed(0)}%</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items Offered Panel */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                  ITEMS YOU ARE OFFERING ({totalOfferedValue} PTS)
                </span>
              </div>

              <div className="space-y-3">
                {offeredItems.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{entry.item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {entry.item.trade_value} PTS / {entry.item.unit}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={entry.qty}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const copy = [...offeredItems];
                          copy[idx].qty = val;
                          setOfferedItems(copy);
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white text-center font-mono"
                      />
                      <button
                        onClick={() => setOfferedItems(offeredItems.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Item Selector */}
                <select
                  onChange={(e) => {
                    const found = TRADE_CATALOG.find(i => i.id === e.target.value);
                    if (found) setOfferedItems([...offeredItems, { item: found, qty: 1 }]);
                  }}
                  className="w-full bg-slate-950 border border-dashed border-slate-700 rounded-xl p-2.5 text-xs text-slate-400 font-mono focus:outline-none"
                >
                  <option value="">+ Add Item To Offer List...</option>
                  {TRADE_CATALOG.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.trade_value} Pts/{item.unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Received Panel */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  ITEMS YOU ARE RECEIVING ({totalReceivedValue} PTS)
                </span>
              </div>

              <div className="space-y-3">
                {receivedItems.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-slate-200">{entry.item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {entry.item.trade_value} PTS / {entry.item.unit}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={entry.qty}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          const copy = [...receivedItems];
                          copy[idx].qty = val;
                          setReceivedItems(copy);
                        }}
                        className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white text-center font-mono"
                      />
                      <button
                        onClick={() => setReceivedItems(receivedItems.filter((_, i) => i !== idx))}
                        className="text-slate-500 hover:text-rose-400 text-xs px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Item Selector */}
                <select
                  onChange={(e) => {
                    const found = TRADE_CATALOG.find(i => i.id === e.target.value);
                    if (found) setReceivedItems([...receivedItems, { item: found, qty: 1 }]);
                  }}
                  className="w-full bg-slate-950 border border-dashed border-slate-700 rounded-xl p-2.5 text-xs text-slate-400 font-mono focus:outline-none"
                >
                  <option value="">+ Add Item To Receive List...</option>
                  {TRADE_CATALOG.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.trade_value} Pts/{item.unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FALLOUT RADIATION 7-10 DECAY CALCULATOR */}
      {activeSubTab === 'fallout' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4" />
            Nuclear Fallout 7-10 Decay Physics Rule ($R_t = R_1 \cdot t^{-1.2}$)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Initial Radiation Reading at Hour 1 (R/hr):
                </label>
                <input
                  type="number"
                  value={initialRadiation}
                  onChange={(e) => setInitialRadiation(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Hours Elapsed Post-Detonation: {hoursPostDetonation} Hours
                </label>
                <input
                  type="range"
                  min={1}
                  max={168} // 7 days
                  value={hoursPostDetonation}
                  onChange={(e) => setHoursPostDetonation(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <div className="text-[10px] text-slate-500 font-mono flex justify-between mt-1">
                  <span>1 Hour</span>
                  <span>7 Hours (90% Drop)</span>
                  <span>49 Hours (99% Drop)</span>
                  <span>7 Days</span>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="text-xs font-mono text-slate-400 uppercase">PROJECTED RADIATION LEVEL:</div>
              <div className="text-3xl font-extrabold font-mono text-rose-400">
                {currentRadiation.toFixed(2)} R/hr
              </div>
              <div className="text-xs font-mono text-emerald-400">
                Total Decay: {percentDecayed.toFixed(1)}% Reduction achieved
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-1 text-xs font-mono text-slate-300">
                <div className="font-bold text-amber-400 uppercase">Tactical Shelter Emergence Rule:</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Remain inside blast shelter for a minimum of 49 hours. Radiation drops by 90% at 7 hours, and 99% at 49 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: WET-BULB TEMPERATURE EXPOSURE */}
      {activeSubTab === 'exposure' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase border-b border-slate-800 pb-3">
            <Thermometer className="w-4 h-4" />
            Wet-Bulb Temperature & Thermal Exposure Index
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Ambient Air Temperature (°C): {airTempC}°C
                </label>
                <input
                  type="range"
                  min={10}
                  max={55}
                  value={airTempC}
                  onChange={(e) => setAirTempC(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Relative Humidity (%): {relativeHumidity}%
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={relativeHumidity}
                  onChange={(e) => setRelativeHumidity(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            {/* Exposure Assessment Result */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="text-xs font-mono text-slate-400 uppercase">CALCULATED WET-BULB TEMP:</div>
              <div className="text-3xl font-extrabold font-mono text-cyan-400">
                {wetBulbC.toFixed(1)}°C
              </div>
              <div className={`text-xs font-mono font-bold px-3 py-1 rounded-full border inline-block ${
                wetBulbC >= 31 ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {heatDanger}
              </div>

              <p className="text-[11px] text-slate-400 font-mono leading-relaxed pt-2 border-t border-slate-800">
                At wet-bulb temperatures above 35°C, human body sweat evaporation stops working, making outdoors fatal within 6 hours without active cooling shelter.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
