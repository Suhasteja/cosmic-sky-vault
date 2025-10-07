// Optional nutrition API integration
// This service provides automatic nutrition calculation using external APIs

export interface NutritionData {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface NutritionAPIResponse {
  calories: number;
  totalNutrients: {
    PROCNT?: { quantity: number }; // Protein
    FAT?: { quantity: number };    // Fat
    CHOCDF?: { quantity: number }; // Carbs
    FIBTG?: { quantity: number };  // Fiber
    SUGAR?: { quantity: number };  // Sugar
    NA?: { quantity: number };     // Sodium
  };
}

export class NutritionService {
  // Edamam API configuration
  private static readonly EDAMAM_APP_ID = process.env.VITE_EDAMAM_APP_ID || '';
  private static readonly EDAMAM_APP_KEY = process.env.VITE_EDAMAM_APP_KEY || '';
  private static readonly EDAMAM_BASE_URL = 'https://api.edamam.com/api/nutrition-details';

  // Spoonacular API configuration (alternative)
  private static readonly SPOONACULAR_API_KEY = process.env.VITE_SPOONACULAR_API_KEY || '';
  private static readonly SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

  /**
   * Calculate nutrition using Edamam API
   * Requires VITE_EDAMAM_APP_ID and VITE_EDAMAM_APP_KEY environment variables
   */
  static async calculateNutritionEdamam(
    title: string,
    ingredients: string[],
    servings: number = 1
  ): Promise<NutritionData | null> {
    if (!this.EDAMAM_APP_ID || !this.EDAMAM_APP_KEY) {
      console.warn('Edamam API credentials not configured');
      return null;
    }

    try {
      const response = await fetch(`${this.EDAMAM_BASE_URL}?app_id=${this.EDAMAM_APP_ID}&app_key=${this.EDAMAM_APP_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          ingr: ingredients
        })
      });

      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status}`);
      }

      const data: NutritionAPIResponse = await response.json();

      return {
        calories: Math.round((data.calories || 0) / servings),
        protein: Math.round((data.totalNutrients.PROCNT?.quantity || 0) / servings),
        fat: Math.round((data.totalNutrients.FAT?.quantity || 0) / servings),
        carbs: Math.round((data.totalNutrients.CHOCDF?.quantity || 0) / servings),
        fiber: Math.round((data.totalNutrients.FIBTG?.quantity || 0) / servings),
        sugar: Math.round((data.totalNutrients.SUGAR?.quantity || 0) / servings),
        sodium: Math.round((data.totalNutrients.NA?.quantity || 0) / servings),
      };
    } catch (error) {
      console.error('Error calculating nutrition with Edamam:', error);
      return null;
    }
  }

  /**
   * Estimate nutrition using Spoonacular API
   * Requires VITE_SPOONACULAR_API_KEY environment variable
   */
  static async calculateNutritionSpoonacular(
    title: string,
    ingredients: string[],
    servings: number = 1
  ): Promise<NutritionData | null> {
    if (!this.SPOONACULAR_API_KEY) {
      console.warn('Spoonacular API key not configured');
      return null;
    }

    try {
      // Use the recipe guess nutrition endpoint
      const response = await fetch(
        `${this.SPOONACULAR_BASE_URL}/guessNutrition?title=${encodeURIComponent(title)}&apiKey=${this.SPOONACULAR_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Spoonacular API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        calories: Math.round((data.calories?.value || 0) / servings),
        protein: Math.round((data.protein?.value || 0) / servings),
        fat: Math.round((data.fat?.value || 0) / servings),
        carbs: Math.round((data.carbohydrates?.value || 0) / servings),
      };
    } catch (error) {
      console.error('Error calculating nutrition with Spoonacular:', error);
      return null;
    }
  }

  /**
   * Simple nutrition estimation based on common ingredients
   * This is a fallback when APIs are not available
   */
  static estimateNutrition(
    ingredients: string[],
    servings: number = 1
  ): NutritionData {
    // Simple estimation based on common ingredients
    // This is very basic and not accurate - just for demonstration
    const estimations: { [key: string]: Partial<NutritionData> } = {
      // Proteins
      'chicken': { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
      'beef': { calories: 250, protein: 26, fat: 15, carbs: 0 },
      'salmon': { calories: 208, protein: 22, fat: 12, carbs: 0 },
      'egg': { calories: 155, protein: 13, fat: 11, carbs: 1.1 },
      
      // Carbs
      'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      'pasta': { calories: 220, protein: 8, fat: 1.1, carbs: 44 },
      'bread': { calories: 265, protein: 9, fat: 3.2, carbs: 49 },
      'potato': { calories: 77, protein: 2, fat: 0.1, carbs: 17 },
      
      // Vegetables
      'tomato': { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
      'onion': { calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3 },
      'garlic': { calories: 149, protein: 6.4, fat: 0.5, carbs: 33 },
      
      // Fats
      'oil': { calories: 884, protein: 0, fat: 100, carbs: 0 },
      'butter': { calories: 717, protein: 0.9, fat: 81, carbs: 0.1 },
    };

    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    ingredients.forEach(ingredient => {
      const lowerIngredient = ingredient.toLowerCase();
      
      // Find matching ingredient in our estimation table
      const match = Object.keys(estimations).find(key => 
        lowerIngredient.includes(key)
      );

      if (match) {
        const nutrition = estimations[match];
        // Assume 100g serving for estimation
        const factor = 0.1; // Adjust based on typical recipe portions
        
        totalCalories += (nutrition.calories || 0) * factor;
        totalProtein += (nutrition.protein || 0) * factor;
        totalFat += (nutrition.fat || 0) * factor;
        totalCarbs += (nutrition.carbs || 0) * factor;
      } else {
        // Default estimation for unknown ingredients
        totalCalories += 50;
        totalProtein += 2;
        totalFat += 1;
        totalCarbs += 8;
      }
    });

    return {
      calories: Math.round(totalCalories / servings),
      protein: Math.round(totalProtein / servings),
      fat: Math.round(totalFat / servings),
      carbs: Math.round(totalCarbs / servings),
    };
  }

  /**
   * Main method to calculate nutrition - tries APIs first, falls back to estimation
   */
  static async calculateNutrition(
    title: string,
    ingredients: string[],
    servings: number = 1
  ): Promise<NutritionData> {
    // Try Edamam first
    let nutrition = await this.calculateNutritionEdamam(title, ingredients, servings);
    
    if (nutrition) {
      return nutrition;
    }

    // Try Spoonacular as fallback
    nutrition = await this.calculateNutritionSpoonacular(title, ingredients, servings);
    
    if (nutrition) {
      return nutrition;
    }

    // Use simple estimation as final fallback
    return this.estimateNutrition(ingredients, servings);
  }
}