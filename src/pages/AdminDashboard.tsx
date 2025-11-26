import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { PatientsView } from '@/components/admin/PatientsView';
import { DoctorsView } from '@/components/admin/DoctorsView';
import { ReassignDoctorModal } from '@/components/admin/ReassignDoctorModal';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { adminService } from '@/services/adminService';
import type { Patient, Doctor, DashboardStats } from '@/services/adminService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { Users, UserPlus, Activity, UserX } from 'lucide-react';

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

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive" title="Error">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage doctors, patients, and assignments
          </p>
        </div>

      {/* Tabs for Dashboard, Patients and Doctors Views */}
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
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <PatientsView
                patients={patients}
                doctors={doctors}
                onReassign={handleReassign}
                onRefreshStripeData={handleRefreshStripeData}
                isLoadingStripeData={isLoadingStripeData}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <DoctorsView doctors={doctors} onReassign={handleReassign} onRefresh={fetchData} />
        </TabsContent>
      </Tabs>

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
      </div>
    </>
  );
};

export default AdminDashboard;
