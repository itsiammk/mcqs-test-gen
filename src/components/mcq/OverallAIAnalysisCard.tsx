'use client';
import type { OverallAIAnalysis } from '@/ai/flows/summarize-historical-analyses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Separator } from '../ui/separator';

export function OverallAIAnalysisCard({ analysis }: { analysis: OverallAIAnalysis }) {
    return (
        <Card className="mb-8 bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-headline text-sky-800 dark:text-sky-300">
                    <Lightbulb className="h-6 w-6" />
                    Overall AI Performance Analysis
                </CardTitle>
                <CardDescription className="text-sky-700 dark:text-sky-400/80">
                    This is a summary of your performance trends across all your quizzes.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
                <div>
                    <h4 className="font-semibold mb-2 text-foreground">Long-Term Summary</h4>
                    <p className="text-muted-foreground">{analysis.longTermSummary}</p>
                </div>
                
                <Separator />

                <div className="grid md:grid-cols-2 gap-6">
                    {analysis.persistentStrengths?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Persistent Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysis.persistentStrengths.map((s, i) => <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">{s}</Badge>)}
                            </div>
                        </div>
                    )}
                    {analysis.criticalAreasForImprovement?.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Critical Areas for Improvement</h4>
                            <ul className="list-disc list-outside space-y-2 text-muted-foreground pl-5">
                                {analysis.criticalAreasForImprovement.map((a, i) => (
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
                    <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2"><Activity className="h-5 w-5 text-blue-500" /> Evolving Trends</h4>
                    <p className="text-muted-foreground">{analysis.evolvingTrends}</p>
                </div>
            </CardContent>
        </Card>
    );
}
