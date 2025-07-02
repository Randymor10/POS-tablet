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

// Get employee by employee ID only (for initial login)
export async function getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
  try {
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('is_active', true)
      .single();

    if (error || !employee) {
      return null;
    }

    return employee;
  } catch (err) {
    console.error('Error fetching employee:', err);
    return null;
  }
}

// Verify employee credentials (for passcode verification)
export async function verifyEmployeeCredentials(employeeId: string, passcode: string): Promise<{ employee: Employee | null, error: string | null }> {
  try {
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

    return { employee, error: null };
  } catch (err) {
    console.error('Credential verification error:', err);
    return { employee: null, error: 'Verification failed' };
  }
}

// Verify employee passcode (for sensitive actions)
export async function verifyEmployeePasscode(employeeId: string, passcode: string): Promise<boolean> {
  try {
    const { employee } = await verifyEmployeeCredentials(employeeId, passcode);
    return employee !== null;
  } catch (err) {
    console.error('Passcode verification error:', err);
    return false;
  }
}