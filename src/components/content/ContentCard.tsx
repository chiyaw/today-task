import { motion } from 'framer-motion';
import { Heart, ExternalLink, Clock, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ContentItem } from '@/types/content';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { formatTimeAgo, formatEngagement, getContentTypeGradient } from '@/utils/formatters';

interface ContentCardProps {
  content: ContentItem;
  index?: number;
}

export const ContentCard = ({ content, index = 0 }: ContentCardProps) => {
  const dispatch = useAppDispatch();
  const favorites = useTypedSelector(state => state.favorites.items);
  const isFavorited = favorites.some(item => item.id === content.id);

  const handleToggleFavorite = () => {
    if (isFavorited) {
      dispatch(removeFavorite(content.id));
    } else {
      dispatch(addFavorite(content));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden bg-gradient-card border-0 shadow-card hover:shadow-primary transition-all duration-300">
        <div className="relative">
          <img
            src={content.image}
            alt={content.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getContentTypeGradient(content.type)}`}>
            {content.type}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-background/80 hover:bg-background ${
              isFavorited ? 'text-red-500' : 'text-muted-foreground'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>{content.source}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{formatTimeAgo(content.publishedAt)}</span>
          </div>

          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {content.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {content.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {content.engagement && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>{formatEngagement(content.engagement.likes)}</span>
                </div>
              )}
              <Button size="sm" variant="outline" asChild>
                <a href={content.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};