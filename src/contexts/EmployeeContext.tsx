import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEmployeeByEmployeeId } from '../lib/supabase';
import type { Employee } from '../lib/supabase';

interface EmployeeContextType {
  employee: Employee | null;
  isLoggedIn: boolean;
  login: (employeeId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employee, setEmployee] = useState<Employee | null>(() => {
    // Check if employee data exists in localStorage
    const saved = localStorage.getItem('employee');
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = employee !== null;

  useEffect(() => {
    // Save employee data to localStorage whenever it changes
    if (employee) {
      localStorage.setItem('employee', JSON.stringify(employee));
    } else {
      localStorage.removeItem('employee');
    }
  }, [employee]);

  const login = async (employeeId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // For now, just set a mock employee without database interaction
      const mockEmployee: Employee = {
        id: 'mock-id',
        employee_id: employeeId,
        name: 'Mock Employee',
        passcode: '1234',
        role: 'admin',
        created_at: new Date().toISOString(),
        is_active: true
      };

      setEmployee(mockEmployee);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setEmployee(null);
  };

  return (
    <EmployeeContext.Provider value={{ employee, isLoggedIn, login, logout }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
};