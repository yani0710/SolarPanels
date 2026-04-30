export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface SavedSystemRecord {
  id: number;
  user_id: number;
  title: string;
  input_snapshot: string;
  result_snapshot: string;
  recommended_power_kwp: number;
  recommended_battery_kwh: number;
  system_type: string;
  advice: string;
  created_at: string;
  updated_at: string;
}
