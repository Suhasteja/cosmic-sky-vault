import connectDB from './mongodb';
import Recipe from '@/models/Recipe';
import User from '@/models/User';

const sampleUsers = [
  {
    email: 'chef@flavorhub.com',
    name: 'Chef Maria',
    firebaseUid: 'sample-user-1',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    email: 'foodie@flavorhub.com',
    name: 'Foodie John',
    firebaseUid: 'sample-user-2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

const sampleRecipes = [
  {
    title: 'Classic Margherita Pizza',
    description: 'A traditional Italian pizza with fresh tomatoes, mozzarella, and basil. Simple yet delicious!',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
    cuisine: 'Italian',
    ingredients: [
      '1 pizza dough ball',
      '1/2 cup tomato sauce',
      '8 oz fresh mozzarella',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt and pepper to taste'
    ],
    steps: [
      'Preheat oven to 500°F (260°C)',
      'Roll out the pizza dough on a floured surface',
      'Spread tomato sauce evenly over the dough',
      'Tear mozzarella into pieces and distribute over sauce',
      'Drizzle with olive oil and season with salt and pepper',
      'Bake for 10-12 minutes until crust is golden',
      'Remove from oven and top with fresh basil leaves'
    ],
    nutrition: {
      calories: 320,
      protein: 15,
      fat: 12,
      carbs: 38
    },
    likes: 45,
    comments: []
  },
  {
    title: 'Chicken Tikka Masala',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces in a rich tomato-based sauce.',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=400&h=300&fit=crop',
    cuisine: 'Indian',
    ingredients: [
      '1 lb chicken breast, cut into cubes',
      '1 cup yogurt',
      '2 tbsp garam masala',
      '1 can diced tomatoes',
      '1 onion, diced',
      '3 cloves garlic, minced',
      '1 inch ginger, grated',
      '1 cup heavy cream',
      '2 tbsp butter',
      'Fresh cilantro for garnish'
    ],
    steps: [
      'Marinate chicken in yogurt and half the garam masala for 30 minutes',
      'Heat butter in a large pan over medium heat',
      'Add onion and cook until soft, about 5 minutes',
      'Add garlic and ginger, cook for 1 minute',
      'Add remaining garam masala and cook for 30 seconds',
      'Add tomatoes and simmer for 10 minutes',
      'Add chicken and cook for 15 minutes',
      'Stir in cream and simmer for 5 minutes',
      'Garnish with cilantro and serve with rice'
    ],
    nutrition: {
      calories: 420,
      protein: 35,
      fat: 18,
      carbs: 22
    },
    likes: 38,
    comments: []
  },
  {
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy chocolate chip cookies that are perfect for any occasion.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
    cuisine: 'American',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups chocolate chips'
    ],
    steps: [
      'Preheat oven to 375°F (190°C)',
      'Mix flour, baking soda, and salt in a bowl',
      'In another bowl, cream butter and both sugars',
      'Beat in eggs one at a time, then vanilla',
      'Gradually blend in flour mixture',
      'Stir in chocolate chips',
      'Drop rounded tablespoons onto ungreased cookie sheets',
      'Bake 9-11 minutes until golden brown',
      'Cool on baking sheet for 2 minutes before removing'
    ],
    nutrition: {
      calories: 150,
      protein: 2,
      fat: 8,
      carbs: 20
    },
    likes: 52,
    comments: []
  },
  {
    title: 'Pad Thai',
    description: 'Authentic Thai stir-fried noodles with shrimp, tofu, and a perfect balance of sweet, sour, and savory flavors.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
    cuisine: 'Thai',
    ingredients: [
      '8 oz rice noodles',
      '1/2 lb shrimp, peeled and deveined',
      '1/2 cup firm tofu, cubed',
      '2 eggs',
      '1/4 cup fish sauce',
      '3 tbsp brown sugar',
      '2 tbsp tamarind paste',
      '3 cloves garlic, minced',
      '2 shallots, sliced',
      '1 cup bean sprouts',
      '2 green onions, chopped',
      '1/4 cup peanuts, crushed',
      'Lime wedges for serving'
    ],
    steps: [
      'Soak rice noodles in warm water for 30 minutes',
      'Mix fish sauce, brown sugar, and tamarind paste for sauce',
      'Heat oil in a large wok over high heat',
      'Add garlic and shallots, stir-fry for 30 seconds',
      'Add shrimp and tofu, cook until shrimp is pink',
      'Push ingredients to one side, add beaten eggs',
      'Scramble eggs, then mix with other ingredients',
      'Add drained noodles and sauce, toss everything together',
      'Add bean sprouts and green onions, cook for 1 minute',
      'Serve with crushed peanuts and lime wedges'
    ],
    nutrition: {
      calories: 380,
      protein: 22,
      fat: 12,
      carbs: 45
    },
    likes: 41,
    comments: []
  },
  {
    title: 'Beef Tacos',
    description: 'Delicious ground beef tacos with fresh toppings and homemade seasoning.',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    cuisine: 'Mexican',
    ingredients: [
      '1 lb ground beef',
      '1 packet taco seasoning',
      '8 taco shells',
      '1 cup shredded lettuce',
      '1 cup diced tomatoes',
      '1 cup shredded cheese',
      '1/2 cup sour cream',
      '1/4 cup diced onions',
      'Salsa for serving'
    ],
    steps: [
      'Brown ground beef in a large skillet over medium heat',
      'Drain excess fat and add taco seasoning',
      'Add water as directed on seasoning packet',
      'Simmer for 5 minutes until sauce thickens',
      'Warm taco shells in oven according to package directions',
      'Fill shells with seasoned beef',
      'Top with lettuce, tomatoes, cheese, onions, and sour cream',
      'Serve with salsa on the side'
    ],
    nutrition: {
      calories: 320,
      protein: 20,
      fat: 18,
      carbs: 22
    },
    likes: 29,
    comments: []
  }
];

export async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Recipe.deleteMany({});
    await User.deleteMany({});
    
    // Create sample users
    const users = await User.insertMany(sampleUsers);
    
    // Create sample recipes with user references
    const recipes = sampleRecipes.map((recipe, index) => ({
      ...recipe,
      user: users[index % users.length]._id,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      updatedAt: new Date()
    }));
    
    await Recipe.insertMany(recipes);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users and ${recipes.length} recipes`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}