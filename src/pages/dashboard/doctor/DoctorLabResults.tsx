import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlaskConical, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LabTestOrderStatusBadge } from '@/components/LabTestOrderStatus';
import { LabTestResults } from '@/components/LabTestResults';
import { doctorLabTestService } from '@/services/doctorLabTestService';
import { api } from '@/services/api';
import type { LabTestOrder } from '@/types/lab-test-types';

type PatientSummary = {
  id: string;
  name: string;
  givenName?: string;
  familyName?: string;
  email?: string;
};

const DoctorLabResults: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isSv = i18n.language === 'sv';

  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [orders, setOrders] = useState<LabTestOrder[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState('');
  const [resultOrder, setResultOrder] = useState<LabTestOrder | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const response = await api.get('/api/doctor/patients');
        setPatients(response.data.patients || []);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSelectPatient = async (patientId: string) => {
    setSelectedPatientId(patientId);
    setLoadingOrders(true);
    setError('');
    try {
      const response = await doctorLabTestService.getPatientLabOrders(patientId);
      setOrders(response.orders);
    } catch (err) {
      console.error('Failed to fetch patient lab orders:', err);
      setError('Failed to load lab orders');
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <FlaskConical className="size-8 text-teal-action" />
            <h1 className="text-3xl font-bold text-gray-800 font-manrope">
              {t('labTests.doctorView.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-manrope">
            {t('labTests.doctorView.description')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 font-manrope">
              Patients
            </h2>
            {loadingPatients ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : patients.length === 0 ? (
              <p className="text-gray-500 text-sm">
                {t('labTests.doctorView.noPatients')}
              </p>
            ) : (
              <div className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      selectedPatientId === patient.id
                        ? 'bg-teal-50 border border-teal-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <User className="size-5 text-gray-500 shrink-0" />
                    <span className="font-medium text-gray-800 text-sm">
                      {patient.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            {!selectedPatientId ? (
              <div className="text-center py-12">
                <FlaskConical className="size-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {t('labTests.doctorView.selectPatient')}
                </p>
              </div>
            ) : loadingOrders ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {t('labTests.doctorView.noLabOrders')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order._id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {isSv ? order.testPackage.nameSv : order.testPackage.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {t('labTests.orderedOn')}: {new Date(order.orderedAt).toLocaleDateString()}
                          </p>
                          {order.completedAt && (
                            <p className="text-sm text-gray-500">
                              {t('labTests.completedOn')}: {new Date(order.completedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <LabTestOrderStatusBadge status={order.status} />
                          {order.results.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setResultOrder(order)}
                            >
                              {t('labTests.viewResults')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Detail Dialog */}
      <Dialog open={!!resultOrder} onOpenChange={(open) => !open && setResultOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('labTests.results')}</DialogTitle>
            <DialogDescription>
              {resultOrder && (isSv ? resultOrder.testPackage.nameSv : resultOrder.testPackage.name)}
              {' - '}
              {resultOrder && new Date(resultOrder.orderedAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          {resultOrder && <LabTestResults results={resultOrder.results} labComment={resultOrder.labComment} statusHistory={resultOrder.statusHistory} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorLabResults;
