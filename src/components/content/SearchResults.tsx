import { motion } from 'framer-motion';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTypedSelector } from '@/hooks/useTypedSelector';

export const SearchResults = () => {
  const { searchResults, loading } = useTypedSelector(state => state.content);
  const { searchQuery } = useTypedSelector(state => state.ui);

  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Start searching</h3>
        <p className="text-muted-foreground">
          Use the search bar above to find news, movies, and social posts
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm text-muted-foreground">Searching for "{searchQuery}"...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4">
          No results found for "{searchQuery}". Try different keywords or check your spelling.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>Suggestions:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Try more general terms</li>
            <li>Check for typos</li>
            <li>Try different keywords</li>
          </ul>
        </div>
      </div>
    );
  }

  const contentTypes = [...new Set(searchResults.map(item => item.type))];
  const sources = [...new Set(searchResults.map(item => item.source))];

  return (
    <div className="space-y-6">
      {/* Search Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Search Results</h2>
          <Badge variant="secondary" className="text-xs">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          </Badge>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[120px] h-8">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {contentTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[120px] h-8">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Latest</SelectItem>
              <SelectItem value="source">Source</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Type Distribution */}
      <div className="flex gap-2 flex-wrap">
        {contentTypes.map(type => {
          const count = searchResults.filter(item => item.type === type).length;
          return (
            <Badge key={type} variant="outline" className="text-xs capitalize">
              {type} ({count})
            </Badge>
          );
        })}
      </div>

      {/* Search Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {searchResults.map((item, index) => (
          <ContentCard key={item.id} content={item} index={index} />
        ))}
      </motion.div>
    </div>
  );
}; 