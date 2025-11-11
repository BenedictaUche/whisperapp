'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Moon,
  Sun,
  Bell,
  BellOff,
  LogOut,
  Settings,
  Smile,
  EarIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useThemeContext } from './ThemeProvider';
import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/notifications';
import { signOut } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const { theme, toggleTheme } = useThemeContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    setNotificationsEnabled(Notification.permission === 'granted');
  }, []);

  const handleNotificationToggle = async () => {
    if (notificationsEnabled) {
      alert('To disable notifications, please use your browser settings');
    } else {
      const enabled = await requestNotificationPermission();
      setNotificationsEnabled(enabled);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onSignOut?.();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getUserInitials = (email?: string) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-full mx-auto px-4 sm:px-6 lg:px-[100px] py-4 flex items-center justify-between"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <EarIcon className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">WhisperMap</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Anonymous whispers from nearby
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleNotificationToggle}
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            <span className="hidden md:inline">
              {notificationsEnabled ? 'On' : 'Notifications'}
            </span>
          </Button>

          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {theme === 'velvet' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden md:inline">
              {theme === 'velvet' ? 'Dark' : 'Light'}
            </span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-background shadow-lg border-border" align="end" forceMount>
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-sm text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Whispers remain anonymous</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="sm:hidden" onClick={handleNotificationToggle}>
                  {notificationsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="sm:hidden" onClick={toggleTheme}>
                  {theme === 'velvet' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                  Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </motion.header>
    </div>
  );
};
