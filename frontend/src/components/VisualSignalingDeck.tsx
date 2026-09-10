import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, Flashlight, AlertTriangle, ShieldCheck, Radio, Sun, Volume2, 
  Play, Square, Compass, HelpCircle, Send, Zap, VolumeX, Sparkles 
} from 'lucide-react';
import { GroundToAirSymbol, VisualSignalPattern } from '../types';

const ICAO_SYMBOLS: GroundToAirSymbol[] = [
  { code: 'V', name: 'Require Assistance', meaning: 'General Emergency / Vehicle Stranded', application: 'Trench or rocks on open field', min_length: '2.5m (8 ft)' },
  { code: 'X', name: 'Require Medical Assistance', meaning: 'Critical Injuries / Medical Triage', application: 'Crossed logs or contrasting canvas', min_length: '3.0m (10 ft)' },
  { code: 'N', name: 'No / Negative', meaning: 'Negative response to pilot signal/drop', application: 'Two perpendicular strokes', min_length: '2.5m (8 ft)' },
  { code: 'Y', name: 'Yes / Affirmative', meaning: 'Confirming drop zone safety / status', application: 'Y-shape with high visual contrast', min_length: '2.5m (8 ft)' },
  { code: '->', name: 'Proceeding This Direction', meaning: 'Marking foot evacuation path', application: 'Arrow pointing toward trek direction', min_length: '4.0m (13 ft)' },
  { code: 'LL', name: 'All Is Well', meaning: 'No assistance required', application: 'Double parallel lines', min_length: '2.5m (8 ft)' },
];

const MORSE_MAP: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
  '9': '----.', '0': '-----', ' ': ' / '
};

export const VisualSignalingDeck: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<GroundToAirSymbol>(ICAO_SYMBOLS[0]);
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(false);
  const [strobeColor, setStrobeColor] = useState<'white' | 'red' | 'amber'>('white');
  const [flashOn, setFlashOn] = useState<boolean>(false);

  // Text to Morse Generator State
  const [customText, setCustomText] = useState<string>('SOS TRAPPED FLAT 4B');
  const [isTransmittingMorse, setIsTransmittingMorse] = useState<boolean>(false);
  const [currentMorseSymbol, setCurrentMorseSymbol] = useState<string>('');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Manual Telegraph Key State
  const [isTelegraphKeyDown, setIsTelegraphKeyDown] = useState<boolean>(false);

  // Torch / MediaStream Track Ref
  const torchTrackRef = useRef<MediaStreamTrack | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Text to Morse Conversion helper
  const textToMorseString = (text: string): string => {
    return text.toUpperCase().split('').map(char => MORSE_MAP[char] || '').join(' ');
  };

  // Play audio pulse tone
  const playPulseSound = (durationMs: number) => {
    if (!isAudioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch {}
  };

  // Toggle Torch Flashlight if supported
  const setTorchState = async (state: boolean) => {
    try {
      if (!torchTrackRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const track = stream.getVideoTracks()[0];
        torchTrackRef.current = track;
      }
      if (torchTrackRef.current && 'applyConstraints' in torchTrackRef.current) {
        await torchTrackRef.current.applyConstraints({
          advanced: [{ torch: state } as any]
        });
      }
    } catch {}
  };

  // Optical Morse Transmission Loop
  useEffect(() => {
    let timeoutId: any = null;
    let isCancelled = false;

    const transmitMorseSequence = async () => {
      if (!isTransmittingMorse || !customText.trim()) return;

      const morseStr = textToMorseString(customText);
      const units = morseStr.split('');

      for (let i = 0; i < units.length; i++) {
        if (isCancelled || !isTransmittingMorse) break;
        const char = units[i];
        setCurrentMorseSymbol(char);

        if (char === '.') {
          setFlashOn(true);
          setTorchState(true);
          playPulseSound(180);
          await new Promise(r => setTimeout(r, 180));
          setFlashOn(false);
          setTorchState(false);
          await new Promise(r => setTimeout(r, 180));
        } else if (char === '-') {
          setFlashOn(true);
          setTorchState(true);
          playPulseSound(500);
          await new Promise(r => setTimeout(r, 500));
          setFlashOn(false);
          setTorchState(false);
          await new Promise(r => setTimeout(r, 180));
        } else {
          // Space pause
          setFlashOn(false);
          setTorchState(false);
          await new Promise(r => setTimeout(r, 400));
        }
      }

      if (!isCancelled && isTransmittingMorse) {
        // Pause 1.5s before repeating loop
        await new Promise(r => setTimeout(r, 1500));
        transmitMorseSequence();
      }
    };

    if (isTransmittingMorse) {
      transmitMorseSequence();
    } else {
      setFlashOn(false);
      setTorchState(false);
    }

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isTransmittingMorse, customText, isAudioEnabled]);

  // Simple Strobe Loop
  useEffect(() => {
    let interval: any;
    if (isStrobeActive && !isTransmittingMorse) {
      interval = setInterval(() => {
        setFlashOn(prev => !prev);
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isStrobeActive, isTransmittingMorse]);

  // Manual Telegraph Key Handlers
  const handleTelegraphDown = () => {
    setIsTelegraphKeyDown(true);
    setFlashOn(true);
    setTorchState(true);
    playPulseSound(600);
  };

  const handleTelegraphUp = () => {
    setIsTelegraphKeyDown(false);
    setFlashOn(false);
    setTorchState(false);
  };

  return (
    <div className="space-y-6">
      {/* Full-screen strobe / Morse overlay when activated */}
      {(isStrobeActive || isTransmittingMorse || isTelegraphKeyDown) && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-75"
          style={{
            backgroundColor: flashOn
              ? (strobeColor === 'white' ? '#FFFFFF' : strobeColor === 'red' ? '#FF0000' : '#FFB000')
              : '#000000'
          }}
        >
          <div className="bg-slate-950/90 border border-slate-700 p-6 rounded-3xl text-center space-y-4 max-w-md shadow-2xl">
            <Flashlight className={`w-14 h-14 mx-auto animate-pulse ${flashOn ? 'text-amber-400' : 'text-slate-600'}`} />
            
            <h3 className="text-xl font-bold text-white uppercase font-mono tracking-wider">
              {isTransmittingMorse ? 'MORSE CODE OPTICAL TRANSMITTER' : 'OPTICAL EMERGENCY STROBE'}
            </h3>

            {isTransmittingMorse && (
              <div className="space-y-1">
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  MESSAGE: "{customText}"
                </div>
                <div className="text-2xl font-mono text-amber-400 font-bold">
                  {textToMorseString(customText)}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsStrobeActive(false);
                  setIsTransmittingMorse(false);
                }}
                className="w-full py-3 px-6 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg transition-all font-mono uppercase text-xs"
              >
                STOP TRANSMITTING [ESC]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-950/80 border border-cyan-700/60 rounded-xl text-cyan-400">
              <Eye className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                ICAO / NATO VISUAL PROTOCOL
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Visual Signaling & Morse Code Beacon
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Convert emergency messages into screen optical flashes, torch pulses, and audio beeps to signal rescuers outside windows or across distances.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStrobeActive(!isStrobeActive)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all text-xs font-mono uppercase"
            >
              <Flashlight className="w-4 h-4" />
              TRIGGER SOS STROBE
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Text-to-Morse Code Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold uppercase">
            <Radio className="w-4 h-4 text-cyan-400" />
            Text-To-Morse Optical Generator
          </div>
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`px-3 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 ${
              isAudioEnabled ? 'bg-cyan-950 text-cyan-400 border-cyan-700' : 'bg-slate-950 text-slate-500 border-slate-800'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioEnabled ? 'AUDIO PULSE ON' : 'MUTED'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            <label className="block text-xs font-mono text-slate-400 uppercase">
              Emergency Signal Text Message
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. SOS TRAPPED FLAT 4B NEED WATER"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 font-mono focus:outline-none focus:border-cyan-500"
              />
              {!isTransmittingMorse ? (
                <button
                  onClick={() => setIsTransmittingMorse(true)}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs font-mono uppercase transition flex items-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  TRANSMIT MORSE
                </button>
              ) : (
                <button
                  onClick={() => setIsTransmittingMorse(false)}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs font-mono uppercase transition flex items-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4" />
                  STOP
                </button>
              )}
            </div>

            {/* Generated Morse Code Preview */}
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">GENERATED MORSE PROTOCOL PREVIEW:</div>
              <div className="text-base font-mono text-amber-400 tracking-widest font-bold">
                {textToMorseString(customText) || '... --- ...'}
              </div>
            </div>
          </div>

          {/* Preset Buttons & Color Select */}
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-mono text-slate-400 uppercase">Quick Presets</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCustomText('SOS TRAPPED FLAT 4B')}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded text-[11px] font-mono"
              >
                TRAPPED FLAT 4B
              </button>
              <button
                onClick={() => setCustomText('NEED MEDICAL AID')}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded text-[11px] font-mono"
              >
                NEED MEDIC
              </button>
              <button
                onClick={() => setCustomText('WATER EXHAUSTED')}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded text-[11px] font-mono"
              >
                WATER LOW
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Strobe Flash Color</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setStrobeColor('white')}
                  className={`py-1 rounded text-[11px] font-mono font-bold border ${strobeColor === 'white' ? 'bg-white text-slate-950 border-white' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  WHITE
                </button>
                <button
                  onClick={() => setStrobeColor('red')}
                  className={`py-1 rounded text-[11px] font-mono font-bold border ${strobeColor === 'red' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  RED
                </button>
                <button
                  onClick={() => setStrobeColor('amber')}
                  className={`py-1 rounded text-[11px] font-mono font-bold border ${strobeColor === 'amber' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                >
                  AMBER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Manual Telegraph Key & Ground-to-Air Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Telegraph Key */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <Zap className="w-4 h-4" />
            Manual Telegraph Key (Tap to Flash)
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Hold or tap the key below to manually flash screen optical strobe bursts and audio pulse tones.
          </p>

          <button
            onMouseDown={handleTelegraphDown}
            onMouseUp={handleTelegraphUp}
            onTouchStart={handleTelegraphDown}
            onTouchEnd={handleTelegraphUp}
            className={`w-full h-32 rounded-2xl border-2 font-mono font-bold text-lg uppercase transition-all flex flex-col items-center justify-center gap-2 select-none ${
              isTelegraphKeyDown 
                ? 'bg-amber-500 text-slate-950 border-amber-300 scale-95 shadow-inner' 
                : 'bg-slate-950 border-amber-600/60 text-amber-400 hover:bg-slate-900'
            }`}
          >
            <Zap className="w-8 h-8" />
            <span>{isTelegraphKeyDown ? 'TRANSMITTING PULSE ●' : 'HOLD / TAP TELEGRAPH KEY'}</span>
          </button>
        </div>

        {/* ICAO Ground-To-Air Symbols */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold uppercase">
              <Compass className="w-4 h-4 text-cyan-400" />
              ICAO / NATO Ground-to-Air Symbol Matrix
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ICAO_SYMBOLS.map(sym => (
              <div
                key={sym.code}
                onClick={() => setSelectedSymbol(sym)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  selectedSymbol.code === sym.code 
                    ? 'bg-cyan-950/80 border-cyan-600 text-white ring-1 ring-cyan-500' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-2xl font-bold font-mono text-cyan-400 mb-1">{sym.code}</div>
                <div className="text-xs font-bold text-slate-200">{sym.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">{sym.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
