import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentCard } from '@/components/content/ContentCard';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { travelService } from '@/services/travelService';
import { ContentItem } from '@/types/content';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setActiveSection } from '@/store/slices/uiSlice';

const Travel = () => {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useTypedSelector(state => state.ui);
  const [travelData, setTravelData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(setActiveSection('travel' as any));
    fetchTravelData();
  }, [dispatch]);

  const fetchTravelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await travelService.getTravelData();
      setTravelData(data);
    } catch (err) {
      setError('Failed to fetch travel data');
      console.error('Error fetching travel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTravelData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main 
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-70'
          } pt-4 px-6`}
        >
          <div className="container max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        Travel & Culture
                      </h1>
                      <p className="text-muted-foreground">
                        Discover amazing destinations and travel experiences
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleRefresh}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </motion.div>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-12"
              >
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Loading travel destinations...</span>
                </div>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-12"
              >
                <div className="text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={handleRefresh} variant="outline">
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}

            {!loading && !error && travelData.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {travelData.map((content, index) => (
                  <ContentCard
                    key={content.id}
                    content={content}
                    index={index}
                  />
                ))}
              </motion.div>
            )}

            {!loading && !error && travelData.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-12"
              >
                <div className="text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Travel Content Available</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any travel content at the moment.
                  </p>
                  <Button onClick={handleRefresh} variant="outline">
                    Refresh
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Travel; 