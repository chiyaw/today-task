import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Trash2, Settings, Mail, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatTimeAgo } from '@/utils/formatters';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'mention' | 'trending' | 'system' | 'email';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  user?: {
    name: string;
    avatar: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah Chen liked your post about Quantum Computing breakthrough',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
    user: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
    }
  },
  {
    id: 'notif-2',
    type: 'comment',
    title: 'New Comment',
    message: 'Mike Johnson commented on your saved article about Global Markets',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
    user: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    }
  },
  {
    id: 'notif-3',
    type: 'trending',
    title: 'Trending Content',
    message: 'Your interests: "AI Technology" is trending with 15 new articles',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'System Update',
    message: 'New features available: Enhanced search filters and dark mode improvements',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true
  },
  {
    id: 'notif-5',
    type: 'email',
    title: 'Weekly Digest',
    message: 'Your personalized content digest for this week is ready',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true
  }
];

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

export const NotificationDropdown = ({ isOpen, onClose, onUnreadCountChange }: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Update unread count whenever notifications change
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    onUnreadCountChange(unreadCount);
  }, [notifications, onUnreadCountChange]);

  const markAsRead = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'mention':
        return <Bell className="h-4 w-4 text-green-500" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'email':
        return <Mail className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
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
          className="absolute top-full right-0 mt-2 w-96 z-[9999]"
        >
          <Card className="shadow-xl border-0 bg-white dark:bg-gray-800">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <h3 className="font-semibold">Notifications</h3>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge variant="destructive" className="h-5 min-w-5 p-0 flex items-center justify-center text-xs">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-7 px-2 text-xs"
                    >
                      Mark all read
                    </Button>
                  )}
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
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h4 className="font-medium text-muted-foreground mb-1">No notifications</h4>
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-l-2 ${
                        notification.read 
                          ? 'border-transparent' 
                          : 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {notification.user ? (
                          <img
                            src={notification.user.avatar}
                            alt={notification.user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => markAsRead(notification.id, e)}
                                    className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                                  >
                                    <Check className="h-3 w-3 text-green-600" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => deleteNotification(notification.id, e)}
                                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                                >
                                  <Trash2 className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <>
                <Separator />
                <div className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center h-8 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('View all notifications');
                      onClose();
                    }}
                  >
                    View All Notifications
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 