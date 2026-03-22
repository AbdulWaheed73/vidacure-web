import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, ShieldAlert, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addWeightHistory, getWeightHistory } from '@/services/weightHistory';
import { treatmentJournalService } from '@/services/treatmentJournalService';
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
  const [weightHistory, setWeightHistory] = React.useState<WeightHistoryEntry[]>([]);
  const [height, setHeight] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [consentRequired, setConsentRequired] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    weight: '',
    sideEffects: '',
    notes: ''
  });

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
    } catch (error: any) {
      if (error.response?.status === 451) {
        setConsentRequired(true);
      } else {
        console.error('Error loading weight history:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight || isNaN(Number(formData.weight))) {
      toast.error(t('progress.weightValidation'));
      return;
    }

    try {
      setSaving(true);
      // Convert lbs input to kg for backend
      
      await addWeightHistory({
        weight: Number(formData.weight),
        sideEffects: formData.sideEffects || undefined,
        notes: formData.notes || undefined
      });
      
      // Reset form and reload data
      setFormData({ weight: '', sideEffects: '', notes: '' });
      await loadWeightHistory();
      // Invalidate dashboard queries so they refetch when navigating back
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

  // Filter data based on selected time range from current date
  const today = new Date();
  let daysToSubtract = 56; // 8 weeks (2 months)
  
  if (timeRange === "2w") {
    daysToSubtract = 14; // 2 weeks
  } else if (timeRange === "4w") {
    daysToSubtract = 28; // 4 weeks (1 month)
  }
  
  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);
  
  // Filter backend data based on time range and sort chronologically
  const filteredData = weightHistory
    .filter((entry) => {
      const itemDate = new Date(entry.date);
      return itemDate >= cutoffDate && itemDate <= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate all-time stats from full weight history (not filtered by time range)
  const allTimeSorted = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
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
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label={t('progress.timeRangeLabel')}
              >
                <SelectValue placeholder={t('progress.last2Months')} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="8w" className="rounded-lg">
                  {t('progress.last2Months')}
                </SelectItem>
                <SelectItem value="4w" className="rounded-lg">
                  {t('progress.lastMonth')}
                </SelectItem>
                <SelectItem value="2w" className="rounded-lg">
                  {t('progress.last2Weeks')}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1 flex flex-col">
            <div className="flex-1 min-h-[250px] lg:min-h-0">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-gray-500">{t('progress.loadingHistory')}</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <LineChart accessibilityLayer data={filteredData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
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
                    tickMargin={8}
                    domain={[minWeight, maxWeight]}
                    tickFormatter={(value) => `${value} kg`}
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
                  <Line
                    dataKey="weight"
                    type="monotone"
                    stroke="var(--color-weight)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-weight)", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "var(--color-weight)", strokeWidth: 2, fill: "white" }}
                  />
                </LineChart>
              </ChartContainer>
              )}
            </div>
            
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>-{rangeProgress} kg</span>
              <span className="ml-2 text-gray-500">
                {t('progress.progressInTime')} {timeRange === "2w" ? `2 ${t('progress.weeks')}` : timeRange === "4w" ? `4 ${t('progress.weeks')}` : `8 ${t('progress.weeks')}`}
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
                  {allTimeSorted.length > 0 ? `${progressPercentage}${t('progress.ofTotalBodyWeight')}` : '--'}
                </div>
              </div>
              <div className="bg-gray-100/80 rounded-2xl px-4 py-3 flex items-center justify-center shrink-0">
                <span className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
                  {allTimeSorted.length > 0 ? `${totalProgress > 0 ? '-' : ''}${totalProgress} kg` : '--'}
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
                  {currentBMI > 0 ? `${t('progress.downFrom')} ${startingBMI}` : '--'}
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
                  {allTimeSorted.length > 0 ? `${totalProgress} ${t('progress.lostSinceStarted')}` : '--'}
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
                      Kg
                    </span>
                  </div>
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