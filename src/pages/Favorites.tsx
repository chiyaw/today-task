import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentCard } from '@/components/content/ContentCard';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Favorites = () => {
  const favorites = useTypedSelector(state => state.favorites.items);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-8 flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <div>
                <h1 className="text-3xl font-bold">Your Favorites</h1>
                <p className="text-muted-foreground">
                  {favorites.length} saved items
                </p>
              </div>
            </div>
            
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((item, index) => (
                  <ContentCard key={item.id} content={item} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">
                  Start adding content to your favorites to see them here
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Favorites;