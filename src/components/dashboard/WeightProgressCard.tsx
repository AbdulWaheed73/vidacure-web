import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeightHistory } from '@/hooks/useDashboardQueries';

const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig;

export const WeightProgressCard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("8w");
  const { data, isLoading } = useWeightHistory();

  const weightHistory = data?.weightHistory ?? [];

  const today = new Date();
  let daysToSubtract = 56;
  if (timeRange === "2w") daysToSubtract = 14;
  else if (timeRange === "4w") daysToSubtract = 28;

  const cutoffDate = new Date(today);
  cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);

  const filteredData = weightHistory
    .filter((entry) => {
      const itemDate = new Date(entry.date);
      return itemDate >= cutoffDate && itemDate <= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const rangeProgress = filteredData.length > 1
    ? Math.round((filteredData[0].weight - filteredData[filteredData.length - 1].weight) * 10) / 10
    : 0;

  const weeksLabel = timeRange === "2w" ? "2 weeks" : timeRange === "4w" ? "4 weeks" : "8 weeks";

  const weights = filteredData.map(d => d.weight);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 2) : 90;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 2) : 110;

  if (isLoading) {
    return (
      <Card className="bg-white/95 backdrop-blur-md shadow-lg col-span-2">
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
      <Card className="bg-white/95 backdrop-blur-md shadow-lg col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-manrope">My Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 mb-4">No weight entries yet. Start tracking your progress!</p>
          <Button onClick={() => navigate('/progress')} className="bg-teal-600 hover:bg-teal-700 text-white">
            Log Your Weight
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-lg col-span-2 pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
        <CardTitle className="text-lg font-manrope">My Progress</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select time range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="8w" className="rounded-lg">Last 2 Months</SelectItem>
            <SelectItem value="4w" className="rounded-lg">Last 4 Weeks</SelectItem>
            <SelectItem value="2w" className="rounded-lg">Last 2 Weeks</SelectItem>
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
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
                labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                formatter={(value) => [`${value} kg`, "Weight"]}
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
          <span className="ml-2 text-gray-500">in the last {weeksLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};
