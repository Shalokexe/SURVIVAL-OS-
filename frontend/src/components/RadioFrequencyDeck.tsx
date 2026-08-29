import React, { useState } from 'react';
import { Radio, Volume2, VolumeX, ShieldAlert, Signal, Search, CheckCircle2, AlertTriangle, Play, Square, Info } from 'lucide-react';

interface RadioFrequency {
  id: string;
  name: string;
  frequency: string;
  band: string;
  category: 'weather' | 'marine' | 'ham' | 'frs_gmrs' | 'cb' | 'aviation';
  channel?: string;
  description: string;
  powerLimit: string;
  protocol: string;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
}

const FREQUENCY_DATABASE: RadioFrequency[] = [
  {
    id: 'marine-16',
    name: 'International Marine Distress & Calling',
    frequency: '156.800 MHz',
    band: 'VHF FM',
    category: 'marine',
    channel: 'Channel 16',
    description: 'Universal maritime emergency channel. Monitored continuously by coast guards, civil defense, and vessels worldwide.',
    powerLimit: '25W Max / 1W Low Power',
    protocol: 'Emergency MAYDAY / PAN-PAN traffic only. Switch to working channel (e.g. Ch 9 / Ch 68) after contact.',
    priority: 'CRITICAL'
  },
  {
    id: 'marine-9',
    name: 'Secondary Marine Calling & Safety',
    frequency: '156.450 MHz',
    band: 'VHF FM',
    category: 'marine',
    channel: 'Channel 9',
    description: 'Alternative calling channel for non-commercial craft to relieve Channel 16 congestion.',
    powerLimit: '25W Max / 1W Low Power',
    protocol: 'Initial calling and vessel-to-vessel safety checks.',
    priority: 'HIGH'
  },
  {
    id: 'noaa-1',
    name: 'NOAA Weather Radio 1 (WX1)',
    frequency: '162.550 MHz',
    band: 'VHF FM',
    category: 'weather',
    channel: 'WX1',
    description: 'Continuous nationwide all-hazards emergency weather forecasts and civil emergency bulletins.',
    powerLimit: 'Receive Only',
    protocol: 'Listen for Specific Area Message Encoding (SAME) alert tones.',
    priority: 'HIGH'
  },
  {
    id: 'noaa-2',
    name: 'NOAA Weather Radio 2 (WX2)',
    frequency: '162.400 MHz',
    band: 'VHF FM',
    category: 'weather',
    channel: 'WX2',
    description: 'Regional weather radar updates, tornado warnings, and flood crest alerts.',
    powerLimit: 'Receive Only',
    protocol: 'Continuous 24/7 automated meteorological broadcast.',
    priority: 'HIGH'
  },
  {
    id: 'noaa-3',
    name: 'NOAA Weather Radio 3 (WX3)',
    frequency: '162.475 MHz',
    band: 'VHF FM',
    category: 'weather',
    channel: 'WX3',
    description: 'Secondary regional all-hazards warning channel.',
    powerLimit: 'Receive Only',
    protocol: 'Automated weather broadcasts and civil defense activations.',
    priority: 'HIGH'
  },
  {
    id: 'ham-2m',
    name: 'HAM 2-Meter National Simplex Calling',
    frequency: '146.520 MHz',
    band: 'VHF FM (2m Band)',
    category: 'ham',
    channel: '2m Simplex',
    description: 'Primary nationwide simplex calling frequency for licensed amateur radio operators. Excellent line-of-sight range.',
    powerLimit: 'Amateur Limits (5W-50W)',
    protocol: 'Transmit callsign, announce listening. Move to adjacent simplex frequency (146.550 or 146.580) for conversations.',
    priority: 'CRITICAL'
  },
  {
    id: 'ham-70cm',
    name: 'HAM 70-Centimeter National Simplex Calling',
    frequency: '446.000 MHz',
    band: 'UHF FM (70cm Band)',
    category: 'ham',
    channel: '70cm Simplex',
    description: 'National UHF calling frequency. Ideal for dense urban environments, concrete structures, and short-range tactical grids.',
    powerLimit: 'Amateur Limits (5W-50W)',
    protocol: 'State callsign and location. Maintain radio silence between contacts.',
    priority: 'HIGH'
  },
  {
    id: 'frs-1',
    name: 'FRS/GMRS Shared Calling & Muster',
    frequency: '462.5625 MHz',
    band: 'UHF FM',
    category: 'frs_gmrs',
    channel: 'Channel 1',
    description: 'Standard household walkie-talkie emergency muster and hailing channel across all consumer radios.',
    powerLimit: '2W (FRS) / 5W (GMRS)',
    protocol: 'Use low power for family line-of-sight check-ins. Keep transmissions under 15 seconds.',
    priority: 'HIGH'
  },
  {
    id: 'gmrs-20',
    name: 'GMRS Emergency & Highway Repeater',
    frequency: '462.675 MHz',
    band: 'UHF FM',
    category: 'frs_gmrs',
    channel: 'Channel 20 / Repeater',
    description: 'Nationwide traveler assistance and emergency repeater frequency (141.3 Hz tone standard).',
    powerLimit: '50W Max (GMRS)',
    protocol: 'Emergency traffic, traveler assistance, and search & rescue support.',
    priority: 'CRITICAL'
  },
  {
    id: 'cb-9',
    name: 'CB Emergency & Traveler Assistance',
    frequency: '27.065 MHz',
    band: 'HF AM/SSB (11m Band)',
    category: 'cb',
    channel: 'Channel 9',
    description: 'Dedicated emergency and distress channel on Citizen Band radios.',
    powerLimit: '4W AM / 12W SSB',
    protocol: 'Strict emergency roadside assistance and life-safety communication.',
    priority: 'HIGH'
  },
  {
    id: 'cb-19',
    name: 'CB Highway & Convoy Channel',
    frequency: '27.185 MHz',
    band: 'HF AM (11m Band)',
    category: 'cb',
    channel: 'Channel 19',
    description: 'Primary highway traveler channel for road blockage updates, evacuation convoy coordination, and fuel scout info.',
    powerLimit: '4W AM',
    protocol: 'General highway situational awareness.',
    priority: 'STANDARD'
  },
  {
    id: 'air-iad',
    name: 'International Aeronautical Distress (IAD)',
    frequency: '121.500 MHz',
    band: 'VHF AM (Airband)',
    category: 'aviation',
    channel: 'Guard',
    description: 'Civilian international aviation emergency frequency. Monitored by search-and-rescue satellites and passing aircraft.',
    powerLimit: 'Emergency Only',
    protocol: 'Strict emergency distress beacons (ELT) and life-threatening aircraft emergencies.',
    priority: 'CRITICAL'
  }
];

const NATO_ALPHABET = [
  { letter: 'A', code: 'Alpha' }, { letter: 'B', code: 'Bravo' }, { letter: 'C', code: 'Charlie' },
  { letter: 'D', code: 'Delta' }, { letter: 'E', code: 'Echo' }, { letter: 'F', code: 'Foxtrot' },
  { letter: 'G', code: 'Golf' }, { letter: 'H', code: 'Hotel' }, { letter: 'I', code: 'India' },
  { letter: 'J', code: 'Juliet' }, { letter: 'K', code: 'Kilo' }, { letter: 'L', code: 'Lima' },
  { letter: 'M', code: 'Mike' }, { letter: 'N', code: 'November' }, { letter: 'O', code: 'Oscar' },
  { letter: 'P', code: 'Papa' }, { letter: 'Q', code: 'Quebec' }, { letter: 'R', code: 'Romeo' },
  { letter: 'S', code: 'Sierra' }, { letter: 'T', code: 'Tango' }, { letter: 'U', code: 'Uniform' },
  { letter: 'V', code: 'Victor' }, { letter: 'W', code: 'Whiskey' }, { letter: 'X', code: 'X-ray' },
  { letter: 'Y', code: 'Yankee' }, { letter: 'Z', code: 'Zulu' }
];

export const RadioFrequencyDeck: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const categories = [
    { id: 'all', label: 'ALL CHANNELS' },
    { id: 'marine', label: 'MARINE VHF' },
    { id: 'weather', label: 'NOAA WEATHER' },
    { id: 'ham', label: 'HAM RADIO' },
    { id: 'frs_gmrs', label: 'FRS / GMRS' },
    { id: 'cb', label: 'CB RADIO' },
    { id: 'aviation', label: 'AVIATION' },
  ];

  const filteredFrequencies = FREQUENCY_DATABASE.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.frequency.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.channel && item.channel.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Web Audio API Morse Code / SOS Tone Generator
  const playSOSBeacon = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      setIsPlayingAudio(true);

      const dotTime = 0.12; // 120ms
      const dashTime = dotTime * 3;
      const freq = 800; // 800Hz emergency tone

      // SOS Pattern: ... --- ...
      const pattern = [
        { type: 'dot', duration: dotTime },
        { type: 'dot', duration: dotTime },
        { type: 'dot', duration: dotTime },
        { type: 'pause', duration: dotTime * 2 },
        { type: 'dash', duration: dashTime },
        { type: 'dash', duration: dashTime },
        { type: 'dash', duration: dashTime },
        { type: 'pause', duration: dotTime * 2 },
        { type: 'dot', duration: dotTime },
        { type: 'dot', duration: dotTime },
        { type: 'dot', duration: dotTime },
      ];

      let currentTime = ctx.currentTime + 0.1;

      pattern.forEach(step => {
        if (step.type === 'dot' || step.type === 'dash') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, currentTime);

          gain.gain.setValueAtTime(0.3, currentTime);
          gain.gain.setValueAtTime(0.001, currentTime + step.duration - 0.01);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(currentTime);
          osc.stop(currentTime + step.duration);

          currentTime += step.duration + dotTime;
        } else {
          currentTime += step.duration;
        }
      });

      setTimeout(() => {
        setIsPlayingAudio(false);
      }, (currentTime - ctx.currentTime) * 1000 + 500);

    } catch (e) {
      console.error('Web Audio API not supported or error:', e);
      setIsPlayingAudio(false);
    }
  };

  const stopSOSBeacon = () => {
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setIsPlayingAudio(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-950 border border-cyan-500/40 rounded-lg text-cyan-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="text-lg font-heading font-bold text-white uppercase tracking-wider">
                TACTICAL RADIO FREQUENCY DECK
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Curated off-grid communications matrix, distress calling channels, and audio SOS beacon.
            </p>
          </div>

          {/* Interactive SOS Beacon Generator */}
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
            <div className="text-right">
              <div className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5 justify-end">
                <Signal className="w-3.5 h-3.5 text-cyan-400" />
                <span>800Hz SOS BEACON</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono">... --- ... (Morse Code)</span>
            </div>

            {!isPlayingAudio ? (
              <button
                onClick={playSOSBeacon}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>PLAY TONE</span>
              </button>
            ) : (
              <button
                onClick={stopSOSBeacon}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shadow animate-pulse"
              >
                <Square className="w-3.5 h-3.5" />
                <span>STOP</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frequency, channel (e.g. 156.800, Ch 16, NOAA, GMRS)..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFrequencies.map(item => {
          const isCritical = item.priority === 'CRITICAL';
          return (
            <div
              key={item.id}
              className={`bg-[#121824] border rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all hover:border-slate-700 ${
                isCritical ? 'border-rose-900/50 bg-rose-950/10' : 'border-slate-800'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                      {item.band}
                    </span>
                    <h3 className="text-sm font-bold text-white font-mono mt-1.5 flex items-center gap-1.5">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-extrabold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-lg block">
                      {item.frequency}
                    </span>
                    {item.channel && (
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {item.channel}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-slate-500">Power Limit:</span>
                  <span className="text-slate-300 font-semibold">{item.powerLimit}</span>
                </div>
                <div className="text-slate-400">
                  <span className="text-slate-500">Protocol: </span>
                  <span className="text-amber-300/90">{item.protocol}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* NATO Phonetic Alphabet & MAYDAY Protocol Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* NATO Phonetic Alphabet */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-3 shadow-md">
          <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            NATO PHONETIC ALPHABET QUICK REFERENCE
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Use phonetic pronunciation to spell GPS coordinates, blood groups, and callsigns through heavy radio static.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
            {NATO_ALPHABET.map(item => (
              <div key={item.letter} className="bg-slate-900/90 border border-slate-800/80 px-2.5 py-1.5 rounded text-xs font-mono flex items-center justify-between">
                <span className="font-bold text-cyan-400">{item.letter}</span>
                <span className="text-slate-300 font-medium">{item.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Voice Distress Procedure */}
        <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-3 shadow-md">
          <h3 className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            MAYDAY TRANSMISSION PROTOCOL CHECKLIST
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300">
              <span className="text-rose-400 font-bold">1. Hail: </span>
              "MAYDAY, MAYDAY, MAYDAY. This is [Your Station / Name x 3]."
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300">
              <span className="text-rose-400 font-bold">2. Position: </span>
              "Position is [Exact Latitude/Longitude or Street Intersection]."
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300">
              <span className="text-rose-400 font-bold">3. Emergency: </span>
              "Nature of distress: [e.g. Flash flood entrapment, trauma injury]."
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300">
              <span className="text-rose-400 font-bold">4. Assistance: </span>
              "Require immediate [Medical triage / Water evacuation]."
            </div>
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-slate-300">
              <span className="text-rose-400 font-bold">5. Count & Out: </span>
              "[X] Adults, [Y] Children. Listening on this channel. OVER."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
