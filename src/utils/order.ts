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
    extras: string[];
    extraTotal: number;
    itemTotal: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
}

export function getOrderData(
  cart: CartItem[],
  selectedExtras: Record<string, string[]>
): OrderData {
  const getExtraTotal = (item: CartItem) => {
    const extras = selectedExtras[item.id] || [];
    return (
      extras.reduce((sum, extra) => sum + (EXTRA_PRICES[extra] || 0), 0) *
      item.quantity
    );
  };

  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity + getExtraTotal(item);
  }, 0);

  const taxRate = 0.0925;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const items = cart.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    basePrice: item.price,
    extras: selectedExtras[item.id] || [],
    extraTotal: getExtraTotal(item),
    itemTotal: item.quantity * item.price + getExtraTotal(item),
  }));

  return {
    items,
    subtotal,
    tax,
    total,
  };
}
