import { api } from './api';
import type {
  EmailTemplatesResponse,
  EmailTemplateResponse,
  CreateEmailTemplatePayload,
  UpdateEmailTemplatePayload,
} from '@/types/email-template-types';

// Admin CRUD for the drip-email template stock. The x-admin-csrf header is
// injected automatically by the axios interceptor in services/api.ts.
export const emailTemplateService = {
  list: async (): Promise<EmailTemplatesResponse> => {
    const response = await api.get('/api/admin/email-templates');
    return response.data;
  },

  create: async (payload: CreateEmailTemplatePayload): Promise<EmailTemplateResponse> => {
    const response = await api.post('/api/admin/email-templates', payload);
    return response.data;
  },

  update: async (id: string, payload: UpdateEmailTemplatePayload): Promise<EmailTemplateResponse> => {
    const response = await api.put(`/api/admin/email-templates/${id}`, payload);
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/admin/email-templates/${id}`);
    return response.data;
  },
};
