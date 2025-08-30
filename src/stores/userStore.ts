import { create } from 'zustand';
import type { UserStore, UserProfile } from '../types';


export const useUserStore = create<UserStore>()((set, get) => ({
  // State
  profile: null,
  isLoading: false,
  error: null,

  // Actions
  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const profile = await response.json();
      
      if (response.ok) {
        set({ profile, isLoading: false });
      } else {
        set({ error: profile.message, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        isLoading: false 
      });
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/users/${currentProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      const updatedProfile = await response.json();
      
      if (response.ok) {
        set({ profile: updatedProfile, isLoading: false });
      } else {
        set({ error: updatedProfile.message, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false 
      });
    }
  },

  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      set({
        profile: {
          ...currentProfile,
          preferences: { ...currentProfile.preferences, ...preferences }
        }
      });
    }
  },

  clearUserData: () => set({ profile: null, error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));