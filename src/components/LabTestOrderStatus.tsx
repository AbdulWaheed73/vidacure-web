import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import type { LabTestOrderStatusType } from '../types/lab-test-types';

type LabTestOrderStatusProps = {
  status: LabTestOrderStatusType;
};

const getStatusStyle = (status: LabTestOrderStatusType): string => {
  switch (status) {
    case 'draft':
    case 'created':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'sending':
    case 'sent':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'sent-failed':
    case 'revoked':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'accepted':
    case 'received':
    case 'sample-received':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'partial-report':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'final-report':
    case 'updated-final-report':
      return 'bg-teal-100 text-teal-700 border-teal-200';
    case 'signed':
    case 'completed-updated':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const LabTestOrderStatusBadge: React.FC<LabTestOrderStatusProps> = ({ status }) => {
  const { t } = useTranslation();

  const tooltip = t(`labTests.statusTooltip.${status}`, '');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${getStatusStyle(status)} cursor-help`}
          >
            {t(`labTests.status.${status}`, status)}
          </Badge>
        </TooltipTrigger>
        {tooltip && (
          <TooltipContent className="max-w-xs text-sm">
            <p>{tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
