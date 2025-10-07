'use client';

import { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import RecipeCard from '@/components/RecipeCard';
import SearchAndFilter from '@/components/SearchAndFilter';
import { Heart } from 'lucide-react';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecipes();
  }, [searchTerm, cuisineFilter, sortBy, page]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        cuisine: cuisineFilter,
        sortBy: sortBy,
        sortOrder: 'desc',
        page: page.toString(),
        limit: '12'
      });

      const response = await fetch(`/api/recipes?${params}`);
      const data = await response.json();
      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Recipes</h1>
          <p className="text-gray-600">Discover amazing recipes from our community</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            cuisineFilter={cuisineFilter}
            setCuisineFilter={setCuisineFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 rounded-lg ${
                            page === pageNum
                              ? 'bg-red-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || cuisineFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to share a delicious recipe!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}