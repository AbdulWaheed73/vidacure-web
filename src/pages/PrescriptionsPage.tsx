import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pill, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PrescriptionRequestModal } from '../components/PrescriptionRequestModal';
import { PrescriptionRequestsList } from '../components/PrescriptionRequestsList';

export const PrescriptionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRequestSuccess = () => {
    // Trigger a refresh of the prescription requests list
    setRefreshTrigger(prev => prev + 1);
    console.log('Prescription request submitted successfully!');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Pill className="size-8 text-teal-action" />
            <h1 className="text-3xl font-bold text-gray-800 font-manrope">{t('prescriptions.title')}</h1>
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus className="size-4" />
            Request Prescription
          </Button>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          {t('prescriptions.description')}
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <PrescriptionRequestsList refreshTrigger={refreshTrigger} />
      </div>

      <PrescriptionRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
};