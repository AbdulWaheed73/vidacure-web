export type EmailSendSource = 'drip' | 'manual_template' | 'manual_custom';
export type EmailSendStatus = 'sent' | 'failed';

// patientId may be populated ({ name, email }) or a bare id string.
export type EmailLogPatientRef = { _id: string; name?: string; email?: string } | string;

export type EmailSendLog = {
  _id: string;
  patientId: EmailLogPatientRef;
  patientEmail: string;
  source: EmailSendSource;
  templateId?: string;
  templateTitle?: string;
  subject: string;
  status: EmailSendStatus;
  error?: string;
  consentGranted: boolean;
  sentAt: string;
};

export type EmailLogResponse = {
  logs: EmailSendLog[];
  pagination: { page: number; limit: number; totalCount: number; totalPages: number };
};

export type PatientTemplateStatus = {
  _id: string;
  title: string;
  subject: string;
  order: number;
  sent: boolean;
  sentAt: string | null;
};

export type PatientEmailStatusResponse = {
  templates: PatientTemplateStatus[];
  communicationConsentGranted: boolean;
};

export type SendPatientEmailPayload = {
  mode: 'template' | 'custom';
  templateId?: string;
  subject?: string;
  html?: string;
};

export type EmailLogFilters = {
  patientId?: string;
  source?: EmailSendSource;
  page?: number;
  limit?: number;
};
