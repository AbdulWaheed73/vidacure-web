import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

type GoalProgressCardProps = {
  goalWeight: number | null;
  currentWeight: number | null;
  startingWeight: number | null;
  className?: string;
  onEditGoal?: () => void;
};

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goalWeight,
  currentWeight,
  startingWeight,
  className,
  onEditGoal,
}) => {
  const { t } = useTranslation();

  const progressPercent =
    goalWeight && startingWeight && currentWeight && startingWeight !== goalWeight
      ? Math.min(
          100,
          Math.max(0, ((startingWeight - currentWeight) / (startingWeight - goalWeight)) * 100)
        )
      : 0;

  return (
    <Card className={`bg-white/95 backdrop-blur-md shadow-lg ${className ?? ''}`}>
      <CardHeader>
        <CardTitle className="text-lg font-manrope">{t('dashboard.myGoals')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.goalWeight')}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                {goalWeight != null ? `${goalWeight} kg` : t('dashboard.notSet')}
              </span>
              {onEditGoal && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  onClick={onEditGoal}
                  aria-label={t('progress.goalWeightEdit')}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.currentWeight')}</span>
            <span className="text-sm font-semibold text-gray-800">
              {currentWeight != null ? `${currentWeight} kg` : '—'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{t('dashboard.startingWeight')}</span>
            <span className="text-sm font-semibold text-gray-800">
              {startingWeight != null ? `${startingWeight} kg` : '—'}
            </span>
          </div>
        </div>

        {goalWeight != null && startingWeight != null && currentWeight != null && (
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
              {Math.round(progressPercent)}
              {t('dashboard.ofGoalReached')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
