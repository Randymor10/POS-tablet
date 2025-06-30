import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Employee } from '../lib/supabase';

interface EmployeeContextType {
  employee: Employee | null;
  isLoggedIn: boolean;
  login: (employee: Employee) => void;
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

  const login = (employeeData: Employee) => {
    setEmployee(employeeData);
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