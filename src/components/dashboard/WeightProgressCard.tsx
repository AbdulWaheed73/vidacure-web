import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeightHistory } from '@/hooks/useDashboardQueries';
import { ConsentRequiredCard, isConsentError } from './ConsentRequiredCard';

export const WeightProgressCard: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState("8w");
  const userPickedRangeRef = React.useRef(false);
  const handleRangeChange = (value: string) => {
    userPickedRangeRef.current = true;
    setTimeRange(value);
  };
  const { data, isLoading, error } = useWeightHistory();

  const chartConfig = {
    weight: {
      label: t('dashboard.weight'),
      color: "var(--chart-1)"
    }
  } satisfies ChartConfig;

  const weightHistory = data?.weightHistory ?? [];

  const today = new Date();
  const rangeDays: Record<string, number> = {
    '2w': 14, '4w': 28, '8w': 56, '6m': 180, '1y': 365, '2y': 730, '5y': 1825
  };
  const rangeLabelKey: Record<string, string> = {
    '2w': 'last2Weeks',
    '4w': 'last4Weeks',
    '8w': 'last2Months',
    '6m': 'last6Months',
    '1y': 'lastYear',
    '2y': 'last2Years',
    '5y': 'last5Years'
  };

  const allTimeSorted = [...weightHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
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

  React.useEffect(() => {
    if (!userPickedRangeRef.current && allTimeSorted.length > 0) {
      setTimeRange(largestAvailableRange);
    }
  }, [largestAvailableRange, allTimeSorted.length]);

  const effectiveRange = availableRanges.includes(timeRange) ? timeRange : largestAvailableRange;
  const daysToSubtract = rangeDays[effectiveRange] ?? 56;

  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);

  // End-of-day local upper bound so entries dated today (stored at 00:00 UTC)
  // aren't filtered out when UTC is still on the previous calendar day.
  const upperBound = new Date(today);
  upperBound.setHours(23, 59, 59, 999);

  const filteredData = weightHistory
    .filter((entry) => {
      const itemDate = new Date(entry.date);
      return itemDate >= cutoffDate && itemDate <= upperBound;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const rangeProgress = filteredData.length > 1
    ? Math.round((filteredData[0].weight - filteredData[filteredData.length - 1].weight) * 10) / 10
    : 0;

  const weeksLabel = t(`dashboard.${rangeLabelKey[effectiveRange]}`).replace(/^(Last|Senaste)\s+/i, '').toLowerCase();

  const weights = filteredData.map(d => d.weight);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 2) : 90;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 2) : 110;

  const dateLocale = i18n.language === 'sv' ? 'sv-SE' : 'en-US';

  if (isConsentError(error)) {
    return <ConsentRequiredCard title={t('dashboard.myProgress')} className="col-span-1 md:col-span-2" />;
  }

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (weightHistory.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-manrope">{t('dashboard.myProgress')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">{t('dashboard.noWeightEntries')}</p>
          <Button onClick={() => navigate('/progress')} className="bg-teal-600 hover:bg-teal-700 text-white">
            {t('dashboard.logYourWeight')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg col-span-1 md:col-span-2 pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
        <CardTitle className="text-lg font-manrope">{t('dashboard.myProgress')}</CardTitle>
        <Select value={effectiveRange} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-[180px] rounded-lg sm:ml-auto" aria-label="Select time range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {availableRanges.map((range) => (
              <SelectItem key={range} value={range} className="rounded-lg">
                {t(`dashboard.${rangeLabelKey[range]}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
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
                return date.toLocaleDateString(dateLocale, { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[minWeight, maxWeight]}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={<ChartTooltipContent
                labelFormatter={(value) => new Date(value).toLocaleDateString(dateLocale, { month: "short", day: "numeric", year: "numeric" })}
                formatter={(value) => [`${value} kg`, t('dashboard.weight')]}
              />}
            />
            <Area
              dataKey="weight"
              type="monotone"
              stroke="var(--color-weight)"
              strokeWidth={2}
              fill="url(#weightGradient)"
              dot={{ fill: "var(--color-weight)", strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: "var(--color-weight)", strokeWidth: 2, fill: "white" }}
            />
          </AreaChart>
        </ChartContainer>

        <div className="flex items-center text-sm text-teal-600 font-medium mt-2">
          <span>{rangeProgress > 0 ? `-${rangeProgress}` : `+${Math.abs(rangeProgress)}`} kg</span>
          <span className="ml-2 text-gray-500">{t('dashboard.inTheLast')} {weeksLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};