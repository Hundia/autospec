export interface MockUser {
  id: string
  name: string
  email: string
  avatar: string
}

export interface MockRecipe {
  id: string
  title: string
  description: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  imageColor: string
  ingredients: { name: string; quantity: number; unit: string; category: string }[]
  calories: number
}

export interface MockMealSlot {
  day: string
  dayShort: string
  meals: {
    type: string
    recipe?: { title: string; prepTime: number }
  }[]
}

export interface MockShoppingItem {
  name: string
  quantity: number
  unit: string
  checked: boolean
  recipes: string[]
}

export interface MockShoppingGroup {
  category: string
  icon: string
  items: MockShoppingItem[]
}

export const mockUsers: MockUser[] = [
  { id: '1', name: 'Jamie Chen', email: 'jamie@example.com', avatar: '👩‍💼' },
  { id: '2', name: 'Morgan Davis', email: 'morgan@example.com', avatar: '👨‍👧‍👦' },
  { id: '3', name: 'Pat Rivera', email: 'pat@example.com', avatar: '🧑‍🎓' },
]

export const mockRecipes: MockRecipe[] = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    tags: ['Italian', 'Pasta', 'Quick'],
    imageColor: '#fef3c7',
    ingredients: [
      { name: 'Spaghetti', quantity: 400, unit: 'g', category: 'Pantry' },
      { name: 'Pancetta', quantity: 200, unit: 'g', category: 'Meat' },
      { name: 'Eggs', quantity: 4, unit: 'whole', category: 'Dairy' },
      { name: 'Parmesan', quantity: 100, unit: 'g', category: 'Dairy' },
      { name: 'Black Pepper', quantity: 2, unit: 'tsp', category: 'Pantry' },
    ],
    calories: 520,
  },
  {
    id: '2',
    title: 'Thai Green Curry',
    description: 'Aromatic curry with coconut milk, vegetables, and fresh basil',
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    difficulty: 'medium',
    tags: ['Asian', 'Curry', 'Spicy'],
    imageColor: '#dcfce7',
    ingredients: [
      { name: 'Chicken Breast', quantity: 500, unit: 'g', category: 'Meat' },
      { name: 'Coconut Milk', quantity: 400, unit: 'ml', category: 'Pantry' },
      { name: 'Green Curry Paste', quantity: 3, unit: 'tbsp', category: 'Pantry' },
      { name: 'Thai Basil', quantity: 1, unit: 'cup', category: 'Produce' },
      { name: 'Bell Peppers', quantity: 2, unit: 'whole', category: 'Produce' },
      { name: 'Bamboo Shoots', quantity: 200, unit: 'g', category: 'Pantry' },
    ],
    calories: 380,
  },
  {
    id: '3',
    title: 'Classic Caesar Salad',
    description: 'Crispy romaine with homemade dressing, croutons, and parmesan',
    prepTime: 15,
    cookTime: 0,
    servings: 2,
    difficulty: 'easy',
    tags: ['Salad', 'Quick', 'Healthy'],
    imageColor: '#d1fae5',
    ingredients: [
      { name: 'Romaine Lettuce', quantity: 2, unit: 'heads', category: 'Produce' },
      { name: 'Parmesan', quantity: 50, unit: 'g', category: 'Dairy' },
      { name: 'Croutons', quantity: 1, unit: 'cup', category: 'Bakery' },
      { name: 'Anchovy Fillets', quantity: 4, unit: 'whole', category: 'Pantry' },
      { name: 'Lemon', quantity: 1, unit: 'whole', category: 'Produce' },
    ],
    calories: 280,
  },
  {
    id: '4',
    title: 'Beef Tacos',
    description: 'Seasoned ground beef in warm tortillas with fresh toppings',
    prepTime: 10,
    cookTime: 15,
    servings: 6,
    difficulty: 'easy',
    tags: ['Mexican', 'Quick', 'Budget'],
    imageColor: '#fed7aa',
    ingredients: [
      { name: 'Ground Beef', quantity: 500, unit: 'g', category: 'Meat' },
      { name: 'Tortillas', quantity: 12, unit: 'whole', category: 'Bakery' },
      { name: 'Tomatoes', quantity: 3, unit: 'whole', category: 'Produce' },
      { name: 'Cheddar Cheese', quantity: 150, unit: 'g', category: 'Dairy' },
      { name: 'Sour Cream', quantity: 100, unit: 'ml', category: 'Dairy' },
      { name: 'Taco Seasoning', quantity: 2, unit: 'tbsp', category: 'Pantry' },
    ],
    calories: 420,
  },
  {
    id: '5',
    title: 'Mushroom Risotto',
    description: 'Creamy arborio rice with mixed mushrooms and white wine',
    prepTime: 10,
    cookTime: 35,
    servings: 4,
    difficulty: 'hard',
    tags: ['Italian', 'Vegetarian', 'Comfort'],
    imageColor: '#f5f5f4',
    ingredients: [
      { name: 'Arborio Rice', quantity: 300, unit: 'g', category: 'Pantry' },
      { name: 'Mixed Mushrooms', quantity: 400, unit: 'g', category: 'Produce' },
      { name: 'White Wine', quantity: 150, unit: 'ml', category: 'Pantry' },
      { name: 'Parmesan', quantity: 80, unit: 'g', category: 'Dairy' },
      { name: 'Vegetable Stock', quantity: 1, unit: 'L', category: 'Pantry' },
      { name: 'Butter', quantity: 50, unit: 'g', category: 'Dairy' },
    ],
    calories: 450,
  },
  {
    id: '6',
    title: 'Avocado Toast',
    description: 'Sourdough toast topped with smashed avocado, cherry tomatoes, and microgreens',
    prepTime: 5,
    cookTime: 3,
    servings: 2,
    difficulty: 'easy',
    tags: ['Breakfast', 'Quick', 'Healthy', 'Vegetarian'],
    imageColor: '#d9f99d',
    ingredients: [
      { name: 'Sourdough Bread', quantity: 2, unit: 'slices', category: 'Bakery' },
      { name: 'Avocado', quantity: 1, unit: 'whole', category: 'Produce' },
      { name: 'Cherry Tomatoes', quantity: 8, unit: 'whole', category: 'Produce' },
      { name: 'Lemon', quantity: 0.5, unit: 'whole', category: 'Produce' },
      { name: 'Red Pepper Flakes', quantity: 0.5, unit: 'tsp', category: 'Pantry' },
    ],
    calories: 310,
  },
]

export const mockMealPlan: MockMealSlot[] = [
  { day: 'Monday', dayShort: 'Mon', meals: [
    { type: 'Breakfast', recipe: { title: 'Avocado Toast', prepTime: 5 } },
    { type: 'Lunch', recipe: { title: 'Caesar Salad', prepTime: 15 } },
    { type: 'Dinner', recipe: { title: 'Pasta Carbonara', prepTime: 15 } },
  ]},
  { day: 'Tuesday', dayShort: 'Tue', meals: [
    { type: 'Breakfast' },
    { type: 'Lunch', recipe: { title: 'Beef Tacos', prepTime: 10 } },
    { type: 'Dinner', recipe: { title: 'Thai Green Curry', prepTime: 20 } },
  ]},
  { day: 'Wednesday', dayShort: 'Wed', meals: [
    { type: 'Breakfast', recipe: { title: 'Avocado Toast', prepTime: 5 } },
    { type: 'Lunch' },
    { type: 'Dinner', recipe: { title: 'Mushroom Risotto', prepTime: 10 } },
  ]},
  { day: 'Thursday', dayShort: 'Thu', meals: [
    { type: 'Breakfast' },
    { type: 'Lunch', recipe: { title: 'Caesar Salad', prepTime: 15 } },
    { type: 'Dinner' },
  ]},
  { day: 'Friday', dayShort: 'Fri', meals: [
    { type: 'Breakfast', recipe: { title: 'Avocado Toast', prepTime: 5 } },
    { type: 'Lunch', recipe: { title: 'Beef Tacos', prepTime: 10 } },
    { type: 'Dinner', recipe: { title: 'Pasta Carbonara', prepTime: 15 } },
  ]},
  { day: 'Saturday', dayShort: 'Sat', meals: [
    { type: 'Breakfast' },
    { type: 'Lunch', recipe: { title: 'Thai Green Curry', prepTime: 20 } },
    { type: 'Dinner', recipe: { title: 'Mushroom Risotto', prepTime: 10 } },
  ]},
  { day: 'Sunday', dayShort: 'Sun', meals: [
    { type: 'Breakfast', recipe: { title: 'Avocado Toast', prepTime: 5 } },
    { type: 'Lunch' },
    { type: 'Dinner', recipe: { title: 'Thai Green Curry', prepTime: 20 } },
  ]},
]

export const mockShoppingList: MockShoppingGroup[] = [
  {
    category: 'Produce',
    icon: '🥬',
    items: [
      { name: 'Romaine Lettuce', quantity: 2, unit: 'heads', checked: false, recipes: ['Caesar Salad'] },
      { name: 'Avocado', quantity: 4, unit: 'whole', checked: false, recipes: ['Avocado Toast'] },
      { name: 'Cherry Tomatoes', quantity: 24, unit: 'whole', checked: true, recipes: ['Avocado Toast'] },
      { name: 'Bell Peppers', quantity: 2, unit: 'whole', checked: false, recipes: ['Thai Green Curry'] },
      { name: 'Thai Basil', quantity: 2, unit: 'cups', checked: false, recipes: ['Thai Green Curry'] },
      { name: 'Mixed Mushrooms', quantity: 800, unit: 'g', checked: false, recipes: ['Mushroom Risotto'] },
      { name: 'Lemon', quantity: 2, unit: 'whole', checked: true, recipes: ['Caesar Salad', 'Avocado Toast'] },
      { name: 'Tomatoes', quantity: 3, unit: 'whole', checked: false, recipes: ['Beef Tacos'] },
    ],
  },
  {
    category: 'Meat',
    icon: '🥩',
    items: [
      { name: 'Pancetta', quantity: 400, unit: 'g', checked: false, recipes: ['Pasta Carbonara'] },
      { name: 'Chicken Breast', quantity: 1000, unit: 'g', checked: false, recipes: ['Thai Green Curry'] },
      { name: 'Ground Beef', quantity: 500, unit: 'g', checked: true, recipes: ['Beef Tacos'] },
    ],
  },
  {
    category: 'Dairy',
    icon: '🧀',
    items: [
      { name: 'Parmesan', quantity: 230, unit: 'g', checked: false, recipes: ['Carbonara', 'Caesar Salad', 'Risotto'] },
      { name: 'Eggs', quantity: 8, unit: 'whole', checked: false, recipes: ['Pasta Carbonara'] },
      { name: 'Cheddar Cheese', quantity: 150, unit: 'g', checked: false, recipes: ['Beef Tacos'] },
      { name: 'Sour Cream', quantity: 100, unit: 'ml', checked: true, recipes: ['Beef Tacos'] },
      { name: 'Butter', quantity: 100, unit: 'g', checked: false, recipes: ['Mushroom Risotto'] },
    ],
  },
  {
    category: 'Pantry',
    icon: '🫙',
    items: [
      { name: 'Spaghetti', quantity: 800, unit: 'g', checked: false, recipes: ['Pasta Carbonara'] },
      { name: 'Coconut Milk', quantity: 800, unit: 'ml', checked: false, recipes: ['Thai Green Curry'] },
      { name: 'Green Curry Paste', quantity: 6, unit: 'tbsp', checked: false, recipes: ['Thai Green Curry'] },
      { name: 'Arborio Rice', quantity: 600, unit: 'g', checked: false, recipes: ['Mushroom Risotto'] },
      { name: 'White Wine', quantity: 300, unit: 'ml', checked: true, recipes: ['Mushroom Risotto'] },
      { name: 'Vegetable Stock', quantity: 2, unit: 'L', checked: false, recipes: ['Mushroom Risotto'] },
      { name: 'Taco Seasoning', quantity: 2, unit: 'tbsp', checked: false, recipes: ['Beef Tacos'] },
    ],
  },
  {
    category: 'Bakery',
    icon: '🍞',
    items: [
      { name: 'Sourdough Bread', quantity: 8, unit: 'slices', checked: false, recipes: ['Avocado Toast'] },
      { name: 'Tortillas', quantity: 12, unit: 'whole', checked: false, recipes: ['Beef Tacos'] },
      { name: 'Croutons', quantity: 2, unit: 'cups', checked: true, recipes: ['Caesar Salad'] },
    ],
  },
]
