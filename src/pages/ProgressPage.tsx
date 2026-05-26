import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ShieldAlert, FileText, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addWeightHistory, getWeightHistory, deleteWeightHistory } from '@/services/weightHistory';
import { patientService } from '@/services/patientService';
import { usePatientProfile } from '@/hooks/useDashboardQueries';
import { GoalProgressCard } from '@/components/GoalProgressCard';
import { treatmentJournalService } from '@/services/treatmentJournalService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { queryKeys } from '@/lib/queryClient';
import DOMPurify from 'dompurify';
import type { WeightHistoryEntry } from '@/types/weight-types';


const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig;


// Helper function to calculate BMI
const calculateBMI = (weightKg: number, heightCm: number) => {
  const bmi = (weightKg / (heightCm * heightCm)) * 10000;
return Math.round(bmi * 10) / 10;

};

export const ProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = React.useState("8w");
  const userPickedRangeRef = React.useRef(false);
  const handleRangeChange = (value: string) => {
    userPickedRangeRef.current = true;
    setTimeRange(value);
  };
  const [weightHistory, setWeightHistory] = React.useState<WeightHistoryEntry[]>([]);
  const [height, setHeight] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [consentRequired, setConsentRequired] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState<{
    weight: string;
    sideEffects: string;
    notes: string;
    date: Date;
  }>({
    weight: '',
    sideEffects: '',
    notes: '',
    date: new Date()
  });
  const [datePickerOpen, setDatePickerOpen] = React.useState(false);
  const [overwriteConfirm, setOverwriteConfirm] = React.useState<{
    open: boolean;
    existingWeight: number | null;
    dateLabel: string;
  }>({ open: false, existingWeight: null, dateLabel: '' });
  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    open: boolean;
    dateString: string;
    dateLabel: string;
    weight: number | null;
    deleting: boolean;
  }>({ open: false, dateString: '', dateLabel: '', weight: null, deleting: false });

  const { data: profileData } = usePatientProfile();
  const goalWeight = profileData?.profile?.goalWeight ?? null;
  const [goalDialogOpen, setGoalDialogOpen] = React.useState(false);
  const [goalInput, setGoalInput] = React.useState('');
  const [savingGoal, setSavingGoal] = React.useState(false);

  const openGoalDialog = () => {
    setGoalInput(goalWeight != null ? String(goalWeight) : '');
    setGoalDialogOpen(true);
  };

  const handleSaveGoalWeight = async () => {
    const num = parseFloat(goalInput);
    if (isNaN(num) || num <= 0 || num > 500) {
      toast.error(t('progress.goalWeightInvalid'));
      return;
    }
    try {
      setSavingGoal(true);
      await patientService.updatePatientProfile({ goalWeight: num });
      await queryClient.invalidateQueries({ queryKey: queryKeys.patientProfile });
      toast.success(t('progress.goalWeightSaveSuccess'));
      setGoalDialogOpen(false);
    } catch (error) {
      console.error('Error updating goal weight:', error);
      toast.error(t('progress.goalWeightSaveError'));
    } finally {
      setSavingGoal(false);
    }
  };

  // Load weight history on component mount
  React.useEffect(() => {
    loadWeightHistory();
  }, []);

  const loadWeightHistory = async () => {
    try {
      setLoading(true);
      const response = await getWeightHistory();
      setWeightHistory(response.weightHistory);
      setHeight(response.height);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 451) {
        setConsentRequired(true);
      } else {
        console.error('Error loading weight history:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const persistWeightEntry = async () => {
    const pickedDateString = format(formData.date, 'yyyy-MM-dd');
    try {
      setSaving(true);
      await addWeightHistory({
        weight: Number(formData.weight),
        sideEffects: formData.sideEffects || undefined,
        notes: formData.notes || undefined,
        date: pickedDateString
      });

      setFormData({ weight: '', sideEffects: '', notes: '', date: new Date() });
      await loadWeightHistory();
      queryClient.invalidateQueries({ queryKey: queryKeys.weightHistory });
      queryClient.invalidateQueries({ queryKey: queryKeys.patientProfile });
      toast.success(t('progress.updateSuccess'));
    } catch (error) {
      console.error('Error saving weight history:', error);
      toast.error(t('progress.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const openDeleteConfirm = (entry: WeightHistoryEntry) => {
    const dateString = new Date(entry.date).toISOString().split('T')[0];
    setDeleteConfirm({
      open: true,
      dateString,
      dateLabel: format(new Date(entry.date), 'PPP'),
      weight: entry.weight,
      deleting: false
    });
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm.dateString) return;
    try {
      setDeleteConfirm((prev) => ({ ...prev, deleting: true }));
      await deleteWeightHistory(deleteConfirm.dateString);
      await loadWeightHistory();
      queryClient.invalidateQueries({ queryKey: queryKeys.weightHistory });
      queryClient.invalidateQueries({ queryKey: queryKeys.patientProfile });
      toast.success(t('progress.deleteSuccess'));
      setDeleteConfirm({ open: false, dateString: '', dateLabel: '', weight: null, deleting: false });
    } catch (error) {
      console.error('Error deleting weight history:', error);
      toast.error(t('progress.deleteError'));
      setDeleteConfirm((prev) => ({ ...prev, deleting: false }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.weight || isNaN(Number(formData.weight))) {
      toast.error(t('progress.weightValidation'));
      return;
    }

    const pickedDateString = format(formData.date, 'yyyy-MM-dd');
    const existing = weightHistory.find(
      (entry) => new Date(entry.date).toISOString().split('T')[0] === pickedDateString
    );

    if (existing) {
      setOverwriteConfirm({
        open: true,
        existingWeight: existing.weight,
        dateLabel: format(formData.date, 'PPP')
      });
      return;
    }

    await persistWeightEntry();
  };

  // Filter data based on selected time range from current date.
  const today = new Date();
  const rangeDays: Record<string, number> = {
    '2w': 14,
    '4w': 28,
    '8w': 56,
    '6m': 180,
    '1y': 365,
    '2y': 730,
    '5y': 1825
  };
  const rangeLabelKey: Record<string, string> = {
    '2w': 'last2Weeks',
    '4w': 'lastMonth',
    '8w': 'last2Months',
    '6m': 'last6Months',
    '1y': 'lastYear',
    '2y': 'last2Years',
    '5y': 'last5Years'
  };

  // Calculate all-time stats from full weight history (not filtered by time range)
  const allTimeSorted = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Build the available range options based on the age of the oldest entry.
  const oldestEntryDate = allTimeSorted.length > 0 ? new Date(allTimeSorted[0].date) : null;
  const ageInDays = oldestEntryDate
    ? Math.floor((today.getTime() - oldestEntryDate.getTime()) / 86400000)
    : 0;
  const availableRanges: string[] = ['2w', '4w', '8w'];
  if (ageInDays > 60) availableRanges.push('6m');
  if (ageInDays > 180) availableRanges.push('1y');
  if (ageInDays > 365) availableRanges.push('2y');
  if (ageInDays > 730) availableRanges.push('5y');

  const largestAvailableRange = availableRanges[availableRanges.length - 1];

  // Default to the largest available range when data first loads. As soon as
  // the user picks a range manually, stop overriding their choice.
  React.useEffect(() => {
    if (!userPickedRangeRef.current && allTimeSorted.length > 0) {
      setTimeRange(largestAvailableRange);
    }
  }, [largestAvailableRange, allTimeSorted.length]);

  const effectiveRange = availableRanges.includes(timeRange) ? timeRange : largestAvailableRange;
  const daysToSubtract = rangeDays[effectiveRange] ?? 56;

  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);

  // Upper bound is end-of-day local so entries dated "today" in the user's
  // local timezone (stored at 00:00 UTC) are still <= today when UTC is
  // still on the previous calendar day.
  const upperBound = new Date(today);
  upperBound.setHours(23, 59, 59, 999);

  // Filter backend data based on time range and sort chronologically
  const filteredData = weightHistory
    .filter((entry) => {
      const itemDate = new Date(entry.date);
      return itemDate >= cutoffDate && itemDate <= upperBound;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const currentWeight = allTimeSorted.length > 0
    ? allTimeSorted[allTimeSorted.length - 1].weight : 0;
  const startingWeight = allTimeSorted.length > 0
    ? allTimeSorted[0].weight : 0;
  const totalProgress = Math.round((startingWeight - currentWeight) * 10) / 10;
  const progressPercentage = startingWeight > 0
    ? Math.round((totalProgress / startingWeight) * 100) : 0;
  const currentBMI = height > 0 ? calculateBMI(currentWeight, height) : 0;
  const startingBMI = height > 0 ? calculateBMI(startingWeight, height) : 0;

  // Calculate progress in the selected time range
  const rangeProgress = filteredData.length > 1
    ? Math.round((filteredData[0].weight - filteredData[filteredData.length - 1].weight) * 10) / 10
    : totalProgress;

  // Formatters: positive totalProgress = weight lost; negative = weight gained.
  // Display the delta with an explicit sign so "-12" never becomes "--12".
  const formatDelta = (val: number): string => {
    if (val === 0) return '0 kg';
    return val > 0 ? `-${val} kg` : `+${Math.abs(val)} kg`;
  };
  const lostOrGainedLabel = totalProgress >= 0
    ? t('progress.lostSinceStarted')
    : t('progress.gainedSinceStarted');
  const bmiDirectionLabel = currentBMI <= startingBMI
    ? t('progress.downFrom')
    : t('progress.upFrom');

  // Get min and max for Y-axis domain
  const weights = filteredData.map(d => d.weight);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 2) : 95;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 2) : 107;

  if (consentRequired) {
    return (
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
            <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2 font-manrope">{t('consent.errors.consentRequiredTitle')}</h2>
            <p className="text-gray-500 mb-6 text-sm">
              {t('consent.errors.consentRequiredProgress')}
            </p>
            <Button
              onClick={() => navigate(ROUTES.PATIENT_CONSENT)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {t('consent.errors.reviewConsent')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="size-6 md:size-8 text-teal-action" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-manrope">{t('progress.title')}</h1>
        </div>
      </div>

      {/* Treatment Journal — top of page */}
      <TreatmentJournalSection />

      {/* Main Content: 2-column layout */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 md:gap-6 mb-4 md:mb-6">
        {/* Left Column: Chart Section */}
        <Card className="bg-white/95 backdrop-blur-md shadow-lg pt-0 w-full lg:w-3/4 flex flex-col">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 space-y-0 border-b py-4 sm:py-5">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-xl font-manrope">{t('progress.cardTitle')}</CardTitle>
              <CardDescription className="text-gray-600">
                {t('progress.cardDescription')}
              </CardDescription>
            </div>
            <Select value={effectiveRange} onValueChange={handleRangeChange}>
              <SelectTrigger
                className="w-[180px] rounded-lg sm:ml-auto"
                aria-label={t('progress.timeRangeLabel')}
              >
                <SelectValue placeholder={t('progress.last2Months')} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {availableRanges.map((range) => (
                  <SelectItem key={range} value={range} className="rounded-lg">
                    {t(`progress.${rangeLabelKey[range]}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col">
            <div className="h-[250px] md:h-[320px] lg:flex-1 lg:h-auto lg:min-h-[280px] w-full">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-500">{t('progress.loadingHistory')}</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <AreaChart accessibilityLayer data={filteredData} margin={{ left: 4, right: 8, top: 12, bottom: 4 }}>
                  <defs>
                    <linearGradient id="progressWeightGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-weight)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-weight)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      });
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
                    content={<ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        });
                      }}
                      formatter={(value) => [`${value} kg`, t('progress.weight')]}
                    />}
                  />
                  <Area
                    dataKey="weight"
                    type="monotone"
                    stroke="var(--color-weight)"
                    strokeWidth={2}
                    fill="url(#progressWeightGradient)"
                    dot={{ fill: "var(--color-weight)", strokeWidth: 2, r: 3 }}
                    activeDot={{
                      r: 6,
                      stroke: "var(--color-weight)",
                      strokeWidth: 2,
                      fill: "white",
                      style: { cursor: 'pointer' },
                      onClick: ((props: unknown) => {
                        const payload = (props as { payload?: WeightHistoryEntry })?.payload;
                        if (payload) openDeleteConfirm(payload);
                      }) as never
                    }}
                  />
                </AreaChart>
              </ChartContainer>
              )}
            </div>
            
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>{formatDelta(rangeProgress)}</span>
              <span className="ml-2 text-gray-500">
                {t('progress.progressInTime')} {t(`progress.${rangeLabelKey[effectiveRange]}`).replace(/^(Last|Senaste)\s+/i, '').toLowerCase()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Progress Summary Cards */}
        <div className="grid grid-cols-1 gap-4 w-full lg:w-1/4 lg:min-w-[280px]">
          {/* Total Progress Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="px-4 md:px-6 py-4 h-full flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-base md:text-lg font-bold text-gray-800">{t('progress.totalProgress')}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  {allTimeSorted.length > 0 ? `${Math.abs(progressPercentage)}${t('progress.ofTotalBodyWeight')}` : '--'}
                </div>
              </div>
              <div className="bg-gray-100/80 rounded-2xl px-4 py-3 flex items-center justify-center shrink-0">
                <span className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
                  {allTimeSorted.length > 0 ? formatDelta(totalProgress) : '--'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* BMI Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="px-4 md:px-6 py-4 h-full flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-base md:text-lg font-bold text-gray-800">{t('progress.bmi')}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  {currentBMI > 0 ? `${bmiDirectionLabel} ${startingBMI}` : '--'}
                </div>
              </div>
              <div className="bg-gray-100/80 rounded-2xl px-4 py-3 flex items-center justify-center shrink-0">
                <span className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
                  {currentBMI > 0 ? currentBMI : '--'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Current Weight Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="px-4 md:px-6 py-4 h-full flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-base md:text-lg font-bold text-gray-800">{t('progress.currentWeight')}</div>
                <div className="text-xs md:text-sm text-gray-500 mt-1">
                  {allTimeSorted.length > 0 ? `${Math.abs(totalProgress)} ${lostOrGainedLabel}` : '--'}
                </div>
              </div>
              <div className="bg-gray-100/80 rounded-2xl px-4 py-3 flex items-center justify-center shrink-0">
                <span className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
                  {allTimeSorted.length > 0 ? `${currentWeight} kg` : '--'}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* My Goals — full-width progress card under the chart */}
      <div className="mb-4 md:mb-6">
        <GoalProgressCard
          goalWeight={goalWeight}
          currentWeight={allTimeSorted.length > 0 ? currentWeight : null}
          startingWeight={allTimeSorted.length > 0 ? allTimeSorted[0].weight : null}
          onEditGoal={openGoalDialog}
        />
      </div>

      {/* Bottom Section: Log Your Progress Form */}
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
          <CardContent className="p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 font-manrope">{t('progress.logProgress')}</h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Current Weight */}
                <div className="space-y-2">
                  <Label htmlFor="current-weight" className="text-base font-medium text-gray-700">
                    {t('progress.currentWeightLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-weight"
                      type="number"
                      step="0.1"
                      placeholder=""
                      className="pr-12 h-12"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      {t('common.kg')}
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="entry-date" className="text-base font-medium text-gray-700">
                    {t('progress.dateLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="entry-date"
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full h-12 justify-start text-left font-normal',
                          !formData.date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, 'PPP') : t('progress.pickDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(d) => {
                          if (d) {
                            setFormData({ ...formData, date: d });
                            setDatePickerOpen(false);
                          }
                        }}
                        disabled={{ after: new Date() }}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Side Effects */}
                <div className="space-y-2">
                  <Label htmlFor="side-effects" className="text-base font-medium text-gray-700">
                    {t('progress.sideEffects')}
                  </Label>
                  <Input
                    id="side-effects"
                    type="text"
                    placeholder=""
                    className="h-12"
                    value={formData.sideEffects}
                    onChange={(e) => setFormData({...formData, sideEffects: e.target.value})}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 mb-6">
                <Label htmlFor="notes" className="text-base font-medium text-gray-700">
                  {t('progress.notes')}
                </Label>
                <Textarea
                  id="notes"
                  placeholder={t('progress.notesPlaceholder')}
                  className="min-h-32 resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-base font-medium"
                  size="lg"
                  disabled={saving}
                >
                  {saving ? t('progress.saving') : t('progress.save')}
                </Button>
              </div>
            </form>

            {/* Privacy Notice */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <span className="font-medium">*</span> {t('progress.privacyNotice')}<br />
                {t('progress.clinicalOutcome')}
              </p>
            </div>
          </CardContent>
        </Card>

        <AlertDialog
          open={overwriteConfirm.open}
          onOpenChange={(open) => setOverwriteConfirm((prev) => ({ ...prev, open }))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('progress.overwriteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('progress.overwriteMessage', {
                  weight: overwriteConfirm.existingWeight ?? '',
                  date: overwriteConfirm.dateLabel
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('progress.overwriteCancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  setOverwriteConfirm({ open: false, existingWeight: null, dateLabel: '' });
                  await persistWeightEntry();
                }}
              >
                {t('progress.overwriteConfirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('progress.deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('progress.deleteMessage', {
                  weight: deleteConfirm.weight ?? '',
                  date: deleteConfirm.dateLabel
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteConfirm.deleting}>
                {t('progress.deleteCancel')}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteConfirmed();
                }}
                disabled={deleteConfirm.deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {t('progress.deleteConfirm')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('progress.goalWeightDialogTitle')}</DialogTitle>
              <DialogDescription>{t('progress.goalWeightDialogDescription')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="goal-weight-input">{t('progress.goalWeightTitle')}</Label>
              <div className="relative">
                <Input
                  id="goal-weight-input"
                  type="number"
                  min={1}
                  max={500}
                  step="0.1"
                  className="pr-12 h-12"
                  placeholder={t('progress.goalWeightPlaceholder')}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {t('common.kg')}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGoalDialogOpen(false)} disabled={savingGoal}>
                {t('progress.goalWeightCancel')}
              </Button>
              <Button type="button" onClick={handleSaveGoalWeight} disabled={savingGoal}>
                {savingGoal ? t('progress.goalWeightSaving') : t('progress.goalWeightSave')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  );
};

// --- Treatment Journal Section ---
const TreatmentJournalSection: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.patientJournal,
    queryFn: () => treatmentJournalService.getPatientJournal(),
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  const journal = data?.journal;

  if (!journal) {
    return null;
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg mb-6">
      <CardHeader>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-teal-600" />
            <CardTitle className="text-xl font-manrope">
              {t('treatmentJournal.title')}
            </CardTitle>
          </div>
          <div className="text-xs text-[#b0b0b0] font-manrope text-right space-y-0.5">
            <p>
              {t('treatmentJournal.created')}: {formatDate(journal.createdAt)}
            </p>
            {journal.updatedAt !== journal.createdAt && (
              <p>
                {t('treatmentJournal.lastUpdated')}: {formatDate(journal.updatedAt)}
              </p>
            )}
          </div>
        </div>
        {journal.doctorName && (
          <p className="text-sm text-[#005044] font-manrope font-medium mt-1">
            {t('treatmentJournal.by')} {journal.doctorName}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="journal-content font-manrope text-[#282828] text-sm"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(journal.content),
          }}
        />
      </CardContent>
    </Card>
  );
};