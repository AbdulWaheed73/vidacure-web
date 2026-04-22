import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageCircle, FlaskConical } from 'lucide-react';
import {
  useDoctorPatientProfile,
  useDoctorPatientQuestionnaire,
  useDoctorPatientLabOrders,
  useDoctorUnassignedPatientQuestionnaire,
} from '@/hooks/useDoctorDashboardQueries';
import { JournalTab } from '@/components/doctor/JournalTab';
import { PatientChatTab } from '@/components/SupabaseChat/PatientChatTab';
import { QUESTION_LABELS } from '@/components/onboarding/questionMapping';
import { LabTestOrderStatusBadge } from '@/components/LabTestOrderStatus';
import { LabTestResults } from '@/components/LabTestResults';
import type { WeightHistoryEntry, PrescriptionRequestEntry } from '@/types/doctor-patient-types';
import type { LabTestOrder } from '@/types/lab-test-types';

type PatientProfilePanelProps = {
  patientId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isUnassigned?: boolean;
};

// --- Weight Chart Sub-component ---

const WeightChart: React.FC<{ weightHistory: WeightHistoryEntry[]; t: (key: string) => string; dateLocale: string }> = ({ weightHistory, t, dateLocale }) => {
  const [timeRange, setTimeRange] = useState('8w');

  const chartConfig = {
    weight: {
      label: t('doctorPatients.weight'),
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  const today = new Date();
  let daysToSubtract = 56;
  if (timeRange === '2w') daysToSubtract = 14;
  else if (timeRange === '4w') daysToSubtract = 28;

  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);

  const filteredData = weightHistory
    .filter((entry) => {
      if (!entry.date) return false;
      const itemDate = new Date(entry.date);
      return itemDate >= cutoffDate && itemDate <= today;
    })
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const rangeProgress =
    filteredData.length > 1
      ? Math.round((filteredData[0].weight - filteredData[filteredData.length - 1].weight) * 10) / 10
      : 0;

  const weeksLabel = timeRange === '2w' ? t('doctorPatients.2weeks') : timeRange === '4w' ? t('doctorPatients.4weeks') : t('doctorPatients.8weeks');

  const weights = filteredData.map((d) => d.weight);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 2) : 90;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 2) : 110;

  if (weightHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
        <h3 className="font-sora font-semibold text-sm text-[#282828] mb-3">{t('doctorPatients.weightProgress')}</h3>
        <p className="text-[#b0b0b0] text-sm font-manrope text-center py-6">{t('doctorPatients.noWeightEntries')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e0e0e0] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-sora font-semibold text-sm text-[#282828]">{t('doctorPatients.weightProgress')}</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[130px] h-8 text-xs rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="8w" className="rounded-lg text-xs">{t('doctorPatients.last2Months')}</SelectItem>
            <SelectItem value="4w" className="rounded-lg text-xs">{t('doctorPatients.last4Weeks')}</SelectItem>
            <SelectItem value="2w" className="rounded-lg text-xs">{t('doctorPatients.last2Weeks')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="aspect-auto h-[180px] w-full">
        <AreaChart data={filteredData} margin={{ left: 4, right: 4, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="panelWeightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            domain={[minWeight, maxWeight]}
            tickFormatter={(value) => `${value}`}
            width={32}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })
                }
                formatter={(value) => [`${value} kg`, t('doctorPatients.weight')]}
              />
            }
          />
          <Area
            dataKey="weight"
            type="monotone"
            stroke="var(--color-weight)"
            strokeWidth={2}
            fill="url(#panelWeightGradient)"
            dot={{ fill: 'var(--color-weight)', strokeWidth: 2, r: 2 }}
            activeDot={{ r: 4, stroke: 'var(--color-weight)', strokeWidth: 2, fill: 'white' }}
          />
        </AreaChart>
      </ChartContainer>
      <div className="flex items-center text-xs text-teal-600 font-medium mt-1">
        <span>{rangeProgress > 0 ? `-${rangeProgress}` : `+${Math.abs(rangeProgress)}`} kg</span>
        <span className="ml-1.5 text-gray-500">{t('doctorPatients.inTheLast')} {weeksLabel}</span>
      </div>
    </div>
  );
};

// --- Prescription status badge helper ---

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  denied: 'bg-red-100 text-red-800 border-red-200',
  under_review: 'bg-blue-100 text-blue-800 border-blue-200',
};

const PrescriptionCard: React.FC<{ request: PrescriptionRequestEntry; t: (key: string) => string; dateLocale: string }> = ({ request, t, dateLocale }) => {
  const style = statusStyles[request.status] ?? 'bg-gray-100 text-gray-800 border-gray-200';
  return (
    <div className="bg-white rounded-xl border border-[#e0e0e0] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sora font-medium text-sm text-[#282828]">
          {request.medicationName ?? t('doctorPatients.prescriptionRequest')}
        </span>
        <Badge className={`${style} text-[10px] px-2 py-0.5 capitalize`}>
          {request.status.replace('_', ' ')}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#b0b0b0] font-manrope">
        {request.dosage && (
          <>
            <span>{t('doctorPatients.dosage')}</span>
            <span className="text-[#282828]">{request.dosage}</span>
          </>
        )}
        {request.currentWeight && (
          <>
            <span>{t('doctorPatients.weightLabel')}</span>
            <span className="text-[#282828]">{request.currentWeight} kg</span>
          </>
        )}
        {request.createdAt && (
          <>
            <span>{t('doctorPatients.requested')}</span>
            <span className="text-[#282828]">
              {new Date(request.createdAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// --- Questionnaire display ---

const QuestionnaireTab: React.FC<{ patientId: string | null; enabled: boolean; isUnassigned?: boolean }> = ({
  patientId,
  enabled,
  isUnassigned = false,
}) => {
  const { t } = useTranslation();
  const assignedQuery = useDoctorPatientQuestionnaire(patientId, enabled && !isUnassigned);
  const unassignedQuery = useDoctorUnassignedPatientQuestionnaire(patientId, enabled && isUnassigned);
  const { data, isLoading } = isUnassigned ? unassignedQuery : assignedQuery;

  const QUESTION_GROUPS = [
    { label: t('doctorPatients.personalInfo'), ids: ['Q1', 'Q2', 'Q3'] },
    { label: t('doctorPatients.physicalDetails'), ids: ['Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11'] },
    { label: t('doctorPatients.healthBackground'), ids: ['Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 'Q19', 'Q20', 'Q21'] },
    { label: t('doctorPatients.medicalHistory'), ids: ['Q22', 'Q23', 'Q24', 'Q25'] },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4 p-1">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const answers = data?.questionnaire ?? [];
  const answerMap = new Map(answers.map((a) => [a.questionId, a.answer]));

  if (answers.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-[#b0b0b0] font-manrope text-sm">{t('doctorPatients.noQuestionnaire')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-1">
      {QUESTION_GROUPS.map((group) => {
        const groupAnswers = group.ids.filter((id) => answerMap.has(id));
        if (groupAnswers.length === 0) return null;
        return (
          <div key={group.label}>
            <h4 className="font-sora font-semibold text-xs text-[#005044] uppercase tracking-wide mb-2">
              {group.label}
            </h4>
            <div className="bg-[#f0f7f4] rounded-xl p-4 space-y-3">
              {groupAnswers.map((id) => (
                <div key={id}>
                  <p className="text-xs text-[#b0b0b0] font-manrope">
                    {t([`doctorPatients.questionLabels.${id}`, QUESTION_LABELS[id as keyof typeof QUESTION_LABELS] ?? id])}
                  </p>
                  <p className="text-sm text-[#282828] font-manrope mt-0.5">
                    {answerMap.get(id) || '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Lab Tests Tab ---

const LabTestsTab: React.FC<{ patientId: string | null; enabled: boolean; t: (key: string) => string; dateLocale: string }> = ({
  patientId,
  enabled,
  t,
  dateLocale,
}) => {
  const { data, isLoading } = useDoctorPatientLabOrders(patientId, enabled);
  const [resultOrder, setResultOrder] = useState<LabTestOrder | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-3 p-1">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <FlaskConical className="w-10 h-10 text-[#c0ebe5] mx-auto mb-3" />
        <p className="text-[#b0b0b0] font-manrope text-sm">{t('doctorPatients.noLabOrders')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 p-1">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl border border-[#e0e0e0] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sora font-medium text-sm text-[#282828]">
                {order.testPackage.name}
              </span>
              <LabTestOrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-[#b0b0b0] font-manrope space-y-0.5">
                <p>{t('doctorPatients.ordered')} {new Date(order.orderedAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                {order.completedAt && (
                  <p>{t('doctorPatients.completed')} {new Date(order.completedAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                )}
              </div>
              {order.results.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setResultOrder(order)}
                >
                  {t('doctorPatients.viewResults')}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!resultOrder} onOpenChange={(open) => !open && setResultOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('doctorPatients.labResults')}</DialogTitle>
            <DialogDescription>
              {resultOrder?.testPackage.name}
              {' — '}
              {resultOrder && new Date(resultOrder.orderedAt).toLocaleDateString(dateLocale)}
            </DialogDescription>
          </DialogHeader>
          {resultOrder && <LabTestResults results={resultOrder.results} labComment={resultOrder.labComment} statusHistory={resultOrder.statusHistory} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

// --- Main Panel ---

export const PatientProfilePanel: React.FC<PatientProfilePanelProps> = ({
  patientId,
  open,
  onOpenChange,
  isUnassigned = false,
}) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(isUnassigned ? 'questionnaire' : 'overview');
  const { data, isLoading } = useDoctorPatientProfile(isUnassigned ? null : patientId);

  useEffect(() => {
    setActiveTab(isUnassigned ? 'questionnaire' : 'overview');
  }, [isUnassigned]);

  const profile = data?.patientProfile;
  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] sm:max-w-[540px] md:w-[600px] md:max-w-[600px] lg:w-[680px] lg:max-w-[680px] xl:w-[760px] xl:max-w-[760px] overflow-y-auto p-0"
      >
        <SheetHeader className="p-5 pb-0">
          <SheetTitle className="font-sora font-bold text-lg text-[#282828]">
            {t('doctorPatients.profileOverview')}
          </SheetTitle>
          <SheetDescription className="sr-only">{t('doctorPatients.profileDescription')}</SheetDescription>
        </SheetHeader>

        <div className="px-3 sm:px-5 pt-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="!bg-transparent w-full justify-start gap-1 sm:gap-2 border-b border-[#e0e0e0] rounded-none p-0 h-auto overflow-x-auto flex-nowrap [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
              {!isUnassigned && (
                <TabsTrigger
                  value="overview"
                  className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#005044] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#005044] px-2 sm:px-3 pb-2 text-xs sm:text-sm font-sora font-medium"
                >
                  {t('doctorPatients.tabOverview')}
                </TabsTrigger>
              )}
              <TabsTrigger
                value="questionnaire"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#005044] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#005044] px-3 pb-2 text-sm font-sora font-medium"
              >
                {t('doctorPatients.tabQuestionnaire')}
              </TabsTrigger>
              {!isUnassigned && (
                <>
                  <TabsTrigger
                    value="chat"
                    className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#005044] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#005044] px-2 sm:px-3 pb-2 text-xs sm:text-sm font-sora font-medium"
                  >
                    {t('doctorPatients.tabChat')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="lab-tests"
                    className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#005044] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#005044] px-2 sm:px-3 pb-2 text-xs sm:text-sm font-sora font-medium"
                  >
                    {t('doctorPatients.tabLabTests')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="journal"
                    className="shrink-0 whitespace-nowrap rounded-none border-b-2 border-transparent data-[state=active]:border-[#005044] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-[#005044] px-2 sm:px-3 pb-2 text-xs sm:text-sm font-sora font-medium"
                  >
                    {t('doctorPatients.tabJournal')}
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 space-y-4 pb-6">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              ) : !profile ? (
                <p className="text-[#b0b0b0] text-sm text-center py-8">
                  {t('doctorPatients.couldNotLoad')}
                </p>
              ) : (
                <>
                  {/* Patient Details */}
                  <div className="bg-[#f0f7f4] rounded-2xl p-5">
                    <h3 className="font-sora font-semibold text-sm text-[#282828] mb-3">
                      {t('doctorPatients.patientDetails')}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-manrope">
                      <div>
                        <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.name')}</p>
                        <p className="text-[#282828] font-medium">{profile.name}</p>
                      </div>
                      {profile.height && (
                        <div>
                          <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.height')}</p>
                          <p className="text-[#282828] font-medium">{profile.height} cm</p>
                        </div>
                      )}
                      {profile.bmi && (
                        <div>
                          <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.bmi')}</p>
                          <p className="text-[#282828] font-medium">{profile.bmi}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weight Progress */}
                  <WeightChart weightHistory={profile.weightHistory} t={t} dateLocale={dateLocale} />

                  {/* Prescriptions */}
                  {profile.prescriptionRequests.length > 0 && (
                    <div>
                      <h3 className="font-sora font-semibold text-sm text-[#282828] mb-3">
                        {t('doctorPatients.prescriptionRequests')}
                      </h3>
                      <div className="space-y-2">
                        {profile.prescriptionRequests.map((req, i) => (
                          <PrescriptionCard key={req.id ?? i} request={req} t={t} dateLocale={dateLocale} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Prescription */}
                  {profile.prescription && (
                    <div className="bg-[#f0f7f4] rounded-2xl p-5">
                      <h3 className="font-sora font-semibold text-sm text-[#282828] mb-3">
                        {t('doctorPatients.activePrescription')}
                      </h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm font-manrope">
                        {profile.prescription.medicationDetails && (
                          <>
                            <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.medication')}</p>
                            <p className="text-[#282828] text-xs">{profile.prescription.medicationDetails}</p>
                          </>
                        )}
                        {profile.prescription.status && (
                          <>
                            <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.status')}</p>
                            <p className="text-[#282828] text-xs capitalize">{profile.prescription.status}</p>
                          </>
                        )}
                        {profile.prescription.validFrom && (
                          <>
                            <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.validFrom')}</p>
                            <p className="text-[#282828] text-xs">{formatDate(profile.prescription.validFrom)}</p>
                          </>
                        )}
                        {profile.prescription.validTo && (
                          <>
                            <p className="text-[#b0b0b0] text-xs">{t('doctorPatients.validTo')}</p>
                            <p className="text-[#282828] text-xs">{formatDate(profile.prescription.validTo)}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Send Message Button — opens the in-sheet Chat tab */}
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full bg-[#005044] text-white rounded-xl px-6 py-3 font-sora font-semibold text-sm hover:bg-[#004038] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {t('doctorPatients.sendMessage')}
                  </button>
                </>
              )}
            </TabsContent>

            {/* Questionnaire Tab */}
            <TabsContent value="questionnaire" className="mt-4 pb-6">
              <QuestionnaireTab
                patientId={patientId}
                enabled={activeTab === 'questionnaire'}
                isUnassigned={isUnassigned}
              />
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="mt-4 pb-6">
              <PatientChatTab
                patientId={patientId}
                enabled={activeTab === 'chat'}
              />
            </TabsContent>

            {/* Lab Tests Tab */}
            <TabsContent value="lab-tests" className="mt-4 pb-6">
              <LabTestsTab
                patientId={patientId}
                enabled={activeTab === 'lab-tests'}
                t={t}
                dateLocale={dateLocale}
              />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="mt-4 pb-6">
              <JournalTab
                patientId={patientId}
                enabled={activeTab === 'journal'}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
