import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { RecipeFilters, CUISINES, DIFFICULTY_LEVELS, POPULAR_TAGS } from '../../types/recipe';

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
  onClearFilters: () => void;
}

export const RecipeFiltersComponent: React.FC<RecipeFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const updateFilter = (key: keyof RecipeFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const toggleTag = (tag: string) => {
    const updatedTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    updateFilter('tags', updatedTags);
  };

  const hasActiveFilters = 
    filters.search ||
    filters.cuisine !== 'All' ||
    filters.difficulty !== 'All' ||
    filters.tags.length > 0 ||
    filters.minCalories > 0 ||
    filters.maxCalories < 2000;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search recipes, ingredients..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={filters.cuisine} onValueChange={(value) => updateFilter('cuisine', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              {CUISINES.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="mostLiked">Most Liked</SelectItem>
              <SelectItem value="leastCalories">Least Calories</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="ml-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={onClearFilters} size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Calorie Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Calories: {filters.minCalories} - {filters.maxCalories}
              </Label>
              <div className="px-2">
                <Slider
                  value={[filters.minCalories, filters.maxCalories]}
                  onValueChange={([min, max]) => {
                    updateFilter('minCalories', min);
                    updateFilter('maxCalories', max);
                  }}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {filters.tags.includes(tag) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            {filters.search && (
              <Badge variant="secondary">
                Search: "{filters.search}"
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('search', '')}
                />
              </Badge>
            )}
            {filters.cuisine !== 'All' && (
              <Badge variant="secondary">
                {filters.cuisine}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('cuisine', 'All')}
                />
              </Badge>
            )}
            {filters.difficulty !== 'All' && (
              <Badge variant="secondary">
                {filters.difficulty}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilter('difficulty', 'All')}
                />
              </Badge>
            )}
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
            {(filters.minCalories > 0 || filters.maxCalories < 2000) && (
              <Badge variant="secondary">
                {filters.minCalories}-{filters.maxCalories} cal
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => {
                    updateFilter('minCalories', 0);
                    updateFilter('maxCalories', 2000);
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};