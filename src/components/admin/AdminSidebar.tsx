import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCog,
  LogOut,
  Bell,
  FileText,
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ROUTES } from '../../constants';
import Vidacure from "../../assets/vidacure_png.png";
import { useAdminAuthStore } from '../../stores/adminAuthStore';
import { Button } from '../ui/Button';
import { adminService } from '@/services/adminService';

type AdminSidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { logoutAdmin } = useAdminAuthStore();
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasHighPriority, setHasHighPriority] = useState(false);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const data = await adminService.getNotificationCount();
        setNotificationCount(data.unreadCount);
        setHasHighPriority(data.highPriorityUnread > 0);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminMenuItems = [
    {
      title: 'Dashboard',
      value: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Patients',
      value: 'patients',
      icon: Users,
    },
    {
      title: 'Doctors',
      value: 'doctors',
      icon: UserCog,
    },
    {
      title: 'Notifications',
      value: 'notifications',
      icon: Bell,
      badge: notificationCount > 0 ? notificationCount : undefined,
      highPriority: hasHighPriority,
    },
    {
      title: 'Deletion Logs',
      value: 'deletion-logs',
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    logoutAdmin();
  };

  return (
    <Sidebar
      collapsible="none"
      className="border-r border-zinc-400 bg-[#F0F7F4] fixed left-0 top-0 h-screen z-50"
      style={{ width: '256px' }}
    >
      {/* Logo Header */}
      <SidebarHeader className="px-4 py-8 bg-[#F0F7F4]">
        <div className="p-2 flex flex-col justify-start items-start gap-2">
          <Link to={ROUTES.ADMIN_DASHBOARD}>
            <img
              className="w-36 h-5"
              src={Vidacure}
              alt="Vidacure Logo"
            />
          </Link>
          <div className="text-sm font-semibold text-dark-teal">Admin Panel</div>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-4 bg-[#F0F7F4] overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-0">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.value;
                const badge = 'badge' in item ? item.badge : undefined;
                const highPriority = 'highPriority' in item ? item.highPriority : false;

                return (
                  <SidebarMenuItem key={item.title} className="mb-1">
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.value)}
                      isActive={isActive}
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
                          'text-base leading-snug flex-1',
                          isActive ? 'text-dark-teal font-bold' : 'text-zinc-800 font-normal'
                        )}
                        style={isActive ? { color: '#005044', fontWeight: 'bold' } : undefined}
                      >
                        {item.title}
                      </span>
                      {badge !== undefined && (
                        <span
                          className={cn(
                            'min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center',
                            highPriority
                              ? 'bg-red-500 text-white'
                              : 'bg-teal-600 text-white'
                          )}
                        >
                          {badge > 99 ? '99+' : badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Logout */}
      <SidebarFooter className="p-4 bg-[#F0F7F4] border-t border-zinc-300">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 font-manrope font-semibold border-zinc-400 hover:bg-hover-teal-buttons hover:text-dark-teal"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
