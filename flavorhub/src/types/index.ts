export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Recipe {
  _id: string;
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
  comments: Comment[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}