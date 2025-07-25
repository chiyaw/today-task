import { useState, useEffect, useRef } from 'react';
import { Search, Clock, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useDebounce } from '@/hooks/useDebounce';
import { setSearchQuery, clearSearchQuery } from '@/store/slices/uiSlice';
import { localSearch, clearSearchResults } from '@/store/slices/contentSlice';
import { formatTimeAgo } from '@/utils/formatters';

interface SearchDropdownProps {
  onClose?: () => void;
}

export const SearchDropdown = ({ onClose }: SearchDropdownProps) => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useTypedSelector(state => state.ui);
  const { searchResults, items } = useTypedSelector(state => state.content);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedSearchQuery = useDebounce(localSearchQuery, 200);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(setSearchQuery(debouncedSearchQuery));
      dispatch(localSearch(debouncedSearchQuery));
      setIsOpen(true);
    } else {
      dispatch(clearSearchResults());
      dispatch(clearSearchQuery());
      setIsOpen(false);
    }
  }, [debouncedSearchQuery, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    dispatch(clearSearchResults());
    dispatch(clearSearchQuery());
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    onClose?.();
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'news':
        return 'bg-blue-500';
      case 'entertainment':
        return 'bg-purple-500';
      case 'social':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const limitedResults = searchResults.slice(0, 6);
  const hasContent = items.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={hasContent ? "Search through loaded content..." : "Load content first to search..."}
          value={localSearchQuery}
          onChange={handleSearchChange}
          onFocus={() => localSearchQuery && setIsOpen(true)}
          disabled={!hasContent}
          className="pl-9 pr-20 h-10 bg-muted/50 border-0 focus:bg-background transition-colors"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {localSearchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {searchResults.length > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 p-0 flex items-center justify-center text-xs"
            >
              {searchResults.length}
            </Badge>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && localSearchQuery && hasContent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-[9999]"
          >
            <Card className="max-h-96 overflow-hidden bg-white dark:bg-gray-800 border shadow-xl">
              {limitedResults.length > 0 ? (
                <div className="overflow-y-auto max-h-80">
                  <div className="p-2 border-b text-xs text-muted-foreground font-medium bg-gray-50 dark:bg-gray-700">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found in {items.length} items
                  </div>
                  <div className="py-2">
                    {limitedResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleResultClick(item.url)}
                        className="flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-600 last:border-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48/gray/white?text=?';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${getContentTypeColor(item.type)}`} />
                            <span className="text-xs text-muted-foreground capitalize">
                              {item.type}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {item.source}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium line-clamp-2 mb-1 text-gray-900 dark:text-gray-100">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(item.publishedAt)}
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {searchResults.length > 6 && (
                    <div className="p-3 border-t bg-gray-50 dark:bg-gray-700">
                      <div className="text-xs text-muted-foreground text-center">
                        {searchResults.length - 6} more result{searchResults.length - 6 !== 1 ? 's' : ''} available
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    No results found for "{localSearchQuery}"
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Try different keywords from loaded content
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 