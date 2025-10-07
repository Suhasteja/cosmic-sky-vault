import React, { useState, useEffect } from 'react';
import { User, Heart, MessageCircle, ChefHat, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { RecipeDetail } from '../components/recipes/RecipeDetail';
import { Recipe } from '../types/recipe';
import { RecipeService } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-recipes');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load user's recipes
      const recipes = await RecipeService.getUserRecipes(user.uid);
      setUserRecipes(recipes);

      // Load liked recipes (simplified - in a real app you'd have a separate collection)
      const { recipes: allRecipes } = await RecipeService.getRecipes();
      const liked = allRecipes.filter(recipe => recipe.likedBy.includes(user.uid));
      setLikedRecipes(liked);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleRecipeUpdate = (updatedRecipe: Recipe) => {
    setUserRecipes(prev => 
      prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    setLikedRecipes(prev => 
      prev.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    if (selectedRecipe?.id === updatedRecipe.id) {
      setSelectedRecipe(updatedRecipe);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Please log in</h2>
        <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
      </div>
    );
  }

  if (selectedRecipe) {
    return (
      <RecipeDetail
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        onRecipeUpdate={handleRecipeUpdate}
      />
    );
  }

  const totalLikes = userRecipes.reduce((sum, recipe) => sum + recipe.likes, 0);
  const totalComments = userRecipes.reduce((sum, recipe) => sum + recipe.comments.length, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback className="text-2xl">
                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                {user.displayName || 'Anonymous Chef'}
              </h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <ChefHat className="h-4 w-4" />
                  <span>{userRecipes.length} recipes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{totalLikes} likes received</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{totalComments} comments received</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDistanceToNow(new Date(user.metadata.creationTime || ''), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{userRecipes.length}</div>
            <div className="text-sm text-muted-foreground">Recipes Created</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalLikes}</div>
            <div className="text-sm text-muted-foreground">Total Likes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{likedRecipes.length}</div>
            <div className="text-sm text-muted-foreground">Recipes Liked</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalComments}</div>
            <div className="text-sm text-muted-foreground">Comments Received</div>
          </CardContent>
        </Card>
      </div>

      {/* Recipe Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
          <TabsTrigger value="liked-recipes">Liked Recipes</TabsTrigger>
        </TabsList>

        <TabsContent value="my-recipes" className="mt-6">
          {loading ? (
            <div className="text-center py-8">Loading your recipes...</div>
          ) : userRecipes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No recipes yet</h3>
                <p className="text-muted-foreground">
                  Start sharing your culinary creations with the world!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRecipeClick={handleRecipeClick}
                  onRecipeUpdate={handleRecipeUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked-recipes" className="mt-6">
          {loading ? (
            <div className="text-center py-8">Loading liked recipes...</div>
          ) : likedRecipes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No liked recipes yet</h3>
                <p className="text-muted-foreground">
                  Start exploring and liking recipes you love!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onRecipeClick={handleRecipeClick}
                  onRecipeUpdate={handleRecipeUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};