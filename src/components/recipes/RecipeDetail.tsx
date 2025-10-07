import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Clock, Users, ChefHat, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Recipe, Comment } from '../../types/recipe';
import { useAuth } from '../../contexts/AuthContext';
import { RecipeService } from '../../services/recipeService';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onRecipeUpdate: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({ 
  recipe, 
  onBack, 
  onRecipeUpdate 
}) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const isLiked = user ? recipe.likedBy.includes(user.uid) : false;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like recipes');
      return;
    }

    try {
      await RecipeService.toggleLike(recipe.id, user.uid);
      
      const updatedRecipe = {
        ...recipe,
        likes: isLiked ? recipe.likes - 1 : recipe.likes + 1,
        likedBy: isLiked 
          ? recipe.likedBy.filter(id => id !== user.uid)
          : [...recipe.likedBy, user.uid]
      };
      
      onRecipeUpdate(updatedRecipe);
      toast.success(isLiked ? 'Recipe unliked' : 'Recipe liked!');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Recipe link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmittingComment(true);
    try {
      await RecipeService.addComment(recipe.id, {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userAvatar: user.photoURL || '',
        text: commentText.trim()
      });

      // Refresh the recipe to get updated comments
      const updatedRecipe = await RecipeService.getRecipe(recipe.id);
      if (updatedRecipe) {
        onRecipeUpdate(updatedRecipe);
      }

      setCommentText('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Recipe Image and Basic Info */}
      <Card className="mb-6">
        <div className="relative">
          <img
            src={recipe.image || '/placeholder.svg'}
            alt={recipe.title}
            className="w-full h-64 md:h-80 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4">
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-black/50 text-white">
              {recipe.cuisine}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={recipe.userAvatar} />
                <AvatarFallback>
                  {recipe.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{recipe.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(recipe.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'} transition-colors`}
              >
                <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {recipe.likes}
              </Button>
              
              <Button variant="ghost" className="text-muted-foreground">
                <MessageCircle className="h-5 w-5 mr-1" />
                {recipe.comments.length}
              </Button>

              <Button variant="ghost" onClick={handleShare} className="text-muted-foreground hover:text-primary">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-muted-foreground mb-6">{recipe.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Cook Time</p>
                <p className="font-medium">{recipe.cookingTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Servings</p>
                <p className="font-medium">{recipe.servings}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <ChefHat className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-medium">{recipe.nutrition.calories}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">P</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="font-medium">{recipe.nutrition.protein}g</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nutrition Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{recipe.nutrition.protein}g</p>
              <p className="text-sm text-muted-foreground">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{recipe.nutrition.fat}g</p>
              <p className="text-sm text-muted-foreground">Fat</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{recipe.nutrition.carbs}g</p>
              <p className="text-sm text-muted-foreground">Carbs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ingredients and Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle>Comments ({recipe.comments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add Comment */}
          {user && (
            <div className="mb-6">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback>
                    {(user.displayName || 'A').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    onClick={handleCommentSubmit}
                    disabled={isSubmittingComment || !commentText.trim()}
                    size="sm"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {recipe.comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              recipe.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.userAvatar} />
                    <AvatarFallback>
                      {comment.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};