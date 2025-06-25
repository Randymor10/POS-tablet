// src/data/menu.ts

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  meatChoice?: boolean;
  extras?: string[];
}

export const menu: MenuItem[] = [
  {
    id: 'breakfast-burrito',
    category: 'Breakfast',
    name: 'Breakfast Burrito',
    description: 'Meat, eggs, Spanish rice, beans, cheese, pico, tortilla',
    price: 12.99,
    meatChoice: true,
  },
  {
    id: 'surf-turf-burrito',
    category: 'Burritos',
    name: 'Surf & Turf Burrito',
    description:
      'Shrimp + meat, rice, beans, lettuce, pico, cheese, sour cream',
    price: 17.99,
    meatChoice: true,
  },
];
