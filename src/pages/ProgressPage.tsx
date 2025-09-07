"use client"

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';

// Static dummy data for weight tracking
const allWeightData = [
  { date: "2025-07-14", weight: 106.0, week: "Week 1" },
  { date: "2025-07-21", weight: 105.2, week: "Week 2" },
  { date: "2025-07-28", weight: 104.8, week: "Week 3" },
  { date: "2025-08-04", weight: 104.1, week: "Week 4" },
  { date: "2025-08-05", weight: 134.1, week: "Week 4" },
  { date: "2025-08-06", weight: 114.1, week: "Week 4" },
  { date: "2025-08-11", weight: 103.5, week: "Week 5" },
  { date: "2025-08-18", weight: 103.0, week: "Week 6" },
  { date: "2025-08-25", weight: 102.8, week: "Week 7" },
  { date: "2025-09-01", weight: 102.0, week: "Week 8" },
];

const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig;

export const ProgressPage: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState("8w");

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
  
  const filteredData = allWeightData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= cutoffDate && itemDate <= today;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">My Progress</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Chart Section */}
        <Card className="bg-white/95 backdrop-blur-md shadow-lg pt-0">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <CardTitle className="text-xl font-manrope">My Progress</CardTitle>
              <CardDescription className="text-gray-600">
                Showing weight progress over time
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 2 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="8w" className="rounded-lg">
                  Last 2 months
                </SelectItem>
                <SelectItem value="4w" className="rounded-lg">
                  Last month
                </SelectItem>
                <SelectItem value="2w" className="rounded-lg">
                  Last 2 weeks
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <div className="mb-6">
              <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
                <LineChart accessibilityLayer data={filteredData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.replace("Week ", "")}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[101, 107]}
                    tickFormatter={(value) => `${value} kg`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      labelFormatter={(value) => {
                        const item = filteredData.find(d => d.week === value);
                        return item ? new Date(item.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        }) : value;
                      }}
                      formatter={(value) => [`${value} kg`, "Weight"]}
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
            </div>
            
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>-8.3 kg</span>
              <span className="ml-2 text-gray-500">in the last 12 weeks</span>
            </div>
          </CardContent>
        </Card>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Progress Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Total Progress</div>
                <div className="text-sm text-gray-500 mb-2">9% of total body weight</div>
                <div className="text-3xl font-bold text-gray-800">-8.5 kg</div>
              </div>
            </CardContent>
          </Card>

          {/* BMI Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">BMI</div>
                <div className="text-sm text-gray-500 mb-2">Down from 31.1</div>
                <div className="text-3xl font-bold text-gray-800">28.5</div>
              </div>
            </CardContent>
          </Card>

          {/* Current Weight Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Current Weight</div>
                <div className="text-sm text-gray-500 mb-2">8.3 kg lost since started</div>
                <div className="text-3xl font-bold text-gray-800">97.5 kg</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Log Your Progress Form */}
        <Card className="bg-white/95 backdrop-blur-md shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-manrope">Log Your Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Current Weight */}
              <div className="space-y-2">
                <Label htmlFor="current-weight" className="text-base font-medium text-gray-700">
                  Current Weight <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="current-weight"
                    type="number"
                    placeholder=""
                    className="pr-12 h-12"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    lbs
                  </span>
                </div>
              </div>

              {/* Side Effects */}
              <div className="space-y-2">
                <Label htmlFor="side-effects" className="text-base font-medium text-gray-700">
                  Side Effects
                </Label>
                <Input
                  id="side-effects"
                  type="text"
                  placeholder=""
                  className="h-12"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="notes" className="text-base font-medium text-gray-700">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Is there anything specific you'd like to discuss? (e.g., 'I've been feeling tired lately,' or 'I have questions about my diet plan.'"
                className="min-h-32 resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-base font-medium"
                size="lg"
              >
                Save
              </Button>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                <span className="font-medium">*</span> Your data is secure and encrypted. We comply with healthcare privacy standards.<br />
                Backed by licensed professionals and real clinical outcomes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};