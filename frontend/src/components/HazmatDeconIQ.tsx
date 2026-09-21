import React, { useState } from 'react';
import { 
  Biohazard, ShieldAlert, AlertTriangle, CheckCircle, Clock, 
  Droplets, Flame, Wind, Layers, ArrowRight, ShieldCheck, RefreshCw, FileText 
} from 'lucide-react';

interface DeconStage {
  stageNumber: number;
  title: string;
  zoneType: 'DIRTY_ZONE' | 'WASH_ZONE' | 'CLEAN_TRANSITION' | 'SAFE_SHELTER';
  instructions: string[];
  warnings: string;
}

export const HazmatDeconIQ: React.FC = () => {
  const [threatType, setThreatType] = useState<'RADIATION' | 'CHEMICAL' | 'BIOLOGICAL'>('RADIATION');
  const [roomLengthM, setRoomLengthM] = useState<number>(4);
  const [roomWidthM, setRoomWidthM] = useState<number>(5);
  const [roomHeightM, setRoomHeightM] = useState<number>(2.5);
  const [windowCount, setWindowCount] = useState<number>(2);
  const [doorCount, setDoorCount] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Plastic Sheeting Sealing Calculation
  const wallArea = 2 * (roomLengthM * roomHeightM + roomWidthM * roomHeightM);
  const ceilingArea = roomLengthM * roomWidthM;
  const totalPlasticAreaSqM = Math.round(wallArea + ceilingArea);

  // Duct Tape needed: Perimeters of windows (assume 1.5m x 1.2m) & doors (2m x 0.9m) x 2 layers
  const windowPerimeter = windowCount * (2 * (1.5 + 1.2));
  const doorPerimeter = doorCount * (2 * (2.0 + 0.9));
  const totalTapeMeters = Math.round((windowPerimeter + doorPerimeter + 20) * 1.5);
  const tapeRollsNeeded = Math.ceil(totalTapeMeters / 50); // 50m standard duct tape roll

  const DECON_PROTOCOLS: Record<typeof threatType, DeconStage[]> = {
    RADIATION: [
      {
        stageNumber: 1,
        title: 'Zone 1: Dirty Entry & Clothing Stripping',
        zoneType: 'DIRTY_ZONE',
        instructions: [
          'Remove outer jacket, shoes, and clothing BEFORE entering the main living space.',
          'Carefully peel clothes inside-out to prevent airborne radioactive dust dispersal.',
          'Double-bag contaminated clothing in heavy-duty plastic garbage bags and tie securely outside.'
        ],
        warnings: 'Removing outer clothing removes up to 90% of radioactive fallout particles.'
      },
      {
        stageNumber: 2,
        title: 'Zone 2: Decontamination Wash & Rinse',
        zoneType: 'WASH_ZONE',
        instructions: [
          'Wash hair and body thoroughly with warm water and mild soap.',
          'Do NOT scrub skin aggressively to avoid breaking the skin barrier.',
          'Do NOT use hair conditioner — it binds radioactive particles to hair proteins.'
        ],
        warnings: 'Gently flush eyes, ears, and nostrils with clean water or saline.'
      },
      {
        stageNumber: 3,
        title: 'Zone 3: Clean Attire & Medical Inspection',
        zoneType: 'CLEAN_TRANSITION',
        instructions: [
          'Don clean, uncontaminated clothing from sealed storage.',
          'Inspect body for open wounds or skin tears and apply sterile dressings.'
        ],
        warnings: 'Ensure no exposed cuts contact fallout dust.'
      },
      {
        stageNumber: 4,
        title: 'Zone 4: Sealed Safe Shelter Entry',
        zoneType: 'SAFE_SHELTER',
        instructions: [
          'Enter inner sealed shelter room.',
          'Consume stored sealed bottled water and canned food only.',
          'Monitor emergency radio for fallout decay updates (7-10 Rule).'
        ],
        warnings: 'Stay sheltered for a minimum of 24 to 48 hours until radiation decays.'
      }
    ],
    CHEMICAL: [
      {
        stageNumber: 1,
        title: 'Zone 1: Vapor Isolation & Rapid Outer Strip',
        zoneType: 'DIRTY_ZONE',
        instructions: [
          'Cut off clothing rather than pulling over the head to avoid eye/mouth contact.',
          'Isolate contaminated gear in sealed airtight chemical bags.'
        ],
        warnings: 'Chemical vapors offgas rapidly from fabric.'
      },
      {
        stageNumber: 2,
        title: 'Zone 2: Copious Water Flush & Neutralization',
        zoneType: 'WASH_ZONE',
        instructions: [
          'Flush skin with continuous flowing water for at least 15 minutes.',
          'Use 0.5% mild soapy water for persistent oily chemical agents.'
        ],
        warnings: 'Flush eyes immediately for 15 full minutes if exposed.'
      },
      {
        stageNumber: 3,
        title: 'Zone 3: Clean Respirator & Barrier Suit',
        zoneType: 'CLEAN_TRANSITION',
        instructions: [
          'Don clean clothing and N95/P100 or chemical mask.',
          'Check seal around nose bridge and chin.'
        ],
        warnings: 'Do not remove mask until shelter atmosphere is confirmed clear.'
      },
      {
        stageNumber: 4,
        title: 'Zone 4: Elevated Indoor Shelter',
        zoneType: 'SAFE_SHELTER',
        instructions: [
          'Move to an UPPER floor room (many chemical gases like Chlorine & VX are heavier than air and settle in basements).'
        ],
        warnings: 'Avoid low-lying basements during heavy chemical gas events.'
      }
    ],
    BIOLOGICAL: [
      {
        stageNumber: 1,
        title: 'Zone 1: Isolation Anteroom Entry',
        zoneType: 'DIRTY_ZONE',
        instructions: [
          'Establish a single entry point anteroom with a bleach-soaked footpad mat.',
          'Remove outer footwear and spray soles with 10% bleach disinfectant.'
        ],
        warnings: 'Pathogens track easily on shoe soles.'
      },
      {
        stageNumber: 2,
        title: 'Zone 2: Sanitization & Mask Donning',
        zoneType: 'WASH_ZONE',
        instructions: [
          'Wash hands thoroughly with soap and water for 30 seconds or use 70%+ alcohol hand rub.',
          'Put on tight-fitting N95/FFP3 respirator mask and protective goggles.'
        ],
        warnings: 'Avoid touching face, eyes, or mask surface.'
      },
      {
        stageNumber: 3,
        title: 'Zone 3: Surface Bleach Wipedown',
        zoneType: 'CLEAN_TRANSITION',
        instructions: [
          'Wipe down all door handles, switches, and hard surfaces with 1:10 bleach solution (1 part bleach to 9 parts water).'
        ],
        warnings: 'Allow bleach solution to remain wet on surfaces for at least 5 minutes.'
      },
      {
        stageNumber: 4,
        title: 'Zone 4: Negative/Positive Sealed Isolation',
        zoneType: 'SAFE_SHELTER',
        instructions: [
          'Maintain sealed shelter room with dedicated air filtration.',
          'Restrict entry and exit to essential tasks only.'
        ],
        warnings: 'Quarantine symptomatic individuals in a separate room.'
      }
    ]
  };

  const currentProtocol = DECON_PROTOCOLS[threatType];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
                <Biohazard className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                  CBRN HAZMAT DECONTAMINATION & SHELTER SEALING <span className="text-xs px-2 py-0.5 bg-rose-900/50 text-rose-300 border border-rose-500/30 rounded">HAZMAT PROTOCOL</span>
                </h2>
                <p className="text-slate-400 text-sm">
                  Step-by-step radiological fallout, chemical agent & biological pathogen decon procedures + Plastic Shelter Sealing Calculator.
                </p>
              </div>
            </div>
          </div>

          {/* Threat Selector Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setThreatType('RADIATION'); setActiveStep(1); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition ${
                threatType === 'RADIATION' ? 'bg-amber-600 text-white border-amber-500 shadow-lg' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              ☢️ RADIOLOGICAL
            </button>
            <button
              onClick={() => { setThreatType('CHEMICAL'); setActiveStep(1); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition ${
                threatType === 'CHEMICAL' ? 'bg-rose-600 text-white border-rose-500 shadow-lg' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              ☣️ CHEMICAL
            </button>
            <button
              onClick={() => { setThreatType('BIOLOGICAL'); setActiveStep(1); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg border transition ${
                threatType === 'BIOLOGICAL' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              🦠 BIOLOGICAL
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Protocol Stepper & Shelter Sealing Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 4-Stage Decon Stepper */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              4-Zone {threatType} Decontamination Protocol Sequence
            </h3>
            <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded font-mono">
              STEP {activeStep} OF 4
            </span>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {currentProtocol.map((stage) => (
              <button
                key={stage.stageNumber}
                onClick={() => setActiveStep(stage.stageNumber)}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition ${
                  activeStep === stage.stageNumber
                    ? 'bg-rose-950/80 border-rose-500/60 text-white shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] text-slate-500 uppercase font-bold">ZONE {stage.stageNumber}</div>
                <div className="truncate font-semibold mt-0.5">{stage.title.split(':')[0]}</div>
              </button>
            ))}
          </div>

          {/* Active Stage Details */}
          {(() => {
            const currentStage = currentProtocol[activeStep - 1];
            return (
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 bg-rose-950 text-rose-400 border border-rose-500/40 rounded-full flex items-center justify-center text-xs font-mono">
                      {currentStage.stageNumber}
                    </span>
                    {currentStage.title}
                  </h4>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    currentStage.zoneType === 'DIRTY_ZONE' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' :
                    currentStage.zoneType === 'WASH_ZONE' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                    currentStage.zoneType === 'CLEAN_TRANSITION' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/40' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                  }`}>
                    {currentStage.zoneType.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Mandatory Protocol Actions:</span>
                  <ul className="space-y-2">
                    {currentStage.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-start space-x-3 text-xs text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">CRITICAL DECON WARNING:</strong>
                    <p className="text-amber-200/90 mt-0.5">{currentStage.warnings}</p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-2">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold rounded border border-slate-700 transition"
                  >
                    ← Previous Zone
                  </button>

                  <button
                    disabled={activeStep === 4}
                    onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold rounded shadow transition flex items-center gap-1"
                  >
                    <span>Next Zone Protocol</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Shelter-In-Place Plastic Sealing Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Shelter-In-Place Plastic Sealing Calculator
          </h3>

          <p className="text-xs text-slate-400">
            Calculates 6-mil plastic sheeting and duct tape requirements to air-seal an indoor safe room against airborne fallout & gas.
          </p>

          <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Room Dimensions (L × W × H in meters):</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number" min="2" max="20"
                  value={roomLengthM}
                  onChange={(e) => setRoomLengthM(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-cyan-400 p-2 rounded text-center outline-none"
                  placeholder="Length"
                />
                <input
                  type="number" min="2" max="20"
                  value={roomWidthM}
                  onChange={(e) => setRoomWidthM(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-cyan-400 p-2 rounded text-center outline-none"
                  placeholder="Width"
                />
                <input
                  type="number" min="2" max="5" step="0.5"
                  value={roomHeightM}
                  onChange={(e) => setRoomHeightM(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-cyan-400 p-2 rounded text-center outline-none"
                  placeholder="Height"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-slate-400 block mb-1">Window Openings:</label>
                <input
                  type="number" min="0" max="10"
                  value={windowCount}
                  onChange={(e) => setWindowCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-amber-400 p-2 rounded text-center outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Door Outlets:</label>
                <input
                  type="number" min="1" max="5"
                  value={doorCount}
                  onChange={(e) => setDoorCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 text-amber-400 p-2 rounded text-center outline-none"
                />
              </div>
            </div>
          </div>

          {/* Calculator Results */}
          <div className="space-y-3 pt-1">
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block uppercase mb-1">6-MIL PLASTIC SHEETING REQUIRED</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{totalPlasticAreaSqM} m²</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Includes 20% overlap margin</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block uppercase mb-1">HEAVY-DUTY DUCT TAPE NEEDED</span>
              <span className="text-2xl font-bold font-mono text-rose-400">{tapeRollsNeeded} Rolls <span className="text-xs font-normal text-slate-500">({totalTapeMeters}m)</span></span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Double-layer perimeter seam sealing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
