import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentCard } from '@/components/content/ContentCard';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const Trending = () => {
  const { items } = useTypedSelector(state => state.content);
  
  // Sort by engagement for trending
  const trendingItems = [...items].sort((a, b) => {
    const aEngagement = a.engagement ? a.engagement.likes + a.engagement.shares : 0;
    const bEngagement = b.engagement ? b.engagement.likes + b.engagement.shares : 0;
    return bEngagement - aEngagement;
  }).slice(0, 12);

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
              <TrendingUp className="h-8 w-8 text-content-trending" />
              <div>
                <h1 className="text-3xl font-bold">Trending Now</h1>
                <p className="text-muted-foreground">
                  Most popular content across all categories
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingItems.map((item, index) => (
                <ContentCard key={item.id} content={item} index={index} />
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Trending;