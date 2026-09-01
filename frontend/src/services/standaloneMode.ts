import { SystemStatus, WaterIQ, FoodIQ, InventoryItem, InventoryAlerts, TaskItem, MapMarker, EmergencyContact, StructuredResponse } from '../types';

export const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 1, category: 'water', name: 'Drinking Water Containers', quantity: 45.0, unit: 'Liters', location_note: 'Pantry Shelf A', is_essential: true },
  { id: 2, category: 'food', name: 'Rice Grains (Airtight Bin)', quantity: 15.0, unit: 'kg', calories_per_unit: 3500, location_note: 'Dry Store Bin', is_essential: true },
  { id: 3, category: 'food', name: 'Lentils (Dal)', quantity: 10.0, unit: 'kg', calories_per_unit: 3400, location_note: 'Dry Store Bin', is_essential: true },
  { id: 4, category: 'food', name: 'Canned Vegetables & Beans', quantity: 24.0, unit: 'cans', calories_per_unit: 450, location_note: 'Pantry Shelf B', is_essential: true },
  { id: 5, category: 'medical', name: 'Trauma First Aid Kit', quantity: 2.0, unit: 'kits', location_note: 'Hallway Cabinet', is_essential: true },
  { id: 6, category: 'medical', name: 'Paracetamol & Painkillers', quantity: 3.0, unit: 'packs', location_note: 'Medical Box', is_essential: true },
  { id: 7, category: 'power', name: 'Heavy Duty Power Bank 30,000mAh', quantity: 2.0, unit: 'pcs', location_note: 'Desk Drawer', is_essential: true },
  { id: 8, category: 'power', name: 'Solar Portable Charger 20W', quantity: 1.0, unit: 'pcs', location_note: 'Emergency Backpack', is_essential: true },
  { id: 9, category: 'tools', name: 'Tactical Multi-tool & Knife', quantity: 2.0, unit: 'pcs', location_note: 'Tool Belt', is_essential: true },
  { id: 10, category: 'tools', name: 'Tactical High-Lumen Flashlight', quantity: 3.0, unit: 'pcs', location_note: 'Bedroom & Kitchen', is_essential: true },
  { id: 11, category: 'sanitation', name: 'Unscented Bleach (5%)', quantity: 2.0, unit: 'Liters', location_note: 'Sanitation Box', is_essential: true },
];

export const DEFAULT_TASKS: TaskItem[] = [
  { id: 1, timeframe: 'first_15_min', title: 'Check household safety & physical injuries', priority: 'CRITICAL', completed: false },
  { id: 2, timeframe: 'first_15_min', title: 'Identify immediate environmental hazards (gas/water leak)', priority: 'CRITICAL', completed: false },
  { id: 3, timeframe: 'first_15_min', title: 'Secure emergency drinking water supply in containers', priority: 'HIGH', completed: false },
  { id: 4, timeframe: 'first_hour', title: 'Inventory food, water, and medical reserves', priority: 'HIGH', completed: false },
  { id: 5, timeframe: 'first_hour', title: 'Switch mobile devices to battery saver mode', priority: 'MEDIUM', completed: false },
  { id: 6, timeframe: 'first_hour', title: 'Check Offline Survival Map & verify safe markers', priority: 'HIGH', completed: false },
  { id: 7, timeframe: 'first_24_hours', title: 'Establish rainwater collection catchment', priority: 'MEDIUM', completed: false },
  { id: 8, timeframe: 'first_24_hours', title: 'Verify emergency contact meeting points', priority: 'HIGH', completed: false },
];

export const DEFAULT_MARKERS: MapMarker[] = [
  { id: 1, title: 'Primary Household Shelter', marker_type: 'SHELTER', latitude: 31.3260, longitude: 75.5762, status: 'SAFE', confidence: 'CONFIRMED', notes: 'Primary home base. Water & dry food stored.' },
  { id: 2, title: 'Civil Hospital Medical Point', marker_type: 'MEDICAL', latitude: 31.3295, longitude: 75.5810, status: 'UNKNOWN', confidence: 'RECENTLY_CHECKED', notes: 'Emergency room access on ground floor.' },
  { id: 3, title: 'Clean Groundwater Borewell', marker_type: 'WATER', latitude: 31.3210, longitude: 75.5715, status: 'SAFE', confidence: 'CONFIRMED', notes: 'Submersible pump with solar backup.' },
  { id: 4, title: 'Bridge Obstruction Hazard', marker_type: 'HAZARD', latitude: 31.3320, longitude: 75.5680, status: 'DANGER', confidence: 'OLD_INFO', notes: 'Debris reported near canal crossing.' },
];

export const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: 1, name: 'Family Emergency Rally Contact', relation: 'Sibling', phone: '+91 98765 43210', category: 'FAMILY', notes: 'Primary meeting point coordinator.' },
  { id: 2, name: 'District Disaster Control Room', relation: 'Civil Authority', phone: '108', category: 'AUTHORITY', notes: 'Government emergency disaster helpline.' },
  { id: 3, name: 'Dr. Sharma (Family Physician)', relation: 'Physician', phone: '+91 98123 45678', category: 'DOCTOR', notes: 'Medical advice and prescription guidance.' },
];

export function getStorageItem<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function setStorageItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export function calculateClientWaterIQ(inventory: InventoryItem[], adults = 2, children = 1): WaterIQ {
  const waterItems = inventory.filter(i => i.category.toLowerCase().includes('water'));
  const totalLiters = waterItems.reduce((acc, curr) => acc + Number(curr.quantity), 0);
  const dailyNeeded = (adults * 3.5) + (children * 2.5);
  const days = dailyNeeded > 0 ? Number((totalLiters / dailyNeeded).toFixed(1)) : 0;

  return {
    total_water_liters: totalLiters,
    household_size: adults + children,
    daily_consumption_liters: dailyNeeded,
    days_remaining: days,
    dew_collection_estimate: '0.5L - 1.5L per night using a 10m² plastic collection tarp in morning dew conditions.',
    rainwater_collection_estimate: '800 Liters potential yield per 10mm rainfall on a 100 m² clean roof catchment.',
    recommendations: days < 3
      ? ['URGENT: Water reserves critical (< 3 days). Fill all clean bathtubs and containers immediately.']
      : ['Water reserves currently stable. Keep containers tightly sealed and away from direct sunlight.']
  };
}

export function calculateClientFoodIQ(inventory: InventoryItem[], adults = 2, children = 1): FoodIQ {
  const foodItems = inventory.filter(i => i.category.toLowerCase().includes('food'));
  let totalKcal = 0;
  const breakdown = foodItems.map(item => {
    let cal = item.calories_per_unit ? item.quantity * item.calories_per_unit : item.quantity * 1000;
    totalKcal += cal;
    return {
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      estimated_calories: cal
    };
  });

  const dailyCalories = (adults * 2000) + (children * 1500);
  const days = dailyCalories > 0 ? Number((totalKcal / dailyCalories).toFixed(1)) : 0;

  return {
    total_calories: totalKcal,
    household_size: adults + children,
    daily_calories_needed: dailyCalories,
    days_remaining: days,
    items_breakdown: breakdown,
    recommendations: days < 7
      ? ['Consume perishable items first before opening sealed grain or canned stockpiles.']
      : ['Food reserves adequate. Maintain dry, cool storage conditions to prevent pest contamination.']
  };
}

export function calculateClientSystemStatus(
  inventory: InventoryItem[],
  markers: MapMarker[],
  waterDays: number,
  foodDays: number
): SystemStatus {
  const waterScore = Math.min(100, (waterDays / 14) * 100);
  const foodScore = Math.min(100, (foodDays / 14) * 100);
  const medScore = inventory.some(i => i.category.includes('medical')) ? 90 : 30;
  const powerScore = inventory.some(i => i.category.includes('power')) ? 85 : 25;
  const commScore = 85;
  const navScore = markers.length > 0 ? 90 : 40;
  const overall = Math.round(
    (waterScore * 0.20) + (foodScore * 0.20) + (medScore * 0.15) + (powerScore * 0.15) + (commScore * 0.15) + (navScore * 0.15)
  );

  return {
    is_online: navigator.onLine,
    local_ai_installed: true,
    local_ai_status: 'Client RuleEngine & Standalone PWA Active',
    active_model: 'SurvivalOS In-Browser Decision Engine',
    database_ready: true,
    handbook_indexed: true,
    total_knowledge_articles: 11,
    offline_maps_cached: true,
    inventory_items_count: inventory.length,
    map_markers_count: markers.length,
    overall_readiness_score: overall
  };
}

export function calculateClientSolarEnergyIQ(
  panelWatts = 100,
  sunHours = 4,
  batteryAh = 100,
  batteryVoltage = 12,
  batteryType: 'lifepo4' | 'agm' | 'gel' = 'lifepo4',
  dailyLoadWh = 300
): SolarEnergyIQ {
  const maxDod = batteryType === 'lifepo4' ? 0.85 : 0.50;
  const totalWh = batteryAh * batteryVoltage;
  const usableWh = totalWh * maxDod;
  const dailyGenWh = panelWatts * sunHours * 0.75;
  const netBalance = dailyGenWh - dailyLoadWh;
  const autonomyHours = dailyLoadWh > 0 ? (usableWh / (dailyLoadWh / 24)) : 999;
  const autonomyDays = Number((autonomyHours / 24).toFixed(1));
  const isSustainable = netBalance >= 0;
  const recPanelWatts = Math.ceil(dailyLoadWh / (sunHours * 0.75));

  const recommendations: string[] = [];
  if (!isSustainable) {
    recommendations.push(`Solar deficit of ${Math.abs(Math.round(netBalance))} Wh/day. Add at least ${recPanelWatts - panelWatts}W more solar panels or reduce load hours.`);
  } else {
    recommendations.push(`Solar setup is sustainable with a +${Math.round(netBalance)} Wh daily energy surplus.`);
  }
  if (batteryType !== 'lifepo4') {
    recommendations.push(`Lead-Acid/AGM usable depth of discharge limited to 50%. Upgrading to LiFePO4 extends usable energy by +35%.`);
  }
  recommendations.push(`Battery backup runtime under zero solar yield: approx ${autonomyDays} days (${Math.round(autonomyHours)} hours).`);

  return {
    battery_capacity_ah: batteryAh,
    battery_voltage: batteryVoltage,
    battery_type: batteryType,
    max_dod_percent: Math.round(maxDod * 100),
    total_stored_wh: totalWh,
    usable_stored_wh: Math.round(usableWh),
    panel_wattage: panelWatts,
    peak_sun_hours: sunHours,
    daily_solar_generation_wh: Math.round(dailyGenWh),
    daily_load_wh: Math.round(dailyLoadWh),
    net_daily_wh_balance: Math.round(netBalance),
    autonomy_hours_zero_sun: Number(autonomyHours.toFixed(1)),
    autonomy_days_zero_sun: autonomyDays,
    is_sustainable: isSustainable,
    recommended_panel_watts: recPanelWatts,
    recommendations
  };
}

export function evaluateClientAgentQuery(promptText: string, scenarioKey: string): StructuredResponse {
  const p = promptText.toLowerCase();
  let risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' = 'HIGH';
  let situation = 'Active Emergency Situation Evaluated.';
  let actions = [
    'Switch mobile devices and radios to Ultra Low Power / Battery Saver mode.',
    'Secure drinking water reserves and verify household safety status.',
    'Check offline map for verified safe rally points and shelter markers.'
  ];
  let avoid = [
    'Operating combustion generators indoors or in enclosed spaces.',
    'Drinking untreated water from open surface runoff.'
  ];
  let sources = ['SurvivalOS Offline Tactical Handbook (WHO / FEMA / Red Cross / SAR)'];

  if (p.includes('flood') || scenarioKey === 'flood') {
    situation = 'Flash Flood & Water Surge Alert';
    risk = 'CRITICAL';
    actions = [
      'Move household members, medical kit, and emergency supplies to higher floor or roof access immediately.',
      'Disconnect main electrical breaker if water approaches wall outlets.',
      'Monitor emergency radio (NOAA / VHF Ch 16) for evacuation routes.'
    ];
    avoid = ['Walking or driving through moving floodwater', 'Touching submerged electrical equipment'];
  } else if (p.includes('solar') || p.includes('battery') || p.includes('panel') || p.includes('energy') || p.includes('mppt')) {
    situation = 'Off-Grid Solar & Battery Storage Optimization';
    risk = 'MODERATE';
    actions = [
      'Size solar array for (Daily Wh Load) / (Peak Sun Hours * 0.75).',
      'Maintain battery DoD limits (80% LiFePO4, 50% AGM) to prevent permanent capacity loss.',
      'Use MPPT charge controller to gain up to +30% yield in cold or overcast weather.',
      'Tilt panels to (Latitude + 15°) during winter months.'
    ];
    avoid = ['Charging LiFePO4 batteries in sub-zero (<0°C) freezing temperatures', 'Wiring panels in parallel without proper wire gauge sizing'];
    sources.push('Off-Grid Solar Power & Battery Storage Survival Guide');
  } else if (p.includes('signal') || p.includes('mirror') || p.includes('strobe') || p.includes('morse') || p.includes('ground to air') || p.includes('icao')) {
    situation = 'Visual Emergency Signaling & Ground-to-Air Protocol';
    risk = 'HIGH';
    actions = [
      'Construct minimum 2.5m Ground-to-Air ICAO symbols (V = Need Help, X = Medical Need).',
      'Aim Signal Mirror flash using two-handed V-sight alignment with target aircraft.',
      'Transmit SOS optical strobe sequence: 3 Short, 3 Long, 3 Short flashes.',
      'Watch pilot wing-wag or landing light flash for confirmation.'
    ];
    avoid = ['Firing red meteor flares directly toward low-flying search helicopters', 'Placing smoke canisters near dry combustible brush'];
    sources.push('Visual Emergency Signaling & Ground-to-Air Protocol Guide');
  } else if (p.includes('shelter') || p.includes('cold') || p.includes('weather') || p.includes('heatwave')) {
    situation = 'Extreme Weather & Improvised Shelter Protocol';
    risk = 'HIGH';
    actions = [
      'Construct a thermal ground barrier (15 cm leaves/cardboard/mats) before sleeping to prevent conductive heat loss.',
      'Build A-frame debris shelter or pitch low tarp lean-to away from prevailing wind direction.',
      'In extreme heat, deploy double-tarp shade fly to drop ambient radiant heat.'
    ];
    avoid = ['Sleeping directly on cold wet ground', 'Enclosing fuel stoves inside unventilated shelters'];
  } else if (p.includes('knot') || p.includes('rope') || p.includes('rig') || p.includes('lash')) {
    situation = 'Tactical Rigging & Knot Application';
    risk = 'MODERATE';
    actions = [
      'Use Bowline for fixed end-of-line loops under load.',
      'Use Taut-Line Hitch for adjustable tarp guy lines.',
      'Use Trucker\'s Hitch (3:1 pulley system) for heavy load hauling or high-tension ridgepoles.'
    ];
    avoid = ['Using Square/Reef knot for human load bearing', 'Combining ropes of unequal diameter without a Sheet Bend'];
  } else if (p.includes('water') || scenarioKey === 'water_shortage') {
    situation = 'Severe Potable Water Disruption';
    risk = 'CRITICAL';
    actions = [
      'Fill all clean containers, pots, bathtubs, and sinks with tap water before pressure drops.',
      'Boil all questionable water for 1 full minute (or add 2 drops unscented 5% bleach per 1 Liter).',
      'Ration non-potable water; strictly prioritize hydration.'
    ];
  } else if (p.includes('power') || scenarioKey === 'power_outage') {
    situation = 'Grid Power Blackout & Electrical Outage';
    risk = 'MODERATE';
    actions = [
      'Keep refrigerator and freezer doors sealed tight (maintains safe temperature for 24-48 hours).',
      'Deploy LED headlamps and battery/solar lanterns; avoid open candles near curtains.',
      'Unplug high-voltage electronics to protect against return power surges.'
    ];
  }

  return {
    situation,
    risk_level: risk,
    do_this_now: actions,
    why: 'Rapid threat mitigation and resource conservation protocol.',
    what_you_have: ['Water Reserves Available', 'Dry Food Stockpile Logged', 'Local Radio Frequencies Loaded'],
    what_you_may_need: ['Backup solar charging capacity', 'Secondary water purification tablets'],
    avoid,
    next_check: 'Re-assess status and battery telemetry in 60 minutes.',
    sources_used: sources,
    is_offline: true,
    model_name: 'SurvivalOS Client-Side Engine (Cloudflare Edge Ready)'
  };
}

export const DEFAULT_SURVIVOR_LOGS: Array<any> = [
  {
    id: 'log-demo-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    day_number: 1,
    title: 'Grid Failure Day 1: Shelter Base & Water Audit',
    content: 'Initial blackout hit at 04:00. Secured 45 Liters of potable tap water before local water pressure dropped. Practiced basic solar panel angling for maximum peak sun generation. All household members safe.',
    log_type: 'vlog',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-on-a-road-in-a-forest-41165-large.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    learned_module_ids: ['water', 'solar'],
    learned_skills_summary: 'Mastered 2 drops/liter chemical disinfection and calculated solar array angle for 32°N latitude.',
    ai_debrief: 'COMMAND EVALUATION: Outstanding speed in securing liquid reserves during the initial 15-minute window. Recommend checking water storage container seals against microbial contamination.',
    preparedness_bonus: 10,
    mood: 'DETERMINED',
    weather_condition: 'CLEAR / 28°C',
    location_stamp: 'SHELTER ALPHA (31.3260°N, 75.5762°E)'
  },
  {
    id: 'log-demo-2',
    date: new Date(Date.now() - 86400000).toISOString(),
    day_number: 2,
    title: 'Radio Scanning & CPR Triage Drill',
    content: 'Tuned into 144.800 MHz VHF HAM frequency. Heard civil emergency repeaters broadcasting periodic grid status updates. Executed a 10-minute CPR & Wound Triage simulation drill with family.',
    log_type: 'photo',
    media_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    learned_module_ids: ['triage', 'vault'],
    learned_skills_summary: 'Refreshed 30:2 CPR compression ratio depth and tourniquet high-and-tight placement rules.',
    ai_debrief: 'COMMAND EVALUATION: CPR drill execution verified. Practice under stress ensures memory recall during true trauma events. +5% Preparedness score added.',
    preparedness_bonus: 5,
    mood: 'TACTICAL',
    weather_condition: 'OVERCAST / 24°C',
    location_stamp: 'RECON POINT BRAVO'
  }
];

export const DEFAULT_ACHIEVEMENTS: Array<any> = [
  {
    id: 'ach-1',
    title: 'First Log Recorded',
    description: 'Documented your first daily survival entry and video journal.',
    icon_name: 'Camera',
    badge_category: 'LOGGING',
    is_unlocked: true,
    unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'ach-2',
    title: 'Master Chronicler',
    description: 'Maintained a 7-day continuous Doomsday journal streak.',
    icon_name: 'BookOpen',
    badge_category: 'STREAK',
    is_unlocked: false
  },
  {
    id: 'ach-3',
    title: 'Field Medic Journal',
    description: 'Completed First Aid & CPR triage module reflections.',
    icon_name: 'Heart',
    badge_category: 'MASTERY',
    is_unlocked: true,
    unlocked_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ach-4',
    title: 'Radio Recon Specialist',
    description: 'Log radio signal frequency discoveries and comms drills.',
    icon_name: 'Radio',
    badge_category: 'MASTERY',
    is_unlocked: false
  },
  {
    id: 'ach-5',
    title: 'Water & Energy Guardian',
    description: 'Track both Water IQ and Solar Load reflections in your journey.',
    icon_name: 'Zap',
    badge_category: 'SPECIAL',
    is_unlocked: true,
    unlocked_at: new Date().toISOString()
  }
];

export function generateAIDebriefForLog(content: string, skills: string[], mood: string): { debrief: string; bonus: number } {
  let bonus = 5;
  const lower = content.toLowerCase();
  
  if (skills.length >= 2) bonus += 5;
  if (lower.includes('water') || lower.includes('purify') || lower.includes('filter')) bonus += 3;
  if (lower.includes('cpr') || lower.includes('triage') || lower.includes('wound')) bonus += 3;
  if (lower.includes('solar') || lower.includes('battery') || lower.includes('charge')) bonus += 3;
  
  let debriefText = 'COMMAND TACTICAL DEBRIEF: Log received and analyzed. ';
  if (mood === 'DETERMINED' || mood === 'TACTICAL') {
    debriefText += 'High psychological resilience and calm focus detected. ';
  } else if (mood === 'EXHAUSTED') {
    debriefText += 'Pacing protocol alert: Ensure adequate caloric intake and mandatory 7-hour rest window to prevent fatigue error. ';
  }

  if (skills.length > 0) {
    debriefText += `Key skills validated: [${skills.join(', ')}]. Core principles applied effectively. `;
  } else {
    debriefText += 'Recommend tagging specific SurvivalOS modules practiced today for maximum skill retention tracking. ';
  }

  debriefText += `Preparedness multiplier unlocked (+${bonus}% Readiness Boost). Keep logging daily.`;

  return {
    debrief: debriefText,
    bonus
  };
}

