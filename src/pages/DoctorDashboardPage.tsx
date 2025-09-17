import React from 'react';
import { DoctorMeetings } from '../components/DoctorMeetings';
import type { DashboardPageProps } from '../types';

export const DoctorDashboardPage: React.FC<DashboardPageProps> = () => {
  return <DoctorMeetings />;
};