'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Recipe } from '@/types';
import { Heart, Clock, MessageCircle, Share2, User } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(recipe.likes);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipe._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isLiked ? 'unlike' : 'like' })
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.origin + `/recipes/${recipe._id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/recipes/${recipe._id}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/recipes/${recipe._id}`}>
        <div className="relative h-48 w-full">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-sm font-semibold text-gray-700">{recipe.cuisine}</span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/recipes/${recipe._id}`}>
          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 hover:text-red-500 transition-colors">
            {recipe.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{recipe.user.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.nutrition.calories} cal</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                isLiked
                  ? 'bg-red-100 text-red-500'
                  : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>

            <Link
              href={`/recipes/${recipe._id}#comments`}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{recipe.comments.length}</span>
            </Link>
          </div>

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-500 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}