import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

type AdminTopBarProps = {
  onLogout: () => void;
};

export const AdminTopBar = ({ onLogout }: AdminTopBarProps) => {
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
      <div className="flex items-center gap-8">
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
