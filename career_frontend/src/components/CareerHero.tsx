import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Target, TrendingUp, Check } from "lucide-react";
import heroCareer from "@/assets/hero-career.jpg";

const CareerHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,hsl(var(--primary)/0.14),transparent_32%),radial-gradient(circle_at_8%_72%,hsl(var(--secondary)/0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(hsl(var(--foreground)/0.04)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.04)_1px,transparent_1px)] [background-size:48px_48px]" />
      
      {/* Floating elements */}
      <div className="container mx-auto px-6 pt-16 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8 fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Career Discovery
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-[0.98] tracking-tight">
              A clearer path to your
              <span className="gradient-text block">next chapter.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              CareerDreamer turns your interests, strengths, and ambitions into a focused career direction you can act on.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="hero" size="lg" className="group">
              <Link href="/signup">
                Start your assessment
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="glass">
              <a href="#process">See how it works</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-sm text-muted-foreground">
            {["Personalized assessment", "Career matching", "Actionable roadmap"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-secondary" /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative lg:order-last order-first">
          <div className="relative">
            {/* Floating icons */}
            <div className="absolute -top-8 -left-8 w-16 h-16 glass rounded-full flex items-center justify-center float">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 glass rounded-full flex items-center justify-center float delay-1000">
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
            <div className="absolute top-1/2 -right-12 w-12 h-12 glass rounded-full flex items-center justify-center float delay-500">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>

            {/* Main hero image */}
            <div className="glass rounded-[2rem] p-3 sm:p-5 transform hover:scale-[1.02] transition-transform duration-500 shadow-elegant">
              <Image
                src={heroCareer} 
                alt="Career exploration and growth visualization" 
                className="w-full h-auto rounded-2xl"
              />
            </div>

            <div className="absolute -bottom-5 left-5 sm:left-10 glass rounded-2xl px-4 py-3 shadow-elegant flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-secondary/15 flex items-center justify-center">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Your direction</p>
                <p className="font-semibold">Becomes a plan</p>
              </div>
            </div>

            {/* Gradient overlay on image */}
            <div className="absolute inset-6 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;