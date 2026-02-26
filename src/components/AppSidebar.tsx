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
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ROUTES } from '../constants';
import { useChatUnreadCounts } from '../hooks/useChatQueries';
import { useSupabaseChatStore, selectUnreadCounts } from '../stores/supabaseChatStore';
import type { User } from '../types';
import Vidacure from "../assets/vidacure_png.png";
import VidacureIcon from "/v_black.png";

export function AppSidebar({ user }: { user: User | null }) {
  const location = useLocation();
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();

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
      collapsible="icon"
      className="border-r border-zinc-400 bg-[#F0F7F4]"
    >
      {/* Logo Header */}
      <SidebarHeader className="px-4 py-8 bg-[#F0F7F4] md:transition-[padding] md:duration-300 md:ease-in-out group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-4">
        <div className="p-2 flex justify-start items-center gap-2.5 md:transition-[padding,justify-content] md:duration-300 md:ease-in-out group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <img
            className="w-36 h-5 shrink-0 md:transition-[width,opacity] md:duration-300 md:ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0"
            src={Vidacure}
            alt="Vidacure Logo"
          />
          <img
            className="w-0 h-7 opacity-0 shrink-0 md:transition-[width,opacity] md:duration-300 md:ease-in-out group-data-[collapsible=icon]:w-7 group-data-[collapsible=icon]:opacity-100"
            src={VidacureIcon}
            alt="Vidacure"
          />
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-4 bg-[#F0F7F4] overflow-y-auto md:transition-[padding] md:duration-300 md:ease-in-out group-data-[collapsible=icon]:px-1">
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
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      size="lg"
                      className={cn(
                        'rounded-xl font-manrope group-data-[collapsible=icon]:justify-center',
                        isActive
                          ? 'bg-[#E6F7F5] text-[#005044] font-bold hover:bg-[#E6F7F5] hover:text-[#005044]'
                          : 'text-zinc-800 font-normal hover:bg-[#E6F7F5] hover:text-[#005044]'
                      )}
                    >
                      <Link
                        to={item.url}
                        onClick={() => setOpenMobile(false)}
                      >
                        <div className="relative shrink-0">
                          <Icon
                            className={cn(
                              '!size-6',
                              isActive ? 'text-[#005044]' : 'text-zinc-800'
                            )}
                          />
                          {showDot && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#F0F7F4]" />
                          )}
                        </div>
                        <span className="md:transition-[opacity,max-width] md:duration-300 md:ease-in-out max-w-48 opacity-100 group-data-[collapsible=icon]:max-w-0 group-data-[collapsible=icon]:opacity-0 overflow-hidden whitespace-nowrap">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
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
