import { useTranslation } from 'react-i18next';
import { Shield, Download } from 'lucide-react';
import { Button } from '../ui';
import { Badge } from '../ui/badge';

type DataPrivacyCardProps = {
  onExportData: () => void;
  isExporting: boolean;
  showConsent?: boolean;
  hasAcceptedLatest?: boolean;
  currentVersion?: string;
};

export const DataPrivacyCard = ({
  onExportData,
  isExporting,
  showConsent = false,
  hasAcceptedLatest,
  currentVersion,
}: DataPrivacyCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 col-span-1">
      <div className="flex items-center gap-2 mb-5">
        <Shield className="size-5 text-[#005044]" />
        <h3 className="text-lg font-semibold text-gray-800 font-sora">
          {t('account.dataExport')}
        </h3>
      </div>

      <div className="bg-[#f0f7f4] rounded-2xl p-5 mb-4">
        <p className="text-sm text-gray-600 font-manrope mb-3">
          {t('account.exportDescription')}
        </p>
        <Button
          onClick={onExportData}
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="font-manrope"
        >
          <Download className="size-4 mr-2" />
          {isExporting ? t('account.exporting') : t('account.exportData')}
        </Button>
      </div>

      {showConsent && (
        <div className="flex items-center gap-2">
          {hasAcceptedLatest ? (
            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
              {t('account.consentAccepted', { version: currentVersion })}
            </Badge>
          ) : (
            <Badge variant="destructive">
              {t('account.consentPending')}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
