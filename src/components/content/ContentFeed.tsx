import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ContentCard } from './ContentCard';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { fetchContent } from '@/store/slices/contentSlice';

export const ContentFeed = () => {
  const dispatch = useAppDispatch();
  const { items, loading, searchResults } = useTypedSelector(state => state.content);
  const { searchQuery } = useTypedSelector(state => state.ui);
  const { categories, newsTopics, movieGenres, socialHashtags } = useTypedSelector(state => state.preferences);

  const enabledCategories = categories.filter(cat => cat.enabled).map(cat => cat.id);
  const displayItems = searchQuery ? searchResults : items;

  useEffect(() => {
    if (enabledCategories.length > 0) {
      dispatch(fetchContent({
        categories: enabledCategories,
        topics: newsTopics,
        genres: movieGenres,
        hashtags: socialHashtags,
      }));
    }
  }, [dispatch, enabledCategories, newsTopics, movieGenres, socialHashtags]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-64" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {displayItems.map((item, index) => (
        <ContentCard key={item.id} content={item} index={index} />
      ))}
    </motion.div>
  );
};