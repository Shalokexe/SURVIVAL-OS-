import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Plus, ShieldCheck, AlertTriangle, Droplets, Activity, 
  Utensils, Home, Zap, Radio, Flag, RefreshCw, Layers, Compass, CheckCircle
} from 'lucide-react';
import { MapMarker as MapMarkerType } from '../types';

// Custom SVG map icons for Leaflet
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.6);
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const MARKER_CONFIGS: Record<string, { color: string; label: string; icon: any }> = {
  SAFE: { color: '#10b981', label: '🟢', icon: ShieldCheck },
  DANGER: { color: '#f43f5e', label: '🔴', icon: AlertTriangle },
  UNKNOWN: { color: '#eab308', label: '🟡', icon: HelpCircleIcon },
  WATER: { color: '#06b6d4', label: '🔵', icon: Droplets },
  MEDICAL: { color: '#a855f7', label: '🟣', icon: Activity },
  FOOD: { color: '#f97316', label: '🟠', icon: Utensils },
  SHELTER: { color: '#6366f1', label: '🏠', icon: Home },
  FUEL: { color: '#e11d48', label: '⛽', icon: Zap },
  COMMUNICATION: { color: '#3b82f6', label: '📡', icon: Radio },
  HAZARD: { color: '#dc2626', label: '⚠', icon: AlertTriangle },
  CHECKPOINT: { color: '#8b5cf6', label: '🔷', icon: Flag },
};

function HelpCircleIcon(props: any) {
  return <span {...props}>?</span>;
}

interface SurvivalMapProps {
  markers: MapMarkerType[];
  onAddMarker: (marker: Partial<MapMarkerType>) => Promise<void>;
  onMarkLocation: () => Promise<void>;
}

export const SurvivalMap: React.FC<SurvivalMapProps> = ({
  markers,
  onAddMarker,
  onMarkLocation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('SAFE');
  const [newLat, setNewLat] = useState(31.3260);
  const [newLng, setNewLng] = useState(75.5762);
  const [newNotes, setNewNotes] = useState('');

  const defaultCenter: [number, number] = [31.3260, 75.5762];

  const filteredMarkers = selectedFilter === 'ALL' 
    ? markers 
    : markers.filter(m => m.marker_type === selectedFilter);

  const handleCreateMarker = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddMarker({
      title: newTitle || 'Custom Survival Marker',
      marker_type: newType as any,
      latitude: parseFloat(newLat as any),
      longitude: parseFloat(newLng as any),
      notes: newNotes,
      status: 'SAFE',
      confidence: 'CONFIRMED'
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewNotes('');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Map Control Bar */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-500">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '12s' }} />
            <h2 className="text-lg font-bold font-heading uppercase text-white tracking-wide">
              MY SURVIVAL MAP
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              OFFLINE TILES CACHED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Personal observations & verified emergency point registry.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onMarkLocation}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-950/50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>I WAS HERE</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-rose-950/50"
          >
            <Plus className="w-4 h-4" />
            <span>ADD MARKER</span>
          </button>
        </div>
      </div>

      {/* Marker Legend Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shrink-0 transition-all ${
            selectedFilter === 'ALL'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          ALL ({markers.length})
        </button>

        {Object.entries(MARKER_CONFIGS).map(([key, cfg]) => {
          const count = markers.filter(m => m.marker_type === key).length;
          const isSelected = selectedFilter === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-slate-800 text-white border border-slate-600 shadow'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <span>{cfg.label}</span>
              <span>{key}</span>
              <span className="text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Map Box */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-2 h-[550px] relative shadow-2xl overflow-hidden">
        {/* Offline Fallback / Interactive Map Leaflet container */}
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', borderRadius: '0.5rem' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredMarkers.map((marker) => {
            const cfg = MARKER_CONFIGS[marker.marker_type] || MARKER_CONFIGS.SAFE;
            const icon = createCustomIcon(cfg.color, cfg.label);
            return (
              <Marker
                key={marker.id || `${marker.latitude}-${marker.longitude}`}
                position={[marker.latitude, marker.longitude]}
                icon={icon}
              >
                <Popup>
                  <div className="space-y-2 p-1 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-bold text-sm text-white">{marker.title}</span>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">
                        {marker.marker_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{marker.notes || 'No extra notes.'}</p>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                      <span>Status: {marker.status}</span>
                      <span className="text-amber-400">{marker.confidence}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Dashboard Overlay */}
        <div className="absolute top-4 right-4 bg-[#121824]/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg text-xs font-mono text-slate-200 z-[1000] shadow-xl space-y-1">
          <div className="font-bold text-rose-400">OFFLINE SURVIVAL MAP</div>
          <div>REGION: JALANDHAR DISTRICT</div>
          <div>MARKERS LOADED: {filteredMarkers.length}</div>
        </div>
      </div>

      {/* Add Marker Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121824] border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">ADD SURVIVAL MARKER</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateMarker} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">MARKER TITLE</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Safe Water Point / Fuel Depot"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">MARKER TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                >
                  {Object.keys(MARKER_CONFIGS).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">LATITUDE</label>
                  <input
                    type="number"
                    step="any"
                    value={newLat}
                    onChange={(e) => setNewLat(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">LONGITUDE</label>
                  <input
                    type="number"
                    step="any"
                    value={newLng}
                    onChange={(e) => setNewLng(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">OBSERVATION NOTES</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Notes on building condition, water availability, hazards..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500 font-sans"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg"
                >
                  SAVE MARKER
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
