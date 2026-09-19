import React, { useState } from 'react';
import { 
  MapPin, Compass, Mountain, AlertCircle, Clock, 
  Flame, ShieldAlert, CheckCircle2, ChevronRight, Plus, Trash2, Download, Navigation, Shield, Award 
} from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  distanceKm: number;
  elevationGainM: number;
  hazardLevel: 'LOW' | 'MODERATE' | 'HIGH';
  hazardType: 'LOWLAND_FLOOD' | 'STEEP_SLOPE' | 'BRIDGE_BOTTLENECK' | 'CLEAR_PATH';
  notes: string;
}

interface RoutePreset {
  name: string;
  description: string;
  waypoints: Waypoint[];
  gearWeightKg: number;
}

export const RoutePlannerIQ: React.FC = () => {
  const PRESET_ROUTES: RoutePreset[] = [
    {
      name: '⛰️ Mountain Ridge Evacuation',
      description: 'Primary high-elevation escape from urban valley to inland alpine shelter',
      gearWeightKg: 18,
      waypoints: [
        { id: '1', name: 'Home Base (Sector 4)', distanceKm: 0, elevationGainM: 0, hazardLevel: 'LOW', hazardType: 'CLEAR_PATH', notes: 'Rally point & inventory check' },
        { id: '2', name: 'River Bridge Crossing', distanceKm: 3.5, elevationGainM: 40, hazardLevel: 'HIGH', hazardType: 'BRIDGE_BOTTLENECK', notes: 'High risk choke point if flooded or blocked' },
        { id: '3', name: 'Pine Forest Trailhead', distanceKm: 7.0, elevationGainM: 210, hazardLevel: 'MODERATE', hazardType: 'STEEP_SLOPE', notes: 'Dense cover, switchback inclines' },
        { id: '4', name: 'Highlands Eagle Shelter', distanceKm: 12.5, elevationGainM: 480, hazardLevel: 'LOW', hazardType: 'CLEAR_PATH', notes: 'Final rendezvous point with fresh spring' }
      ]
    },
    {
      name: '🌊 Coastal Tsunami Sprint',
      description: 'Rapid ascent from shoreline zone to 200m+ emergency high ground',
      gearWeightKg: 10,
      waypoints: [
        { id: '1', name: 'Coastal Outpost', distanceKm: 0, elevationGainM: 0, hazardLevel: 'LOW', hazardType: 'CLEAR_PATH', notes: 'Coastal ground zero' },
        { id: '2', name: 'Downtown Highway Overpass', distanceKm: 1.8, elevationGainM: 35, hazardLevel: 'MODERATE', hazardType: 'BRIDGE_BOTTLENECK', notes: 'Traffic congestion hazard' },
        { id: '3', name: 'Reservoir Hill Summit', distanceKm: 4.2, elevationGainM: 220, hazardLevel: 'LOW', hazardType: 'CLEAR_PATH', notes: 'Safe tsunami evacuation horizon' }
      ]
    }
  ];

  const [waypoints, setWaypoints] = useState<Waypoint[]>(PRESET_ROUTES[0].waypoints);
  const [gearWeightKg, setGearWeightKg] = useState<number>(18);
  const [baseSpeedKmH, setBaseSpeedKmH] = useState<number>(4.5);
  const [newPointName, setNewPointName] = useState<string>('');
  const [newPointDistance, setNewPointDistance] = useState<number>(3.0);
  const [newPointElev, setNewPointElev] = useState<number>(120);
  const [newPointHazard, setNewPointHazard] = useState<Waypoint['hazardType']>('STEEP_SLOPE');

  // Naismith's Rule Calculation Logic
  const totalDistanceKm = waypoints.reduce((acc, wp) => acc + wp.distanceKm, 0);
  const totalElevationM = waypoints.reduce((acc, wp) => acc + wp.elevationGainM, 0);

  // Naismith's Rule: Base time = Distance / Speed + (10 mins per 100m elevation gain)
  const baseWalkHours = totalDistanceKm / baseSpeedKmH;
  const elevationPenaltyHours = (totalElevationM / 100) * (10 / 60);

  // Pack weight multiplier
  let weightFactor = 1.0;
  if (gearWeightKg > 25) weightFactor = 1.35;
  else if (gearWeightKg > 15) weightFactor = 1.18;
  else if (gearWeightKg > 10) weightFactor = 1.08;

  const adjustedTotalHours = (baseWalkHours + elevationPenaltyHours) * weightFactor;
  const hours = Math.floor(adjustedTotalHours);
  const minutes = Math.round((adjustedTotalHours - hours) * 60);

  // Calorie Burn Estimate (~450 kcal/hr baseline + gear weight bonus)
  const estimatedCalories = Math.round(adjustedTotalHours * (420 + gearWeightKg * 8));

  // Average slope percentage
  const avgSlopePercent = totalDistanceKm > 0 ? Math.round(((totalElevationM) / (totalDistanceKm * 1000)) * 100) : 0;

  const addWaypoint = () => {
    if (!newPointName.trim()) return;
    const newWp: Waypoint = {
      id: Date.now().toString(),
      name: newPointName,
      distanceKm: newPointDistance,
      elevationGainM: newPointElev,
      hazardLevel: newPointHazard === 'CLEAR_PATH' ? 'LOW' : newPointHazard === 'STEEP_SLOPE' ? 'MODERATE' : 'HIGH',
      hazardType: newPointHazard,
      notes: 'Custom emergency checkpoint'
    };
    setWaypoints([...waypoints, newWp]);
    setNewPointName('');
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const loadPreset = (preset: RoutePreset) => {
    setWaypoints(preset.waypoints);
    setGearWeightKg(preset.gearWeightKg);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
                <Navigation className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                  EVACUATION ROUTE & TERRAIN PLANNER <span className="text-xs px-2 py-0.5 bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 rounded">NAISMITH MATH</span>
                </h2>
                <p className="text-slate-400 text-sm">
                  Calculates real walking time, elevation slope drag, pack weight fatigue, and route bottleneck hazards offline.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {PRESET_ROUTES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(preset)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Telemetry Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">TOTAL TRANSIT DISTANCE</span>
          <span className="text-2xl md:text-3xl font-bold font-mono text-cyan-400">
            {totalDistanceKm.toFixed(1)} <span className="text-sm font-normal text-slate-500">km</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">NAISMITH TIME (EST.)</span>
          <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
            {hours}h {minutes}m
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">TOTAL ELEVATION ASCENT</span>
          <span className="text-2xl md:text-3xl font-bold font-mono text-amber-400">
            +{totalElevationM} <span className="text-sm font-normal text-slate-500">m</span>
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-xs text-slate-400 font-semibold block mb-1">CALORIC EXPENDITURE</span>
          <span className="text-2xl md:text-3xl font-bold font-mono text-rose-400">
            {estimatedCalories} <span className="text-sm font-normal text-slate-500">kcal</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Waypoints List & Route Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Checkpoint Sequence Manifest */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Evacuation Route Checkpoint Manifest ({waypoints.length} Leg Points)
            </h3>
            <span className={`text-xs px-2.5 py-1 font-mono rounded ${avgSlopePercent > 12 ? 'bg-rose-950 text-rose-400 border border-rose-800/40' : 'bg-slate-800 text-slate-400'}`}>
              AVG SLOPE: {avgSlopePercent}%
            </span>
          </div>

          <div className="space-y-3">
            {waypoints.map((wp, index) => (
              <div 
                key={wp.id} 
                className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:border-slate-700"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {wp.name}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        wp.hazardLevel === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800/40' :
                        wp.hazardLevel === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800/40' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                      }`}>
                        {wp.hazardType.replace('_', ' ')}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{wp.notes}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">LEG DISTANCE</span>
                    <span className="text-cyan-400 font-bold">+{wp.distanceKm} km</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">ELEVATION</span>
                    <span className="text-amber-400 font-bold">+{wp.elevationGainM} m</span>
                  </div>

                  <button
                    onClick={() => removeWaypoint(wp.id)}
                    className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Waypoint Form */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              + Add Custom Evacuation Waypoint:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Checkpoint Name..."
                value={newPointName}
                onChange={(e) => setNewPointName(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-2 rounded focus:border-emerald-500 outline-none"
              />

              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="0.5"
                  placeholder="Dist (km)"
                  value={newPointDistance}
                  onChange={(e) => setNewPointDistance(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-cyan-400 text-xs px-2 py-2 rounded w-full outline-none"
                />
                <span className="text-xs text-slate-500">km</span>
              </div>

              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  step="10"
                  placeholder="Elev (m)"
                  value={newPointElev}
                  onChange={(e) => setNewPointElev(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-amber-400 text-xs px-2 py-2 rounded w-full outline-none"
                />
                <span className="text-xs text-slate-500">m</span>
              </div>

              <select
                value={newPointHazard}
                onChange={(e) => setNewPointHazard(e.target.value as Waypoint['hazardType'])}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-2 py-2 rounded outline-none"
              >
                <option value="CLEAR_PATH">Clear Path</option>
                <option value="STEEP_SLOPE">Steep Slope</option>
                <option value="BRIDGE_BOTTLENECK">Bridge Chokepoint</option>
                <option value="LOWLAND_FLOOD">Lowland Flood Basin</option>
              </select>
            </div>

            <button
              onClick={addWaypoint}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded shadow transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>ADD CHECKPOINT TO ROUTE MANIFEST</span>
            </button>
          </div>
        </div>

        {/* Naismith Rule Parameters & Hazards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            Naismith Transit Parameters
          </h3>

          {/* Pack Weight Drag Slider */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Bug-Out Bag Weight:</span>
              <span className="text-amber-400 font-mono font-bold">{gearWeightKg} kg</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={gearWeightKg}
              onChange={(e) => setGearWeightKg(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Light (5kg)</span>
              <span>Speed Penalty: +{Math.round((weightFactor - 1) * 100)}% Time</span>
              <span>Heavy (35kg)</span>
            </div>
          </div>

          {/* Base Walking Speed Slider */}
          <div className="space-y-2 bg-slate-950 p-3.5 rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Unladen Walking Speed:</span>
              <span className="text-cyan-400 font-mono font-bold">{baseSpeedKmH} km/h</span>
            </div>
            <input
              type="range"
              min="2.5"
              max="6.0"
              step="0.5"
              value={baseSpeedKmH}
              onChange={(e) => setBaseSpeedKmH(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800 h-2 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              Standard adult unencumbered pace is 4.5 km/h. Reduce for night travel or injured group members.
            </p>
          </div>

          {/* Naismith Rule Formula Box */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2">
            <span className="font-semibold text-emerald-400 block flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Naismith's Survival Rule:
            </span>
            <p className="text-slate-400 text-[11px]">
              Time = (Distance ÷ Speed) + (10 min per 100m Ascent) × Pack Weight Penalty.
            </p>
            <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300 space-y-1">
              <div>• Base Distance Time: {(totalDistanceKm / baseSpeedKmH).toFixed(1)} hrs</div>
              <div>• Ascent Elevation Penalty: {((totalElevationM / 100) * (10/60)).toFixed(1)} hrs</div>
              <div>• Pack Fatigue Multiplier: {weightFactor}x</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
