import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, signInEmployee, signOutEmployee, getCurrentAuthUser } from '../lib/supabase';
import type { Employee } from '../lib/supabase';

interface EmployeeContextType {
  employee: Employee | null;
  isLoggedIn: boolean;
  login: (employeeId: string, passcode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.user_metadata) {
        // Reconstruct employee from user metadata
        const userData = session.user.user_metadata;
        if (userData.employee_id) {
          const reconstructedEmployee: Employee = {
            id: userData.employee_id,
            employee_id: userData.employee_code,
            name: userData.employee_name,
            role: userData.employee_role,
            passcode: '', // Don't store passcode
            created_at: '',
            is_active: true
          };
          setEmployee(reconstructedEmployee);
        }
      } else if (event === 'SIGNED_OUT') {
        setEmployee(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const user = await getCurrentAuthUser();
      if (user?.user_metadata?.employee_id) {
        const userData = user.user_metadata;
        const reconstructedEmployee: Employee = {
          id: userData.employee_id,
          employee_id: userData.employee_code,
          name: userData.employee_name,
          role: userData.employee_role,
          passcode: '',
          created_at: '',
          is_active: true
        };
        setEmployee(reconstructedEmployee);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (employeeId: string, passcode: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { employee: loggedInEmployee, error } = await signInEmployee(employeeId, passcode);
      
      if (error || !loggedInEmployee) {
        setIsLoading(false);
        return { success: false, error: error || 'Login failed' };
      }

      setEmployee(loggedInEmployee);
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOutEmployee();
      setEmployee(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: EmployeeContextType = {
    employee,
    isLoggedIn: !!employee,
    login,
    logout,
    isLoading,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}