import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Book, CheckCircle, PieChart, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your progress and identify areas for improvement.
          </p>
        </div>
        <Link href="/">
          <Button size="lg" className="h-11">
              <Zap className="mr-2 h-5 w-5" /> Start a New Quiz
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Book className="h-5 w-5 text-primary"/>
              Subject Performance
            </CardTitle>
            <CardDescription>
              Your average scores across different subjects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Analytics coming soon...</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-5 w-5 text-green-500"/>
              Strengths & Weaknesses
            </CardTitle>
            <CardDescription>
              Topics you excel at and those needing more focus.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground italic">Analytics coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-accent"/>
              Progress Over Time
            </CardTitle>
            <CardDescription>
              Visualize your improvement journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">Analytics coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
