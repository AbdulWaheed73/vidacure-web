import { useEffect, useState } from 'react';
import { User, Settings, LogOut, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { adminService } from '@/services/adminService';
import { cn } from '@/lib/utils';

type AdminTopBarProps = {
  onLogout: () => void;
  onNotificationClick?: () => void;
};

export const AdminTopBar = ({ onLogout, onNotificationClick }: AdminTopBarProps) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasHighPriority, setHasHighPriority] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!document.hasFocus()) return;
      try {
        const data = await adminService.getNotificationCount();
        setNotificationCount(data.unreadCount);
        setHasHighPriority(data.highPriorityUnread > 0);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    const handleFocus = () => fetchNotificationCount();

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  // Generate dynamic greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  const greeting = getGreeting();

  return (
    <div className="bg-[#F0F7F4] px-5 py-8 flex justify-between items-center">
      {/* Dynamic Greeting */}
      <div className="text-zinc-800 text-2xl font-bold font-sora leading-loose">
        {greeting}, Admin
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-teal-50"
          onClick={onNotificationClick}
        >
          <Bell className="h-5 w-5 text-zinc-700" />
          {notificationCount > 0 && (
            <span
              className={cn(
                'absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-xs font-semibold flex items-center justify-center',
                hasHighPriority
                  ? 'bg-red-500 text-white'
                  : 'bg-teal-600 text-white'
              )}
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-4 p-2 hover:bg-zinc-50"
            >
              <div className="size-11 p-2.5 rounded-full border-2 border-zinc-800 flex justify-center items-center">
                <span className="text-zinc-800 text-base font-semibold font-manrope">
                  A
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
