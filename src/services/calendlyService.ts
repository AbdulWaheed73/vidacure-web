import { api } from './api';
import type {
  AppointmentBookingResponse,
  PatientMeetingsResponse,
  AvailableEventTypesResponse
} from '../types/calendly-types';

export const calendlyService = {
  // Get available event types for patient's assigned doctor
  async getAvailableEventTypes(): Promise<AvailableEventTypesResponse> {
    const response = await api.get('/api/calendly/patient-event-types');
    return response.data;
  },

  // Create a patient booking link with pre-filled details
  async createPatientBookingLink(eventType: 'free' | 'standard' | 'premium'): Promise<AppointmentBookingResponse> {
    const response = await api.post('/api/calendly/patient-booking', {
      eventType
    });
    return response.data;
  },

  // Get patient's scheduled meetings
  async getPatientMeetings(): Promise<PatientMeetingsResponse> {
    const response = await api.get('/api/calendly/patient-meetings');
    return response.data;
  },

  // Get doctor's own scheduled meetings
  async getDoctorOwnMeetings(pageToken?: string): Promise<PatientMeetingsResponse> {
    const params = pageToken ? { pageToken } : {};
    const response = await api.get('/api/calendly/doctor-own-meetings', { params });
    return response.data;
  },

  // Open Calendly popup widget (requires Calendly script to be loaded)
  openCalendlyPopup(schedulingLink: string) {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      (window as any).Calendly.initPopupWidget({
        url: schedulingLink
      });
    } else {
      // Fallback: open in new tab
      window.open(schedulingLink, '_blank');
    }
  }
};

// Load Calendly widget script
export const loadCalendlyScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).Calendly) {
      resolve();
      return;
    }

    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.href = 'https://assets.calendly.com/assets/external/widget.css';
    cssLink.rel = 'stylesheet';
    document.head.appendChild(cssLink);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Calendly script'));
    document.head.appendChild(script);
  });
};