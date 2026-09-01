import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, Camera, Mic, Film, Sparkles, ShieldAlert, Award, Calendar, 
  CheckCircle, Play, Pause, Trash2, Download, Plus, Zap, AlertTriangle, 
  Layers, Upload, RefreshCw, Eye, EyeOff, Radio, Heart, Droplets, Sun, BookOpen, Square
} from 'lucide-react';
import { SurvivorLogEntry, SurvivalAchievement } from '../types';
import { DEFAULT_SURVIVOR_LOGS, DEFAULT_ACHIEVEMENTS, generateAIDebriefForLog, getStorageItem, setStorageItem } from '../services/standaloneMode';

interface SurvivorChroniclesProps {
  onBonusEarned?: (bonusPoints: number) => void;
}

export const SurvivorChronicles: React.FC<SurvivorChroniclesProps> = ({ onBonusEarned }) => {
  // Navigation sub-tab inside Chronicles
  const [activeSubTab, setActiveSubTab] = useState<'studio' | 'create' | 'timeline' | 'badges'>('timeline');

  // Logs and Badges State
  const [logs, setLogs] = useState<SurvivorLogEntry[]>(() => {
    return getStorageItem<SurvivorLogEntry[]>('survival_chronicles_logs', DEFAULT_SURVIVOR_LOGS);
  });
  const [achievements, setAchievements] = useState<SurvivalAchievement[]>(() => {
    return getStorageItem<SurvivalAchievement[]>('survival_chronicles_achievements', DEFAULT_ACHIEVEMENTS);
  });

  // Filter state for timeline
  const [filterType, setFilterType] = useState<'all' | 'vlog' | 'photo' | 'audio' | 'text'>('all');
  const [selectedLog, setSelectedLog] = useState<SurvivorLogEntry | null>(null);

  // New Log Entry Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLogType, setNewLogType] = useState<'vlog' | 'photo' | 'audio' | 'text'>('vlog');
  const [mediaDataUrl, setMediaDataUrl] = useState<string>('');
  const [learnedModuleIds, setLearnedModuleIds] = useState<string[]>(['water']);
  const [skillsSummary, setSkillsSummary] = useState('');
  const [mood, setMood] = useState<'DETERMINED' | 'EXHAUSTED' | 'TACTICAL' | 'OPTIMISTIC' | 'CAUTIOUS'>('DETERMINED');
  const [weatherCondition, setWeatherCondition] = useState('CLEAR / 26°C');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiDebriefResult, setAiDebriefResult] = useState<{ debrief: string; bonus: number } | null>(null);

  // Camera / Studio state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isNightVision, setIsNightVision] = useState(false);
  const [isCRTOverlay, setIsCRTOverlay] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Audio Recording state
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Calculate stats
  const totalDaysLogged = new Set(logs.map(l => l.day_number)).size;
  const currentStreak = calculateStreak(logs);
  const totalPreparednessEarned = logs.reduce((acc, curr) => acc + (curr.preparedness_bonus || 0), 0);

  function calculateStreak(logsList: SurvivorLogEntry[]): number {
    if (logsList.length === 0) return 0;
    return Math.min(14, logsList.length);
  }

  // Save logs to local storage
  useEffect(() => {
    setStorageItem('survival_chronicles_logs', logs);
  }, [logs]);

  // Save achievements to local storage
  useEffect(() => {
    setStorageItem('survival_chronicles_achievements', achievements);
  }, [achievements]);

  // Handle Camera initialization
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera stream error or permission denied:', err);
      alert('Camera access unavailable or blocked. You can still upload video/photo files or use simulated capture mode.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  // Video recording logic
  const startVideoRecording = () => {
    if (!streamRef.current) {
      alert('Please activate live camera first or upload a video file!');
      return;
    }
    recordedChunksRef.current = [];
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setMediaDataUrl(url);
        setNewLogType('vlog');
        alert('Video Vlog captured successfully! Proceeding to reflection log.');
        setActiveSubTab('create');
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordSeconds(0);
    } catch (e) {
      console.error('MediaRecorder error:', e);
      alert('Video recording not supported on this browser context. You can use photo snapshot or file upload.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Timer for video recording
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => setRecordSeconds(prev => prev + 1), 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Photo Snapshot logic
  const takePhotoSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Burn tactical watermark into photo
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(`SURVIVAL OS - DAY ${totalDaysLogged + 1}`, 20, 40);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px monospace';
        ctx.fillText(`STAMP: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`, 20, 65);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setMediaDataUrl(dataUrl);
        setNewLogType('photo');
        alert('Tactical Snapshot Captured! Proceeding to detail reflection form.');
        setActiveSubTab('create');
      }
    } else {
      // Fallback demo snapshot image
      const demoUrl = 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80';
      setMediaDataUrl(demoUrl);
      setNewLogType('photo');
      alert('Simulated Tactical Photo Captured! Proceeding to reflection form.');
      setActiveSubTab('create');
    }
  };

  // Handle audio note recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMediaDataUrl(url);
        setNewLogType('audio');
        alert('Voice Note Recorded! Proceeding to reflection detail.');
        setActiveSubTab('create');
      };
      mediaRecorder.start();
      audioRecorderRef.current = mediaRecorder;
      setIsAudioRecording(true);
      setAudioSeconds(0);
    } catch (err) {
      alert('Microphone access blocked or unavailable. You can upload an audio file directly.');
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorderRef.current && isAudioRecording) {
      audioRecorderRef.current.stop();
      setIsAudioRecording(false);
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isAudioRecording) {
      timer = setInterval(() => setAudioSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isAudioRecording]);

  // Handle File Upload Fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setMediaDataUrl(result);
      if (file.type.startsWith('video/')) setNewLogType('vlog');
      else if (file.type.startsWith('image/')) setNewLogType('photo');
      else if (file.type.startsWith('audio/')) setNewLogType('audio');
      alert(`Media file uploaded (${file.name})! Proceeding to detail reflection.`);
      setActiveSubTab('create');
    };
    reader.readAsDataURL(file);
  };

  // Module toggle for new log creation
  const toggleModuleSelection = (id: string) => {
    if (learnedModuleIds.includes(id)) {
      if (learnedModuleIds.length > 1) {
        setLearnedModuleIds(learnedModuleIds.filter(m => m !== id));
      }
    } else {
      setLearnedModuleIds([...learnedModuleIds, id]);
    }
  };

  // Run AI Debrief & Save Entry
  const handleRunAIDebriefAndSave = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please enter a Title and Daily Notes story for your log.');
      return;
    }

    setIsAnalyzingAI(true);
    setTimeout(() => {
      const moduleNames = learnedModuleIds.map(m => {
        switch (m) {
          case 'water': return 'Water IQ & Filtration';
          case 'triage': return 'CPR & Trauma Triage';
          case 'solar': return 'Solar Energy IQ';
          case 'vault': return 'Radio Frequencies & Comms';
          case 'signals': return 'Ground Signaling';
          default: return 'Survival Handbook';
        }
      });

      const { debrief, bonus } = generateAIDebriefForLog(newContent, moduleNames, mood);
      setAiDebriefResult({ debrief, bonus });
      setIsAnalyzingAI(false);

      // Create log entry object
      const nextDayNum = totalDaysLogged + 1;
      const newEntry: SurvivorLogEntry = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString(),
        day_number: nextDayNum,
        title: newTitle,
        content: newContent,
        log_type: newLogType,
        media_url: mediaDataUrl || (newLogType === 'vlog' ? 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-on-a-road-in-a-forest-41165-large.mp4' : undefined),
        learned_module_ids: learnedModuleIds,
        learned_skills_summary: skillsSummary || `Practiced ${moduleNames.join(', ')} survival protocols.`,
        ai_debrief: debrief,
        preparedness_bonus: bonus,
        mood: mood,
        weather_condition: weatherCondition,
        location_stamp: 'SHELTER ALPHA (31.3260°N, 75.5762°E)'
      };

      setLogs([newEntry, ...logs]);
      if (onBonusEarned) onBonusEarned(bonus);

      // Check achievement unlocks
      const updatedAchievements = achievements.map(ach => {
        if (ach.id === 'ach-1' && !ach.is_unlocked) {
          return { ...ach, is_unlocked: true, unlocked_at: new Date().toISOString() };
        }
        if (ach.id === 'ach-2' && logs.length + 1 >= 7 && !ach.is_unlocked) {
          return { ...ach, is_unlocked: true, unlocked_at: new Date().toISOString() };
        }
        if (ach.id === 'ach-3' && learnedModuleIds.includes('triage') && !ach.is_unlocked) {
          return { ...ach, is_unlocked: true, unlocked_at: new Date().toISOString() };
        }
        return ach;
      });
      setAchievements(updatedAchievements);

      // Reset form
      setNewTitle('');
      setNewContent('');
      setMediaDataUrl('');
      setSkillsSummary('');

      alert(`Log Entry Saved! AI Tactical Debrief completed. Unlocked +${bonus}% Preparedness EXP!`);
      setActiveSubTab('timeline');
    }, 900);
  };

  // Delete entry
  const handleDeleteLog = (id: string) => {
    if (confirm('Are you sure you want to delete this survival vlog entry?')) {
      setLogs(logs.filter(l => l.id !== id));
      if (selectedLog?.id === id) setSelectedLog(null);
    }
  };

  // Filter logs for display
  const filteredLogs = logs.filter(l => filterType === 'all' || l.log_type === filterType);

  const availableModules = [
    { id: 'water', label: 'Water IQ & Filtration', icon: Droplets, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50' },
    { id: 'triage', label: 'CPR & First Aid Triage', icon: Heart, color: 'text-rose-400 bg-rose-950/60 border-rose-700/50' },
    { id: 'solar', label: 'Solar Energy & Power', icon: Sun, color: 'text-amber-400 bg-amber-950/60 border-amber-700/50' },
    { id: 'vault', label: 'Radio Frequencies & Comms', icon: Radio, color: 'text-emerald-400 bg-emerald-700/50 border-emerald-700/50' },
    { id: 'signals', label: 'Visual Signal Flares', icon: Eye, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-700/50' },
    { id: 'handbook', label: 'Handbook & Rigging Knots', icon: BookOpen, color: 'text-purple-400 bg-purple-950/60 border-purple-700/50' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Doomsday Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-[#131b2b] to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Film className="w-64 h-64 text-rose-500" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-950/70 border border-rose-700/60 text-rose-400 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mb-2">
              <Film className="w-3.5 h-3.5 animate-pulse" />
              DOOMSDAY CHRONICLES & DAILY VLOGS
            </div>
            <h1 className="text-3xl font-heading font-extrabold text-white tracking-wide uppercase">
              Survivor Journey & Video Journal
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Record daily video vlogs, photo snapshots, and audio logs of your survival challenge. Document critical lessons learned from SurvivalOS modules, execute AI tactical debriefs, and build your doomsday chronicle archive.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveSubTab('studio');
                startCamera();
              }}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-rose-950/60"
            >
              <Video className="w-4 h-4" />
              Open Camera Studio
            </button>
            <button
              onClick={() => setActiveSubTab('create')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium rounded-xl text-sm transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              New Journal Entry
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-rose-950/60 text-rose-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Days Logged</div>
              <div className="text-xl font-bold font-mono text-white">{totalDaysLogged} Days</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-amber-950/60 text-amber-400 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Active Streak</div>
              <div className="text-xl font-bold font-mono text-white">{currentStreak} Days 🔥</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/60 text-emerald-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Preparedness Bonus</div>
              <div className="text-xl font-bold font-mono text-white">+{totalPreparednessEarned}% EXP</div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/60 text-cyan-400 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono uppercase">Badges Unlocked</div>
              <div className="text-xl font-bold font-mono text-white">
                {achievements.filter(a => a.is_unlocked).length} / {achievements.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeSubTab === 'timeline'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Film className="w-4 h-4" />
            Doomsday Timeline ({logs.length})
          </button>

          <button
            onClick={() => {
              setActiveSubTab('studio');
              if (!isCameraActive) startCamera();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeSubTab === 'studio'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            Tactical Camera Studio
          </button>

          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeSubTab === 'create'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            Reflection Form
          </button>

          <button
            onClick={() => setActiveSubTab('badges')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              activeSubTab === 'badges'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Milestones & Badges
          </button>
        </div>
      </div>

      {/* VIEW 1: TACTICAL CAMERA STUDIO */}
      {activeSubTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-2xl">
              {/* Studio Canvas / Video Container */}
              <div className={`relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 ${isNightVision ? 'brightness-125 contrast-125 saturate-200 sepia hue-rotate-90' : ''}`}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* CRT Scanline & HUD Overlay */}
                {isCRTOverlay && (
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />
                )}

                {/* Tactical HUD Markers */}
                <div className="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between text-xs font-mono text-rose-500">
                  <div className="flex items-center justify-between bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-rose-950/60">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`} />
                      <span className="font-bold text-white tracking-widest uppercase">
                        {isRecording ? `REC ● 00:${recordSeconds.toString().padStart(2, '0')}` : 'LIVE TACTICAL STREAM'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                      <span>RAD: 0.12 μSv/h</span>
                      <span>BATT: 94% ⚡</span>
                      <span>GRID: 31.3260°N, 75.5762°E</span>
                    </div>
                  </div>

                  {/* Corner Crosshairs */}
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] text-slate-400 bg-black/60 px-2 py-1 rounded">
                      FPS: 60.0 | RES: 1080p | ENCODING: WEBM
                    </div>
                    <div className="text-right text-[10px] text-rose-400 bg-black/60 px-2 py-1 rounded font-bold">
                      DOOMSDAY CHRONICLE HUD v2.4
                    </div>
                  </div>
                </div>
              </div>

              {/* Studio Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 shadow"
                    >
                      <Video className="w-4 h-4" />
                      Start Camera Stream
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                    >
                      <Video className="w-4 h-4 text-rose-400" />
                      Stop Camera
                    </button>
                  )}

                  <button
                    onClick={() => setIsNightVision(!isNightVision)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                      isNightVision
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Night Vision
                  </button>

                  <button
                    onClick={() => setIsCRTOverlay(!isCRTOverlay)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                      isCRTOverlay
                        ? 'bg-rose-950 border-rose-700 text-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    CRT Overlay
                  </button>
                </div>

                {/* Primary Recording Buttons */}
                <div className="flex items-center gap-2">
                  {!isRecording ? (
                    <button
                      onClick={startVideoRecording}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-950/60"
                    >
                      <Film className="w-4 h-4" />
                      Record Vlog Video
                    </button>
                  ) : (
                    <button
                      onClick={stopVideoRecording}
                      className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-xl text-xs flex items-center gap-2 animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-current" />
                      Stop & Save Vlog (00:{recordSeconds.toString().padStart(2, '0')})
                    </button>
                  )}

                  <button
                    onClick={takePhotoSnapshot}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    Snap Photo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Voice Memo & File Upload Sidebar */}
          <div className="space-y-4">
            {/* Audio Voice Note Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
                  <Mic className="w-4 h-4" />
                  Voice Audio Recorder
                </div>
                {isAudioRecording && (
                  <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full font-mono animate-pulse">
                    REC ● 00:{audioSeconds.toString().padStart(2, '0')}
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Record a hands-free audio voice memo if video stream bandwidth or battery is low.
              </p>

              {!isAudioRecording ? (
                <button
                  onClick={startAudioRecording}
                  className="w-full py-2.5 bg-amber-600/90 hover:bg-amber-500 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 shadow"
                >
                  <Mic className="w-4 h-4" />
                  Start Recording Voice Note
                </button>
              ) : (
                <button
                  onClick={stopAudioRecording}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 animate-pulse"
                >
                  <Pause className="w-4 h-4" />
                  Stop Voice Note & Attach
                </button>
              )}
            </div>

            {/* Media File Attachment Fallback */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase font-bold">
                <Upload className="w-4 h-4" />
                Upload Media File (Offline Fallback)
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Upload existing MP4, WEBM, JPG, or WAV recordings directly from your device storage.
              </p>

              <label className="w-full py-3 bg-slate-950 border border-dashed border-slate-700 hover:border-cyan-500 text-slate-300 rounded-xl cursor-pointer flex flex-col items-center justify-center gap-1 transition">
                <Upload className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-medium">Select Video / Photo / Audio</span>
                <span className="text-[10px] text-slate-500 font-mono">Supports MP4, WEBM, JPG, PNG, MP3</span>
                <input
                  type="file"
                  accept="video/*,image/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: NEW REFLECTION & MODULE JOURNAL FORM */}
      {activeSubTab === 'create' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-500" />
                Document Daily Journey & Survival Learnings
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Day {totalDaysLogged + 1} Survival Challenge Record
              </p>
            </div>
            {mediaDataUrl && (
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-full text-xs font-mono">
                ✓ Media Attached ({newLogType.toUpperCase()})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Journal Entry Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Day 3: Secured Rainwater & Solar Panel Angle Alignment"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">Survivor Psychological State (Mood)</label>
              <select
                value={mood}
                onChange={(e: any) => setMood(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="DETERMINED">DETERMINED - Focused & Calm</option>
                <option value="TACTICAL">TACTICAL - High Readiness Alert</option>
                <option value="EXHAUSTED">EXHAUSTED - Physical Fatigue</option>
                <option value="CAUTIOUS">CAUTIOUS - Elevated Threat Awareness</option>
                <option value="OPTIMISTIC">OPTIMISTIC - Morale Rising</option>
              </select>
            </div>
          </div>

          {/* Module Tagging Selection */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
              Select SurvivalOS Modules Practiced/Learned Today:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {availableModules.map((mod) => {
                const isSelected = learnedModuleIds.includes(mod.id);
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleModuleSelection(mod.id)}
                    className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? mod.color + ' ring-1 ring-rose-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Icon className="w-4 h-4" />
                      <span>{mod.label}</span>
                    </div>
                    {isSelected && <CheckCircle className="w-4 h-4 text-rose-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learnings & Story Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Key Survival Takeaways & Skill Mastery Notes
              </label>
              <textarea
                rows={2}
                value={skillsSummary}
                onChange={(e) => setSkillsSummary(e.target.value)}
                placeholder="What new techniques did you practice from our app today? (e.g., 2 drops bleach per liter, CPR 30:2 ratio)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5">
                Full Doomsday Story & Journal Log Notes
              </label>
              <textarea
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Describe your day, challenges faced, resource rationing, or shelter observations..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* AI Debrief & Save Trigger */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setActiveSubTab('timeline')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isAnalyzingAI}
              onClick={handleRunAIDebriefAndSave}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-rose-950/60 disabled:opacity-50"
            >
              {isAnalyzingAI ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-200" />
                  Running AI Tactical Debrief...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Trigger AI Debrief & Save Log Entry (+EXP)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: DOOMSDAY JOURNEY TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-semibold px-2">Filter Logs:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filterType === 'all' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                All Entries ({logs.length})
              </button>
              <button
                onClick={() => setFilterType('vlog')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  filterType === 'vlog' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                Vlogs
              </button>
              <button
                onClick={() => setFilterType('photo')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  filterType === 'photo' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Photos
              </button>
              <button
                onClick={() => setFilterType('audio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                  filterType === 'audio' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                Voice Notes
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Showing {filteredLogs.length} Doomsday Journal Records
            </div>
          </div>

          {/* Timeline Cards Grid */}
          {filteredLogs.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300 uppercase">No Survival Logs Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start your survival journey by capturing a daily vlog or recording your module reflections.
              </p>
              <button
                onClick={() => {
                  setActiveSubTab('studio');
                  startCamera();
                }}
                className="px-4 py-2 bg-rose-600 text-white font-medium rounded-xl text-xs inline-flex items-center gap-2 mt-2"
              >
                <Video className="w-4 h-4" />
                Open Camera Studio
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl transition flex flex-col justify-between group"
                >
                  {/* Card Media Preview */}
                  <div className="relative aspect-video bg-slate-950 border-b border-slate-800 overflow-hidden">
                    {log.log_type === 'vlog' && log.media_url ? (
                      <video
                        src={log.media_url}
                        controls={false}
                        poster={log.thumbnail_url}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : log.log_type === 'photo' && log.media_url ? (
                      <img
                        src={log.media_url}
                        alt={log.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 to-slate-900 text-slate-500 p-6">
                        <Mic className="w-10 h-10 text-amber-500 mb-2 animate-bounce" />
                        <span className="text-xs font-mono text-slate-400 font-bold uppercase">AUDIO VOICE NOTE</span>
                      </div>
                    )}

                    {/* Overlay Day Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-rose-600/60 px-3 py-1 rounded-lg text-rose-400 font-mono text-xs font-bold">
                      DAY {log.day_number} SURVIVED
                    </div>

                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-slate-300 font-mono text-[11px] uppercase">
                      {log.mood}
                    </div>

                    <button
                      onClick={() => setSelectedLog(log)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-medium text-xs bg-rose-950/40 backdrop-blur-sm"
                    >
                      <Play className="w-8 h-8 p-1.5 bg-rose-600 rounded-full" />
                      Play & Inspect Entry
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                        <span>+{log.preparedness_bonus}% EXP</span>
                      </div>
                      <h3 className="text-base font-heading font-bold text-white leading-snug line-clamp-1">
                        {log.title}
                      </h3>
                      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mt-1.5">
                        {log.content}
                      </p>
                    </div>

                    {/* Modules Learned Tags */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {log.learned_module_ids.map(modId => (
                          <span key={modId} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 rounded text-[10px] font-mono uppercase">
                            #{modId}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-slate-600 hover:text-rose-400 transition p-1"
                        title="Delete Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: SURVIVOR ACHIEVEMENTS & MILESTONES */}
      {activeSubTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition relative overflow-hidden flex items-start gap-4 ${
                  ach.is_unlocked
                    ? 'bg-slate-900/90 border-emerald-600/50 shadow-lg shadow-emerald-950/20'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div className={`p-3 rounded-xl ${ach.is_unlocked ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60' : 'bg-slate-900 text-slate-600'}`}>
                  <Award className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                    {ach.is_unlocked && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{ach.description}</p>
                  {ach.unlocked_at && (
                    <div className="text-[10px] text-slate-500 font-mono pt-1">
                      Unlocked: {new Date(ach.unlocked_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLAYBACK & INSPECT MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-rose-500 uppercase font-bold">
                  DAY {selectedLog.day_number} SURVIVAL LOG PLAYBACK
                </span>
                <h2 className="text-xl font-heading font-bold text-white">{selectedLog.title}</h2>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono"
              >
                CLOSE [ESC]
              </button>
            </div>

            {/* Media Player */}
            {selectedLog.log_type === 'vlog' && selectedLog.media_url ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                <video src={selectedLog.media_url} controls autoPlay className="w-full h-full object-contain" />
              </div>
            ) : selectedLog.log_type === 'photo' && selectedLog.media_url ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                <img src={selectedLog.media_url} alt={selectedLog.title} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-2">
                <Mic className="w-10 h-10 text-amber-500 mx-auto" />
                <div className="text-xs font-mono text-slate-300">VOICE MEMO AUDIO RECORDING</div>
                {selectedLog.media_url && <audio src={selectedLog.media_url} controls className="mx-auto mt-2" />}
              </div>
            )}

            {/* AI Command Debrief Section */}
            {selectedLog.ai_debrief && (
              <div className="p-4 bg-slate-950 border border-rose-900/50 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  AI Command Tactical Debrief
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-mono">
                  {selectedLog.ai_debrief}
                </p>
              </div>
            )}

            {/* Story Text */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase">Daily Survivor Log Notes</h4>
              <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {selectedLog.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
