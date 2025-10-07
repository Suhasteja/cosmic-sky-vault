import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { RecipeForm } from '../components/recipes/RecipeForm';
import { RecipeDetail } from '../components/recipes/RecipeDetail';
import { RecipeFiltersComponent } from '../components/recipes/RecipeFilters';
import { Recipe, RecipeFilters } from '../types/recipe';
import { RecipeService } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { DocumentSnapshot } from 'firebase/firestore';

type ViewMode = 'list' | 'create' | 'detail';

export const RecipesPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>({
    search: '',
    cuisine: 'All',
    difficulty: 'All',
    maxCalories: 2000,
    minCalories: 0,
    tags: [],
    sortBy: 'newest'
  });

  const loadRecipes = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setRecipes([]);
        setLastDoc(null);
      }

      const { recipes: newRecipes, lastDoc: newLastDoc } = await RecipeService.getRecipes(
        filters,
        isLoadMore ? lastDoc : undefined
      );

      if (isLoadMore) {
        setRecipes(prev => [...prev, ...newRecipes]);
      } else {
        setRecipes(newRecipes);
      }

      setLastDoc(newLastDoc);
      setHasMore(newRecipes.length === 12); // If we got less than the limit, no more recipes
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [filters]);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setViewMode('detail');
  };

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  const handleCreateSuccess = () => {
    setViewMode('list');
    loadRecipes(); // Refresh the list
    toast.success('Recipe created successfully!');
  };

  const handleFiltersChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      cuisine: 'All',
      difficulty: 'All',
      maxCalories: 2000,
      minCalories: 0,
      tags: [],
      sortBy: 'newest'
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadRecipes(true);
    }
  };

  if (viewMode === 'create') {
    return (
      <RecipeForm
        onSuccess={handleCreateSuccess}
        onCancel={() => setViewMode('list')}
      />
    );
  }

  if (viewMode === 'detail' && selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setViewMode('list')}
        onRecipeUpdate={handleRecipeUpdate}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">FlavorHub</h1>
          <p className="text-muted-foreground">Discover and share amazing recipes</p>
        </div>
        {user && (
          <Button onClick={() => setViewMode('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Recipe
          </Button>
        )}
      </div>

      {/* Filters */}
      <RecipeFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading recipes...</span>
        </div>
      ) : (
        <>
          {/* Recipe Grid */}
          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || filters.cuisine !== 'All' || filters.difficulty !== 'All' || filters.tags.length > 0
                  ? 'Try adjusting your filters to find more recipes.'
                  : 'Be the first to share a delicious recipe!'}
              </p>
              {user && (
                <Button onClick={() => setViewMode('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Recipe
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onRecipeClick={handleRecipeClick}
                    onRecipeUpdate={handleRecipeUpdate}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Recipes'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};