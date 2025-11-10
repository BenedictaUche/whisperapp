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
    <div className="sticky top-0 z-40 bg-yellow-50/95 backdrop-blur-md border-b border-pink-200 shadow-sm">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" px-8 py-3 flex items-center justify-between"
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <EarIcon className="text-pink-500 w-6 h-6 animate-bounce" />
            <h1 className="text-2xl font-bold text-pink-600">whispr</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Anonymous whispers from nearby
          </p>
        </motion.div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleNotificationToggle}
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-2 text-pink-600"
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
            className="hidden sm:flex items-center gap-2 text-pink-600"
          >
            {theme === 'velvet' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="hidden md:inline">
              {theme === 'velvet' ? 'Dark' : 'Light'}
            </span>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-pink-100 text-pink-600 font-bold">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white shadow-lg border-pink-100" align="end" forceMount>
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-semibold text-sm text-pink-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Whispers remain anonymous</p>
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
