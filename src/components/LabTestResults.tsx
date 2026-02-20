import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import type { LabTestResult } from '../types/lab-test-types';

type LabTestResultsProps = {
  results: LabTestResult[];
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

export const LabTestResults: React.FC<LabTestResultsProps> = ({ results }) => {
  const { t } = useTranslation();

  if (results.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4 text-center">
        {t('labTests.noResults')}
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('labTests.marker')}</TableHead>
          <TableHead>{t('labTests.value')}</TableHead>
          <TableHead>{t('labTests.referenceRange')}</TableHead>
          <TableHead>{t('labTests.statusLabel')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.observationId}>
            <TableCell className="font-medium">{result.name}</TableCell>
            <TableCell>{formatValue(result)}</TableCell>
            <TableCell className="text-gray-500">
              {formatReferenceRange(result)}
            </TableCell>
            <TableCell>
              <ResultStatusBadge result={result} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

function ResultStatusBadge({ result }: { result: LabTestResult }) {
  const { t } = useTranslation();

  if (result.valueType === 'absent') {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
        {t('labTests.pending')}
      </Badge>
    );
  }

  if (result.isOutOfRange) {
    // Determine if high or low
    const isLow =
      result.valueType === 'quantity' &&
      result.valueQuantity &&
      result.referenceRange?.low !== undefined &&
      result.valueQuantity.value < result.referenceRange.low;

    return (
      <Badge
        variant="outline"
        className={
          isLow
            ? 'bg-amber-100 text-amber-700 border-amber-200'
            : 'bg-red-100 text-red-700 border-red-200'
        }
      >
        {t('labTests.outOfRange')}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
      {t('labTests.normal')}
    </Badge>
  );
}
