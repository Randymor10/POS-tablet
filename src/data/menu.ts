// src/data/menu.ts

// Define all available meat choices
export const ALL_MEAT_CHOICES = [
  { value: 'no-meat', label: 'No Meat' },
  { value: 'birria', label: 'Birria' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'steak', label: 'Steak' },
  { value: 'ground-beef', label: 'Ground Beef' },
  { value: 'shrimp', label: 'Shrimp' },
  { value: 'fish', label: 'Fish' },
  { value: 'pastor', label: 'Pastor' },
  { value: 'carnitas', label: 'Carnitas' },
  { value: 'chorizo', label: 'Chorizo' },
  { value: 'tofu', label: 'Tofu' }
];

// Base ingredient interface
export interface BaseIngredient {
  name: string;
  label: string;
  defaultLevel: 'regular';
}

export interface MenuOption {
  type: 'meat' | 'beans' | 'tortilla' | 'sauce' | 'add_on' | 'choice';
  label: string;
  choices: { value: string; label: string; price?: number }[];
  required?: boolean;
  multiple?: boolean;
}

export interface MenuItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  customizable?: boolean;
  options?: MenuOption[];
  baseIngredients?: BaseIngredient[];
  image?: string;
}

export const menu: MenuItem[] = [
  // Breakfast Items
  {
    id: 'breakfast-burrito',
    category: 'Breakfast',
    name: 'Breakfast Burrito',
    description: 'Your choice of meat with eggs, Spanish rice, beans (black or pinto), cheese, and pico de gallo wrapped in a flour tortilla.',
    price: 12.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: ALL_MEAT_CHOICES,
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ],
    baseIngredients: [
      { name: 'eggs', label: 'Eggs', defaultLevel: 'regular' },
      { name: 'spanish-rice', label: 'Spanish Rice', defaultLevel: 'regular' },
      { name: 'cheese', label: 'Cheese', defaultLevel: 'regular' },
      { name: 'pico-de-gallo', label: 'Pico de Gallo', defaultLevel: 'regular' }
    ]
  },
  {
    id: 'breakfast-plate',
    category: 'Breakfast',
    name: 'Breakfast Plate',
    description: 'Your choice of meat with eggs, Spanish rice, beans (black or pinto), cheese and pico de gallo. Served with 3 corn tortillas.',
    price: 12.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: ALL_MEAT_CHOICES,
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ],
    baseIngredients: [
      { name: 'eggs', label: 'Eggs', defaultLevel: 'regular' },
      { name: 'spanish-rice', label: 'Spanish Rice', defaultLevel: 'regular' },
      { name: 'cheese', label: 'Cheese', defaultLevel: 'regular' },
      { name: 'pico-de-gallo', label: 'Pico de Gallo', defaultLevel: 'regular' }
    ]
  },
  {
    id: 'scrambled-eggs-chorizo',
    category: 'Breakfast',
    name: 'Scrambled Eggs and Chorizo Plate',
    description: 'Scrambled eggs with chorizo topped off with cheese. Served with Spanish rice and beans (black or pinto) with 3 corn tortillas or 1 flour tortilla.',
    price: 12.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      },
      {
        type: 'tortilla',
        label: 'Choice of Tortillas',
        choices: [
          { value: 'corn', label: '3 Corn Tortillas' },
          { value: 'flour', label: '1 Flour Tortilla' }
        ],
        required: true
      }
    ],
    baseIngredients: [
      { name: 'scrambled-eggs', label: 'Scrambled Eggs', defaultLevel: 'regular' },
      { name: 'chorizo', label: 'Chorizo', defaultLevel: 'regular' },
      { name: 'cheese', label: 'Cheese', defaultLevel: 'regular' },
      { name: 'spanish-rice', label: 'Spanish Rice', defaultLevel: 'regular' },
      { name: 'tortillas', label: 'Tortillas', defaultLevel: 'regular' }
    ]
  },
  {
    id: 'mexican-scrambled-eggs',
    category: 'Breakfast',
    name: 'Mexican Style Scrambled Eggs',
    description: 'Scrambled eggs with tomato, onion, cilantro and fresh jalapeño pepper. Served with Spanish rice and beans (black or pinto) with 3 corn tortillas or 1 flour tortilla.',
    price: 11.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      },
      {
        type: 'tortilla',
        label: 'Choice of Tortillas',
        choices: [
          { value: 'corn', label: '3 Corn Tortillas' },
          { value: 'flour', label: '1 Flour Tortilla' }
        ],
        required: true
      }
    ],
    baseIngredients: [
      { name: 'scrambled-eggs', label: 'Scrambled Eggs', defaultLevel: 'regular' },
      { name: 'tomato', label: 'Tomato', defaultLevel: 'regular' },
      { name: 'onion', label: 'Onion', defaultLevel: 'regular' },
      { name: 'cilantro', label: 'Cilantro', defaultLevel: 'regular' },
      { name: 'jalapeno', label: 'Fresh Jalapeño', defaultLevel: 'regular' },
      { name: 'spanish-rice', label: 'Spanish Rice', defaultLevel: 'regular' },
      { name: 'tortillas', label: 'Tortillas', defaultLevel: 'regular' }
    ]
  },
  {
    id: 'drowned-eggs',
    category: 'Breakfast',
    name: 'Drowned Eggs',
    description: '2 fried eggs on top of 1 fried tortilla cooked in red sauce with Spanish rice and beans (black or pinto).',
    price: 11.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ],
    baseIngredients: [
      { name: 'fried-eggs', label: 'Fried Eggs', defaultLevel: 'regular' },
      { name: 'fried-tortilla', label: 'Fried Tortilla', defaultLevel: 'regular' },
      { name: 'red-sauce', label: 'Red Sauce', defaultLevel: 'regular' },
      { name: 'spanish-rice', label: 'Spanish Rice', defaultLevel: 'regular' }
    ]
  },

  // Epale Burritos or Bowls
  {
    id: 'street-taco',
    category: 'Tacos',
    name: 'Street Taco',
    description: 'Your choice of meat served on a corn tortilla topped with cilantro, onions and green salsa.',
    price: 4.00,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: ALL_MEAT_CHOICES,
        required: true
      }
    ],
    baseIngredients: [
      { name: 'corn-tortilla', label: 'Corn Tortilla', defaultLevel: 'regular' },
      { name: 'cilantro', label: 'Cilantro', defaultLevel: 'regular' },
      { name: 'onions', label: 'Onions', defaultLevel: 'regular' },
      { name: 'green-salsa', label: 'Green Salsa', defaultLevel: 'regular' }
    ]
  },
  {
    id: 'epale-taco',
    category: 'Tacos',
    name: 'Epale Taco',
    description: 'Your choice of meat served on a corn tortilla topped with cilantro, onions, green salsa plus lettuce, cheese, sour cream and guacamole.',
    price: 6.00,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: ALL_MEAT_CHOICES,
        required: true
      }
    ],
    baseIngredients: [
      { name: 'corn-tortilla', label: 'Corn Tortilla', defaultLevel: 'regular' },
      { name: 'cilantro', label: 'Cilantro', defaultLevel: 'regular' },
      { name: 'onions', label: 'Onions', defaultLevel: 'regular' },
      { name: 'green-salsa', label: 'Green Salsa', defaultLevel: 'regular' },
      { name: 'lettuce', label: 'Lettuce', defaultLevel: 'regular' },
      { name: 'cheese', label: 'Cheese', defaultLevel: 'regular' },
      { name: 'sour-cream', label: 'Sour Cream', defaultLevel: 'regular' },
      { name: 'guacamole', label: 'Guacamole', defaultLevel: 'regular' }
    ]
  },
  {
    id: 'surf-turf-burrito',
    category: 'Burritos',
    name: 'Surf & Turf Burrito',
    description: 'Made with shrimp and choice of meat, Spanish rice, beans (black or pinto) fresh pico de gallo, romaine lettuce, cheese and sour cream.',
    price: 17.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'california-burrito',
    category: 'Burritos',
    name: 'California Burrito',
    description: 'Made with steak, french fries, sour cream and fresh pico de gallo.',
    price: 14.99,
    customizable: false
  },
  {
    id: 'mexican-burrito',
    category: 'Burritos',
    name: 'Mexican Burrito',
    description: 'Your choice of meat, Spanish rice, beans (black or pinto) fresh pico de gallo and romaine lettuce.',
    price: 13.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' },
          { value: 'chorizo', label: 'Chorizo' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'mexican-super-burrito',
    category: 'Burritos',
    name: 'Mexican Super Burrito',
    description: 'Your choice of meat, Spanish rice, beans (black or pinto) fresh pico de gallo, romaine lettuce, cheese and sour cream.',
    price: 15.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' },
          { value: 'chorizo', label: 'Chorizo' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'cajun-burrito',
    category: 'Burritos',
    name: 'Cajun Burrito',
    description: 'Your choice of meat with spicy cajun sauce, onions, green peppers all sautéed with Spanish rice and beans (black or pinto), romaine lettuce, and pico de gallo.',
    price: 16.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'thai-burrito',
    category: 'Burritos',
    name: 'Thai Burrito',
    description: 'Your choice of meat with spicy thai peanut sauce, bell peppers, onions all sautéed with jalapeño-garlic sauce with Spanish rice, romaine lettuce and pico de gallo.',
    price: 16.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'teriyaki-burrito',
    category: 'Burritos',
    name: 'Teriyaki Burrito',
    description: 'Your choice of meat with teriyaki sauce sautéed bell peppers, onion with Spanish rice, romaine lettuce and pico de gallo.',
    price: 16.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'vegan-burrito',
    category: 'Burritos',
    name: 'Vegan Burrito',
    description: 'Made with Spanish rice and beans (black or pinto), romaine lettuce and pico de gallo.',
    price: 9.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'mixed-veggies-burrito',
    category: 'Burritos',
    name: 'Mixed Veggies Burrito',
    description: 'Made with Spanish rice, beans (black or pinto), romaine lettuce, zucchini, squash, green bell peppers, onion and pico de gallo.',
    price: 12.49,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'garlic-lime-chicken-burrito',
    category: 'Burritos',
    name: 'Garlic Lime Chicken Burrito',
    description: 'Made with chicken, Spanish rice, beans (black or pinto), romaine lettuce, pico de gallo with garlic lime sauce.',
    price: 13.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'garlic-lime-steak-burrito',
    category: 'Burritos',
    name: 'Garlic Lime Steak Burrito',
    description: 'Made with steak, Spanish rice, beans (black or pinto), romaine lettuce, pico de gallo with garlic lime sauce.',
    price: 13.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },

  // Plates
  {
    id: 'fajitas',
    category: 'Plates',
    name: 'Fajitas',
    description: 'Strips of chicken or steak with bell pepper and onions, served with Spanish rice and beans and 3 corn tortillas or 1 flour tortilla.',
    price: 20.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'chicken', label: 'Chicken' },
          { value: 'steak', label: 'Steak' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      },
      {
        type: 'tortilla',
        label: 'Choice of Tortillas',
        choices: [
          { value: 'corn', label: '3 Corn Tortillas' },
          { value: 'flour', label: '1 Flour Tortilla' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'chilaquiles',
    category: 'Plates',
    name: 'Chilaquiles',
    description: 'Your choice of meat with red or green sauce with cheese, beans and eggs.',
    price: 14.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'chorizo', label: 'Chorizo' }
        ],
        required: true
      },
      {
        type: 'sauce',
        label: 'Choice of Sauce',
        choices: [
          { value: 'red', label: 'Red Sauce' },
          { value: 'green', label: 'Green Sauce' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'enchiladas',
    category: 'Plates',
    name: 'Enchiladas (3)',
    description: 'Your choice of meat, green or red sauce topped with cheese, served with lettuce, pico de gallo and sour cream with Spanish rice and beans (black or pinto).',
    price: 15.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'cheese', label: 'Cheese Only' }
        ],
        required: true
      },
      {
        type: 'sauce',
        label: 'Choice of Sauce',
        choices: [
          { value: 'red', label: 'Red Sauce' },
          { value: 'green', label: 'Green Sauce' }
        ],
        required: true
      },
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'birria-plate',
    category: 'Plates',
    name: 'Birria Plate',
    description: 'Topped with onions and cilantro with Spanish rice and beans (black or pinto) and 3 corn tortillas or 1 flour tortilla.',
    price: 19.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      },
      {
        type: 'tortilla',
        label: 'Choice of Tortillas',
        choices: [
          { value: 'corn', label: '3 Corn Tortillas' },
          { value: 'flour', label: '1 Flour Tortilla' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'shrimp-plancha',
    category: 'Plates',
    name: 'Shrimp a la Plancha',
    description: 'Grilled shrimp seasoned with garlic and butter. Served with rice and beans (black or pinto), lettuce, pico de gallo and 3 corn tortillas.',
    price: 18.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'shrimp-diabla',
    category: 'Plates',
    name: 'Shrimp a la Diabla',
    description: 'Shrimp covered in red chile pepper sauce topped with cheese, served with Spanish rice, beans (black or pinto) and 3 corn tortillas, lettuce, pico de gallo and sour cream on the side.',
    price: 19.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },

  // Epale Seafood
  {
    id: 'fried-shrimp',
    category: 'Seafood',
    name: 'Fried Shrimp (10 pcs)',
    description: 'Fried shrimp 10 pieces with fries.',
    price: 17.99,
    customizable: false
  },
  {
    id: 'fried-fish',
    category: 'Seafood',
    name: 'Fried Fish (6 pcs)',
    description: 'Fried fish 6 pieces with fries.',
    price: 17.99,
    customizable: false
  },
  {
    id: 'fried-calamari',
    category: 'Seafood',
    name: 'Fried Calamari (10 pcs)',
    description: 'Fried calamari 10 pieces with fries.',
    price: 16.99,
    customizable: false
  },
  {
    id: 'fried-fish-sandwich',
    category: 'Seafood',
    name: 'Fried Fish Sandwich w/ Fries',
    description: 'Made with fish, mayo, romaine lettuce, tomato and onion with french fries.',
    price: 16.99,
    customizable: false
  },
  {
    id: 'fried-shrimp-sandwich',
    category: 'Seafood',
    name: 'Fried Shrimp Sandwich w/ Fries',
    description: 'Made with shrimp, mayo, romaine lettuce, tomato and onion.',
    price: 17.99,
    customizable: false
  },
  {
    id: 'garlic-noodles-shrimp',
    category: 'Seafood',
    name: 'Garlic Noodles w/ Shrimp',
    description: 'Comes with garlic bread.',
    price: 16.99,
    customizable: false
  },
  {
    id: 'mexican-shrimp-cocktail',
    category: 'Seafood',
    name: 'Mexican Shrimp Cocktail',
    description: 'Peeled then boiled shrimp with tomatoes, onions, cilantro, fresh jalapeño pepper, cucumber, avocado, lemon juice and ketchup served with 2 tostadas or chips.',
    price: 17.99,
    customizable: true,
    options: [
      {
        type: 'choice',
        label: 'Served with',
        choices: [
          { value: 'tostadas', label: '2 Tostadas' },
          { value: 'chips', label: 'Chips' }
        ],
        required: true
      }
    ]
  },

  // Favorites
  {
    id: 'epale-quesabirrias',
    category: 'Favorites',
    name: 'Epale Quesabirrias',
    description: 'Made with birria, cheese, onion and cilantro with consommé.',
    price: 5.00,
    customizable: false
  },
  {
    id: 'birria-ramen',
    category: 'Favorites',
    name: 'Birria Ramen',
    description: 'Ramen noodles served in flavorful broth consommé and tender birria meat, served with 2 mini only cheese corn quesadillas for dipping.',
    price: 11.99,
    customizable: false
  },
  {
    id: 'regular-quesadilla',
    category: 'Quesadillas',
    name: 'Regular Quesadilla',
    description: 'Your choice of tortilla (flour, spinach or whole wheat) filled with melted cheese and your choice of meat topped with pico de gallo.',
    price: 11.99,
    customizable: true,
    options: [
      {
        type: 'tortilla',
        label: 'Choice of Tortilla',
        choices: [
          { value: 'flour', label: 'Flour' },
          { value: 'spinach', label: 'Spinach' },
          { value: 'wheat', label: 'Whole Wheat' }
        ],
        required: true
      },
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' },
          { value: 'chorizo', label: 'Chorizo' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'super-quesadilla',
    category: 'Quesadillas',
    name: 'Super Quesadilla',
    description: 'Your choice of tortilla (flour, spinach or whole wheat) filled with melted cheese with your choice of meat and topped with pico de gallo and sour cream.',
    price: 13.99,
    customizable: true,
    options: [
      {
        type: 'tortilla',
        label: 'Choice of Tortilla',
        choices: [
          { value: 'flour', label: 'Flour' },
          { value: 'spinach', label: 'Spinach' },
          { value: 'wheat', label: 'Whole Wheat' }
        ],
        required: true
      },
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' },
          { value: 'chorizo', label: 'Chorizo' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'torta',
    category: 'Favorites',
    name: 'Torta',
    description: 'Mexican sandwich with choice of meat, cheese, mayo, lettuce, pico de gallo and sour cream. Add french fries for an extra $2.50.',
    price: 12.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' },
          { value: 'chorizo', label: 'Chorizo' }
        ],
        required: true
      },
      {
        type: 'add_on',
        label: 'Add French Fries',
        choices: [
          { value: 'fries', label: 'Add French Fries', price: 2.50 }
        ],
        required: false
      }
    ]
  },
  {
    id: 'steak-fries',
    category: 'Favorites',
    name: 'Steak Fries',
    description: 'Fries topped with shredded mozzarella cheese, steak meat, sour cream and pico de gallo.',
    price: 15.99,
    customizable: false
  },
  {
    id: 'nachos',
    category: 'Favorites',
    name: 'Nachos',
    description: 'Chips, topped with shredded mozzarella cheese, Spanish rice, beans (black or pinto), pico de gallo and sour cream.',
    price: 15.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'cheeseburger',
    category: 'Favorites',
    name: 'Cheeseburger w/ Fries',
    description: 'Beef patty with cheese on a bun with mayo, lettuce, and pico de gallo served with french fries.',
    price: 11.49,
    customizable: false
  },

  // Kids Plates
  {
    id: 'kids-cheese-quesadilla',
    category: 'Kids',
    name: 'Kids Cheese Quesadilla Plate',
    description: 'Rice and beans (black or pinto). Add chicken or steak +$2.00',
    price: 6.49,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      },
      {
        type: 'add_on',
        label: 'Add Meat',
        choices: [
          { value: 'chicken', label: 'Add Chicken', price: 2.00 },
          { value: 'steak', label: 'Add Steak', price: 2.00 }
        ],
        required: false
      }
    ]
  },
  {
    id: 'kids-taco-plate',
    category: 'Kids',
    name: 'Kids Taco Plate',
    description: 'Grilled chicken or steak.',
    price: 6.49,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'chicken', label: 'Grilled Chicken' },
          { value: 'steak', label: 'Steak' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'kids-burrito',
    category: 'Kids',
    name: 'Kids Burrito',
    description: 'Made with your choice of black or pinto beans, rice and cheese. Add chicken or steak +$2.00',
    price: 8.49,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      },
      {
        type: 'add_on',
        label: 'Add Meat',
        choices: [
          { value: 'chicken', label: 'Add Chicken', price: 2.00 },
          { value: 'steak', label: 'Add Steak', price: 2.00 }
        ],
        required: false
      }
    ]
  },

  // Salad
  {
    id: 'epale-salad',
    category: 'Salads',
    name: 'Epale Salad',
    description: 'Fresh cut romaine lettuce with your choice of meat with sautéed veggies (bell peppers, onions, zucchini and squash) with garlic lemon homemade dressing.',
    price: 13.99,
    customizable: true,
    options: [
      {
        type: 'meat',
        label: 'Choice of Meat',
        choices: [
          { value: 'carne-asada', label: 'Carne Asada' },
          { value: 'chicken', label: 'Chicken' },
          { value: 'carnitas', label: 'Carnitas' },
          { value: 'al-pastor', label: 'Al Pastor' },
          { value: 'shrimp', label: 'Shrimp' }
        ],
        required: true
      }
    ]
  },

  // Extras
  {
    id: 'chips-guacamole',
    category: 'Extras',
    name: 'Chips and Guacamole',
    description: 'Fresh tortilla chips with house-made guacamole.',
    price: 7.99,
    customizable: false
  },
  {
    id: 'chips-salsa',
    category: 'Extras',
    name: 'Chips and Salsa',
    description: 'Fresh tortilla chips with salsa.',
    price: 6.99,
    customizable: false
  },
  {
    id: 'bag-chips',
    category: 'Extras',
    name: 'Bag of Chips',
    description: 'Bag of tortilla chips.',
    price: 2.79,
    customizable: false
  },
  {
    id: 'rice-beans',
    category: 'Extras',
    name: 'Rice and Beans',
    description: 'Spanish rice and beans (black or pinto).',
    price: 6.99,
    customizable: true,
    options: [
      {
        type: 'beans',
        label: 'Choice of Beans',
        choices: [
          { value: 'black', label: 'Black Beans' },
          { value: 'pinto', label: 'Pinto Beans' }
        ],
        required: true
      }
    ]
  },
  {
    id: 'corn-tortillas',
    category: 'Extras',
    name: 'Corn Tortillas (3)',
    description: '3 corn tortillas.',
    price: 2.99,
    customizable: false
  },
  {
    id: 'churro',
    category: 'Extras',
    name: 'Churro',
    description: 'Traditional Mexican churro.',
    price: 2.99,
    customizable: false
  },

  // Drinks
  {
    id: 'jarritos',
    category: 'Drinks',
    name: 'Jarritos Bottle',
    description: 'Mexican soda bottle.',
    price: 4.00,
    customizable: false
  },
  {
    id: 'small-coke',
    category: 'Drinks',
    name: 'Small Coca Cola Bottle',
    description: 'Small Coca Cola bottle.',
    price: 4.29,
    customizable: false
  },
  {
    id: 'large-coke',
    category: 'Drinks',
    name: 'Large Coca Cola Bottle',
    description: 'Large Coca Cola bottle.',
    price: 4.79,
    customizable: false
  },
  {
    id: 'water-bottle',
    category: 'Drinks',
    name: 'Water Bottle',
    description: 'Bottled water.',
    price: 2.50,
    customizable: false
  },
  {
    id: 'canned-soda',
    category: 'Drinks',
    name: 'Canned Soda',
    description: 'Canned soda.',
    price: 2.50,
    customizable: false
  },
  {
    id: 'agua-fresca-small',
    category: 'Drinks',
    name: 'Agua Fresca Small',
    description: 'Small agua fresca.',
    price: 3.79,
    customizable: false
  },
  {
    id: 'agua-fresca-large',
    category: 'Drinks',
    name: 'Agua Fresca Large',
    description: 'Large agua fresca.',
    price: 4.49,
    customizable: false
  }
];