import { api } from './api';

type SSNResponse = {
  ssn: string;
};

export const ssnService = {
  getMySSN: async (): Promise<string> => {
    const response = await api.get<SSNResponse>('/api/users/me/ssn');
    return response.data.ssn;
  },
};
