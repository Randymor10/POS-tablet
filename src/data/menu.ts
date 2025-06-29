// src/data/menu.ts

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  meatChoice?: boolean;
  extras?: string[];
  image?: string;
}

export const menu: MenuItem[] = [
  // Breakfast
  {
    id: 'breakfast-burrito',
    category: 'Breakfast',
    name: 'Breakfast Burrito',
    description: 'Meat, eggs, Spanish rice, beans, cheese, pico, tortilla',
    price: 12.99,
    meatChoice: true,
  },
  {
    id: 'breakfast-quesadilla',
    category: 'Breakfast',
    name: 'Breakfast Quesadilla',
    description: 'Eggs, cheese, meat, served with salsa and sour cream',
    price: 10.99,
    meatChoice: true,
  },
  {
    id: 'breakfast-tacos',
    category: 'Breakfast',
    name: 'Breakfast Tacos (3)',
    description: 'Three tacos with eggs, meat, cheese, and pico',
    price: 9.99,
    meatChoice: true,
  },

  // Burritos
  {
    id: 'surf-turf-burrito',
    category: 'Burritos',
    name: 'Surf & Turf Burrito',
    description: 'Shrimp + meat, rice, beans, lettuce, pico, cheese, sour cream',
    price: 17.99,
    meatChoice: true,
  },
  {
    id: 'california-burrito',
    category: 'Burritos',
    name: 'California Burrito',
    description: 'Carne asada, french fries, cheese, pico, sour cream',
    price: 15.99,
  },
  {
    id: 'veggie-burrito',
    category: 'Burritos',
    name: 'Veggie Burrito',
    description: 'Rice, beans, lettuce, pico, cheese, guac, sour cream',
    price: 11.99,
  },

  // Tacos
  {
    id: 'street-tacos',
    category: 'Tacos',
    name: 'Street Tacos (3)',
    description: 'Three authentic street tacos with onions and cilantro',
    price: 8.99,
    meatChoice: true,
  },
  {
    id: 'fish-tacos',
    category: 'Tacos',
    name: 'Fish Tacos (2)',
    description: 'Grilled fish, cabbage slaw, pico, chipotle crema',
    price: 12.99,
  },
  {
    id: 'shrimp-tacos',
    category: 'Tacos',
    name: 'Shrimp Tacos (2)',
    description: 'Grilled shrimp, cabbage, pico, avocado crema',
    price: 13.99,
  },

  // Quesadillas
  {
    id: 'cheese-quesadilla',
    category: 'Quesadillas',
    name: 'Cheese Quesadilla',
    description: 'Melted cheese in a crispy tortilla',
    price: 7.99,
  },
  {
    id: 'meat-quesadilla',
    category: 'Quesadillas',
    name: 'Meat Quesadilla',
    description: 'Your choice of meat with melted cheese',
    price: 11.99,
    meatChoice: true,
  },
  {
    id: 'shrimp-quesadilla',
    category: 'Quesadillas',
    name: 'Shrimp Quesadilla',
    description: 'Grilled shrimp with cheese and peppers',
    price: 13.99,
  },

  // Sides
  {
    id: 'chips-guac',
    category: 'Sides',
    name: 'Chips & Guacamole',
    description: 'Fresh tortilla chips with house-made guacamole',
    price: 6.99,
  },
  {
    id: 'chips-salsa',
    category: 'Sides',
    name: 'Chips & Salsa',
    description: 'Fresh tortilla chips with salsa verde or roja',
    price: 4.99,
  },
  {
    id: 'mexican-rice',
    category: 'Sides',
    name: 'Mexican Rice',
    description: 'Seasoned Spanish rice',
    price: 3.99,
  },
  {
    id: 'refried-beans',
    category: 'Sides',
    name: 'Refried Beans',
    description: 'Traditional refried beans',
    price: 3.99,
  },

  // Drinks
  {
    id: 'horchata',
    category: 'Drinks',
    name: 'Horchata',
    description: 'Traditional rice and cinnamon drink',
    price: 3.99,
  },
  {
    id: 'agua-fresca',
    category: 'Drinks',
    name: 'Agua Fresca',
    description: 'Fresh fruit water (Jamaica, Tamarindo, or Mango)',
    price: 3.49,
  },
  {
    id: 'mexican-coke',
    category: 'Drinks',
    name: 'Mexican Coke',
    description: 'Coca-Cola made with cane sugar',
    price: 2.99,
  },
  {
    id: 'coffee',
    category: 'Drinks',
    name: 'Mexican Coffee',
    description: 'Rich coffee with cinnamon and brown sugar',
    price: 2.49,
  },
];