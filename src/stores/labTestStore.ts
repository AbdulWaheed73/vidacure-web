import { create } from 'zustand';
import { labTestService } from '../services/labTestService';
import type { LabTestPackage, LabTestOrder } from '../types/lab-test-types';

type LabTestState = {
  packages: LabTestPackage[];
  orders: LabTestOrder[];
  selectedOrder: LabTestOrder | null;
  isLoadingPackages: boolean;
  isLoadingOrders: boolean;
  isLoadingOrder: boolean;
  isPlacingOrder: boolean;
  error: string | null;
  fetchPackages: () => Promise<void>;
  fetchOrders: (status?: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  placeOrder: (testPackageId: string) => Promise<boolean>;
  clearError: () => void;
  clearSelectedOrder: () => void;
};

export const useLabTestStore = create<LabTestState>((set, get) => ({
  packages: [],
  orders: [],
  selectedOrder: null,
  isLoadingPackages: false,
  isLoadingOrders: false,
  isLoadingOrder: false,
  isPlacingOrder: false,
  error: null,

  fetchPackages: async () => {
    set({ isLoadingPackages: true, error: null });
    try {
      const response = await labTestService.getTestPackages();
      set({ packages: response.packages });
    } catch (error) {
      console.error('Failed to fetch test packages:', error);
      set({ error: 'Failed to load test packages' });
    } finally {
      set({ isLoadingPackages: false });
    }
  },

  fetchOrders: async (status?: string) => {
    set({ isLoadingOrders: true, error: null });
    try {
      const response = await labTestService.getOrders(status);
      set({ orders: response.orders });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ error: 'Failed to load orders' });
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoadingOrder: true, error: null });
    try {
      const response = await labTestService.getOrderById(orderId);
      set({ selectedOrder: response.order });
    } catch (error) {
      console.error('Failed to fetch order:', error);
      set({ error: 'Failed to load order details' });
    } finally {
      set({ isLoadingOrder: false });
    }
  },

  placeOrder: async (testPackageId: string) => {
    set({ isPlacingOrder: true, error: null });
    try {
      const response = await labTestService.placeOrder(testPackageId);
      // Add the new order to the beginning of the orders list
      const { orders } = get();
      set({ orders: [response.order, ...orders] });
      return true;
    } catch (error) {
      console.error('Failed to place order:', error);
      set({ error: 'Failed to place lab test order' });
      return false;
    } finally {
      set({ isPlacingOrder: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedOrder: () => set({ selectedOrder: null }),
}));
