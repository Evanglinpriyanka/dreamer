import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import heroCareer from "@/assets/hero-career.jpg";

const CareerHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse delay-500" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="space-y-8 fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Career Discovery
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Discover Your
              <span className="gradient-text block">Dream Career</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Unlock your potential with our AI-powered career exploration platform. 
              Get personalized insights, discover new paths, and build the career you've always dreamed of.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="group">
              Start Your Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="glass">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Career Paths</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
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
            <div className="glass rounded-3xl p-6 transform hover:scale-105 transition-transform duration-500">
              <img 
                src={heroCareer} 
                alt="Career exploration and growth visualization" 
                className="w-full h-auto rounded-2xl"
              />
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