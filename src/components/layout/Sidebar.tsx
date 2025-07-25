import { Home, Heart, TrendingUp, Settings, Rss, Film, MessageSquare, BookOpen, DollarSign, Globe, Heart as HeartIcon, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { setActiveSection, togglePreferences } from '@/store/slices/uiSlice';
import { filterByCategory, clearFilter } from '@/store/slices/contentSlice';


const navigationItems = [
  { id: 'feed', label: 'My Feed', icon: Home, path: '/' },
  { id: 'favorites', label: 'Favorites', icon: Heart, path: '/favorites' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, path: '/trending' },
];

const categoryIcons = {
  news: Rss,
  sports: TrendingUp,
  entertainment: Film,
  social: MessageSquare,
  educational: BookOpen,
  finance: DollarSign,
  travel: Globe,
  lifestyle: HeartIcon,
  technology: Lightbulb,
};


export const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeSection, sidebarCollapsed } = useTypedSelector(state => state.ui);
  const { categories } = useTypedSelector(state => state.preferences);
  const { activeFilter } = useTypedSelector(state => state.content);
  const favorites = useTypedSelector(state => state.favorites.items);

  const handleSectionChange = (section: any) => {
    dispatch(setActiveSection(section));
  };

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to dedicated pages for all categories
    const categoryRoutes: { [key: string]: string } = {
      'news': '/news',
      'sports': '/sports', 
      'entertainment': '/entertainment',
      'educational': '/education',
      'finance': '/finance',
      'travel': '/travel',
      'technology': '/technology'
    };

    const route = categoryRoutes[categoryId];
    
    if (route) {
      navigate(route);
      dispatch(setActiveSection(categoryId as any));
      return;
    }

    // For categories without dedicated pages, use the existing filter behavior
    if (activeFilter === categoryId) {
      // If clicking the same category, clear the filter
      dispatch(clearFilter());
    } else {
      // Set new filter
      dispatch(filterByCategory(categoryId));
    }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
      className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border z-40 lg:relative lg:top-0 lg:h-screen"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full p-4">
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <NavLink to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={`w-full justify-start h-11 ${
                      isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-primary' : ''
                    }`}
                    onClick={() => handleSectionChange(item.id)}
                  >
                    <Icon className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.id === 'favorites' && favorites.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {favorites.length}
                      </Badge>
                    )}
                  </Button>
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <Separator className="my-4" />

        {/* Content Types */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-3 text-sm font-medium text-sidebar-foreground/70">
              Content Types
            </h3>
            <div className="space-y-2">
              {categories.map((category, index) => {
                // For categories with dedicated pages, check activeSection; for others, check activeFilter
                const categoriesWithPages = ['news', 'sports', 'entertainment', 'educational', 'finance', 'travel', 'technology'];
                const isActive = categoriesWithPages.includes(category.id)
                  ? activeSection === category.id 
                  : activeFilter === category.id;
                const isEnabled = category.enabled;
                const CategoryIcon = categoryIcons[category.id as keyof typeof categoryIcons] || Rss;
                
                return (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isEnabled && isActive ? 'bg-sidebar-accent/50' : isEnabled ? 'bg-sidebar-accent/50' : 'opacity-50'
                    }`}
                  >
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start h-11" 
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <CategoryIcon className="h-4 w-4" />
                      <span className="ml-2 text-sm">{category.name}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Settings */}
        <div className="mt-auto">
          <Separator className="mb-4" />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start h-11"
              onClick={() => dispatch(togglePreferences())}
            >
              <Settings className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-3'}`} />
              {!sidebarCollapsed && <span>Preferences</span>}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.aside>
  );
};