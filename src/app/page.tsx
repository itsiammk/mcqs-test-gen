
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BarChart2, Target, BrainCircuit, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-muted/30 dark:bg-muted/20 py-20 sm:py-28">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-extrabold font-headline mb-4 text-primary">
                Unlock Your Potential with AI-Powered Quizzes
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8">
                Generate personalized multiple-choice questions on any subject in seconds. Prepare smarter, not harder.
              </p>
              <Link href="/quiz/new">
                <Button size="lg" className="h-12 px-8 text-lg">
                  Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="AI Quiz Generation Dashboard"
                width={600}
                height={400}
                className="rounded-xl shadow-2xl mx-auto"
                data-ai-hint="education learning"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline">Why ScholarQuiz?</h2>
              <p className="text-lg text-muted-foreground mt-2">Everything you need to supercharge your study sessions.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-primary" />}
                title="Instant Quiz Generation"
                description="Describe your topic, and our AI will instantly create relevant, challenging questions for you."
              />
              <FeatureCard
                icon={<BarChart2 className="h-8 w-8 text-primary" />}
                title="In-Depth Analytics"
                description="Track your performance over time. Identify strengths and weaknesses with our visual dashboards."
              />
              <FeatureCard
                icon={<Target className="h-8 w-8 text-primary" />}
                title="Targeted Practice"
                description="Focus on specific exam types or custom notes to tailor your practice for what matters most."
              />
              <FeatureCard
                icon={<BrainCircuit className="h-8 w-8 text-primary" />}
                title="AI-Powered Insights"
                description="Get smart feedback on your performance, including time management and concept mastery."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-muted/30 dark:bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-headline">Get Started in 3 Simple Steps</h2>
              <p className="text-lg text-muted-foreground mt-2">From setup to success in just a few clicks.</p>
            </div>
            <div className="relative">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                
                <div className="grid md:grid-cols-3 gap-12 relative">
                    <HowItWorksStep
                        step="1"
                        title="Define Your Quiz"
                        description="Enter your subject, number of questions, difficulty, and any specific notes to generate a custom test."
                    />
                    <HowItWorksStep
                        step="2"
                        title="Take the Test"
                        description="Engage with the AI-generated questions in a clean, timed test environment."
                    />
                    <HowItWorksStep
                        step="3"
                        title="Analyze & Improve"
                        description="Review your results with detailed explanations and AI-driven analysis to guide your future studies."
                    />
                </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl font-bold font-headline mb-4">Ready to Ace Your Next Exam?</h2>
                 <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Stop the endless search for practice questions. Start generating your own tailored quizzes today and see the difference.
                 </p>
                 <Link href="/quiz/new">
                    <Button size="lg" className="h-12 px-8 text-lg">
                        Create My First Quiz <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader className="p-0 items-center">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
            {icon}
        </div>
        <CardTitle className="text-xl font-semibold font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function HowItWorksStep({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="text-center bg-background p-6 rounded-xl relative">
       <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground font-bold text-2xl rounded-full border-4 border-background">
          {step}
       </div>
       <h3 className="text-2xl font-semibold font-headline mt-8 mb-2">{title}</h3>
       <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
