'use client';

import { Search, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  cuisineFilter: string;
  setCuisineFilter: (cuisine: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const cuisines = [
  'all',
  'Italian',
  'Indian',
  'Chinese',
  'Mexican',
  'Japanese',
  'Thai',
  'French',
  'Mediterranean',
  'American',
  'Korean',
  'Vietnamese'
];

const sortOptions = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'likes', label: 'Most Popular' },
  { value: 'title', label: 'Alphabetical' }
];

export default function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  cuisineFilter,
  setCuisineFilter,
  sortBy,
  setSortBy
}: SearchAndFilterProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search recipes, ingredients, or cuisines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {/* Cuisine Filter */}
        <select
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
        >
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine === 'all' ? 'All Cuisines' : cuisine}
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {(searchTerm || cuisineFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setCuisineFilter('all');
            }}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}