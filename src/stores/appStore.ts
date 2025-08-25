import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  isOnline: boolean;
  currentPage: string;
}

interface AppActions {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setOnlineStatus: (status: boolean) => void;
  setCurrentPage: (page: string) => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()((set, get) => ({
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