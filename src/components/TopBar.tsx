import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, User, LogOut, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { SidebarTrigger } from '../components/ui/sidebar';
import type { TopBarProps } from '../types/component-types';

export const TopBar: React.FC<TopBarProps> = ({
  user,
  onBookAppointment,
  onProfileClick,
  onLogout,
}) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const isEnglish = i18n.language.startsWith('en');
    i18n.changeLanguage(isEnglish ? 'sv' : 'en');
  };

  const currentLang = i18n.language.startsWith('sv') ? 'SV' : 'EN';

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
    <div className="bg-[#F0F7F4] px-4 md:px-5 py-4 md:py-4 flex justify-between items-center shrink-0">
      {/* Left Section — hamburger + greeting */}
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="h-9 w-9 shrink-0" />
        <div className="text-zinc-800 text-base md:text-2xl font-bold font-sora leading-loose truncate">
          {greeting}, {userName}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3 lg:gap-6 shrink-0">
        {/* Book Appointment Button — patients only */}
        {user?.role !== 'doctor' && (
          <Button
            onClick={onBookAppointment}
            className="h-9 md:h-11 px-2.5 md:px-3 lg:px-6 py-2 md:py-2.5 bg-gradient-to-r from-teal-600 to-teal-600 rounded-full hover:from-teal-700 hover:to-teal-700 text-white font-semibold font-sora"
          >
            <Calendar className="size-5 md:size-6" />
            <span className="hidden lg:inline">{t('topbar.bookAppointment')}</span>
          </Button>
        )}

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-4 p-1.5 md:p-2 hover:bg-zinc-50"
            >
              <div className="size-9 md:size-11 p-2 md:p-2.5 rounded-full border-2 border-zinc-800 flex justify-center items-center">
                <span className="text-zinc-800 text-sm md:text-base font-semibold font-manrope">
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
            <DropdownMenuItem onClick={toggleLanguage}>
              <Globe className="mr-2 h-4 w-4" />
              <span>{currentLang === 'EN' ? 'Svenska' : 'English'}</span>
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