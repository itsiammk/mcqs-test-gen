import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="flex items-center gap-4 mb-6">
        <BarChart2 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            This is your personal analytics dashboard. We're busy building powerful tools to help you track your progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Soon, you'll be able to see:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Your performance by subject.</li>
            <li>Your strengths and weaknesses.</li>
            <li>Progress charts over time.</li>
            <li>And much more!</li>
          </ul>
          <div className="mt-6 pt-6 border-t">
             <Link href="/">
                <Button>
                    <Zap className="mr-2 h-4 w-4" /> Start a New Quiz
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
