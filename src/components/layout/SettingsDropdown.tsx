import { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  X, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Layout, 
  Filter,
  Palette,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { toggleDarkMode, setDarkMode } from '@/store/slices/uiSlice';

interface SettingsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsDropdown = ({ isOpen, onClose }: SettingsDropdownProps) => {
  const dispatch = useAppDispatch();
  const { darkMode } = useTypedSelector(state => state.ui);
  const [activeSection, setActiveSection] = useState<'general' | 'appearance'>('general');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Local state for settings
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false,
      trending: true,
    },
    appearance: {
      theme: darkMode ? 'dark' : 'light',
      compactMode: false,
      animations: true,
    },
    content: {
      autoRefresh: true,
      showReadTime: true,
      infiniteScroll: true,
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme }
    }));

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setDarkMode(systemDark));
    } else {
      dispatch(setDarkMode(theme === 'dark'));
    }
  };

  const handleSettingToggle = (section: keyof typeof settings, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key as keyof typeof prev[typeof section]]
      }
    }));
  };

  const menuItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const renderGeneralSection = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Notifications</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm">Email notifications</span>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm">Push notifications</span>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: checked }
                }));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Trending alerts</span>
            </div>
            <Switch
              checked={settings.notifications.trending}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, trending: checked }
                }));
              }}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Content</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span className="text-sm">Auto-refresh feed</span>
            </div>
            <Switch
              checked={settings.content.autoRefresh}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  content: { ...prev.content, autoRefresh: checked }
                }));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Show read time</span>
            </div>
            <Switch
              checked={settings.content.showReadTime}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  content: { ...prev.content, showReadTime: checked }
                }));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Infinite scroll</span>
            </div>
            <Switch
              checked={settings.content.infiniteScroll}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  content: { ...prev.content, infiniteScroll: checked }
                }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Theme</h4>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={settings.appearance.theme === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={(e) => handleThemeChange('light', e)}
            className="flex flex-col items-center gap-1 h-16"
          >
            <Sun className="h-4 w-4" />
            <span className="text-xs">Light</span>
          </Button>
          <Button
            variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={(e) => handleThemeChange('dark', e)}
            className="flex flex-col items-center gap-1 h-16"
          >
            <Moon className="h-4 w-4" />
            <span className="text-xs">Dark</span>
          </Button>
          <Button
            variant={settings.appearance.theme === 'system' ? 'default' : 'outline'}
            size="sm"
            onClick={(e) => handleThemeChange('system', e)}
            className="flex flex-col items-center gap-1 h-16"
          >
            <Monitor className="h-4 w-4" />
            <span className="text-xs">System</span>
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium mb-3">Display</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span className="text-sm">Compact mode</span>
            </div>
            <Switch
              checked={settings.appearance.compactMode}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, compactMode: checked }
                }));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Animations</span>
            </div>
            <Switch
              checked={settings.appearance.animations}
              onCheckedChange={(checked) => {
                setSettings(prev => ({
                  ...prev,
                  appearance: { ...prev.appearance, animations: checked }
                }));
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSection();
      case 'appearance':
        return renderAppearanceSection();
      default:
        return renderGeneralSection();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-full right-0 mt-2 w-80 z-[9999]"
        >
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <h3 className="font-semibold">Settings</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-24 border-r p-2">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? 'default' : 'ghost'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSection(item.id as any);
                        }}
                        className="w-full flex flex-col items-center gap-1 h-14 p-1"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 max-h-96 overflow-y-auto">
                <div>
                  {renderContent()}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 