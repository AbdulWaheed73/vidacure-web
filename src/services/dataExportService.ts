import { api } from './api';
import type { PatientDataExport } from '../types';

/**
 * Fetch all patient data for GDPR export
 */
export const exportMyData = async (): Promise<PatientDataExport> => {
  const response = await api.get<PatientDataExport>('/api/users/me/data-export');
  return response.data;
};

/**
 * Trigger browser download of exported data as JSON file
 */
export const downloadDataAsFile = (data: PatientDataExport): void => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split('T')[0];
  const filename = `vidacure-data-export-${date}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  exportMyData,
  downloadDataAsFile,
};
