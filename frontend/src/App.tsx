import { 
  ShieldAlert, Bot, MapPin, Droplets, Utensils, Home, 
  CheckSquare, Activity, Radio, BookOpen, ShieldCheck, Wifi, WifiOff, Heart, Battery 
} from 'lucide-react';

import { CommandCenter } from './components/CommandCenter';
import { AIAgentView } from './components/AIAgentView';
import { SurvivalMap } from './components/SurvivalMap';
import { WaterIQ } from './components/WaterIQ';
import { FoodIQ } from './components/FoodIQ';
import { InventoryManager } from './components/InventoryManager';
import { TaskBoard } from './components/TaskBoard';
import { PreparednessScore } from './components/PreparednessScore';
import { EmergencyVault } from './components/EmergencyVault';
import { SurvivalHandbook } from './components/SurvivalHandbook';
import { PrepareWizard } from './components/PrepareWizard';
import { FirstAidTriage } from './components/FirstAidTriage';
import { MinimalistOS } from './components/MinimalistOS';

import { SystemStatus, WaterIQ as WaterIQType, FoodIQ as FoodIQType, InventoryItem, InventoryAlerts, TaskItem, MapMarker, EmergencyContact, StructuredResponse } from './types';
import { 
  DEFAULT_INVENTORY, DEFAULT_TASKS, DEFAULT_MARKERS, DEFAULT_CONTACTS,
  getStorageItem, setStorageItem, calculateClientWaterIQ, calculateClientFoodIQ,
  calculateClientSystemStatus, evaluateClientAgentQuery
} from './services/standaloneMode';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isMinimalOS, setIsMinimalOS] = useState<boolean>(() => {
    try {
      return localStorage.getItem('survival_is_minimal_os') === 'true';
    } catch {
      return false;
    }
  });
  
  // Data state
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [waterIQ, setWaterIQ] = useState<WaterIQType | null>(null);
  const [foodIQ, setFoodIQ] = useState<FoodIQType | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlerts | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [lastAIResponse, setLastAIResponse] = useState<StructuredResponse | null>(null);

  // Agent prompt state
  const [agentPrompt, setAgentPrompt] = useState<string>('');
  const [agentScenario, setAgentScenario] = useState<string>('power_outage');

  // Network listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      navigator.serviceWorker?.controller?.postMessage('sync-now');
      fetchSystemStatus();
      fetchInventory();
      fetchInventoryAlerts();
      fetchWaterIQ();
      fetchFoodIQ();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchSystemStatus();
    fetchWaterIQ();
    fetchFoodIQ();
    fetchInventory();
    fetchInventoryAlerts();
    fetchTasks();
    fetchMarkers();
    fetchContacts();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/system/status');
      if (res.ok) {
        setStatus(await res.json());
        return;
      }
    } catch {}
    const inv = getStorageItem<InventoryItem[]>('survival_inventory', DEFAULT_INVENTORY);
    const mks = getStorageItem<MapMarker[]>('survival_markers', DEFAULT_MARKERS);
    const wIQ = calculateClientWaterIQ(inv);
    const fIQ = calculateClientFoodIQ(inv);
    setStatus(calculateClientSystemStatus(inv, mks, wIQ.days_remaining, fIQ.days_remaining));
  };

  const fetchWaterIQ = async () => {
    try {
      const res = await fetch('/api/inventory/water_iq');
      if (res.ok) {
        setWaterIQ(await res.json());
        return;
      }
    } catch {}
    const inv = getStorageItem<InventoryItem[]>('survival_inventory', DEFAULT_INVENTORY);
    setWaterIQ(calculateClientWaterIQ(inv));
  };

  const fetchFoodIQ = async () => {
    try {
      const res = await fetch('/api/inventory/food_iq');
      if (res.ok) {
        setFoodIQ(await res.json());
        return;
      }
    } catch {}
    const inv = getStorageItem<InventoryItem[]>('survival_inventory', DEFAULT_INVENTORY);
    setFoodIQ(calculateClientFoodIQ(inv));
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/inventory/items');
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
        setStorageItem('survival_inventory', data);
        return;
      }
    } catch {}
    const localInv = getStorageItem<InventoryItem[]>('survival_inventory', DEFAULT_INVENTORY);
    setInventory(localInv);
  };

  const fetchInventoryAlerts = async () => {
    try {
      const res = await fetch('/api/inventory/alerts');
      if (res.ok) {
        setInventoryAlerts(await res.json());
        return;
      }
    } catch {}
    setInventoryAlerts({
      generated_at: new Date().toISOString(),
      expired_count: 0,
      expiring_soon_count: 1,
      shortage_count: 0,
      alerts: [
        {
          type: 'expiring_soon',
          severity: 'warning',
          item_name: 'Paracetamol & Painkillers',
          message: 'Paracetamol & Painkillers expiring within 30 days. Plan rotation or replenishment.',
          days_until_expiry: 22
        }
      ]
    });
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks/');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        setStorageItem('survival_tasks', data);
        return;
      }
    } catch {}
    setTasks(getStorageItem<TaskItem[]>('survival_tasks', DEFAULT_TASKS));
  };

  const fetchMarkers = async () => {
    try {
      const res = await fetch('/api/maps/markers');
      if (res.ok) {
        const data = await res.json();
        setMarkers(data);
        setStorageItem('survival_markers', data);
        return;
      }
    } catch {}
    setMarkers(getStorageItem<MapMarker[]>('survival_markers', DEFAULT_MARKERS));
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/emergency/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
        setStorageItem('survival_contacts', data);
        return;
      }
    } catch {}
    setContacts(getStorageItem<EmergencyContact[]>('survival_contacts', DEFAULT_CONTACTS));
  };

  // Agent query runner
  const handleRunAgentQuery = async (promptText: string, scenarioKey: string): Promise<StructuredResponse> => {
    try {
      const res = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          scenario: scenarioKey,
          force_offline: true
        })
      });
      if (res.ok) {
        const data: StructuredResponse = await res.json();
        setLastAIResponse(data);
        return data;
      }
    } catch {}
    const fallbackResponse = evaluateClientAgentQuery(promptText, scenarioKey);
    setLastAIResponse(fallbackResponse);
    return fallbackResponse;
  };

  const handleAskAIFromDashboard = (promptText: string, scenarioKey: string) => {
    setAgentPrompt(promptText);
    setAgentScenario(scenarioKey);
    setActiveTab('agent');
  };

  // Inventory actions
  const handleAddInventory = async (item: Partial<InventoryItem>) => {
    try {
      await fetch('/api/inventory/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch {}
    const current = getStorageItem<InventoryItem[]>('survival_inventory', DEFAULT_INVENTORY);
    const newItem: InventoryItem = {
      id: Date.now(),
      category: item.category || 'general',
      name: item.name || 'Emergency Item',
      quantity: Number(item.quantity || 1),
      unit: item.unit || 'units',
      location_note: item.location_note || 'Storage Bin',
      is_essential: true
    };
    const updated = [newItem, ...current];
    setStorageItem('survival_inventory', updated);
    setInventory(updated);
    fetchWaterIQ();
    fetchFoodIQ();
    fetchSystemStatus();
  };

  const handleDeleteInventory = async (id: number) => {
    try {
      await fetch(`/api/inventory/items/${id}`, { method: 'DELETE' });
    } catch {}
    const current = getStorageItem<InventoryItem[]>('survival_inventory', DEFAULT_INVENTORY);
    const updated = current.filter(i => i.id !== id);
    setStorageItem('survival_inventory', updated);
    setInventory(updated);
    fetchWaterIQ();
    fetchFoodIQ();
    fetchSystemStatus();
  };

  const handleFindSubstitute = async (missingItem: string) => {
    try {
      const res = await fetch(`/api/inventory/substitute?missing_item=${encodeURIComponent(missingItem)}`);
      if (res.ok) return await res.json();
    } catch {}
    return {
      missing_item: missingItem,
      alternatives: [
        'Boil water vigorously for 1 minute as thermal disinfection alternative.',
        'Use LED battery headlamps / lanterns on lowest lumen setting.',
        'Check vehicle emergency kit or neighborhood barter network.'
      ]
    };
  };

  // Task actions
  const handleToggleTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
    } catch {}
    const current = getStorageItem<TaskItem[]>('survival_tasks', DEFAULT_TASKS);
    const updated = current.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setStorageItem('survival_tasks', updated);
    setTasks(updated);
  };

  const handleAddTask = async (task: Partial<TaskItem>) => {
    try {
      await fetch('/api/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
    } catch {}
    const current = getStorageItem<TaskItem[]>('survival_tasks', DEFAULT_TASKS);
    const newTask: TaskItem = {
      id: Date.now(),
      timeframe: task.timeframe || 'first_hour',
      title: task.title || 'New Emergency Action',
      priority: task.priority || 'HIGH',
      completed: false
    };
    const updated = [newTask, ...current];
    setStorageItem('survival_tasks', updated);
    setTasks(updated);
  };

  // Map actions
  const handleAddMarker = async (marker: Partial<MapMarker>) => {
    try {
      await fetch('/api/maps/markers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marker)
      });
    } catch {}
    const current = getStorageItem<MapMarker[]>('survival_markers', DEFAULT_MARKERS);
    const newMarker: MapMarker = {
      id: Date.now(),
      title: marker.title || 'Custom Marker',
      marker_type: marker.marker_type || 'SAFE',
      latitude: marker.latitude || 31.3260,
      longitude: marker.longitude || 75.5762,
      status: marker.status || 'SAFE',
      confidence: marker.confidence || 'CONFIRMED',
      notes: marker.notes || 'Added locally via command HUD'
    };
    const updated = [newMarker, ...current];
    setStorageItem('survival_markers', updated);
    setMarkers(updated);
    fetchSystemStatus();
  };

  const handleMarkLocation = async () => {
    handleAddMarker({
      title: 'Current Survivor Checkpoint',
      marker_type: 'CHECKPOINT',
      status: 'SAFE',
      confidence: 'CONFIRMED',
      notes: 'GPS check-in logged'
    });
  };

  // Emergency Contact actions
  const handleAddContact = async (contact: Partial<EmergencyContact>) => {
    try {
      await fetch('/api/emergency/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
    } catch {}
    const current = getStorageItem<EmergencyContact[]>('survival_contacts', DEFAULT_CONTACTS);
    const newContact: EmergencyContact = {
      id: Date.now(),
      name: contact.name || 'Emergency Contact',
      relation: contact.relation || 'Rally Contact',
      phone: contact.phone || 'N/A',
      category: contact.category || 'FAMILY'
    };
    const updated = [newContact, ...current];
    setStorageItem('survival_contacts', updated);
    setContacts(updated);
  };

  const handleSimulateScenario = async (scenario: string, days: number) => {
    try {
      const res = await fetch(`/api/emergency/simulate_scenario?scenario_name=${encodeURIComponent(scenario)}&days=${days}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}
    return {
      scenario,
      duration_days: days,
      household_size: 3,
      simulation_notice: 'SIMULATION ENGINE: Client-Side Offline Projection',
      projected_water_remaining_liters: Math.max(0, 45 - (days * 9.5)).toFixed(1),
      water_status: (45 - (days * 9.5)) > 0 ? 'ADEQUATE' : 'DEPLETED (CRITICAL)',
      projected_food_remaining_calories: Math.max(0, 120000 - (days * 5500)),
      food_status: (120000 - (days * 5500)) > 0 ? 'SUFFICIENT' : 'DEPLETED'
    };
  };

  const navItems = [
    { id: 'dashboard', label: 'COMMAND', icon: ShieldAlert },
    { id: 'triage', label: 'TRIAGE & CPR', icon: Heart },
    { id: 'agent', label: 'AI AGENT', icon: Bot },
    { id: 'map', label: 'MY MAP', icon: MapPin },
    { id: 'water', label: 'WATER IQ', icon: Droplets },
    { id: 'food', label: 'FOOD IQ', icon: Utensils },
    { id: 'inventory', label: 'INVENTORY', icon: Home },
    { id: 'tasks', label: 'TASKS', icon: CheckSquare },
    { id: 'readiness', label: 'SCORE', icon: Activity },
    { id: 'vault', label: 'EMERGENCY', icon: Radio },
    { id: 'handbook', label: 'HANDBOOK', icon: BookOpen },
    { id: 'prepare', label: 'PREPARE', icon: ShieldCheck },
  ];

  if (isMinimalOS) {
    return (
      <MinimalistOS
        onLaunchApp={(appId) => {
          setActiveTab(appId);
          setIsMinimalOS(false);
        }}
        onExitMinimalMode={() => {
          setIsMinimalOS(false);
          localStorage.setItem('survival_is_minimal_os', 'false');
        }}
        waterDays={waterIQ?.days_remaining || 5.0}
        foodDays={foodIQ?.days_remaining || 15.0}
        readinessScore={status?.overall_readiness_score || 85}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d12] text-slate-100 font-sans selection:bg-rose-600 selection:text-white">
      {/* Top Fixed Emergency Header */}
      <header className="bg-[#101520]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-2.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 bg-rose-950/80 border border-rose-600/40 rounded-lg text-rose-500">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="font-heading font-bold text-white tracking-wider text-base uppercase leading-none">
                APOCALYPSE AI
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">
                SURVIVAL INTELLIGENCE
              </span>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Minimal OS & Status Indicators */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsMinimalOS(true);
                localStorage.setItem('survival_is_minimal_os', 'true');
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-600/50 rounded-full text-xs font-mono font-bold text-amber-300 transition-all shadow"
            >
              <Battery className="w-3.5 h-3.5 text-amber-400" />
              <span>MINIMAL OS</span>
            </button>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              !isOnline 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {!isOnline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{!isOnline ? 'OFFLINE MODE' : 'ONLINE'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Scrollbar */}
      <div className="lg:hidden bg-[#101520] border-b border-slate-800 px-3 py-2 overflow-x-auto flex gap-1 scrollbar-none">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <CommandCenter
            status={status}
            waterIQ={waterIQ}
            foodIQ={foodIQ}
            inventoryAlerts={inventoryAlerts}
            onNavigate={setActiveTab}
            onAskAI={handleAskAIFromDashboard}
            isOfflineMode={!isOnline}
          />
        )}

        {activeTab === 'triage' && <FirstAidTriage />}

        {activeTab === 'agent' && (
          <AIAgentView
            initialPrompt={agentPrompt}
            initialScenario={agentScenario}
            onQuery={handleRunAgentQuery}
            lastResponse={lastAIResponse}
          />
        )}

        {activeTab === 'map' && (
          <SurvivalMap
            markers={markers}
            onAddMarker={handleAddMarker}
            onMarkLocation={handleMarkLocation}
          />
        )}

        {activeTab === 'water' && <WaterIQ waterIQ={waterIQ} />}

        {activeTab === 'food' && <FoodIQ foodIQ={foodIQ} />}

        {activeTab === 'inventory' && (
          <InventoryManager
            items={inventory}
            onAddItem={handleAddInventory}
            onDeleteItem={handleDeleteInventory}
            onFindSubstitute={handleFindSubstitute}
            alerts={inventoryAlerts}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskBoard
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        )}

        {activeTab === 'readiness' && (
          <PreparednessScore status={status} waterIQ={waterIQ} foodIQ={foodIQ} />
        )}

        {activeTab === 'vault' && (
          <EmergencyVault
            contacts={contacts}
            onAddContact={handleAddContact}
            onSimulateScenario={handleSimulateScenario}
          />
        )}

        {activeTab === 'handbook' && <SurvivalHandbook />}

        {activeTab === 'prepare' && (
          <PrepareWizard onComplete={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0a0d12] py-4 text-center text-xs font-mono text-slate-500">
        APOCALYPSE AI AGENT // "INTERNET WHEN AVAILABLE. INTELLIGENCE WHEN UNAVAILABLE." // ALL DATA STORED LOCALLY
      </footer>
    </div>
  );
}
