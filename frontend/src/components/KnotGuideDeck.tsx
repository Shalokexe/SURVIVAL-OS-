import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Layers, Activity, HelpCircle, 
  ChevronRight, CheckCircle, AlertTriangle, Compass, RefreshCw, Zap
} from 'lucide-react';

interface KnotEntry {
  id: string;
  name: string;
  category: 'LOOP' | 'HITCH' | 'LASHING' | 'BEND';
  strength_retention: number; // % strength retained
  difficulty: 'EASY' | 'MEDIUM' | 'ADVANCED';
  primary_use: string;
  steps: string[];
  tips: string;
  warning?: string;
}

const KNOT_DATABASE: KnotEntry[] = [
  {
    id: 'bowline',
    name: 'Bowline Knot (King of Knots)',
    category: 'LOOP',
    strength_retention: 75,
    difficulty: 'EASY',
    primary_use: 'Fixed end-of-line loop for heavy rescue hauling or securing main guyline anchors under heavy tension.',
    steps: [
      'Form a small loop (the "rabbit hole") near the end of the rope.',
      'Pass the working end (the "rabbit") up through the hole from below.',
      'Wrap the working end around the standing line (behind the "tree").',
      'Pass the working end back down into the rabbit hole.',
      'Pull the standing line and loop firmly to lock knot.'
    ],
    tips: 'Will not slip or jam under extreme tension, yet easily unties after heavy load release.',
    warning: 'Can shake loose if used on stiff synthetic slick cordage without a stopper safety knot.'
  },
  {
    id: 'taut_line',
    name: 'Taut-Line Hitch',
    category: 'HITCH',
    strength_retention: 65,
    difficulty: 'EASY',
    primary_use: 'Adjustable friction hitch for tarp guylines, tent stakes, and securing vehicle loads.',
    steps: [
      'Wrap the working end around the stake and back along the standing line.',
      'Make two full turns inside the loop toward the anchor point.',
      'Pass the working end outside the loop and make one turn above the first two.',
      'Pass through the final loop to form a hitch and slide tight.'
    ],
    tips: 'Slide the hitch up or down to tighten or loosen tarp tension instantly.',
    warning: 'May slip under extreme ice conditions or when used on ultra-slick Dyneema lines.'
  },
  {
    id: 'truckers_hitch',
    name: 'Trucker\'s Hitch (3:1 Mechanical Pulley)',
    category: 'HITCH',
    strength_retention: 70,
    difficulty: 'MEDIUM',
    primary_use: 'High-tension ridgepole rigging and securing heavy cargo with 3:1 mechanical advantage.',
    steps: [
      'Tie a directional slip loop in the standing line 2-3 feet above the anchor point.',
      'Pass the working end around the anchor stake or tree trunk.',
      'Feed the working end back through the directional slip loop.',
      'Pull working end to apply 3:1 pulley tension, then lock with two half-hitches.'
    ],
    tips: 'Creates massive tension across long tarp ridgepoles without requiring winch hardware.',
    warning: 'High friction against the rope loop can cause heat wear if pulled too rapidly.'
  },
  {
    id: 'square_lashing',
    name: 'Square Lashing',
    category: 'LASHING',
    strength_retention: 80,
    difficulty: 'MEDIUM',
    primary_use: 'Joining two timber poles at 90° angles for shelter framing, watchtowers, or elevated beds.',
    steps: [
      'Start with a Clove Hitch on the vertical timber pole.',
      'Wrap cordage alternately around both poles 3-4 times in a square pattern.',
      'Execute 2-3 tight "frapping" turns between the poles to pull wraps rock solid.',
      'Finish with a Clove Hitch on the horizontal pole.'
    ],
    tips: 'Frapping turns between the timbers are critical for rigid non-wobbly joints.',
    warning: 'Do not use slick thin string; use 550 Paracord or 6mm jute cordage.'
  },
  {
    id: 'sheet_bend',
    name: 'Sheet Bend (Becket Bend)',
    category: 'BEND',
    strength_retention: 70,
    difficulty: 'EASY',
    primary_use: 'Tying two ropes of unequal diameter or different material compositions together.',
    steps: [
      'Form a bight (simple U-bend) in the thicker rope.',
      'Pass the thinner working rope up through the bight from behind.',
      'Wrap the thinner rope around both legs of the thick bight.',
      'Tuck the thinner rope under its own standing line (do not pass back in bight).'
    ],
    tips: 'Superior to square/reef knots for combining different ropes under tension.',
    warning: 'If ropes differ drastically in size, use a Double Sheet Bend for added friction.'
  }
];

const ROPE_MATERIALS = [
  { id: 'paracord', name: '550 Type III Paracord (7-Strand)', base_break_kg: 250, desc: 'Standard military utility cordage' },
  { id: 'nylon_10mm', name: '10mm Static Nylon Rope', base_break_kg: 2200, desc: 'Heavy rescue & shelter load line' },
  { id: 'dyneema_4mm', name: '4mm Dyneema / UHMWPE', base_break_kg: 1400, desc: 'Ultra-light high-tensile slick cordage' },
  { id: 'jute_6mm', name: '6mm Jute Natural Fiber Cord', base_break_kg: 90, desc: 'Biodegradable natural fiber cord' },
];

export const KnotGuideDeck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'calculator' | 'shelter_rigging'>('library');
  const [selectedKnot, setSelectedKnot] = useState<KnotEntry>(KNOT_DATABASE[0]);

  // Calculator State
  const [selectedRope, setSelectedRope] = useState(ROPE_MATERIALS[0]);
  const [calcKnot, setCalcKnot] = useState<KnotEntry>(KNOT_DATABASE[0]);
  const [appliedLoadKg, setAppliedLoadKg] = useState<number>(75); // kg load

  // Calculated load metrics
  const effectiveBreakKg = (selectedRope.base_break_kg * (calcKnot.strength_retention / 100));
  const safeWorkingLoadKg = effectiveBreakKg / 5; // Standard 5:1 safety factor
  const isOverloaded = appliedLoadKg > safeWorkingLoadKg;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950/80 border border-indigo-700/60 rounded-xl text-indigo-400">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-indigo-950/80 border border-indigo-700/60 text-indigo-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                TACTICAL RIGGING & CORDAGE ENGINE v1.0
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Tactical Knot & Shelter Rigging Studio
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Master essential survival knots, calculate safe working load limits (SWL) for Paracord 550 and heavy cordage, and inspect tarp shelter rigging templates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b md:border-b-0 border-slate-800 pb-3 md:pb-0">
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'library' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              KNOT LIBRARY
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'calculator' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              LOAD CALCULATOR
            </button>
            <button
              onClick={() => setActiveTab('shelter_rigging')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
                activeTab === 'shelter_rigging' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              TARP RIGGING
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: KNOT LIBRARY & STEP VIEWER */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Knot List Selector (Col 1) */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase font-bold px-1">SELECT SURVIVAL KNOT:</div>
            {KNOT_DATABASE.map(knot => (
              <div
                key={knot.id}
                onClick={() => setSelectedKnot(knot)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                  selectedKnot.id === knot.id
                    ? 'bg-indigo-950/80 border-indigo-600 text-white ring-1 ring-indigo-500 shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                  <span>{knot.name}</span>
                  <span className="text-indigo-400">{knot.strength_retention}% RETENTION</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{knot.primary_use}</div>
              </div>
            ))}
          </div>

          {/* Knot Detail Card & Step-by-Step (Col 2 & 3) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">CATEGORY: {selectedKnot.category}</span>
                  <h2 className="text-xl font-heading font-bold text-white">{selectedKnot.name}</h2>
                </div>

                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-950 border border-indigo-700 text-indigo-400 rounded-full text-xs font-mono font-bold">
                    {selectedKnot.strength_retention}% ROPE EFFICIENCY
                  </span>
                  <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-full text-xs font-mono">
                    DIFFICULTY: {selectedKnot.difficulty}
                  </span>
                </div>
              </div>

              {/* Primary Use Box */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-1">
                <div className="text-xs font-mono text-slate-400 uppercase font-bold">Primary Tactical Application:</div>
                <p className="text-xs font-mono text-slate-200 leading-relaxed">{selectedKnot.primary_use}</p>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-300 uppercase font-bold">Step-by-Step Tying Sequence:</div>
                <div className="space-y-2">
                  {selectedKnot.steps.map((stepText, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs font-mono">
                      <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-slate-300 pt-0.5 leading-relaxed">{stepText}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tactical Tips & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-300 text-xs font-mono space-y-1">
                  <div className="font-bold uppercase flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Pro Rigging Tip:
                  </div>
                  <p className="text-[11px] leading-relaxed">{selectedKnot.tips}</p>
                </div>

                {selectedKnot.warning && (
                  <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl text-amber-300 text-xs font-mono space-y-1">
                    <div className="font-bold uppercase flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Caution Warning:
                    </div>
                    <p className="text-[11px] leading-relaxed">{selectedKnot.warning}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ROPE & PARACORD LOAD CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4" />
            Cordage Tensile Breaking Strength & Safe Working Load (SWL) Calculator
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Select Rope Material / Diameter:</label>
                <select
                  value={selectedRope.id}
                  onChange={(e) => setSelectedRope(ROPE_MATERIALS.find(r => r.id === e.target.value) || ROPE_MATERIALS[0])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
                >
                  {ROPE_MATERIALS.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Base Rating: {r.base_break_kg} kg / {(r.base_break_kg * 2.2).toFixed(0)} lbs)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Select Knot Tied on Line:</label>
                <select
                  value={calcKnot.id}
                  onChange={(e) => setCalcKnot(KNOT_DATABASE.find(k => k.id === e.target.value) || KNOT_DATABASE[0])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white font-mono focus:outline-none"
                >
                  {KNOT_DATABASE.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.name} ({k.strength_retention}% Strength Retained)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Expected Load Weight (kg): {appliedLoadKg} kg</label>
                <input
                  type="range"
                  min={5}
                  max={500}
                  value={appliedLoadKg}
                  onChange={(e) => setAppliedLoadKg(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Load Output Metrics Panel */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
              <div className="text-xs font-mono text-slate-400 uppercase">CALCULATED SAFE WORKING LOAD (SWL 5:1 SAFETY FACTOR):</div>
              <div className={`text-3xl font-extrabold font-mono ${isOverloaded ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`}>
                {safeWorkingLoadKg.toFixed(1)} kg / {(safeWorkingLoadKg * 2.2).toFixed(0)} lbs
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Base Un-knotted Breaking Strength:</span>
                  <span className="font-bold text-white">{selectedRope.base_break_kg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Knot Strength Degradation Loss:</span>
                  <span className="font-bold text-amber-400">-{100 - calcKnot.strength_retention}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Knotted Break Limit:</span>
                  <span className="font-bold text-cyan-400">{effectiveBreakKg.toFixed(1)} kg</span>
                </div>
              </div>

              {/* Overload Alert */}
              {isOverloaded ? (
                <div className="p-3 bg-rose-950 border border-rose-800 rounded-xl text-rose-300 text-xs font-mono space-y-1">
                  <div className="font-bold uppercase flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    OVERLOAD DANGER:
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Applied load ({appliedLoadKg} kg) exceeds recommended 5:1 safety margin ({safeWorkingLoadKg.toFixed(0)} kg). Risk of snap line injury!
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-mono">
                  ✓ LOAD IS WITHIN SAFE 5:1 WORKING MARGIN.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SHELTER TARP RIGGING PRESETS */}
      {activeTab === 'shelter_rigging' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase border-b border-slate-800 pb-3">
            <Compass className="w-4 h-4" />
            Tactical Shelter Tarp Rigging Presets
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'A-Frame Storm Shelter', knots: 'Trucker\'s Hitch (Ridgepole), Taut-Line (Guylines)', wind_rating: 'HIGH (35+ MPH)', description: 'Classic 2-person weather shelter with steep runoff angles for heavy rain.' },
              { title: 'Lean-To Windbreak', knots: 'Bowline (Anchor Trees), Taut-Line (Front Pegs)', wind_rating: 'MODERATE', description: 'Open-front reflector shelter for wood fire heat retention at night.' },
              { title: 'Plow Point Emergency Bivouac', knots: 'Bowline (High Branch), Taut-Line (Corner Stakes)', wind_rating: 'HIGH WINGED', description: 'Single-point fast tarp pitch in under 3 minutes for sudden thunderstorms.' },
            ].map((shelter, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="text-base font-bold text-white font-heading">{shelter.title}</h3>
                <div className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-emerald-400 p-2 rounded-lg">
                  RECOMMENDED KNOTS: {shelter.knots}
                </div>
                <div className="text-xs font-mono text-amber-400">WIND RATING: {shelter.wind_rating}</div>
                <p className="text-slate-400 text-xs font-mono leading-relaxed">{shelter.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
