import { ShieldAlert, Biohazard, Flame, Lock, Phone, AlertTriangle, Play, CheckCircle2, Radio } from 'lucide-react';
import { EmergencyContact } from '../types';
import { RadioFrequencyDeck } from './RadioFrequencyDeck';

interface EmergencyVaultProps {
  contacts: EmergencyContact[];
  onAddContact: (contact: Partial<EmergencyContact>) => Promise<void>;
  onSimulateScenario: (scenario: string, days: number) => Promise<any>;
}

export const EmergencyVault: React.FC<EmergencyVaultProps> = ({
  contacts,
  onAddContact,
  onSimulateScenario
}) => {
  const [activeTab, setActiveTab] = useState<'contacts' | 'radio' | 'outbreak' | 'simulation' | 'whatif'>('contacts');
  
  // Simulator state
  const [simScenario, setSimScenario] = useState('Power Outage');
  const [simDays, setSimDays] = useState(3);
  const [simResult, setSimResult] = useState<any>(null);

  // New Contact form
  const [cName, setCName] = useState('');
  const [cRelation, setCRelation] = useState('');
  const [cPhone, setCPhone] = useState('');

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onSimulateScenario(simScenario, simDays);
    setSimResult(res);
  };

  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cPhone) return;
    await onAddContact({
      name: cName,
      relation: cRelation || 'Family',
      phone: cPhone,
      category: 'FAMILY'
    });
    setCName('');
    setCPhone('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="bg-[#121824] border border-slate-800 rounded-xl p-4 flex flex-wrap gap-2 shadow-xl">
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'contacts' ? 'bg-blue-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>EMERGENCY CONTACTS</span>
        </button>

        <button
          onClick={() => setActiveTab('radio')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'radio' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>RADIO FREQUENCIES</span>
        </button>

        <button
          onClick={() => setActiveTab('outbreak')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'outbreak' ? 'bg-purple-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Biohazard className="w-4 h-4" />
          <span>OUTBREAK MODE</span>
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'simulation' ? 'bg-rose-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>FICTIONAL SIMULATION</span>
        </button>

        <button
          onClick={() => setActiveTab('whatif')}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'whatif' ? 'bg-amber-600 text-white shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>WHAT-IF SIMULATOR</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'radio' && <RadioFrequencyDeck />}

      {activeTab === 'contacts' && (
        <div className="space-y-4">
          <div className="bg-[#121824] border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-mono uppercase font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              LOCAL EMERGENCY CONTACTS & HELPLINES
            </h3>

            <form onSubmit={handleAddContactSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Contact Name..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
              />
              <input
                type="text"
                value={cRelation}
                onChange={(e) => setCRelation(e.target.value)}
                placeholder="Relation (Family/Doctor)..."
                className="w-40 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <input
                type="text"
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                placeholder="Phone Number..."
                className="w-44 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-mono font-bold rounded-lg shrink-0">
                ADD CONTACT
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {contacts.map(c => (
                <div key={c.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-sm text-white">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.relation}</div>
                  <div className="text-sm font-mono font-bold text-blue-400 pt-1">{c.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'outbreak' && (
        <div className="bg-[#121824] border border-purple-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-purple-400">
            <Biohazard className="w-8 h-8 animate-pulse" />
            <div>
              <h3 className="text-xl font-bold font-heading text-white">OUTBREAK MODE — PROTOCOLS</h3>
              <p className="text-xs text-slate-400 font-mono">Real-World Infectious Disease Exposure & Mitigation Guidelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-900 border border-purple-900/30 rounded-lg space-y-2">
              <h4 className="text-xs font-mono uppercase text-purple-300 font-bold">PRIMARY EXPOSURE REDUCTION</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">✓ N95 / FFP2 Respiratory protection in enclosed shared spaces</li>
                <li className="flex items-center gap-2">✓ Active cross-ventilation (HEPA filter / open windows)</li>
                <li className="flex items-center gap-2">✓ Designated isolation room with dedicated bathroom</li>
                <li className="flex items-center gap-2">✓ Frequent surface disinfection with 70%+ Isopropyl Alcohol</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-900 border border-rose-900/30 rounded-lg space-y-2">
              <h4 className="text-xs font-mono uppercase text-rose-300 font-bold">EMERGENCY WARNING SIGNS</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">⚠ Persistent chest tightness or shortness of breath</li>
                <li className="flex items-center gap-2">⚠ Pulse Oximeter oxygen saturation drops below 94%</li>
                <li className="flex items-center gap-2">⚠ High fever unreduced by Paracetamol over 39.5°C</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="bg-[#121824] border border-rose-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <Flame className="w-6 h-6" />
            <h3 className="text-xl font-bold font-heading text-white">FICTIONAL SIMULATION MODE</h3>
            <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold rounded">
              FICTIONAL SIMULATION
            </span>
          </div>

          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-lg text-xs text-slate-200 space-y-2">
            <p className="font-bold text-rose-400">FICTIONAL ZOMBIE OUTBREAK / ALIEN INVASION SCENARIO</p>
            <p>
              Focus: Perimeter reinforcement, complete light/noise blackout, consolidation of water reserves, 
              and establishing 24-hour perimeter watch rotation.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'whatif' && (
        <div className="bg-[#121824] border border-amber-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-xl font-bold font-heading text-white">WHAT-IF DISASTER SIMULATOR</h3>
          </div>

          <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={simScenario}
              onChange={(e) => setSimScenario(e.target.value)}
              placeholder="Disruption scenario..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
            />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">DURATION:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={simDays}
                onChange={(e) => setSimDays(Number(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono"
              />
              <span className="text-xs font-mono text-slate-400">DAYS</span>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs font-mono rounded-lg flex items-center gap-2 shrink-0"
            >
              <Play className="w-4 h-4" />
              <span>RUN SIMULATION</span>
            </button>
          </form>

          {simResult && (
            <div className="p-5 bg-slate-900 border border-amber-500/30 rounded-lg space-y-3 font-mono text-xs">
              <div className="text-amber-400 font-bold">{simResult.simulation_notice}</div>
              <div className="text-slate-200">
                SCENARIO: {simResult.scenario} for {simResult.duration_days} Days ({simResult.household_size} Family Members)
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div>WATER REMAINING: {simResult.projected_water_remaining_liters} L</div>
                  <div className="text-cyan-400 font-bold mt-1">STATUS: {simResult.water_status}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <div>FOOD REMAINING: {simResult.projected_food_remaining_calories} kcal</div>
                  <div className="text-orange-400 font-bold mt-1">STATUS: {simResult.food_status}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
