import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isNavbarVisible: true,
  setNavbarVisible: (visible) => set({ isNavbarVisible: visible }),
}));
