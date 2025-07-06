// src/utils/order.ts

import { EXTRA_PRICES } from './extras';
import type { MenuItem } from '../data/menu';

interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderData {
  items: {
    id: string;
    name: string;
    quantity: number;
    basePrice: number;
    extras: any[];
    extraTotal: number;
    itemTotal: number;
    customizations?: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}

export function getOrderData(
  cart: CartItem[],
  selectedExtras: Record<string, any>
): OrderData {
  const getItemTotal = (item: CartItem) => {
    let total = item.price * item.quantity;
    const itemExtras = selectedExtras[item.id] || {};
    
    // Add extra prices
    if (itemExtras.extras && Array.isArray(itemExtras.extras)) {
      itemExtras.extras.forEach((extra: string) => {
        if (EXTRA_PRICES[extra]) {
          total += EXTRA_PRICES[extra] * item.quantity;
        }
      });
    }
    
    return total;
  };

  const getCustomizationText = (item: CartItem) => {
    const itemExtras = selectedExtras[item.id] || {};
    const customizations: string[] = [];
    
    // Add selections from options
    Object.entries(itemExtras).forEach(([key, value]) => {
      if (key !== 'extras' && value) {
        if (Array.isArray(value)) {
          customizations.push(`${key}: ${value.join(', ')}`);
        } else {
          customizations.push(`${key}: ${value}`);
        }
      }
    });
    
    // Add extras
    if (itemExtras.extras && Array.isArray(itemExtras.extras)) {
      customizations.push(`extras: ${itemExtras.extras.join(', ')}`);
    }
    
    return customizations.join('; ');
  };

  const subtotal = cart.reduce((total, item) => {
    return total + getItemTotal(item);
  }, 0);

  const taxRate = 0.0925;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const items = cart.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    basePrice: item.price,
    extras: selectedExtras[item.id]?.extras || [],
    extraTotal: getItemTotal(item) - (item.price * item.quantity),
    itemTotal: getItemTotal(item),
    customizations: getCustomizationText(item),
  }));

  return {
    items,
    subtotal,
    tax,
    total,
  };
}
