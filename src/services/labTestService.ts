import { api } from './api';
import type {
  GetLabTestPackagesResponse,
  PlaceLabTestOrderResponse,
  GetLabTestOrdersResponse,
  GetLabTestOrderResponse,
  CreateLabTestCheckoutResponse,
} from '../types/lab-test-types';

export const labTestService = {
  getTestPackages: async (): Promise<GetLabTestPackagesResponse> => {
    const response = await api.get<GetLabTestPackagesResponse>('/api/lab-tests/packages');
    return response.data;
  },

  placeOrder: async (testPackageId: string): Promise<PlaceLabTestOrderResponse> => {
    const response = await api.post<PlaceLabTestOrderResponse>('/api/lab-tests/orders', {
      testPackageId,
    }, {
      timeout: 30000,
    });
    return response.data;
  },

  createCheckoutSession: async (testPackageId: string): Promise<CreateLabTestCheckoutResponse> => {
    const response = await api.post<CreateLabTestCheckoutResponse>(
      '/api/lab-tests/create-checkout-session',
      { testPackageId }
    );
    return response.data;
  },

  getOrders: async (status?: string): Promise<GetLabTestOrdersResponse> => {
    const params = status ? { status } : {};
    const response = await api.get<GetLabTestOrdersResponse>('/api/lab-tests/orders', {
      params,
      timeout: 30000,
    });
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<GetLabTestOrderResponse> => {
    const response = await api.get<GetLabTestOrderResponse>(
      `/api/lab-tests/orders/${orderId}`,
      { timeout: 20000 },
    );
    return response.data;
  },
};
