import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings under "API"
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  passcode: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

export interface Sale {
  id: string;
  employee_id: string;
  order_data: any;
  total_amount: number;
  created_at: string;
}