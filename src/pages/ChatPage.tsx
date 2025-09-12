import React from 'react';
import { useAuthStore } from '../stores/authStore';
import ChatContainer from '../components/Chat/ChatContainer';
import DoctorChat from '../components/Chat/DoctorChat';
import { Card } from '../components/ui/card';

const ChatPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Medical Chat</h1>
          <p>Please log in to access the medical chat system.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medical Chat
              </h1>
              <p className="text-sm text-gray-600">
                {user.role === 'patient' 
                  ? 'Secure communication with your doctor'
                  : 'Patient communication portal'
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 container mx-auto p-4">
        <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {user.role === 'doctor' ? (
            <DoctorChat />
          ) : (
            <ChatContainer />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;