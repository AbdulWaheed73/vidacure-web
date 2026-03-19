import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientProfile, useWeightHistory } from '@/hooks/useDashboardQueries';
import { ConsentRequiredCard, isConsentError } from './ConsentRequiredCard';

export const GoalsCard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: profileData, isLoading: profileLoading, error: profileError } = usePatientProfile();
  const { data: weightData, isLoading: weightLoading, error: weightError } = useWeightHistory();

  const isLoading = profileLoading || weightLoading;

  const goalWeight = profileData?.profile.goalWeight ?? null;
  const history = weightData?.weightHistory ?? [];
  const currentWeight = history.length > 0 ? history[0].weight : null;
  const startingWeight = history.length > 0 ? history[history.length - 1].weight : null;

  if (isConsentError(profileError) || isConsentError(weightError)) {
    return <ConsentRequiredCard title={t('dashboard.myGoals')} />;
  }

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-full mb-3" />
          <Skeleton className="h-5 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (goalWeight === null && currentWeight === null) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-manrope">{t('dashboard.myGoals')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Target className="size-8 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-4 text-center text-sm">{t('dashboard.setGoalPrompt')}</p>
          <Button onClick={() => navigate('/account')} className="bg-teal-600 hover:bg-teal-700 text-white">
            {t('dashboard.setGoalWeight')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = (goalWeight && startingWeight && currentWeight)
    ? Math.min(100, Math.max(0, ((startingWeight - currentWeight) / (startingWeight - goalWeight)) * 100))
    : 0;

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-manrope">{t('dashboard.myGoals')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.goalWeight')}</span>
            <span className="text-sm font-semibold text-gray-800">
              {goalWeight ? `${goalWeight} kg` : t('dashboard.notSet')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.currentWeight')}</span>
            <span className="text-sm font-semibold text-gray-800">
              {currentWeight ? `${currentWeight} kg` : "\u2014"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.startingWeight')}</span>
            <span className="text-sm font-semibold text-gray-800">
              {startingWeight ? `${startingWeight} kg` : "\u2014"}
            </span>
          </div>
        </div>

        {goalWeight && startingWeight && currentWeight && (
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{t('dashboard.start')}</span>
              <span>{t('dashboard.goal')}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {Math.round(progressPercent)}{t('dashboard.ofGoalReached')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
