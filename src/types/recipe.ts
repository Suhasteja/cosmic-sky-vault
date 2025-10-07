export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this recipe
  comments: Comment[];
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  cookingTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: Date;
}

export interface RecipeFormData {
  title: string;
  description: string;
  image: File | null;
  cuisine: string;
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  cookingTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface RecipeFilters {
  search: string;
  cuisine: string;
  difficulty: string;
  maxCalories: number;
  minCalories: number;
  tags: string[];
  sortBy: 'newest' | 'oldest' | 'mostLiked' | 'leastCalories';
}

export const CUISINES = [
  'All',
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'Japanese',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Korean',
  'Vietnamese',
  'Greek',
  'Spanish',
  'Middle Eastern',
  'Other'
];

export const DIFFICULTY_LEVELS = ['All', 'Easy', 'Medium', 'Hard'];

export const POPULAR_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'High-Protein',
  'Quick',
  'Healthy',
  'Comfort Food',
  'Dessert',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Appetizer'
];