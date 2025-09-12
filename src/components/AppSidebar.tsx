import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Calendar,
  Pill,
  TrendingUp,
  BookOpen,
  User as UserIcon,
  Inbox,
  MessageCircle,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ROUTES } from '../constants';
import type { User } from '../types';
import Vidacure from "../assets/vidacure_png.png";

// Doctor sidebar items
const doctorMenuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Chat',
    url: ROUTES.DOCTOR_CHAT,
    icon: MessageCircle,
  },
  {
    title: 'Inbox',
    url: ROUTES.DOCTOR_INBOX,
    icon: Inbox,
  },
  {
    title: 'Prescriptions',
    url: ROUTES.DOCTOR_PRESCRIPTIONS,
    icon: Pill,
  },
  {
    title: 'Account',
    url: ROUTES.DOCTOR_ACCOUNT,
    icon: UserIcon,
  },
];

// Patient sidebar items (existing)
const patientMenuItems = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Chat',
    url: ROUTES.PATIENT_CHAT,
    icon: MessageCircle,
  },
  {
    title: 'Appointments',
    url: '/appointments',
    icon: Calendar,
  },
  {
    title: 'Prescriptions',
    url: '/prescriptions',
    icon: Pill,
  },
  {
    title: 'My Progress',
    url: '/progress',
    icon: TrendingUp,
  },
  {
    title: 'Resources',
    url: '/resources',
    icon: BookOpen,
  },
  {
    title: 'Account',
    url: '/account',
    icon: UserIcon,
  },
];

export function AppSidebar({ user }: { user: User | null }) {
  const location = useLocation();
  
  // Choose menu items based on user role
  const menuItems = user?.role === 'doctor' ? doctorMenuItems : patientMenuItems;

  return (
    <Sidebar 
      collapsible="none" 
      className="border-r border-zinc-400 bg-[#F0F7F4] fixed left-0 top-0 h-screen z-50"
      style={{ width: '256px' }} // Fixed width matching Figma design
    >
      {/* Logo Header */}
      <SidebarHeader className="px-4 py-8 bg-[#F0F7F4]">
        <div className="p-2 flex justify-start items-center gap-2.5">
          <img 
            className="w-36 h-5" 
            src={Vidacure} 
            alt="Vidacure Logo" 
          />
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-4 bg-[#F0F7F4] overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-0">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <Link
                      to={item.url}
                      className={cn(
                        'px-5 py-3 rounded-xl inline-flex justify-start items-center gap-3 w-full font-manrope transition-all duration-200',
                        isActive
                          ? 'bg-hover-teal-buttons text-dark-teal font-bold'
                          : 'text-zinc-800 font-normal hover:bg-hover-teal-buttons hover:text-dark-teal'
                      )}
                      style={isActive ? { backgroundColor: '#E6F7F5', color: '#005044' } : undefined}
                    >
                      <Icon 
                        className={cn(
                          'size-6 shrink-0',
                          isActive ? 'text-dark-teal' : 'text-zinc-800'
                        )} 
                        style={isActive ? { color: '#005044' } : undefined}
                      />
                      <span 
                        className={cn(
                          'text-base leading-snug',
                          isActive ? 'text-dark-teal font-bold' : 'text-zinc-800 font-normal'
                        )}
                        style={isActive ? { color: '#005044', fontWeight: 'bold' } : undefined}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}