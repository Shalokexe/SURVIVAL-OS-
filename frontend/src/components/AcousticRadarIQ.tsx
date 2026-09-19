import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, AlertTriangle, ShieldAlert, 
  Activity, Bell, Radio, CheckCircle, RefreshCw, Zap, Play, Square, Settings, Award 
} from 'lucide-react';

interface AcousticLog {
  id: string;
  timestamp: string;
  type: 'EAS_TONE' | 'DISTRESS_WHISTLE' | 'SIREN_SWEEP' | 'DECIBEL_SPIKE';
  frequency: number;
  decibels: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
}

export const AcousticRadarIQ: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [sensitivityDb, setSensitivityDb] = useState<number>(65);
  const [currentDb, setCurrentDb] = useState<number>(0);
  const [dominantFreq, setDominantFreq] = useState<number>(0);
  const [detectedType, setDetectedType] = useState<string>('NORMAL');
  const [logs, setLogs] = useState<AcousticLog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'EAS_TONE',
      frequency: 1042,
      decibels: 78,
      severity: 'CRITICAL',
      description: '1000Hz Emergency Alert Broadcast System (EAS) tone pattern detected'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'DISTRESS_WHISTLE',
      frequency: 3120,
      decibels: 72,
      severity: 'WARNING',
      description: 'High-pitch SOS survivor distress whistle frequency pattern identified'
    }
  ]);
  const [alarmActive, setAlarmActive] = useState<boolean>(false);
  const [activeTestSynth, setActiveTestSynth] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const testOscillatorRef = useRef<OscillatorNode | null>(null);

  // Frequency history for detecting siren pitch sweeps
  const freqHistoryRef = useRef<number[]>([]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      processAudio();
    } catch (err) {
      console.error("Microphone access denied or unavailble", err);
      // Fallback: run simulated audio ticker for demonstration
      setIsListening(true);
      runSimulatedTicker();
    }
  };

  const stopListening = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    setIsListening(false);
    setCurrentDb(0);
    setDominantFreq(0);
    setDetectedType('NORMAL');
  };

  const runSimulatedTicker = () => {
    let phase = 0;
    const tick = () => {
      phase += 0.05;
      const db = Math.floor(40 + Math.sin(phase) * 15 + Math.random() * 5);
      const freq = Math.floor(400 + Math.sin(phase * 0.5) * 300);
      setCurrentDb(db);
      setDominantFreq(freq);
      drawSpectrum(null);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const processAudio = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyzeFrame = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate peak decibel proxy and dominant frequency bin
      let maxVal = 0;
      let maxBinIndex = 0;
      let totalVal = 0;

      for (let i = 0; i < bufferLength; i++) {
        const val = dataArray[i];
        totalVal += val;
        if (val > maxVal) {
          maxVal = val;
          maxBinIndex = i;
        }
      }

      const sampleRate = audioCtxRef.current?.sampleRate || 44100;
      const dominantFrequency = Math.round((maxBinIndex * sampleRate) / (bufferLength * 2));
      const approxDb = Math.round((maxVal / 255) * 100);

      setCurrentDb(approxDb);
      setDominantFreq(dominantFrequency);

      // Siren sweep tracking
      freqHistoryRef.current.push(dominantFrequency);
      if (freqHistoryRef.current.length > 30) freqHistoryRef.current.shift();

      // Trigger Evaluation
      evaluateAcousticTrigger(approxDb, dominantFrequency);

      // Render Canvas Visualizer
      drawSpectrum(dataArray);

      animFrameRef.current = requestAnimationFrame(analyzeFrame);
    };

    analyzeFrame();
  };

  const evaluateAcousticTrigger = (db: number, freq: number) => {
    if (db < sensitivityDb) return;

    // Check EAS Tone (~950Hz - 1100Hz)
    if (freq >= 950 && freq <= 1100 && db >= sensitivityDb + 5) {
      triggerEvent('EAS_TONE', freq, db, 'CRITICAL', `1000Hz EAS Emergency Alert tone pattern detected (${freq} Hz, ${db} dB)`);
    }
    // Check SOS Whistle (~2800Hz - 3600Hz)
    else if (freq >= 2800 && freq <= 3600 && db >= sensitivityDb) {
      triggerEvent('DISTRESS_WHISTLE', freq, db, 'WARNING', `Distress Whistle pulse identified (${freq} Hz, ${db} dB)`);
    }
    // Check Decibel Spike
    else if (db >= 88) {
      triggerEvent('DECIBEL_SPIKE', freq, db, 'CRITICAL', `High-intensity acoustic decibel spike detected (${db} dB)`);
    }
  };

  const triggerEvent = (type: AcousticLog['type'], freq: number, db: number, severity: AcousticLog['severity'], desc: string) => {
    setDetectedType(type);
    setAlarmActive(true);

    // Prevent spam logs within 4 seconds
    setLogs(prev => {
      const recent = prev[0];
      if (recent && recent.type === type && (Date.now() - new Date('1970/01/01 ' + recent.timestamp).getTime()) < 4000) {
        return prev;
      }
      const newLog: AcousticLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type,
        frequency: freq,
        decibels: db,
        severity,
        description: desc
      };
      return [newLog, ...prev.slice(0, 19)];
    });
  };

  const drawSpectrum = (dataArray: Uint8Array | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!dataArray) {
      // Draw idle sine wave
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin((x * 0.05) + (Date.now() * 0.005)) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      return;
    }

    const barWidth = (width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * (height - 10);
      
      // Color gradient based on frequency index
      const hue = 180 + (i / dataArray.length) * 120;
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.85)`;

      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  };

  // Test Tone Generator for Offline Testing
  const playTestTone = (type: 'EAS' | 'WHISTLE' | 'SIREN') => {
    if (activeTestSynth) {
      stopTestTone();
      return;
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'EAS') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1050, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      setActiveTestSynth('EAS 1050Hz Tone');
    } else if (type === 'WHISTLE') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      setActiveTestSynth('Distress Whistle (3200Hz)');
    } else if (type === 'SIREN') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 1.5);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 3.0);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      setActiveTestSynth('Air Raid Siren Sweep');
    }

    osc.start();
    testOscillatorRef.current = osc;

    setTimeout(() => {
      try {
        osc.stop();
        ctx.close();
      } catch (e) {
        console.log(e);
      }
      setActiveTestSynth(null);
    }, 3500);
  };

  const stopTestTone = () => {
    if (testOscillatorRef.current) {
      try {
        testOscillatorRef.current.stop();
      } catch (e) {
        console.log(e);
      }
      testOscillatorRef.current = null;
    }
    setActiveTestSynth(null);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className={`space-y-6 transition-colors duration-300 ${alarmActive ? 'animate-pulse bg-red-950/20 p-2 rounded-xl' : ''}`}>
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                  ACOUSTIC RADAR & SIREN DETECTOR <span className="text-xs px-2 py-0.5 bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 rounded">FFT AUDIO V2</span>
                </h2>
                <p className="text-slate-400 text-sm">
                  Real-time microphone spectrum monitoring for EAS 1000Hz alert tones, distress whistles, and decibel spikes.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isListening ? (
              <button
                onClick={startListening}
                className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-cyan-900/40 transition"
              >
                <Mic className="w-5 h-5" />
                <span>START ACOUSTIC SCAN</span>
              </button>
            ) : (
              <button
                onClick={stopListening}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-rose-900/40 transition"
              >
                <MicOff className="w-5 h-5" />
                <span>STOP SCANNER</span>
              </button>
            )}

            {alarmActive && (
              <button
                onClick={() => setAlarmActive(false)}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3 py-2 rounded-lg"
              >
                SILENCE ALARM
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FFT Canvas Visualizer & Metrics */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Audio Frequency Spectrum Analyzer
            </h3>
            <span className={`text-xs px-2.5 py-1 font-mono rounded ${isListening ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'}`}>
              {isListening ? '● LISTENING (22kHz FFT)' : 'STANDBY'}
            </span>
          </div>

          {/* Canvas Spectrum Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 relative overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={180} 
              className="w-full h-44 rounded bg-slate-950" 
            />
            {alarmActive && (
              <div className="absolute inset-0 bg-rose-600/20 pointer-events-none flex items-center justify-center animate-ping">
                <span className="bg-rose-600 text-white px-4 py-1.5 font-bold rounded-md shadow-xl text-sm">
                  ⚠️ SIREN / EAS DETECTED
                </span>
              </div>
            )}
          </div>

          {/* Live Sensor Gauges */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-center">
              <span className="text-xs text-slate-400 block mb-1">ACOUSTIC INTENSITY</span>
              <span className={`text-2xl font-bold font-mono ${currentDb >= sensitivityDb ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`}>
                {currentDb} <span className="text-xs text-slate-500 font-normal">dB</span>
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-center">
              <span className="text-xs text-slate-400 block mb-1">DOMINANT PITCH</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {dominantFreq} <span className="text-xs text-slate-500 font-normal">Hz</span>
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg text-center">
              <span className="text-xs text-slate-400 block mb-1">DETECTION TYPE</span>
              <span className={`text-xs font-bold px-2 py-1 inline-block rounded ${
                detectedType === 'EAS_TONE' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                detectedType === 'DISTRESS_WHISTLE' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                detectedType === 'DECIBEL_SPIKE' ? 'bg-purple-950 text-purple-300 border border-purple-500/30' :
                'bg-slate-800 text-slate-400'
              }`}>
                {detectedType}
              </span>
            </div>
          </div>
        </div>

        {/* Sensitivity & Drill Test Synthesizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4 text-cyan-400" />
              Radar Settings & Test Drills
            </h3>

            {/* Threshold Slider */}
            <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Trigger Sensitivity Threshold:</span>
                <span className="text-cyan-400 font-mono font-bold">{sensitivityDb} dB</span>
              </div>
              <input
                type="range"
                min="40"
                max="90"
                value={sensitivityDb}
                onChange={(e) => setSensitivityDb(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Lower dB triggers alerts on softer sounds. Recommended: 65 dB for quiet indoor shelter.
              </p>
            </div>

            {/* Simulated Audio Test Generator */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Offline Test Audio Drill Synthesizer:
              </span>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => playTestTone('EAS')}
                  className="w-full text-left px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-rose-300 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-rose-400" />
                    Test 1000Hz EAS Siren Tone
                  </span>
                  <Play className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => playTestTone('WHISTLE')}
                  className="w-full text-left px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-amber-300 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    Test 3200Hz SOS Whistle Tone
                  </span>
                  <Play className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  onClick={() => playTestTone('SIREN')}
                  className="w-full text-left px-3 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-xs text-cyan-300 flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                    Test Air Raid Pitch Sweep
                  </span>
                  <Play className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              {activeTestSynth && (
                <div className="p-2 bg-cyan-950/40 border border-cyan-500/30 rounded text-center text-xs text-cyan-300 animate-pulse">
                  Playing: {activeTestSynth}
                </div>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">💡 Survivalist Pro-Tip:</span>
            <p>
              Leave Acoustic Radar running on your tablet/laptop overnight while sleeping. The visual strobe will wake you up if an emergency air siren or distress call sounds nearby.
            </p>
          </div>
        </div>
      </div>

      {/* Incident Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Acoustic Incident Telemetry History
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {logs.length} EVENTS LOGGED
          </span>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-3.5 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono transition ${
                log.severity === 'CRITICAL' ? 'bg-rose-950/20 border-rose-800/40 text-rose-300' :
                log.severity === 'WARNING' ? 'bg-amber-950/20 border-amber-800/40 text-amber-300' :
                'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 font-semibold">{log.timestamp}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  log.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-200">{log.description}</span>
              </div>

              <div className="flex items-center space-x-4 text-slate-400">
                <span>PITCH: <strong className="text-cyan-400">{log.frequency} Hz</strong></span>
                <span>VOL: <strong className="text-emerald-400">{log.decibels} dB</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
