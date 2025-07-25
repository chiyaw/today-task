import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ContentFeed } from '@/components/content/ContentFeed';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:ml-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                Your Personalized Feed
              </h1>
              <p className="text-muted-foreground">
                Discover curated content from your favorite sources
              </p>
            </div>
            <ContentFeed />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
