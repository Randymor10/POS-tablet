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
  updated_at?: string;
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

// Get all employees
export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }

    return employees || [];
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
}

// Add new employee
export async function addEmployee(employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<Employee | null> {
  try {
    const { data: employee, error } = await supabase
      .from('employees')
      .insert({
        ...employeeData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding employee:', error);
      return null;
    }

    return employee;
  } catch (err) {
    console.error('Error adding employee:', err);
    return null;
  }
}

// Update employee
export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  try {
    const { data: employee, error } = await supabase
      .from('employees')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      return null;
    }

    return employee;
  } catch (err) {
    console.error('Error updating employee:', err);
    return null;
  }
}

// Delete employee
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error deleting employee:', err);
    return false;
  }
}

// Verify employee passcode
export async function verifyEmployeePasscode(employeeId: string, passcode: string): Promise<boolean> {
  try {
    const { data: employee, error } = await supabase
      .from('employees')
      .select('id')
      .eq('employee_id', employeeId)
      .eq('passcode', passcode)
      .eq('is_active', true)
      .single();

    if (error || !employee) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error verifying passcode:', err);
    return false;
  }
}

// Get employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !employee) {
      return null;
    }

    return employee;
  } catch (err) {
    console.error('Error fetching employee by ID:', err);
    return null;
  }
}