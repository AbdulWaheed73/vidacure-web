import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePatientProfile, useWeightHistory } from '@/hooks/useDashboardQueries';
import { ConsentRequiredCard, isConsentError } from './ConsentRequiredCard';

type BMICategory = {
  key: string;
  color: string;
  min: number;
  max: number;
};

const bmiCategories: BMICategory[] = [
  { key: "underweight", color: "#60a5fa", min: 0, max: 18.5 },
  { key: "normal", color: "#34d399", min: 18.5, max: 24.9 },
  { key: "overweight", color: "#fbbf24", min: 25, max: 29.9 },
  { key: "obese", color: "#f87171", min: 30, max: 100 },
];

const calculateBMI = (weightKg: number, heightCm: number) => {
  return Math.round((weightKg / (heightCm * heightCm)) * 10000 * 10) / 10;
};

const getBMICategory = (bmi: number): BMICategory => {
  return bmiCategories.find(c => bmi >= c.min && bmi <= c.max) || bmiCategories[3];
};

export const BMICard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: profileData, isLoading: profileLoading, error: profileError } = usePatientProfile();
  const { data: weightData, isLoading: weightLoading, error: weightError } = useWeightHistory();

  const isLoading = profileLoading || weightLoading;

  const height = profileData?.profile.height;
  const history = weightData?.weightHistory ?? [];

  let currentBMI: number | null = null;
  let startingBMI: number | null = null;

  if (height && history.length > 0) {
    const latestWeight = history[0].weight;
    const firstWeight = history[history.length - 1].weight;
    currentBMI = calculateBMI(latestWeight, height);
    startingBMI = calculateBMI(firstWeight, height);
  }

  if (isConsentError(profileError) || isConsentError(weightError)) {
    return <ConsentRequiredCard title={t('dashboard.bmi')} />;
  }

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
          <Skeleton className="h-5 w-24 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (currentBMI === null) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-manrope">{t('dashboard.bmi')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 mb-4 text-center text-sm">{t('dashboard.completeProfileBMI')}</p>
          <Button onClick={() => navigate('/account')} className="bg-teal-600 hover:bg-teal-700 text-white">
            {t('dashboard.completeProfile')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const category = getBMICategory(currentBMI);

  // Donut gauge parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clampedBMI = Math.min(40, Math.max(15, currentBMI));
  const gaugePercent = (clampedBMI - 15) / (40 - 15);
  const strokeDashoffset = circumference * (1 - gaugePercent * 0.75);

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-manrope">{t('dashboard.bmi')}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p className="text-xs">{t('dashboard.bmiTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-36 h-36 mb-3">
          <svg viewBox="0 0 128 128" className="w-full h-full -rotate-[135deg]">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              strokeLinecap="round"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={category.color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">{currentBMI}</span>
          </div>
        </div>

        <span
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: category.color + '20', color: category.color }}
        >
          {t(`dashboard.${category.key}`)}
        </span>

        {startingBMI !== null && startingBMI !== currentBMI && (
          <p className="text-xs text-gray-500 mt-2">
            {t('dashboard.downFrom')} {startingBMI} {t('dashboard.atStart')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
