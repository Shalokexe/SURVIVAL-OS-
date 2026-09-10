import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Eye, Video, Mic, Bell, BellOff, RefreshCw, 
  AlertTriangle, Radio, Activity, Volume2, Lock, Unlock, Play, Square 
} from 'lucide-react';

interface IntrusionLog {
  id: string;
  time: string;
  type: 'MOTION' | 'AUDIO_SPIKE' | 'SYSTEM';
  severity: 'HIGH' | 'CRITICAL' | 'INFO';
  value: string;
}

export const PerimeterRadar: React.FC = () => {
  const [isArmGuardActive, setIsArmGuardActive] = useState<boolean>(false);
  const [motionSensitivity, setMotionSensitivity] = useState<number>(30); // 1-100
  const [audioSensitivity, setAudioSensitivity] = useState<number>(60); // 1-100
  const [isSoundAlarmEnabled, setIsSoundAlarmEnabled] = useState<boolean>(true);
  const [motionLevel, setMotionLevel] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [intrusionAlert, setIntrusionAlert] = useState<boolean>(false);
  const [logs, setLogs] = useState<IntrusionLog[]>([
    {
      id: 'log-init',
      time: new Date().toLocaleTimeString(),
      type: 'SYSTEM',
      severity: 'INFO',
      value: 'Perimeter Defense Radar initialized. Standby status.'
    }
  ]);

  // Video & Canvas Refs for Motion Detection
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevFrameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const currFrameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Radar Angle Sweep
  const radarAngleRef = useRef<number>(0);

  // Sound Alarm Generator
  const playSirenSound = () => {
    if (!isSoundAlarmEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {}
  };

  // Start Radar Guard
  const handleStartArmGuard = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Audio Setup
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      setIsArmGuardActive(true);
      setIntrusionAlert(false);

      const newLog: IntrusionLog = {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        type: 'SYSTEM',
        severity: 'INFO',
        value: 'PERIMETER ARMED: Motion & Audio tripwires active.'
      };
      setLogs(prev => [newLog, ...prev]);

    } catch (err) {
      alert('Camera & Microphone access is required to run the Perimeter Security Guard.');
    }
  };

  // Stop Radar Guard
  const handleStopArmGuard = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setIsArmGuardActive(false);
    setIntrusionAlert(false);
    setMotionLevel(0);
    setAudioLevel(0);
  };

  // Main Detection Loop
  useEffect(() => {
    let lastAlertTime = 0;

    const processFrame = () => {
      if (!isArmGuardActive || !videoRef.current) return;

      const video = videoRef.current;
      const prevCanvas = prevFrameCanvasRef.current;
      const currCanvas = currFrameCanvasRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA && prevCanvas && currCanvas) {
        const width = 160;
        const height = 120;
        prevCanvas.width = width;
        prevCanvas.height = height;
        currCanvas.width = width;
        currCanvas.height = height;

        const prevCtx = prevCanvas.getContext('2d');
        const currCtx = currCanvas.getContext('2d');

        if (prevCtx && currCtx) {
          // Draw current video frame to currCanvas
          currCtx.drawImage(video, 0, 0, width, height);
          const currData = currCtx.getImageData(0, 0, width, height).data;
          const prevData = prevCtx.getImageData(0, 0, width, height).data;

          // Frame difference pixel variance
          let diffSum = 0;
          const totalPixels = width * height;
          for (let i = 0; i < currData.length; i += 16) { // Sample every 4th pixel for performance
            const rDiff = Math.abs(currData[i] - prevData[i]);
            const gDiff = Math.abs(currData[i + 1] - prevData[i + 1]);
            const bDiff = Math.abs(currData[i + 2] - prevData[i + 2]);
            diffSum += (rDiff + gDiff + bDiff) / 3;
          }

          const avgDiff = (diffSum / (totalPixels / 4));
          const calculatedMotion = Math.min(100, Math.round(avgDiff * 4));
          setMotionLevel(calculatedMotion);

          // Copy current frame to prevCanvas for next iteration
          prevCtx.drawImage(currCanvas, 0, 0);

          // Trigger Motion Alert threshold check
          const threshold = 100 - motionSensitivity;
          if (calculatedMotion > threshold && Date.now() - lastAlertTime > 4000) {
            lastAlertTime = Date.now();
            setIntrusionAlert(true);
            playSirenSound();

            const alertLog: IntrusionLog = {
              id: `log-${Date.now()}`,
              time: new Date().toLocaleTimeString(),
              type: 'MOTION',
              severity: 'CRITICAL',
              value: `MOTION TRIPWIRE BROKEN: ${calculatedMotion}% variance detected.`
            };
            setLogs(prev => [alertLog, ...prev.slice(0, 30)]);
          }
        }
      }

      // Process Audio Decibel Level
      if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avgAudio = Math.min(100, Math.round((sum / bufferLength) * 1.5));
        setAudioLevel(avgAudio);

        const audioThreshold = 100 - audioSensitivity;
        if (avgAudio > audioThreshold && Date.now() - lastAlertTime > 4000) {
          lastAlertTime = Date.now();
          setIntrusionAlert(true);
          playSirenSound();

          const alertLog: IntrusionLog = {
            id: `log-${Date.now()}`,
            time: new Date().toLocaleTimeString(),
            type: 'AUDIO_SPIKE',
            severity: 'HIGH',
            value: `DECIBEL SPIKE DETECTED: ${avgAudio} dB room noise spike.`
          };
          setLogs(prev => [alertLog, ...prev.slice(0, 30)]);
        }
      }

      // Draw Radar Canvas Animation
      if (radarCanvasRef.current) {
        const rCanvas = radarCanvasRef.current;
        const rCtx = rCanvas.getContext('2d');
        if (rCtx) {
          const cx = rCanvas.width / 2;
          const cy = rCanvas.height / 2;
          const radius = Math.min(cx, cy) - 10;

          rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);

          // Radar Circles
          rCtx.strokeStyle = intrusionAlert ? '#f43f5e' : '#10b981';
          rCtx.lineWidth = 1.5;
          rCtx.beginPath();
          rCtx.arc(cx, cy, radius, 0, Math.PI * 2);
          rCtx.arc(cx, cy, radius * 0.66, 0, Math.PI * 2);
          rCtx.arc(cx, cy, radius * 0.33, 0, Math.PI * 2);
          rCtx.stroke();

          // Radar Grid Lines
          rCtx.beginPath();
          rCtx.moveTo(cx - radius, cy);
          rCtx.lineTo(cx + radius, cy);
          rCtx.moveTo(cx, cy - radius);
          rCtx.lineTo(cx, cy + radius);
          rCtx.stroke();

          // Sweep Line
          radarAngleRef.current = (radarAngleRef.current + 0.04) % (Math.PI * 2);
          const sweepX = cx + Math.cos(radarAngleRef.current) * radius;
          const sweepY = cy + Math.sin(radarAngleRef.current) * radius;

          rCtx.strokeStyle = intrusionAlert ? '#f43f5e' : '#34d399';
          rCtx.lineWidth = 2.5;
          rCtx.beginPath();
          rCtx.moveTo(cx, cy);
          rCtx.lineTo(sweepX, sweepY);
          rCtx.stroke();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    if (isArmGuardActive) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isArmGuardActive, motionSensitivity, audioSensitivity, isSoundAlarmEnabled, intrusionAlert]);

  return (
    <div className="space-y-6">
      {/* Intrusion Alert Screen Overlay */}
      {intrusionAlert && (
        <div className="fixed inset-0 z-50 bg-rose-600/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-pulse">
          <div className="bg-black/90 border-2 border-rose-500 p-8 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-extrabold text-white uppercase font-mono tracking-wider">
              ⚠️ PERIMETER INTRUSION ALARM ⚠️
            </h2>
            <p className="text-xs text-rose-300 font-mono">
              Unauthorised motion or sound detected near your shelter perimeter.
            </p>
            <button
              onClick={() => setIntrusionAlert(false)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl font-mono uppercase text-sm shadow-lg"
            >
              SILENCE ALARM & ACKNOWLEDGE
            </button>
          </div>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${isArmGuardActive ? 'bg-rose-950 border-rose-700 text-rose-500' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
              <ShieldAlert className={`w-8 h-8 ${isArmGuardActive ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 bg-rose-950/80 border border-rose-700/60 text-rose-400 rounded-full text-xs font-mono font-semibold uppercase mb-1">
                PERIMETER SECURITY GUARD v1.0
              </div>
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide uppercase">
                Shelter Perimeter Radar & Motion Tripwire
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 max-w-xl">
                Monitors device camera pixel variances and room audio decibels to detect entry, footsteps, or glass breaking while you sleep.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isArmGuardActive ? (
              <button
                onClick={handleStartArmGuard}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs uppercase font-mono shadow-lg transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                ARM PERIMETER GUARD
              </button>
            ) : (
              <button
                onClick={handleStopArmGuard}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs uppercase font-mono shadow-lg transition flex items-center gap-2 animate-pulse"
              >
                <Unlock className="w-4 h-4" />
                DISARM GUARD
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Sweep & Sensor Canvas (Col 1 & 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold uppercase">
                <Activity className="w-4 h-4 text-emerald-400" />
                Radar Target Display & Sensor Telemetry
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isArmGuardActive 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-700' 
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}>
                {isArmGuardActive ? '● ARMED & ACTIVE' : 'OFFLINE'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Radar Sweeper Canvas */}
              <div className="bg-black border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative aspect-square">
                <canvas ref={radarCanvasRef} width={220} height={220} className="w-full h-full max-w-[220px]" />
                <div className="absolute bottom-2 text-[10px] font-mono text-emerald-400 bg-black/80 px-2 py-0.5 rounded border border-emerald-900">
                  RANGE: 10M PERIMETER
                </div>
              </div>

              {/* Sensor Gauge Meters */}
              <div className="space-y-4">
                {/* Motion Variance Gauge */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5 font-bold uppercase">
                      <Video className="w-4 h-4 text-cyan-400" />
                      Motion Variance
                    </span>
                    <span className={`font-bold ${motionLevel > (100 - motionSensitivity) ? 'text-rose-400' : 'text-cyan-400'}`}>
                      {motionLevel}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-150 ${motionLevel > (100 - motionSensitivity) ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${motionLevel}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                    <span>Threshold: {100 - motionSensitivity}%</span>
                    <span>Sensitivity: {motionSensitivity}%</span>
                  </div>
                </div>

                {/* Audio Noise Gauge */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5 font-bold uppercase">
                      <Mic className="w-4 h-4 text-amber-400" />
                      Audio Decibels
                    </span>
                    <span className={`font-bold ${audioLevel > (100 - audioSensitivity) ? 'text-rose-400' : 'text-amber-400'}`}>
                      {audioLevel} dB
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-150 ${audioLevel > (100 - audioSensitivity) ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                    <span>Threshold: {100 - audioSensitivity} dB</span>
                    <span>Sensitivity: {audioSensitivity}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hidden Stream Canvases */}
            <video ref={videoRef} className="hidden" muted />
            <canvas ref={prevFrameCanvasRef} className="hidden" />
            <canvas ref={currFrameCanvasRef} className="hidden" />
          </div>
        </div>

        {/* Settings & Intrusion Audit Log (Col 3) */}
        <div className="space-y-6">
          {/* Tripwire Sensitivity Adjuster */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-mono text-slate-300 font-bold uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Tripwire Calibration
            </h3>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Motion Sensitivity: {motionSensitivity}%
              </label>
              <input
                type="range"
                min={10}
                max={90}
                value={motionSensitivity}
                onChange={e => setMotionSensitivity(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                Audio Spike Sensitivity: {audioSensitivity}%
              </label>
              <input
                type="range"
                min={10}
                max={90}
                value={audioSensitivity}
                onChange={e => setAudioSensitivity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">Audible Siren Tone</span>
              <button
                onClick={() => setIsSoundAlarmEnabled(!isSoundAlarmEnabled)}
                className={`p-2 rounded-lg border text-xs font-mono ${
                  isSoundAlarmEnabled 
                    ? 'bg-rose-950 text-rose-400 border-rose-800' 
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}
              >
                {isSoundAlarmEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Intrusion Audit Log */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono text-slate-300 font-bold uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400" />
              Intrusion Audit Event Log
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {logs.map(log => (
                <div
                  key={log.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono ${
                    log.severity === 'CRITICAL'
                      ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                      : log.severity === 'HIGH'
                      ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5">
                    <span>{log.time}</span>
                    <span>{log.type}</span>
                  </div>
                  <div>{log.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
