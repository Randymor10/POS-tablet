import { supabase } from '../lib/supabase';
import type { OrderData } from './order';

export interface SaleRecord {
  id: string;
  employee_id: string;
  order_data: OrderData;
  total_amount: number;
  created_at: string;
}

export async function recordSale(employeeId: string, orderData: OrderData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('sales')
      .insert({
        employee_id: employeeId,
        order_data: orderData,
        total_amount: orderData.total,
      });

    if (error) {
      console.error('Error recording sale:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to record sale:', err);
    return false;
  }
}

export async function getSalesByEmployee(employeeId: string): Promise<SaleRecord[]> {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch sales:', err);
    return [];
  }
}

export async function getAllSales(): Promise<SaleRecord[]> {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        employees!fk_sales_employee(name, role)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all sales:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch all sales:', err);
    return [];
  }
}