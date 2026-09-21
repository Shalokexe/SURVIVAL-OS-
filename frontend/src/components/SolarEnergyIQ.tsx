import React, { useState } from 'react';
import { Sun, Battery, Zap, AlertTriangle, CheckCircle, Info, ShieldAlert, Cpu, Compass } from 'lucide-react';
import { SolarEnergyIQ as SolarEnergyIQType, SolarLoadDevice } from '../types';
import { calculateClientSolarEnergyIQ } from '../services/standaloneMode';

const DEFAULT_DEVICES: SolarLoadDevice[] = [
  { id: '1', name: 'Tactical VHF/HAM Radio', watts: 15, hours_per_day: 4, enabled: true, category: 'communication' },
  { id: '2', name: 'LED Emergency Lighting', watts: 10, hours_per_day: 5, enabled: true, category: 'lighting' },
  { id: '3', name: 'Mobile / Powerbank Charger', watts: 10, hours_per_day: 3, enabled: true, category: 'gadgets' },
  { id: '4', name: '12V Portable Cooler/Fridge', watts: 40, hours_per_day: 8, enabled: false, category: 'refrigeration' },
  { id: '5', name: 'UV Water Sterilizer Pen', watts: 25, hours_per_day: 1, enabled: true, category: 'medical' },
  { id: '6', name: 'CPAP Medical Machine', watts: 50, hours_per_day: 7, enabled: false, category: 'medical' },
];

export const SolarEnergyIQ: React.FC = () => {
  const [panelWatts, setPanelWatts] = useState<number>(120);
  const [sunHours, setSunHours] = useState<number>(4.5);
  const [batteryAh, setBatteryAh] = useState<number>(100);
  const [batteryVoltage, setBatteryVoltage] = useState<number>(12);
  const [batteryType, setBatteryType] = useState<'lifepo4' | 'agm' | 'gel'>('lifepo4');
  const [devices, setDevices] = useState<SolarLoadDevice[]>(DEFAULT_DEVICES);

  // Solar Panel Tilt Calculator State
  const [latitude, setLatitude] = useState<number>(30);
  const [season, setSeason] = useState<'spring_autumn' | 'summer' | 'winter'>('spring_autumn');
  const [hemisphere, setHemisphere] = useState<'N' | 'S'>('N');

  const optimalTilt = Math.round(
    season === 'summer' ? Math.max(0, latitude - 15) : season === 'winter' ? latitude + 15 : latitude
  );
  const compassDirection = hemisphere === 'N' ? 'TRUE SOUTH (180°)' : 'TRUE NORTH (0°)';

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d));
  };

  const updateHours = (id: string, hours: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, hours_per_day: Math.max(0.5, Math.min(24, hours)) } : d));
  };

  const activeDailyLoadWh = devices
    .filter(d => d.enabled)
    .reduce((sum, d) => sum + (d.watts * d.hours_per_day), 0);

  const energyIQ: SolarEnergyIQType = calculateClientSolarEnergyIQ(
    panelWatts,
    sunHours,
    batteryAh,
    batteryVoltage,
    batteryType,
    activeDailyLoadWh
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-amber-500/30 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <Sun className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                SOLAR ENERGY & BATTERY IQ
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">OFF-GRID TELEMETRY</span>
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Calculate solar panel yields, battery depth of discharge (DoD), and electrical autonomy during multi-day grid blackouts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/60 p-3 rounded-lg border border-slate-700">
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase font-mono">Status</div>
              <div className={`text-sm font-bold flex items-center justify-end gap-1 ${energyIQ.is_sustainable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {energyIQ.is_sustainable ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {energyIQ.is_sustainable ? 'SUSTAINABLE SURPLUS' : 'ENERGY DEFICIT'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Solar Yield */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Daily Solar Harvest</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {energyIQ.daily_solar_generation_wh} <span className="text-xs text-slate-400">Wh/day</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {panelWatts}W array @ {sunHours} peak sun hrs
          </div>
        </div>

        {/* Card 2: Daily Load */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Daily Consumption Load</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {energyIQ.daily_load_wh} <span className="text-xs text-slate-400">Wh/day</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {devices.filter(d => d.enabled).length} active emergency devices
          </div>
        </div>

        {/* Card 3: Usable Storage */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Usable Battery Storage</span>
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {energyIQ.usable_stored_wh} <span className="text-xs text-slate-400">Wh</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {batteryAh}Ah @ {batteryVoltage}V ({batteryType.toUpperCase()} {energyIQ.max_dod_percent}% DoD)
          </div>
        </div>

        {/* Card 4: Autonomy Runway */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-2">
            <span>Zero-Sun Autonomy</span>
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">
            {energyIQ.autonomy_days_zero_sun} <span className="text-xs text-slate-400">Days</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            ~{Math.round(energyIQ.autonomy_hours_zero_sun)} hours backup runtime
          </div>
        </div>
      </div>

      {/* Control Panel & Load Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: System Configuration Controls */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-5">
          <h3 className="text-md font-bold text-slate-200 flex items-center gap-2 border-b border-slate-700 pb-3">
            <Cpu className="w-4 h-4 text-amber-400" /> SYSTEM SPECIFICATIONS
          </h3>

          {/* Panel Wattage */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
              <span>Solar Panel Capacity</span>
              <span className="text-amber-400 font-bold">{panelWatts} Watts</span>
            </label>
            <input
              type="range" min="20" max="1000" step="10"
              value={panelWatts}
              onChange={(e) => setPanelWatts(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-700 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Peak Sun Hours */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
              <span>Daily Peak Sun Hours</span>
              <span className="text-amber-400 font-bold">{sunHours} Hours</span>
            </label>
            <input
              type="range" min="1" max="10" step="0.5"
              value={sunHours}
              onChange={(e) => setSunHours(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-700 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Battery Ah */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex justify-between mb-1.5">
              <span>Battery Bank Capacity</span>
              <span className="text-emerald-400 font-bold">{batteryAh} Ah ({batteryAh * batteryVoltage} Wh)</span>
            </label>
            <input
              type="range" min="20" max="600" step="10"
              value={batteryAh}
              onChange={(e) => setBatteryAh(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-700 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Battery Type & Voltage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">System Voltage</label>
              <select
                value={batteryVoltage}
                onChange={(e) => setBatteryVoltage(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 font-mono"
              >
                <option value={12}>12V DC</option>
                <option value={24}>24V DC</option>
                <option value={48}>48V DC</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Chemistry</label>
              <select
                value={batteryType}
                onChange={(e) => setBatteryType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 font-mono"
              >
                <option value="lifepo4">LiFePO4 (85% DoD)</option>
                <option value="agm">AGM / Lead (50% DoD)</option>
                <option value="gel">Gel (50% DoD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Device Load Simulator & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Device Load Simulator Table */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5">
            <h3 className="text-md font-bold text-slate-200 flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> EMERGENCY DEVICE LOAD BUDGET
              </span>
              <span className="text-xs text-cyan-400 font-mono">Total: {activeDailyLoadWh} Wh/day</span>
            </h3>

            <div className="space-y-3">
              {devices.map(device => (
                <div
                  key={device.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border transition-all ${
                    device.enabled
                      ? 'bg-slate-900/80 border-slate-700 text-slate-200'
                      : 'bg-slate-900/30 border-slate-800/50 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={device.enabled}
                      onChange={() => toggleDevice(device.id)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {device.name}
                        <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">{device.watts}W</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {device.enabled ? `${device.watts * device.hours_per_day} Wh/day` : 'Device Offline'}
                      </div>
                    </div>
                  </div>

                  {device.enabled && (
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <span className="text-xs text-slate-400 font-mono">Runtime:</span>
                      <input
                        type="number" min="0.5" max="24" step="0.5"
                        value={device.hours_per_day}
                        onChange={(e) => updateHours(device.id, Number(e.target.value))}
                        className="w-16 bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 text-center rounded p-1"
                      />
                      <span className="text-xs text-slate-400 font-mono">hrs/day</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Solar Panel Tilt Angle & Orientation Calculator */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" /> SOLAR PANEL TILT ANGLE & ORIENTATION OPTIMIZER
              </span>
              <span className="text-xs text-emerald-400 font-mono">+25% YIELD BOOST</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Your Latitude (°N/S):</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={latitude}
                  onChange={(e) => setLatitude(Math.max(0, Math.min(90, Number(e.target.value))))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-amber-400 font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hemisphere:</label>
                <select
                  value={hemisphere}
                  onChange={(e) => setHemisphere(e.target.value as 'N' | 'S')}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 outline-none"
                >
                  <option value="N">Northern Hemisphere</option>
                  <option value="S">Southern Hemisphere</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Season / Solstice:</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 outline-none"
                >
                  <option value="spring_autumn">Spring / Autumn Equinox</option>
                  <option value="summer">Summer Solstice (-15°)</option>
                  <option value="winter">Winter Solstice (+15°)</option>
                </select>
              </div>
            </div>

            {/* Calculated Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase">RECOMMENDED TILT ANGLE</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{optimalTilt}°</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Tilt up from horizontal ground</span>
              </div>

              <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-lg text-center">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase">FACING COMPASS DIRECTION</span>
                <span className="text-lg font-bold text-cyan-400 font-mono">{compassDirection}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">Point panel faces towards sun</span>
              </div>
            </div>
          </div>

          {/* Telemetry Recommendations & Guidance */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-400" /> SYSTEM ADVISORY & RECOMMENDATIONS
            </h4>
            <div className="space-y-2">
              {energyIQ.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
