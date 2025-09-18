export type EventTypeOption = {
  type: 'free' | 'standard' | 'premium';
  name: string;
};

export type AppointmentBookingResponse = {
  success: boolean;
  eventType: string;
  eventName: string;
  schedulingLink: string;
  singleUse: boolean;
  expiresAfter: string;
  patientName: string;
  doctorName: string;
  message: string;
};

export type PatientMeeting = {
  id: string;
  patientName: string;
  patientEmail: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'canceled';
  meetingUrl: string | null;
  eventType: string;
  createdAt: string;
  cancelUrl: string | null;
  rescheduleUrl: string | null;
};

export type PatientMeetingsResponse = {
  success: boolean;
  patient: {
    name: string;
    email: string;
  };
  doctorName: string;
  meetings: PatientMeeting[];
  count: number;
  filters: Record<string, any>;
};

export type AvailableEventTypesResponse = {
  success: boolean;
  patient: {
    name: string;
    email: string;
  };
  doctor: {
    name: string;
    email: string;
  };
  eventType: EventTypeOption;
  subscription: {
    planType: string | null;
    status: string | null;
  };
};