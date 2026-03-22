import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';
import { MessageSquare, CheckCircle2, Circle } from 'lucide-react';
import { LabTestOrderStatusBadge } from './LabTestOrderStatus';
import type { LabTestResult, LabTestStatusHistoryEntry } from '../types/lab-test-types';

type LabTestResultsProps = {
  results: LabTestResult[];
  labComment?: string;
  statusHistory?: LabTestStatusHistoryEntry[];
};

function formatValue(result: LabTestResult): string {
  if (result.valueType === 'quantity' && result.valueQuantity) {
    return `${result.valueQuantity.value} ${result.valueQuantity.unit}`;
  }
  if (result.valueType === 'string' && result.valueString) {
    return result.valueString;
  }
  if (result.valueType === 'codeableConcept' && result.valueString) {
    return result.valueString;
  }
  return '-';
}

function formatReferenceRange(result: LabTestResult): string {
  if (!result.referenceRange) return '-';
  if (result.referenceRange.text) return result.referenceRange.text;

  const { low, high } = result.referenceRange;
  if (low !== undefined && high !== undefined) {
    return `${low} - ${high}`;
  }
  if (low !== undefined) return `> ${low}`;
  if (high !== undefined) return `< ${high}`;
  return '-';
}

export const LabTestResults: React.FC<LabTestResultsProps> = ({ results, labComment, statusHistory }) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-GB';

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return new Intl.DateTimeFormat(dateLocale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Lab Comment */}
      {labComment && (
        <div className="bg-[#f0f7f4] border border-[#c0ebe5] rounded-2xl p-4 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-[#005044] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold font-sora text-[#005044] mb-1">
              {t('labTests.labComment')}
            </p>
            <p className="text-sm font-manrope text-[#005044]/80">{labComment}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <p className="text-gray-500 text-sm py-4 text-center font-manrope">
          {t('labTests.noResults')}
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-xs font-semibold font-sora text-[#005044] uppercase tracking-wider">{t('labTests.marker')}</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold font-sora text-[#005044] uppercase tracking-wider">{t('labTests.value')}</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold font-sora text-[#005044] uppercase tracking-wider">{t('labTests.referenceRange')}</th>
                  <th className="text-left py-3 px-3 text-xs font-semibold font-sora text-[#005044] uppercase tracking-wider">{t('labTests.statusLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.observationId} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-3">
                      <span className="text-sm font-medium font-manrope text-gray-900">{result.name}</span>
                      {result.note && (
                        <p className="text-xs text-gray-400 font-manrope mt-0.5">{result.note}</p>
                      )}
                    </td>
                    <td className="py-3 px-3 text-sm font-manrope text-gray-700">{formatValue(result)}</td>
                    <td className="py-3 px-3 text-sm font-manrope text-gray-500">{formatReferenceRange(result)}</td>
                    <td className="py-3 px-3">
                      <ResultStatusBadge result={result} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {results.map((result) => (
              <div key={result.observationId} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold font-manrope text-gray-900">{result.name}</span>
                  <ResultStatusBadge result={result} />
                </div>
                {result.note && (
                  <p className="text-xs text-gray-400 font-manrope">{result.note}</p>
                )}
                <div className="flex justify-between text-xs font-manrope">
                  <span className="text-gray-500">{t('labTests.value')}: <span className="text-gray-700 font-medium">{formatValue(result)}</span></span>
                  <span className="text-gray-500">{t('labTests.referenceRange')}: <span className="text-gray-700">{formatReferenceRange(result)}</span></span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Status History Timeline */}
      {statusHistory && statusHistory.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
          <p className="text-xs font-semibold font-sora text-[#005044] uppercase tracking-wider mb-4">
            {t('labTests.statusHistory')}
          </p>
          <div className="relative">
            {statusHistory.map((entry, i) => {
              const isLast = i === statusHistory.length - 1;
              return (
                <div key={`${entry.status}-${i}`} className="flex items-start gap-3 relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div className="absolute left-[11px] top-[22px] w-0.5 h-[calc(100%-6px)] bg-gray-200" />
                  )}
                  {/* Dot */}
                  <div className="shrink-0 mt-0.5 z-10">
                    {isLast ? (
                      <CheckCircle2 className="w-[22px] h-[22px] text-teal-500" />
                    ) : (
                      <Circle className="w-[22px] h-[22px] text-gray-300 fill-white" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 pb-5 ${isLast ? 'pb-0' : ''}`}>
                    <LabTestOrderStatusBadge status={entry.status} />
                    <span className="text-xs text-gray-400 font-manrope">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function ResultStatusBadge({ result }: { result: LabTestResult }) {
  const { t } = useTranslation();

  if (result.valueType === 'absent') {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs font-manrope">
        {t('labTests.pending')}
      </Badge>
    );
  }

  if (result.isOutOfRange) {
    const isLow =
      result.valueType === 'quantity' &&
      result.valueQuantity &&
      result.referenceRange?.low !== undefined &&
      result.valueQuantity.value < result.referenceRange.low;

    return (
      <Badge
        variant="outline"
        className={`text-xs font-manrope ${
          isLow
            ? 'bg-amber-100 text-amber-700 border-amber-200'
            : 'bg-red-100 text-red-700 border-red-200'
        }`}
      >
        {t('labTests.outOfRange')}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs font-manrope">
      {t('labTests.normal')}
    </Badge>
  );
}
