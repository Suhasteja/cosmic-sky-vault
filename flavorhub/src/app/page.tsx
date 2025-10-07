'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types';
import { Heart, Clock, Users, Search, Filter } from 'lucide-react';
import RecipeCard from '@/components/RecipeCard';
import SearchAndFilter from '@/components/SearchAndFilter';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchRecipes();
  }, [searchTerm, cuisineFilter, sortBy]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        cuisine: cuisineFilter,
        sortBy: sortBy,
        sortOrder: 'desc',
        limit: '12'
      });

      const response = await fetch(`/api/recipes?${params}`);
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing Recipes
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Share your favorite recipes, discover new flavors, and connect with food lovers from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recipes"
              className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Recipes
            </Link>
            <Link
              href="/create"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-500 transition-colors"
            >
              Share Your Recipe
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            cuisineFilter={cuisineFilter}
            setCuisineFilter={setCuisineFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Recipes</h2>
            <Link
              href="/recipes"
              className="text-red-500 hover:text-red-600 font-semibold flex items-center gap-2"
            >
              View All
              <Users className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
              <p className="text-gray-500 mb-6">Be the first to share a delicious recipe!</p>
              <Link
                href="/create"
                className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Create Recipe
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">500+</div>
              <div className="text-gray-600">Recipes Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">1,200+</div>
              <div className="text-gray-600">Happy Cooks</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">50+</div>
              <div className="text-gray-600">Cuisines</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
