import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Recipe, Comment, RecipeFormData, RecipeFilters } from '../types/recipe';

const RECIPES_COLLECTION = 'recipes';

export class RecipeService {
  // Upload image to Firebase Storage
  static async uploadImage(file: File, recipeId: string): Promise<string> {
    const imageRef = ref(storage, `recipes/${recipeId}/${file.name}`);
    const snapshot = await uploadBytes(imageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  // Delete image from Firebase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }

  // Create a new recipe
  static async createRecipe(recipeData: RecipeFormData, userId: string, userName: string, userAvatar?: string): Promise<string> {
    try {
      // First create the recipe document to get an ID
      const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
        title: recipeData.title,
        description: recipeData.description,
        image: '', // Will be updated after image upload
        cuisine: recipeData.cuisine,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        nutrition: recipeData.nutrition,
        likes: 0,
        likedBy: [],
        comments: [],
        userId,
        userName,
        userAvatar: userAvatar || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        cookingTime: recipeData.cookingTime,
        servings: recipeData.servings,
        difficulty: recipeData.difficulty,
        tags: recipeData.tags
      });

      // Upload image if provided
      let imageUrl = '';
      if (recipeData.image) {
        imageUrl = await this.uploadImage(recipeData.image, docRef.id);
        // Update the recipe with the image URL
        await updateDoc(docRef, { image: imageUrl });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  // Get all recipes with optional filters
  static async getRecipes(filters?: Partial<RecipeFilters>, lastDoc?: DocumentSnapshot): Promise<{ recipes: Recipe[], lastDoc: DocumentSnapshot | null }> {
    try {
      let q = query(collection(db, RECIPES_COLLECTION));

      // Apply filters
      if (filters?.cuisine && filters.cuisine !== 'All') {
        q = query(q, where('cuisine', '==', filters.cuisine));
      }

      if (filters?.difficulty && filters.difficulty !== 'All') {
        q = query(q, where('difficulty', '==', filters.difficulty));
      }

      if (filters?.tags && filters.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', filters.tags));
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'oldest':
          q = query(q, orderBy('createdAt', 'asc'));
          break;
        case 'mostLiked':
          q = query(q, orderBy('likes', 'desc'));
          break;
        case 'leastCalories':
          q = query(q, orderBy('nutrition.calories', 'asc'));
          break;
        default:
          q = query(q, orderBy('createdAt', 'desc'));
      }

      // Pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(12));

      const snapshot = await getDocs(q);
      const recipes: Recipe[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        recipes.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          comments: data.comments.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toDate()
          }))
        } as Recipe);
      });

      // Filter by search term and calories on client side (Firestore limitations)
      let filteredRecipes = recipes;

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredRecipes = recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(searchTerm) ||
          recipe.description.toLowerCase().includes(searchTerm) ||
          recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))
        );
      }

      if (filters?.minCalories || filters?.maxCalories) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          const calories = recipe.nutrition.calories;
          const minCal = filters.minCalories || 0;
          const maxCal = filters.maxCalories || Infinity;
          return calories >= minCal && calories <= maxCal;
        });
      }

      const lastDocument = snapshot.docs[snapshot.docs.length - 1] || null;

      return { recipes: filteredRecipes, lastDoc: lastDocument };
    } catch (error) {
      console.error('Error getting recipes:', error);
      throw error;
    }
  }

  // Get a single recipe by ID
  static async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const docRef = doc(db, RECIPES_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          comments: data.comments.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toDate()
          }))
        } as Recipe;
      }

      return null;
    } catch (error) {
      console.error('Error getting recipe:', error);
      throw error;
    }
  }

  // Get recipes by user ID
  static async getUserRecipes(userId: string): Promise<Recipe[]> {
    try {
      const q = query(
        collection(db, RECIPES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const recipes: Recipe[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        recipes.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          comments: data.comments.map((comment: any) => ({
            ...comment,
            createdAt: comment.createdAt.toDate()
          }))
        } as Recipe);
      });

      return recipes;
    } catch (error) {
      console.error('Error getting user recipes:', error);
      throw error;
    }
  }

  // Update a recipe
  static async updateRecipe(id: string, recipeData: Partial<RecipeFormData>): Promise<void> {
    try {
      const docRef = doc(db, RECIPES_COLLECTION, id);
      
      const updateData: any = {
        ...recipeData,
        updatedAt: Timestamp.now()
      };

      // Handle image update
      if (recipeData.image) {
        const imageUrl = await this.uploadImage(recipeData.image, id);
        updateData.image = imageUrl;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  }

  // Delete a recipe
  static async deleteRecipe(id: string, imageUrl?: string): Promise<void> {
    try {
      // Delete image from storage if exists
      if (imageUrl) {
        await this.deleteImage(imageUrl);
      }

      // Delete recipe document
      await deleteDoc(doc(db, RECIPES_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }

  // Like/Unlike a recipe
  static async toggleLike(recipeId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, RECIPES_COLLECTION, recipeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const likedBy = data.likedBy || [];
        const isLiked = likedBy.includes(userId);

        if (isLiked) {
          // Unlike
          await updateDoc(docRef, {
            likes: increment(-1),
            likedBy: arrayRemove(userId)
          });
        } else {
          // Like
          await updateDoc(docRef, {
            likes: increment(1),
            likedBy: arrayUnion(userId)
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Add a comment to a recipe
  static async addComment(recipeId: string, comment: Omit<Comment, 'id' | 'createdAt'>): Promise<void> {
    try {
      const docRef = doc(db, RECIPES_COLLECTION, recipeId);
      const newComment: Comment = {
        id: Date.now().toString(), // Simple ID generation
        ...comment,
        createdAt: new Date()
      };

      await updateDoc(docRef, {
        comments: arrayUnion({
          ...newComment,
          createdAt: Timestamp.fromDate(newComment.createdAt)
        })
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Delete a comment from a recipe
  static async deleteComment(recipeId: string, commentId: string): Promise<void> {
    try {
      const docRef = doc(db, RECIPES_COLLECTION, recipeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const comments = data.comments || [];
        const updatedComments = comments.filter((comment: any) => comment.id !== commentId);

        await updateDoc(docRef, {
          comments: updatedComments
        });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}