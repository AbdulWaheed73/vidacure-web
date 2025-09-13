import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, Settings, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import type { TopBarProps } from '../types/component-types';

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onBookAppointment,
  onProfileClick,
  onAccountClick,
  onLogout,
}) => {
  const { t } = useTranslation();

  // Generate dynamic greeting based on time of day
  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return t('topbar.goodMorning');
    } else if (currentHour >= 12 && currentHour < 18) {
      return t('topbar.goodAfternoon');
    } else {
      return t('topbar.goodEvening');
    }
  };

  // Generate user initials from name
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const greeting = getGreeting();
  const userName = user?.name || 'User';
  const userInitials = getUserInitials(userName);

  return (
    <div className="bg-[#F0F7F4] px-5 py-8 flex justify-between items-center">
      {/* Dynamic Greeting */}
      <div className="text-zinc-800 text-2xl font-bold font-sora leading-loose">
        {greeting}, {userName}
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-8">
        {/* Book Appointment Button */}
        <Button
          onClick={onBookAppointment}
          className="h-11 px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full hover:from-teal-700 hover:to-teal-700 text-white font-semibold font-sora"
        >
          <Calendar className="size-6" />
          {t('topbar.bookAppointment')}
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
                  {userInitials}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('topbar.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>{t('topbar.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAccountClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>{t('topbar.accountSettings')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('topbar.logOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};