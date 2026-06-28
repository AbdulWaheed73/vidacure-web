import { z } from 'zod';

// A drip-email template (the "stock" of monthly patient emails).
export type EmailTemplate = {
  _id: string;
  title: string;     // internal admin label
  subject: string;   // subject line the patient sees
  html: string;      // body content (HTML fragment authored in the editor)
  order: number;     // position in the monthly sequence
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EmailTemplatesResponse = {
  templates: EmailTemplate[];
};

export type EmailTemplateResponse = {
  template: EmailTemplate;
};

// Form validation (the HTML body comes from the Tiptap editor, validated separately).
export const emailTemplateFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  order: z.coerce.number().int('Order must be a whole number').min(1, 'Order must be at least 1'),
  isActive: z.boolean(),
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateFormSchema>;

export type CreateEmailTemplatePayload = EmailTemplateFormValues & { html: string };
export type UpdateEmailTemplatePayload = Partial<CreateEmailTemplatePayload>;
