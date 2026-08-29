export interface StructuredResponse {
  situation: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'EXTREME (SIMULATION)';
  do_this_now: string[];
  why: string;
  what_you_have: string[];
  what_you_may_need: string[];
  avoid: string[];
  next_check: string;
  sources_used: string[];
  is_offline: boolean;
  model_name: string;
}

export interface SystemStatus {
  is_online: boolean;
  local_ai_installed: boolean;
  local_ai_status: string;
  active_model: string;
  database_ready: boolean;
  handbook_indexed: boolean;
  total_knowledge_articles: number;
  offline_maps_cached: boolean;
  inventory_items_count: number;
  map_markers_count: number;
  overall_readiness_score: number;
}

export interface InventoryItem {
  id?: number;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  calories_per_unit?: number;
  expiration_date?: string;
  location_note?: string;
  is_essential?: boolean;
}

export interface InventoryAlert {
  type: 'expired' | 'expiring_soon' | 'shortage';
  severity: 'critical' | 'warning';
  item_id?: number;
  item_name?: string;
  message: string;
  days_until_expiry?: number;
}

export interface InventoryAlerts {
  generated_at: string;
  expired_count: number;
  expiring_soon_count: number;
  shortage_count: number;
  alerts: InventoryAlert[];
}

export interface TaskItem {
  id?: number;
  timeframe: 'first_15_min' | 'first_hour' | 'first_24_hours' | 'ongoing';
  title: string;
  description?: string;
  completed: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MapMarker {
  id?: number;
  title: string;
  marker_type: 'SAFE' | 'DANGER' | 'UNKNOWN' | 'WATER' | 'MEDICAL' | 'FOOD' | 'SHELTER' | 'FUEL' | 'COMMUNICATION' | 'EXIT' | 'HAZARD' | 'CHECKPOINT' | 'RESOURCE' | 'PEOPLE';
  latitude: number;
  longitude: number;
  notes?: string;
  status?: string;
  confidence?: 'CONFIRMED' | 'RECENTLY_CHECKED' | 'OLD_INFO' | 'UNVERIFIED' | 'UNKNOWN';
  last_verified?: string;
  created_by?: string;
}

export interface MapRoute {
  id?: number;
  name: string;
  route_type: 'PRIMARY' | 'BACKUP' | 'EVACUATION' | 'DANGER';
  waypoints_json: string;
  notes?: string;
}

export interface EmergencyContact {
  id?: number;
  name: string;
  relation: string;
  phone: string;
  alt_phone?: string;
  address?: string;
  notes?: string;
  category: 'FAMILY' | 'FRIEND' | 'DOCTOR' | 'HOSPITAL' | 'POLICE' | 'FIRE' | 'AUTHORITY';
}

export interface WaterIQ {
  total_water_liters: number;
  household_size: number;
  daily_consumption_liters: number;
  days_remaining: number;
  dew_collection_estimate: string;
  rainwater_collection_estimate: string;
  recommendations: string[];
}

export interface FoodIQ {
  total_calories: number;
  household_size: number;
  daily_calories_needed: number;
  days_remaining: number;
  items_breakdown: Array<{
    name: string;
    quantity: number;
    unit: string;
    estimated_calories: number;
  }>;
  recommendations: string[];
}

export interface UserProfile {
  id?: number;
  name: string;
  household_adults: number;
  household_children: number;
  household_elderly: number;
  household_pets: number;
  home_latitude?: number;
  home_longitude?: number;
  selected_region: string;
  preferred_language: string;
  offline_mode_override: boolean;
}
