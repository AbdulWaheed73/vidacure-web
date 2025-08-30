import { create } from 'zustand';
import type { AppStore } from '../types';


export const useAppStore = create<AppStore>()((set) => ({
  // State
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
  isOnline: true,
  currentPage: '/',

  // Actions
  setTheme: (theme: 'light' | 'dark') => set({ theme }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
    };
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
  },
  
  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  clearNotifications: () => set({ notifications: [] }),
  
  setOnlineStatus: (status: boolean) => set({ isOnline: status }),
  
  setCurrentPage: (page: string) => set({ currentPage: page }),
}));