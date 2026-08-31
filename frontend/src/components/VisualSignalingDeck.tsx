import React, { useState, useEffect } from 'react';
import { Eye, Flashlight, AlertTriangle, ShieldCheck, Radio, Sun, Volume2, Play, Square, Compass, HelpCircle } from 'lucide-react';
import { GroundToAirSymbol, VisualSignalPattern } from '../types';

const ICAO_SYMBOLS: GroundToAirSymbol[] = [
  { code: 'V', name: 'Require Assistance', meaning: 'General Emergency / Vehicle Stranded', application: 'Trench or rocks on open field', min_length: '2.5m (8 ft)' },
  { code: 'X', name: 'Require Medical Assistance', meaning: 'Critical Injuries / Medical Triage', application: 'Crossed logs or contrasting canvas', min_length: '3.0m (10 ft)' },
  { code: 'N', name: 'No / Negative', meaning: 'Negative response to pilot signal/drop', application: 'Two perpendicular strokes', min_length: '2.5m (8 ft)' },
  { code: 'Y', name: 'Yes / Affirmative', meaning: 'Confirming drop zone safety / status', application: 'Y-shape with high visual contrast', min_length: '2.5m (8 ft)' },
  { code: '->', name: 'Proceeding This Direction', meaning: 'Marking foot evacuation path', application: 'Arrow pointing toward trek direction', min_length: '4.0m (13 ft)' },
  { code: 'LL', name: 'All Is Well', meaning: 'No assistance required', application: 'Double parallel lines', min_length: '2.5m (8 ft)' },
];

const SIGNAL_PATTERNS: VisualSignalPattern[] = [
  { id: 'sos', title: 'International SOS Optical Strobe', code_morse: '... --- ...', description: '3 Short, 3 Long, 3 Short optical light bursts', category: 'distress' },
  { id: 'rule3', title: 'Rule of Three Flash Sequence', code_morse: '• • •', description: '3 flashes spaced 1s apart, then 60s pause', category: 'distress' },
  { id: 'mirror', title: 'Heliograph Mirror Aiming Flash', code_morse: '— — —', description: 'Continuous rapid sweeps across target cockpit', category: 'mirror' },
];

export const VisualSignalingDeck: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<GroundToAirSymbol>(ICAO_SYMBOLS[0]);
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(false);
  const [strobeColor, setStrobeColor] = useState<'white' | 'red' | 'amber'>('white');
  const [flashOn, setFlashOn] = useState<boolean>(false);

  // Optical Screen Flasher effect
  useEffect(() => {
    let interval: any;
    if (isStrobeActive) {
      interval = setInterval(() => {
        setFlashOn(prev => !prev);
      }, 350);
    } else {
      setFlashOn(false);
    }
    return () => clearInterval(interval);
  }, [isStrobeActive]);

  const toggleStrobe = () => {
    setIsStrobeActive(prev => !prev);
  };

  return (
    <div className="space-y-6">
      {/* Full-screen strobe overlay when activated */}
      {isStrobeActive && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-100"
          style={{
            backgroundColor: flashOn
              ? (strobeColor === 'white' ? '#FFFFFF' : strobeColor === 'red' ? '#FF0000' : '#FFB000')
              : '#000000'
          }}
        >
          <div className="bg-slate-900/90 border border-slate-700 p-6 rounded-2xl text-center space-y-4 max-w-sm">
            <Flashlight className={`w-12 h-12 mx-auto animate-bounce ${flashOn ? 'text-amber-400' : 'text-slate-500'}`} />
            <h3 className="text-xl font-bold text-white uppercase font-mono">OPTICAL STROBE TRANSMITTING</h3>
            <p className="text-xs text-slate-300 font-mono">
              Pattern: International SOS Morse Sequence (`... --- ...`)
            </p>
            <button
              onClick={toggleStrobe}
              className="w-full py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              STOP OPTICAL STROBE
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-cyan-500/30 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <Eye className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                VISUAL EMERGENCY SIGNALING DECK
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">ICAO / NATO PROTOCOL</span>
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Ground-to-Air visual emergency codes, heliograph mirror aiming techniques, and high-visibility optical strobe transmitters.
              </p>
            </div>
          </div>
          <button
            onClick={toggleStrobe}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg shadow-lg transition-all"
          >
            <Flashlight className="w-4 h-4" />
            TRIGGER SCREEN STROBE
          </button>
        </div>
      </div>

      {/* Main Feature Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Ground-to-Air Symbol Matrix */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-4">
          <h3 className="text-md font-bold text-slate-200 flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" /> GROUND-TO-AIR VISUAL CODE MATRIX
            </span>
            <span className="text-xs text-slate-400 font-mono">Standard: ICAO / NATO SAR</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ICAO_SYMBOLS.map(sym => (
              <button
                key={sym.code}
                onClick={() => setSelectedSymbol(sym)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  selectedSymbol.code === sym.code
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-md scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-4xl font-black font-mono tracking-widest text-amber-400 mb-1">{sym.code}</div>
                <div className="text-xs font-bold truncate w-full">{sym.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Min Length: {sym.min_length}</div>
              </button>
            ))}
          </div>

          {/* Selected Symbol Detail Drawer */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-2 mt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
                SYMBOL FOCUS: <span className="text-lg font-mono text-white">{selectedSymbol.code}</span> - {selectedSymbol.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Min Length: {selectedSymbol.min_length}</span>
            </div>
            <p className="text-xs text-slate-300">
              <strong className="text-slate-400 font-mono">Meaning:</strong> {selectedSymbol.meaning}
            </p>
            <p className="text-xs text-slate-300">
              <strong className="text-slate-400 font-mono">Field Construction:</strong> Construct using {selectedSymbol.application} against contrasting terrain background.
            </p>
          </div>
        </div>

        {/* Column 3: Signal Mirror Aiming & Flare Protocols */}
        <div className="space-y-6">
          {/* Signal Mirror Sighting Card */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 border-b border-slate-700 pb-3">
              <Sun className="w-4 h-4 text-amber-400" /> SIGNAL MIRROR (HELIOGRAPH) AIMING
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">1.</span>
                <span>Hold mirror center hole near your eye facing bright sun.</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">2.</span>
                <span>Catch reflected beam on outstretched fingers (V-sight).</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                <span className="font-mono text-amber-400 font-bold">3.</span>
                <span>Align beam dot with target aircraft cockpit; sweep 3 times.</span>
              </div>
            </div>

            <div className="text-[11px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg font-mono">
              ⚡ Visibility Range: Up to 40+ miles (65 km) in direct sunlight.
            </div>
          </div>

          {/* Aircraft Response Quick Reference */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 border-b border-slate-700 pb-3">
              <Radio className="w-4 h-4 text-cyan-400" /> PILOT WING-WAG RESPONSES
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-300 font-bold">Wing-Wag / Flash Lights</span>
                <span className="text-emerald-400 font-mono">RECEIVED & UNDERSTOOD</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="text-slate-300 font-bold">360° Right-Hand Circle</span>
                <span className="text-rose-400 font-mono">NOT UNDERSTOOD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
