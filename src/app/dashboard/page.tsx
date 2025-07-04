import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Quiz, { IQuiz } from '@/models/Quiz';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, BookOpen, History, Lightbulb, Target, TrendingDown, TrendingUp, Zap, Trophy, Activity } from "lucide-react";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SubjectPerformanceChart } from '@/components/dashboard/SubjectPerformanceChart';
import { format, formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverallAIAnalysisCard } from '@/components/mcq/OverallAIAnalysisCard';
import { summarizeHistoricalAnalyses, type OverallAIAnalysis } from '@/ai/flows/summarize-historical-analyses';
import type { AIAnalysis } from '@/ai/flows/analyze-quiz-results';

async function getDashboardData() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const quizzes = await Quiz.find({ userId: session.userId }).sort({ createdAt: -1 }).lean();
  
  // Collect all available AI analyses. The query sorts by most recent first.
  const allAnalyses = quizzes
    .map(q => q.aiAnalysis)
    .filter((a): a is AIAnalysis => !!a && Object.keys(a).length > 0);

  let overallAnalysis: OverallAIAnalysis | null = null;
  // A meta-analysis is only useful if there are multiple data points.
  if (allAnalyses.length >= 2) {
      try {
        // The flow prompt is designed to handle analyses sorted from most recent to oldest.
        overallAnalysis = await summarizeHistoricalAnalyses(allAnalyses);
      } catch (e) {
        console.error("Failed to generate overall AI analysis:", e);
        overallAnalysis = null;
      }
  }

  // Make sure the data is serializable
  const serializableQuizzes = JSON.parse(JSON.stringify(quizzes)) as IQuiz[];
  const serializableOverallAnalysis = overallAnalysis ? JSON.parse(JSON.stringify(overallAnalysis)) as OverallAIAnalysis : null;

  return { quizzes: serializableQuizzes, overallAnalysis: serializableOverallAnalysis };
}

export default async function DashboardPage() {
  const { quizzes, overallAnalysis } = await getDashboardData();

  if (quizzes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Welcome to Your Dashboard!</CardTitle>
                <CardDescription>You haven't completed any quizzes yet.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">Start a new quiz to see your progress and analytics here.</p>
                <Link href="/quiz/new">
                    <Button size="lg">
                        <Zap className="mr-2 h-5 w-5" /> Start a New Quiz
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    );
  }

  // --- Analytics Calculations ---
  const totalQuizzes = quizzes.length;
  const totalQuestions = quizzes.reduce((acc, q) => acc + q.numQuestions, 0);
  const totalCorrect = quizzes.reduce((acc, q) => acc + q.score, 0);
  const overallAverage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const subjectStats: { [key: string]: { quizzes: number; totalQs: number; correct: number; } } = {};
  quizzes.forEach(quiz => {
    const subject = quiz.subject;
    if (!subjectStats[subject]) {
      subjectStats[subject] = { quizzes: 0, totalQs: 0, correct: 0 };
    }
    subjectStats[subject].quizzes++;
    subjectStats[subject].totalQs += quiz.numQuestions;
    subjectStats[subject].correct += quiz.score;
  });

  const subjectPerformance = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    averageScore: stats.totalQs > 0 ? Math.round((stats.correct / stats.totalQs) * 100) : 0,
    quizCount: stats.quizzes
  })).sort((a, b) => b.averageScore - a.averageScore);
  
  const strengths = subjectPerformance.slice(0, 3);
  const weaknesses = [...subjectPerformance].reverse().slice(0, 3);
  const recentQuizzes = quizzes.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Track your progress and identify areas for improvement.
          </p>
        </div>
        <Link href="/quiz/new">
          <Button size="lg" className="h-11">
              <Zap className="mr-2 h-5 w-5" /> Start a New Quiz
          </Button>
        </Link>
      </div>
      
      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-muted-foreground">
              <Trophy className="h-5 w-5" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{overallAverage}%</p>
            <p className="text-sm text-muted-foreground mt-1">Average Score</p>
            <Progress value={overallAverage} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-muted-foreground">
               <BookOpen className="h-5 w-5" />
               Total Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalQuizzes}</p>
             <p className="text-sm text-muted-foreground mt-1">{totalQuestions} questions answered</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-muted-foreground">
                <Target className="h-5 w-5" />
                Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-4xl font-bold">{totalCorrect} / {totalQuestions}</p>
             <p className="text-sm text-muted-foreground mt-1">Correct answers</p>
          </CardContent>
        </Card>
      </div>

       <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Statistical Overview</TabsTrigger>
            <TabsTrigger value="ai-insights">
                <Lightbulb className="mr-2 h-4 w-4" /> AI-Powered Insights
            </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 w-full overflow-hidden">
        <div className="lg:col-span-2 w-full min-w-0">
            <div className="w-full overflow-x-auto">
                <SubjectPerformanceChart data={subjectPerformance} />
            </div>
        </div>
        <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0"/>
                        <span className="truncate">Your Strengths</span>
                    </CardTitle>
                     <CardDescription className="text-sm">Top subjects based on average score.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 sm:space-y-3">
                        {strengths.map(s => (
                            <li key={s.subject} className="flex justify-between items-center gap-2 text-sm">
                                <span className="truncate flex-1 min-w-0">{s.subject}</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 flex-shrink-0">{s.averageScore}%</Badge>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0"/>
                        <span className="truncate">Areas to Improve</span>
                    </CardTitle>
                    <CardDescription className="text-sm">Lowest subjects based on average score.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 sm:space-y-3">
                        {weaknesses.map(s => (
                            <li key={s.subject} className="flex justify-between items-center gap-2 text-sm">
                                <span className="truncate flex-1 min-w-0">{s.subject}</span>
                                <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 flex-shrink-0">{s.averageScore}%</Badge>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
</TabsContent>
        <TabsContent value="ai-insights">
             {overallAnalysis ? (
                <OverallAIAnalysisCard analysis={overallAnalysis} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary" /> Overall AI Insights Unavailable</CardTitle>
                        <CardDescription>Complete at least two quizzes to get your personalized long-term performance analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">The overall AI analysis provides a deep dive into your consistent strengths, recurring weaknesses, and learning trends based on your entire quiz history. It's the best way to get actionable, high-level feedback!</p>
                    </CardContent>
                </Card>
            )}
        </TabsContent>
      </Tabs>
        
      {/* Recent History */}
      <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <History className="h-6 w-6" />
              Recent Activity
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentQuizzes.map(quiz => (
                  <Card key={quiz._id.toString()}>
                      <CardHeader>
                          <CardTitle className="text-lg">{quiz.subject}</CardTitle>
                          <CardDescription>
                              {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Score:</span>
                              <span className="font-semibold">{quiz.score} / {quiz.numQuestions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Difficulty:</span>
                              <Badge variant={
                                  quiz.difficulty === 'low' ? 'secondary' :
                                  quiz.difficulty === 'high' ? 'destructive' :
                                  'default'
                              } className="capitalize">{quiz.difficulty}</Badge>
                            </div>
                      </CardContent>
                      <CardFooter>
                          <Link href={`/history/${quiz._id.toString()}`} className="w-full">
                              <Button variant="outline" className="w-full">
                                  Review <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                          </Link>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      </div>
    </div>
  );
}
