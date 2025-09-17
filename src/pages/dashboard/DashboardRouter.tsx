import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { DashboardPage } from '../DashboardPage';
import { DoctorDashboardPage } from '../DoctorDashboardPage';
import type { User } from '../../types';

const DoctorPrescriptions = lazy(() => import('./doctor/DoctorPrescriptions'));
const DoctorInbox = lazy(() => import('./doctor/DoctorInbox'));
const DoctorAccount = lazy(() => import('./doctor/DoctorAccount'));

type DashboardRouterProps = {
  user: User | null;
  onLogout: () => void;
  loading: boolean;
};

const DashboardRouter: React.FC<DashboardRouterProps> = ({ user, onLogout, loading }) => {

  const LoadingSpinner = () => (
    <div className="p-8 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <Routes>
      {/* Dashboard root route */}
      <Route 
        index 
        element={
          user?.role === 'doctor' ? (
            <DoctorDashboardPage user={user} onLogout={onLogout} loading={loading} />
          ) : user?.role === 'patient' ? (
            <DashboardPage user={user} onLogout={onLogout} loading={loading} />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        } 
      />
      
      {/* Doctor routes */}
      <Route 
        path="doctor/prescriptions" 
        element={
          user?.role === 'doctor' ? (
            <Suspense fallback={<LoadingSpinner />}>
              <DoctorPrescriptions />
            </Suspense>
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        } 
      />
      <Route 
        path="doctor/inbox" 
        element={
          user?.role === 'doctor' ? (
            <Suspense fallback={<LoadingSpinner />}>
              <DoctorInbox />
            </Suspense>
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        } 
      />
      <Route 
        path="doctor/account" 
        element={
          user?.role === 'doctor' ? (
            <Suspense fallback={<LoadingSpinner />}>
              <DoctorAccount />
            </Suspense>
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        } 
      />
      
      {/* Catch-all redirect */}
      <Route 
        path="*" 
        element={
          user?.role === 'doctor' ? (
            <Navigate to="/dashboard" replace />
          ) : user?.role === 'patient' ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        } 
      />
    </Routes>
  );
};

export default DashboardRouter;