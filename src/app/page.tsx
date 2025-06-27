import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, BarChart2, Target, BrainCircuit, ArrowRight, Search } from "lucide-react";
import { HeroSection } from "@/components/ui/hero-section-1";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import HowItWorks from "@/components/HowItWorks";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-40 bg-muted/30 dark:bg-muted/20 max-w-7xl mx-auto "
      >
        <HowItWorks />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">
              Why ScholarQuiz?
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Everything you need to supercharge your study sessions.
            </p>
          </div>
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4">
            <GridItem
              area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
              icon={<Zap className="h-6 w-6 text-foreground" />}
              title="Instant Quiz Generation"
              description="Describe your topic, and our AI will instantly create relevant, challenging questions for you."
            />
            <GridItem
              area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
              icon={<BarChart2 className="h-6 w-6 text-foreground" />}
              title="In-Depth Analytics"
              description="Track your performance over time. Identify strengths and weaknesses with our visual dashboards."
            />
            <GridItem
              area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
              icon={<Target className="h-6 w-6 text-foreground" />}
              title="Targeted Practice"
              description="Focus on specific exam types or custom notes to tailor your practice for what matters most."
            />
            <GridItem
              area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
              icon={<BrainCircuit className="h-6 w-6 text-foreground" />}
              title="AI-Powered Insights"
              description="Get smart feedback on your performance, including time management and concept mastery."
            />
            <GridItem
              area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
              icon={
                <Search className="h-4 w-4 text-black dark:text-neutral-400" />
              }
              title="Easy and Simple UI"
              description="You will the best and simple user interface to create your quizzes and practice questions."
            />
          </ul>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">
            Ready to Ace Your Next Exam?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop the endless search for practice questions. Start generating
            your own tailored quizzes today and see the difference.
          </p>
          <Link href="/quiz/new">
            <Button size="lg" className="h-12 px-8 text-lg">
              Create My First Quiz <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect glow={true} disabled={false} proximity={64} />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-border p-3">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-headline pt-0.5 text-xl font-semibold text-balance text-foreground md:text-2xl">
                {title}
              </h3>
              <p className="font-body text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

function HowItWorksStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center bg-background p-6 rounded-xl relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center bg-primary text-primary-foreground font-bold text-2xl rounded-full border-4 border-background">
        {step}
      </div>
      <h3 className="text-2xl font-semibold font-headline mt-8 mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
