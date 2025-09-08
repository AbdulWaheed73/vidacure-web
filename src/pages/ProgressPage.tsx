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
import { addWeightHistory, getWeightHistory, type WeightHistoryEntry } from '@/services/weightHistory';


const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig;


// Helper function to calculate BMI
const calculateBMI = (weightKg: number, heightInches: number = 65) => {
  // Height: 5'5" = 65 inches
  const heightM = heightInches * 0.0254;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const ProgressPage: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState("8w");
  const [weightHistory, setWeightHistory] = React.useState<WeightHistoryEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  
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
    } catch (error) {
      console.error('Error loading weight history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight || isNaN(Number(formData.weight))) {
      alert('Please enter a valid weight');
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
      alert('Weight history updated successfully!');
    } catch (error) {
      console.error('Error saving weight history:', error);
      alert('Error saving weight history. Please try again.');
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

  // Calculate dynamic values
  const currentWeight = filteredData.length > 0 ? filteredData[filteredData.length - 1].weight : 97.5;
  const startingWeight = filteredData.length > 0 ? filteredData[0].weight : 105.8;
  const totalProgress = Math.round((startingWeight - currentWeight) * 10) / 10;
  const progressPercentage = Math.round((totalProgress / startingWeight) * 100);
  const currentBMI = calculateBMI(currentWeight);
  const startingBMI = calculateBMI(startingWeight);
  
  // Calculate progress in the selected time range
  const rangeProgress = filteredData.length > 1 
    ? Math.round((filteredData[0].weight - filteredData[filteredData.length - 1].weight) * 10) / 10
    : totalProgress;

  // Get min and max for Y-axis domain
  const weights = filteredData.map(d => d.weight);
  const minWeight = weights.length > 0 ? Math.floor(Math.min(...weights) - 2) : 95;
  const maxWeight = weights.length > 0 ? Math.ceil(Math.max(...weights) + 2) : 107;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="size-8 text-teal-action" />
          <h1 className="text-3xl font-bold text-gray-800 font-manrope">My Progress</h1>
        </div>
      </div>

      {/* Main Content: 2-column layout */}
      <div className="flex  gap-6 mb-6">
        {/* Left Column: Chart Section */}
        <Card className="bg-white/95 backdrop-blur-md shadow-lg pt-0 w-3/4">
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
              {loading ? (
                <div className="h-[400px] w-full flex items-center justify-center">
                  <p className="text-gray-500">Loading weight history...</p>
                </div>
              ) : (
                <ChartContainer config={chartConfig} className="aspect-auto h-[400px] w-full">
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
              )}
            </div>
            
            <div className="flex items-center text-sm text-teal-600 font-medium">
              <span>-{rangeProgress} kg</span>
              <span className="ml-2 text-gray-500">
                in the last {timeRange === "2w" ? "2 weeks" : timeRange === "4w" ? "4 weeks" : "12 weeks"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Progress Summary Cards */}
        <div className="space-y-6 min-w-1/4">
          {/* Total Progress Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className='flex'>
                <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Total Progress</div>
                <div className="text-sm text-gray-500 mb-2">{progressPercentage}% of total body weight</div>
              </div>
                <div className='size-lf-stretch bg-light-teal-background rounded-xl inline-flex justify-center items-center gap-2.5'>
                  <div className="text-3xl font-bold text-gray-800">-{totalProgress} kg</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BMI Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">BMI</div>
                <div className="text-sm text-gray-500 mb-2">Down from {startingBMI}</div>
                <div className="text-3xl font-bold text-gray-800">{currentBMI}</div>
              </div>
            </CardContent>
          </Card>

          {/* Current Weight Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-lg">
            <CardContent className="p-6">
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Current Weight</div>
                <div className="text-sm text-gray-500 mb-2">{totalProgress} kg lost since started</div>
                <div className="text-3xl font-bold text-gray-800">{currentWeight} kg</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Log Your Progress Form */}
      <Card className="bg-white/95 backdrop-blur-md shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-manrope">Log Your Progress</h2>
            
            <form onSubmit={handleFormSubmit}>
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
                    Side Effects
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
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Is there anything specific you'd like to discuss? (e.g., 'I've been feeling tired lately,' or 'I have questions about my diet plan.'"
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
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>

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
  );
};