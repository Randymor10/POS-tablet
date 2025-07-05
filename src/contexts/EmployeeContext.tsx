import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEmployeeByEmployeeId, verifyEmployeePasscode } from '../lib/supabase';
import type { Employee } from '../lib/supabase';

interface EmployeeContextType {
  employee: Employee | null;
  isLoggedIn: boolean;
  login: (employeeId: string) => Promise<{ success: boolean; error?: string }>;
  verifyPasscode: (employeeId: string, passcode: string) => Promise<boolean>;
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
      const employee = await getEmployeeByEmployeeId(employeeId);
      
      if (employee) {
        setEmployee(employee);
        return { success: true };
      } else {
        return { success: false, error: 'Employee not found or inactive' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Login failed' };
    }
  };

  const verifyPasscode = async (employeeId: string, passcode: string): Promise<boolean> => {
    try {
      return await verifyEmployeePasscode(employeeId, passcode);
    } catch (err) {
      console.error('Passcode verification error:', err);
      return false;
    }
  };

  const logout = () => {
    setEmployee(null);
  };

  return (
    <EmployeeContext.Provider value={{ employee, isLoggedIn, login, verifyPasscode, logout }}>
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