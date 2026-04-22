import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { SupabaseChatContainer, SupabaseDoctorChat } from '../components/SupabaseChat';
import { Card } from '../components/ui/card';
import { SubscriptionRequired } from '../components/subscription/SubscriptionRequired';

const SupabaseChatPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p>{t('chat.loginRequired')}</p>
        </Card>
      </div>
    );
  }

  // Doctors — the DoctorChat component handles its own card layout
  if (user.role === 'doctor') {
    return (
      <div className="h-[calc(100dvh-80px)]">
        <SupabaseDoctorChat />
      </div>
    );
  }

  // Patient view with subscription check
  return (
    <SubscriptionRequired featureName="Chat">
      <div className="h-[calc(100dvh-80px)] flex flex-col p-4 bg-[#F0F7F4]">
        <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm overflow-hidden">
          <SupabaseChatContainer />
        </div>
      </div>
    </SubscriptionRequired>
  );
};

export default SupabaseChatPage;
