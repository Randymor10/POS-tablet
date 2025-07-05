import type { OrderData } from './order';

export interface SaleRecord {
  id: string;
  employee_id: string;
  order_data: OrderData;
  total_amount: number;
  created_at: string;
}

// Mock sales data for demonstration
const mockSales: SaleRecord[] = [
  {
    id: 'sale-001',
    employee_id: 'EMP001',
    order_data: {
      items: [
        {
          id: 'breakfast-burrito',
          name: 'Breakfast Burrito',
          quantity: 2,
          basePrice: 12.99,
          extras: ['cheese', 'guac'],
          extraTotal: 8.58,
          itemTotal: 34.56
        }
      ],
      subtotal: 34.56,
      tax: 3.20,
      total: 37.76
    },
    total_amount: 37.76,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 'sale-002',
    employee_id: 'EMP002',
    order_data: {
      items: [
        {
          id: 'street-tacos',
          name: 'Street Tacos (3)',
          quantity: 1,
          basePrice: 8.99,
          extras: ['meat'],
          extraTotal: 3.00,
          itemTotal: 11.99
        }
      ],
      subtotal: 11.99,
      tax: 1.11,
      total: 13.10
    },
    total_amount: 13.10,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  }
];

export async function getSalesByEmployee(employeeId: string): Promise<SaleRecord[]> {
  // Return mock data filtered by employee
  return mockSales.filter(sale => sale.employee_id === employeeId);
}

export async function getAllSales(): Promise<SaleRecord[]> {
  // Return all mock sales data
  return mockSales;
}