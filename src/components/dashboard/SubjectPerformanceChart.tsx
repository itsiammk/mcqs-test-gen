'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartData {
  subject: string;
  averageScore: number;
}

interface SubjectPerformanceChartProps {
  data: ChartData[];
}

const chartConfig = {
  averageScore: {
    label: 'Avg. Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function SubjectPerformanceChart({ data }: SubjectPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>No data available to display chart.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Complete a quiz to see your performance.</p>
            </CardContent>
        </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Your average scores across different subjects.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
                data={data} 
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                barSize={40}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="subject"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.length > 12 ? `${value.slice(0, 10)}...` : value}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                    indicator="dot" 
                    formatter={(value, name) => [`${value}%`, 'Avg. Score']}
                />}
              />
              <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
