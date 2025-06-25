import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Quiz, { IQuiz } from '@/models/Quiz';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

async function getQuizzes() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  await dbConnect();
  const quizzes = await Quiz.find({ userId: session.userId }).sort({ createdAt: -1 }).lean();
  return quizzes as IQuiz[];
}

export default async function HistoryPage() {
  const quizzes = await getQuizzes();

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <h1 className="text-3xl font-bold mb-6">Quiz History</h1>
      {quizzes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No History Found</CardTitle>
            <CardDescription>You haven't completed any quizzes yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Start a new quiz to see your history here!</p>
          </CardContent>
          <CardFooter>
             <Link href="/quiz/new">
                <Button>Start a New Quiz</Button>
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz._id.toString()} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">{quiz.subject}</CardTitle>
                <CardDescription>
                  Taken on {format(new Date(quiz.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <span className="font-semibold">{quiz.score} / {quiz.questions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">Difficulty:</span>
                     <Badge variant={
                        quiz.difficulty === 'low' ? 'secondary' :
                        quiz.difficulty === 'high' ? 'destructive' :
                        'default'
                     } className="capitalize">{quiz.difficulty}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {/* This link is a placeholder for a future detailed review page */}
                <Link href={`/history/${quiz._id.toString()}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Review Quiz <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
