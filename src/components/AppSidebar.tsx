import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Calendar,
  Pill,
  TrendingUp,
  BookOpen,
  User as UserIcon,
  Users,
  MessageCircle,
  FlaskConical,
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
import { useChatUnreadCounts } from '../hooks/useChatQueries';
import { useSupabaseChatStore, selectUnreadCounts } from '../stores/supabaseChatStore';
import type { User } from '../types';
import Vidacure from "../assets/vidacure_png.png";

export function AppSidebar({ user }: { user: User | null }) {
  const location = useLocation();
  const { t } = useTranslation();

  // Server-side unread counts (works even before chat page is opened)
  const { data: serverUnreadCounts } = useChatUnreadCounts(!!user);
  // Client-side unread counts (live updates from Zustand store when chat is active)
  const storeUnreadCounts = useSupabaseChatStore(selectUnreadCounts);

  // Show dot if EITHER source reports unread messages
  const serverTotal = Object.values(serverUnreadCounts || {}).reduce((sum, count) => sum + count, 0);
  const storeTotal = Object.values(storeUnreadCounts).reduce((sum, count) => sum + count, 0);
  const hasUnreadChat = serverTotal > 0 || storeTotal > 0;

  // Create menu items with translations - moved inside component to react to language changes
  const doctorMenuItems = [
    {
      title: t('sidebar.dashboard'),
      url: '/dashboard',
      icon: Home,
    },
    {
      title: t('sidebar.appointments', 'Appointments'),
      url: ROUTES.DOCTOR_APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: t('sidebar.chat'),
      url: ROUTES.DOCTOR_CHAT,
      icon: MessageCircle,
    },
    {
      title: t('sidebar.patients'),
      url: ROUTES.DOCTOR_PATIENTS,
      icon: Users,
    },
    {
      title: t('sidebar.prescriptions'),
      url: ROUTES.DOCTOR_PRESCRIPTIONS,
      icon: Pill,
    },
    {
      title: t('sidebar.labTests'),
      url: ROUTES.DOCTOR_LAB_RESULTS,
      icon: FlaskConical,
    },
    {
      title: t('sidebar.account'),
      url: ROUTES.DOCTOR_ACCOUNT,
      icon: UserIcon,
    },
  ];

  const patientMenuItems = [
    {
      title: t('sidebar.home'),
      url: '/dashboard',
      icon: Home,
    },
    {
      title: t('sidebar.chat'),
      url: ROUTES.PATIENT_CHAT,
      icon: MessageCircle,
    },
    {
      title: t('sidebar.appointments'),
      url: '/appointments',
      icon: Calendar,
    },
    {
      title: t('sidebar.prescriptions'),
      url: '/prescriptions',
      icon: Pill,
    },
    {
      title: t('sidebar.labTests'),
      url: '/lab-tests',
      icon: FlaskConical,
    },
    {
      title: t('sidebar.myProgress'),
      url: '/progress',
      icon: TrendingUp,
    },
    {
      title: t('sidebar.resources'),
      url: '/resources',
      icon: BookOpen,
    },
    {
      title: t('sidebar.account'),
      url: '/account',
      icon: UserIcon,
    },
  ];

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
                const isChatItem = item.url === ROUTES.DOCTOR_CHAT || item.url === ROUTES.PATIENT_CHAT;
                const showDot = isChatItem && hasUnreadChat;

                return (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <Link
                      to={item.url}
                      className={cn(
                        'px-5 py-3 rounded-xl inline-flex justify-start items-center gap-3 w-full font-manrope transition-all duration-200 relative',
                        isActive
                          ? 'bg-hover-teal-buttons text-dark-teal font-bold'
                          : 'text-zinc-800 font-normal hover:bg-hover-teal-buttons hover:text-dark-teal'
                      )}
                      style={isActive ? { backgroundColor: '#E6F7F5', color: '#005044' } : undefined}
                    >
                      <div className="relative">
                        <Icon
                          className={cn(
                            'size-6 shrink-0',
                            isActive ? 'text-dark-teal' : 'text-zinc-800'
                          )}
                          style={isActive ? { color: '#005044' } : undefined}
                        />
                        {showDot && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F0F7F4]" />
                        )}
                      </div>
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