import { useEffect, useState } from 'react';
import { Moon, Sun, Settings, Menu, Bell, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchDropdown } from './SearchDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { SettingsDropdown } from './SettingsDropdown';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { toggleDarkMode, toggleSidebar, togglePreferences } from '@/store/slices/uiSlice';
import { searchContent, clearSearchResults, clearFilter } from '@/store/slices/contentSlice';


export const Header = () => {
  const dispatch = useAppDispatch();
  const { darkMode, sidebarCollapsed } = useTypedSelector(state => state.ui);
  const { searchResults, loading, activeFilter } = useTypedSelector(state => state.content);
  const { categories } = useTypedSelector(state => state.preferences);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const activeCategoryName = activeFilter 
  ? categories.find(cat => cat.id === activeFilter)?.name 
  : null;

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNotificationCountChange = (count: number) => {
    setUnreadCount(count);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CF</span>
            </div>
            {!sidebarCollapsed && (
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Curated Feed
                </h1>
                <p className="text-xs text-muted-foreground">Personalized Dashboard</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md mx-4">
          
          <SearchDropdown />
          
        </div>
        {/* Right section */}
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(toggleDarkMode())}
              className="h-9 w-9 p-0"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </Button>
          </motion.div>


          <div className="relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowSettings(false); // Close settings if open
                }}
                className="h-9 w-9 p-0 relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </motion.div>
            <NotificationDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)}
              onUnreadCountChange={handleNotificationCountChange}
            />
          </div>

          <div className="relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowNotifications(false); // Close notifications if open
                }}
                className="h-9 w-9 p-0"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
            <SettingsDropdown 
              isOpen={showSettings} 
              onClose={() => setShowSettings(false)} 
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};