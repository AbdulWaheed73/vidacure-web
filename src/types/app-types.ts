// App-related types for application state management

export type AppState = {
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

export type AppActions = {
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setOnlineStatus: (status: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export type AppStore = AppState & AppActions;