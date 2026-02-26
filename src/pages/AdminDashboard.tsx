import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PatientsView } from '@/components/admin/PatientsView';
import { DoctorsView } from '@/components/admin/DoctorsView';
import { ReassignDoctorModal } from '@/components/admin/ReassignDoctorModal';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { NotificationsView } from '@/components/admin/NotificationsView';
import { DeletionLogsView } from '@/components/admin/DeletionLogsView';
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog';
import { ProvidersView } from '@/components/admin/ProvidersView';
import { adminService } from '@/services/adminService';
import type { Patient, Doctor, DashboardStats } from '@/services/adminService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Users, UserPlus, Activity, UserX, Stethoscope } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [isLoadingStripeData, setIsLoadingStripeData] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });

  // Delete user state
  const [deleteTarget, setDeleteTarget] = useState<{
    user: Patient | Doctor | null;
    type: 'patient' | 'doctor';
  }>({ user: null, type: 'patient' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteUser = (user: Patient | Doctor, type: 'patient' | 'doctor') => {
    setDeleteTarget({ user, type });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, patientsData, doctorsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllPatients(pagination.page, pagination.limit),
        adminService.getAllDoctors(),
      ]);

      setStats(statsData);
      setPatients(patientsData.patients);
      setPagination(patientsData.pagination);
      setDoctors(doctorsData.doctors);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setError(err.response?.data?.error || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page]);

  const handleReassign = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsReassignModalOpen(true);
  };

  const handleReassignSubmit = async (patientId: string, newDoctorId: string) => {
    setIsReassigning(true);
    try {
      await adminService.reassignDoctor(patientId, newDoctorId);
      // Refresh data after successful reassignment
      await fetchData();
      setIsReassignModalOpen(false);
      setSelectedPatient(null);
    } catch (err: any) {
      console.error('Error reassigning doctor:', err);
      alert(err.response?.data?.error || 'Failed to reassign doctor');
    } finally {
      setIsReassigning(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleRefreshStripeData = async () => {
    try {
      setIsLoadingStripeData(true);
      setError(null);

      // Fetch patients with Stripe data included
      const patientsData = await adminService.getAllPatients(
        pagination.page,
        pagination.limit,
        true // includeStripeData
      );

      setPatients(patientsData.patients);
      setPagination(patientsData.pagination);
    } catch (err: any) {
      console.error('Error fetching Stripe data:', err);
      setError(err.response?.data?.error || 'Failed to load Stripe data');
    } finally {
      setIsLoadingStripeData(false);
    }
  };

  return (
    <>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-8 space-y-8 overflow-x-hidden">

      {/* Loading State */}
      {loading && !stats && (
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert variant="destructive" title="Error">
          {error}
        </Alert>
      )}

      {/* Tabs for Dashboard, Patients and Doctors Views */}
      {!loading && !error && stats && (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsContent value="dashboard" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Registered in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalDoctors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Available for assignment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.activeSubscriptions || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Patients with active plans
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unassigned Patients
                </CardTitle>
                <UserX className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.unassignedPatients || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting doctor assignment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Providers
                </CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalProviders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Physicians & specialists
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <PatientsView
                patients={patients}
                doctors={doctors}
                onReassign={handleReassign}
                onDelete={(patient) => handleDeleteUser(patient, 'patient')}
                onRefreshStripeData={handleRefreshStripeData}
                isLoadingStripeData={isLoadingStripeData}
                pagination={pagination}
                onPageChange={handlePageChange}
                onRefresh={fetchData}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <DoctorsView
            doctors={doctors}
            onReassign={handleReassign}
            onDelete={(doctor) => handleDeleteUser(doctor, 'doctor')}
            onRefresh={fetchData}
          />
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <ProvidersView onRefresh={fetchData} />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationsView />
        </TabsContent>

        <TabsContent value="deletion-logs" className="space-y-4">
          <DeletionLogsView />
        </TabsContent>
      </Tabs>
      )}

      {/* Reassign Doctor Modal */}
      <ReassignDoctorModal
        isOpen={isReassignModalOpen}
        onClose={() => {
          setIsReassignModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        doctors={doctors}
        onReassign={handleReassignSubmit}
        isLoading={isReassigning}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeleteTarget({ user: null, type: 'patient' });
        }}
        user={deleteTarget.user}
        userType={deleteTarget.type}
        doctors={doctors}
        onSuccess={handleDeleteSuccess}
      />
      </div>
    </>
  );
};

export default AdminDashboard;
