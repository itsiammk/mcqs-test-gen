'use client';
import type { AIAnalysis } from '@/ai/flows/analyze-quiz-results';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { Separator } from '../ui/separator';

export function AIAnalysisCard({ analysis }: { analysis: AIAnalysis }) {
    return (
        <Card className="mb-8 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-headline text-sky-800 dark:text-sky-300">
                    <Lightbulb className="h-6 w-6" />
                    AI Performance Analysis
                </CardTitle>
                <CardDescription className="text-sky-700 dark:text-sky-400/80">
                    Here's a breakdown of your performance based on speed and accuracy.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
                <div>
                    <h4 className="font-semibold mb-2 text-foreground">Overall Feedback</h4>
                    <p className="text-muted-foreground">{analysis.overallFeedback}</p>
                </div>
                
                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                    {analysis.strengths?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.strengths.map((s, i) => <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">{s}</Badge>)}
                            </div>
                        </div>
                    )}
                    {analysis.areasForImprovement?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" /> Areas for Improvement</h4>
                            <ul className="list-disc list-outside space-y-2 text-muted-foreground pl-5">
                                {analysis.areasForImprovement.map((a, i) => (
                                    <li key={i}>
                                        <span className="font-semibold text-foreground/90">{a.topic}:</span> {a.reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <Separator />
                
                <div>
                    <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2"><Clock className="h-5 w-5 text-blue-500" /> Time Management</h4>
                    <p className="text-muted-foreground">{analysis.timeManagementAnalysis}</p>
                </div>
            </CardContent>
        </Card>
    );
}
