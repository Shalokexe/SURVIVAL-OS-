import React, { useState, useEffect } from 'react';
import { 
  Battery, BatteryCharging, ShieldAlert, Bot, MapPin, Droplets, 
  Utensils, CheckSquare, Radio, BookOpen, Heart, Volume2, Sun,
  Settings, Check, LayoutGrid, ArrowLeft
} from 'lucide-react';

interface MinimalistOSProps {
  onLaunchApp: (appId: string) => void;
  onExitMinimalMode: () => void;
  waterDays?: number;
  foodDays?: number;
  readinessScore?: number;
}

interface SurvivalAppItem {
  id: string;
  name: string;
  category: string;
  icon: any;
  pinned: boolean;
}

const DEFAULT_APPS: SurvivalAppItem[] = [
  { id: 'triage', name: 'START TRIAGE & CPR', category: 'MEDICAL', icon: Heart, pinned: true },
  { id: 'water', name: 'WATER IQ CALCULATOR', category: 'SUPPLY', icon: Droplets, pinned: true },
  { id: 'food', name: 'FOOD IQ & RUNWAY', category: 'SUPPLY', icon: Utensils, pinned: true },
  { id: 'vault', name: 'RADIO & ICE VAULT', category: 'COMMS', icon: Radio, pinned: true },
  { id: 'agent', name: 'AI EMERGENCY COPILOT', category: 'INTELLIGENCE', icon: Bot, pinned: true },
  { id: 'tasks', name: 'FIRST 15-MIN TASKS', category: 'TRIAGE', icon: CheckSquare, pinned: true },
  { id: 'map', name: 'SURVIVAL MAP', category: 'GIS', icon: MapPin, pinned: true },
  { id: 'handbook', name: 'OFFLINE MANUALS', category: 'KNOWLEDGE', icon: BookOpen, pinned: false },
];

export const MinimalistOS: React.FC<MinimalistOSProps> = ({
  onLaunchApp,
  onExitMinimalMode,
  waterDays = 5.0,
  foodDays = 15.0,
  readinessScore = 85
}) => {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [apps, setApps] = useState<SurvivalAppItem[]>(() => {
    try {
      const saved = localStorage.getItem('minimal_os_apps');
      return saved ? JSON.parse(saved) : DEFAULT_APPS;
    } catch {
      return DEFAULT_APPS;
    }
  });
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState<boolean>(false);

  // Battery API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    }
  }, []);

  const togglePinApp = (id: string) => {
    const updated = apps.map(app => app.id === id ? { ...app, pinned: !app.pinned } : app);
    setApps(updated);
    try {
      localStorage.setItem('minimal_os_apps', JSON.stringify(updated));
    } catch {}
  };

  const pinnedApps = apps.filter(a => a.pinned);

  if (isFlashlightOn) {
    return (
      <div 
        onClick={() => setIsFlashlightOn(false)}
        className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <span className="text-black font-mono font-bold text-xs bg-slate-200 px-4 py-2 rounded-full shadow">
          EMERGENCY WHITE SCREEN FLASHLIGHT // TAP ANYWHERE TO EXIT
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-400 font-mono flex flex-col justify-between p-4 sm:p-6 select-none animate-fadeIn">
      {/* Top Telemetry Bar */}
      <header className="border-b border-amber-950/80 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping" />
          <div>
            <div className="text-sm font-black tracking-wider text-amber-300">
              MINIMAL CRISIS OS
            </div>
            <div className="text-[10px] text-amber-600">
              0-LUX OLED BATTERY SAVER MODE
            </div>
          </div>
        </div>

        {/* Battery & Power Telemetry */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-800/40 rounded text-xs">
            {isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            ) : (
              <Battery className="w-4 h-4 text-amber-400" />
            )}
            <span className="font-bold">{batteryLevel !== null ? `${batteryLevel}%` : 'PWR OK'}</span>
          </div>

          <button
            onClick={onExitMinimalMode}
            className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded hover:bg-slate-800 transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>FULL HUD</span>
          </button>
        </div>
      </header>

      {/* Main Apps Matrix */}
      <main className="py-6 space-y-6 max-w-4xl mx-auto w-full">
        {/* Vital Quick Numbers */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-amber-950/80 bg-black p-3 rounded text-center">
            <span className="text-[10px] text-amber-600 block">WATER RUNWAY</span>
            <span className="text-base font-bold text-amber-300">{waterDays} DAYS</span>
          </div>
          <div className="border border-amber-950/80 bg-black p-3 rounded text-center">
            <span className="text-[10px] text-amber-600 block">FOOD RUNWAY</span>
            <span className="text-base font-bold text-amber-300">{foodDays} DAYS</span>
          </div>
          <div className="border border-amber-950/80 bg-black p-3 rounded text-center">
            <span className="text-[10px] text-amber-600 block">READINESS</span>
            <span className="text-base font-bold text-amber-300">{readinessScore}/100</span>
          </div>
        </div>

        {/* Apps Header & Customize Toggle */}
        <div className="flex items-center justify-between border-b border-amber-950/80 pb-2">
          <span className="text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>PINNED SURVIVAL APPS ({pinnedApps.length})</span>
          </span>
          <button
            onClick={() => setIsConfiguring(!isConfiguring)}
            className="text-[11px] text-amber-600 hover:text-amber-300 flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>{isConfiguring ? 'DONE' : 'CHOOSE APPS'}</span>
          </button>
        </div>

        {/* Customization Drawer */}
        {isConfiguring && (
          <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-lg space-y-3">
            <span className="text-xs text-amber-400 block font-bold">SELECT APPS FOR MINIMAL HOMESCREEN:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {apps.map(app => (
                <button
                  key={app.id}
                  onClick={() => togglePinApp(app.id)}
                  className={`p-2.5 rounded border text-left text-xs flex items-center justify-between ${
                    app.pinned
                      ? 'bg-amber-950/60 border-amber-600 text-amber-300'
                      : 'bg-black border-slate-900 text-slate-600'
                  }`}
                >
                  <span className="truncate">{app.name}</span>
                  {app.pinned && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pinned App Launch Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pinnedApps.map(app => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => onLaunchApp(app.id)}
                className="border border-amber-900/60 bg-black hover:bg-amber-950/30 p-4 rounded-lg text-left flex items-center justify-between transition-all group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-amber-800/50 rounded bg-amber-950/30 text-amber-400 group-hover:text-amber-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-amber-300 group-hover:text-amber-200">
                      {app.name}
                    </div>
                    <span className="text-[10px] text-amber-700 block mt-0.5">
                      CATEGORY: {app.category}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-amber-600 group-hover:text-amber-400">
                  OPEN →
                </span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Emergency Quick Tool Strip */}
      <footer className="border-t border-amber-950/80 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlashlightOn(true)}
            className="px-3 py-2 bg-amber-950/40 border border-amber-700/60 text-amber-300 rounded flex items-center gap-1.5 hover:bg-amber-900/50 transition-all"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>FLASHLIGHT SCREEN</span>
          </button>
          <button
            onClick={() => onLaunchApp('vault')}
            className="px-3 py-2 bg-amber-950/40 border border-amber-700/60 text-amber-300 rounded flex items-center gap-1.5 hover:bg-amber-900/50 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>SOS FREQUENCIES</span>
          </button>
        </div>

        <span className="text-[10px] text-amber-700">
          SURVIVAL-OS // MINIMAL POWER RUNTIME MODE
        </span>
      </footer>
    </div>
  );
};
