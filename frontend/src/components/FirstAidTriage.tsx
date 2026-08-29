import React, { useState, useEffect, useRef } from 'react';
import { Heart, Activity, AlertCircle, Play, Square, RefreshCw, CheckCircle2, ShieldAlert, Clock, UserCheck, Flame } from 'lucide-react';

export const FirstAidTriage: React.FC = () => {
  // START Triage Wizard State
  const [step, setStep] = useState<number>(1);
  const [triageResult, setTriageResult] = useState<{
    category: 'RED' | 'YELLOW' | 'GREEN' | 'BLACK';
    title: string;
    priority: string;
    action: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  } | null>(null);

  // CPR Metronome State
  const [isCPRRunning, setIsCPRRunning] = useState<boolean>(false);
  const [compressionCount, setCompressionCount] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isBreathPhase, setIsBreathPhase] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(110);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<any>(null);

  // START Triage Decision Handlers
  const handleCanWalk = (canWalk: boolean) => {
    if (canWalk) {
      setTriageResult({
        category: 'GREEN',
        title: 'GREEN — MINOR (Walking Wounded)',
        priority: 'PRIORITY 3 (Lowest)',
        action: 'Direct to a designated safe shelter area. Re-evaluate periodically. Can assist with minor tasks or companion care.',
        colorClass: 'text-emerald-400',
        bgClass: 'bg-emerald-950/40',
        borderClass: 'border-emerald-500/40'
      });
    } else {
      setStep(2); // Check breathing
    }
  };

  const handleBreathing = (isBreathing: boolean, airwayOpened = false) => {
    if (!isBreathing) {
      if (!airwayOpened) {
        setStep(2.5); // Prompt to open airway
      } else {
        setTriageResult({
          category: 'BLACK',
          title: 'BLACK — DECEASED / EXPECTANT',
          priority: 'NO RESUSCITATION IN MASS CASUALTY',
          action: 'Casualty remains unresponsive with no spontaneous breathing after airway opening. Do not initiate CPR in high-casualty resource-limited triage.',
          colorClass: 'text-slate-400',
          bgClass: 'bg-slate-900',
          borderClass: 'border-slate-700'
        });
      }
    } else {
      if (airwayOpened) {
        setTriageResult({
          category: 'RED',
          title: 'RED — IMMEDIATE (Critical)',
          priority: 'PRIORITY 1 (Highest Urgent)',
          action: 'Casualty started breathing after airway maneuver. Position in recovery position immediately to maintain patent airway. Evacuate urgently.',
          colorClass: 'text-rose-400',
          bgClass: 'bg-rose-950/40',
          borderClass: 'border-rose-600/40'
        });
      } else {
        setStep(3); // Check respiratory rate
      }
    }
  };

  const handleRespRate = (isFast: boolean) => {
    if (isFast) {
      setTriageResult({
        category: 'RED',
        title: 'RED — IMMEDIATE (Respiratory Distress)',
        priority: 'PRIORITY 1 (Highest Urgent)',
        action: 'Breathing rate > 30 breaths/min indicates severe respiratory compromise, tension pneumothorax, or shock. Treat immediately.',
        colorClass: 'text-rose-400',
        bgClass: 'bg-rose-950/40',
        borderClass: 'border-rose-600/40'
      });
    } else {
      setStep(4); // Check perfusion
    }
  };

  const handlePerfusion = (hasPulse: boolean) => {
    if (!hasPulse) {
      setTriageResult({
        category: 'RED',
        title: 'RED — IMMEDIATE (Circulatory Shock)',
        priority: 'PRIORITY 1 (Highest Urgent)',
        action: 'Absent radial pulse or capillary refill > 2 seconds indicates decompensated shock or severe internal/external hemorrhage. Control bleeding immediately.',
        colorClass: 'text-rose-400',
        bgClass: 'bg-rose-950/40',
        borderClass: 'border-rose-600/40'
      });
    } else {
      setStep(5); // Check mental status
    }
  };

  const handleMentalStatus = (canFollow: boolean) => {
    if (!canFollow) {
      setTriageResult({
        category: 'RED',
        title: 'RED — IMMEDIATE (Altered Mental Status)',
        priority: 'PRIORITY 1 (Highest Urgent)',
        action: 'Inability to follow simple commands ("Squeeze my hand") indicates severe hypoxia, brain trauma, or advanced shock.',
        colorClass: 'text-rose-400',
        bgClass: 'bg-rose-950/40',
        borderClass: 'border-rose-600/40'
      });
    } else {
      setTriageResult({
        category: 'YELLOW',
        title: 'YELLOW — DELAYED (Serious / Stable)',
        priority: 'PRIORITY 2 (Moderate)',
        action: 'Stable vital signs and mentation, but serious non-ambulatory injury (e.g. fracture, deep laceration). Re-triage every 30-60 minutes.',
        colorClass: 'text-amber-400',
        bgClass: 'bg-amber-950/40',
        borderClass: 'border-amber-500/40'
      });
    }
  };

  const resetTriage = () => {
    setStep(1);
    setTriageResult(null);
  };

  // CPR Metronome Logic
  const playMetronomeBeep = (freq = 880) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  const startCPR = () => {
    setIsCPRRunning(true);
    setCompressionCount(0);
    setCycleCount(0);
    setIsBreathPhase(false);
  };

  const stopCPR = () => {
    setIsCPRRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    if (!isCPRRunning) return;

    const intervalMs = (60 / bpm) * 1000;
    let localCount = 0;
    let localCycles = 0;

    intervalRef.current = setInterval(() => {
      localCount++;
      if (localCount <= 30) {
        setIsBreathPhase(false);
        setCompressionCount(localCount);
        playMetronomeBeep(localCount === 1 || localCount === 30 ? 1046 : 880); // High pitch on 1 and 30
      } else if (localCount > 30 && localCount <= 34) {
        // 2 breath pause (~2 seconds)
        setIsBreathPhase(true);
        if (localCount === 31 || localCount === 33) {
          playMetronomeBeep(523); // Low tone for breath
        }
      } else {
        // Reset to next cycle
        localCount = 1;
        localCycles++;
        setCycleCount(localCycles);
        setIsBreathPhase(false);
        setCompressionCount(1);
        playMetronomeBeep(1046);
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCPRRunning, bpm]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-rose-950/80 border border-rose-500/40 rounded-lg text-rose-500">
            <Heart className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider">
              EMERGENCY FIRST AID & CPR TRIAGE ENGINE
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Official START Mass Casualty Protocol & 110 BPM Cardiopulmonary Resuscitation Metronome.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: START Triage Flowchart */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono font-bold text-white uppercase">
                  START TRIAGE ALGORITHM (UNDER 60s)
                </h3>
              </div>
              <button
                onClick={resetTriage}
                className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded"
              >
                <RefreshCw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            </div>

            {!triageResult ? (
              <div className="space-y-4 py-2">
                {step === 1 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">STEP 1 / 4: AMBULATION</span>
                    <h4 className="text-sm font-semibold text-white">Can the casualty stand and walk safely?</h4>
                    <p className="text-xs text-slate-400">Ask all ambulatory patients to move to a designated rally point.</p>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleCanWalk(true)}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        YES (Can Walk)
                      </button>
                      <button
                        onClick={() => handleCanWalk(false)}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold rounded-lg border border-slate-700"
                      >
                        NO (Non-Ambulatory)
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">STEP 2 / 4: RESPIRATION</span>
                    <h4 className="text-sm font-semibold text-white">Is the casualty breathing spontaneously?</h4>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleBreathing(true)}
                        className="py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        YES (Breathing)
                      </button>
                      <button
                        onClick={() => handleBreathing(false)}
                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        NO (Apneic / Not Breathing)
                      </button>
                    </div>
                  </div>
                )}

                {step === 2.5 && (
                  <div className="space-y-3 p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg">
                    <span className="text-xs font-mono text-rose-400 font-bold uppercase">AIRWAY INTERVENTION REQUIRED</span>
                    <h4 className="text-sm font-semibold text-white">Perform head-tilt / chin-lift or jaw-thrust to position airway. Did breathing start?</h4>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleBreathing(true, true)}
                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        YES (Started Breathing)
                      </button>
                      <button
                        onClick={() => handleBreathing(false, true)}
                        className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-700"
                      >
                        NO (Still Not Breathing)
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">STEP 3 / 4: RESPIRATORY CADENCE</span>
                    <h4 className="text-sm font-semibold text-white">What is the estimated respiratory rate?</h4>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleRespRate(false)}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold rounded-lg border border-slate-700"
                      >
                        NORMAL (10 - 29 / min)
                      </button>
                      <button
                        onClick={() => handleRespRate(true)}
                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        CRITICAL (&gt; 30 / min or &lt; 10)
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">STEP 4 / 4: PERFUSION / PULSE</span>
                    <h4 className="text-sm font-semibold text-white">Is radial pulse present? (Or Capillary Refill &lt; 2s)</h4>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handlePerfusion(true)}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold rounded-lg border border-slate-700"
                      >
                        YES (Pulse Present / &lt; 2s)
                      </button>
                      <button
                        onClick={() => handlePerfusion(false)}
                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        NO (Absent Pulse / Shock)
                      </button>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">STEP 5: MENTAL STATUS</span>
                    <h4 className="text-sm font-semibold text-white">Can the casualty follow simple verbal commands?</h4>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => handleMentalStatus(true)}
                        className="py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        YES (Follows Commands)
                      </button>
                      <button
                        onClick={() => handleMentalStatus(false)}
                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold rounded-lg shadow"
                      >
                        NO (Unresponsive / Altered)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-4 rounded-xl border ${triageResult.bgClass} ${triageResult.borderClass} space-y-3`}>
                <div className="flex items-center justify-between">
                  <span className={`text-base font-heading font-extrabold ${triageResult.colorClass}`}>
                    {triageResult.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {triageResult.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {triageResult.action}
                </p>
                <button
                  onClick={resetTriage}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold rounded-lg mt-2 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>TRIAGE NEXT CASUALTY</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>PROTOCOL: START MCI 60-SEC ALGORITHM</span>
            <span>STANDARD: FEMA / ERC</span>
          </div>
        </div>

        {/* Module 2: CPR 110 BPM Audio Metronome & Compression Target */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-mono font-bold text-white uppercase">
                  110 BPM CPR RHYTHM METRONOME
                </h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-rose-400">
                <Clock className="w-3.5 h-3.5" />
                <span>30:2 CADENCE</span>
              </div>
            </div>

            {/* Metronome Beat Visualization */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center space-y-3 relative overflow-hidden">
              <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                {isBreathPhase ? '💨 GIVE 2 RESCUE BREATHS (1s EACH)' : '⚡ CHEST COMPRESSION CADENCE'}
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                <div
                  className={`w-24 h-24 rounded-full flex flex-col items-center justify-center font-heading font-black text-3xl transition-all ${
                    isCPRRunning
                      ? isBreathPhase
                        ? 'bg-cyan-950 border-2 border-cyan-400 text-cyan-300 animate-pulse'
                        : 'bg-rose-950 border-2 border-rose-500 text-rose-300 scale-105 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-slate-950 border border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{isCPRRunning ? (isBreathPhase ? 'BREATH' : compressionCount) : '--'}</span>
                  <span className="text-[9px] font-mono text-slate-400 font-normal">
                    {isCPRRunning ? (isBreathPhase ? 'PAUSE' : 'PUSH 5CM') : '110 BPM'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">CURRENT CYCLE</span>
                  <span className="text-white font-bold text-sm">CYCLE #{cycleCount + 1}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">COMPRESSION RATIO</span>
                  <span className="text-rose-400 font-bold text-sm">30 : 2 BREATHS</span>
                </div>
              </div>
            </div>

            {/* CPR Controls */}
            <div className="space-y-2">
              {!isCPRRunning ? (
                <button
                  onClick={startCPR}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all tracking-wider"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>START 110 BPM CPR AUDIO METRONOME</span>
                </button>
              ) : (
                <button
                  onClick={stopCPR}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-600/40 font-mono font-bold text-xs rounded-lg shadow flex items-center justify-center gap-2 transition-all tracking-wider"
                >
                  <Square className="w-4 h-4 fill-rose-400" />
                  <span>STOP METRONOME</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
            <span>AHA STANDARD: 5CM (2 INCHES) COMPRESSION DEPTH // ALLOW FULL RECOIL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
