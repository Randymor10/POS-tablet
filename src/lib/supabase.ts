import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = 'https://szrxjlzewoqqjxlptuop.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cnhqbHpld29xcWp4bHB0dW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTYwMDksImV4cCI6MjA2Njc3MjAwOX0.31-H-tMJwavyOuOrLoDSKpgOfKLE8dva0T8yh1xFtN4';

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

// Authentication helper functions
export async function signInEmployee(employeeId: string, passcode: string): Promise<{ employee: Employee | null, error: string | null }> {
  try {
    // First verify the employee credentials
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('passcode', passcode)
      .eq('is_active', true)
      .single();

    if (employeeError || !employee) {
      return { employee: null, error: 'Invalid employee ID or passcode' };
    }

    // Create a temporary auth session using the employee's UUID as the user ID
    // This is a workaround to make the employee appear as an authenticated user
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.error('Auth error:', authError);
      return { employee: null, error: 'Authentication failed' };
    }

    // Store employee data in the session
    const { error: updateError } = await supabase.auth.updateUser({
      data: { 
        employee_id: employee.id,
        employee_code: employee.employee_id,
        employee_name: employee.name,
        employee_role: employee.role
      }
    });

    if (updateError) {
      console.error('Update user error:', updateError);
    }

    return { employee, error: null };
  } catch (err) {
    console.error('Sign in error:', err);
    return { employee: null, error: 'Sign in failed' };
  }
}

export async function signOutEmployee(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentAuthUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}