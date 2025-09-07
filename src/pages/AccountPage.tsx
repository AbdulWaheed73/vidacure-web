import React from 'react';
import { User } from 'lucide-react';
import { Button } from '../components/ui';
import type { User as UserType } from '../types';

interface AccountPageProps {
  user: UserType | null;
  onLogout: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ user, onLogout }) => {

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <User className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">Account</h1>
        </div>
        <p className="text-lg text-gray-600 font-manrope">
          Manage your account settings and profile information
        </p>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-6">
        {user && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 font-manrope">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-700 font-manrope">Name</p>
                  <p className="text-gray-600 font-manrope">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-700 font-manrope">Role</p>
                  <p className="text-gray-600 font-manrope">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 font-manrope">
            Account Actions
          </h2>
          <Button 
            onClick={onLogout}
            variant="destructive"
            size="lg"
            className="font-manrope"
          >
            🚪 Logout
          </Button>
        </div>
      </div>
    </div>
  );
};