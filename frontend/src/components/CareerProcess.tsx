import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  ClipboardList,
  Lightbulb,
  Rocket,
  Trophy,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Complete Assessment",
    description:
      "Take our comprehensive career assessment covering your skills, interests, values, and personality traits.",
    color: "text-primary",
  },
  {
    icon: Lightbulb,
    title: "Get AI Insights",
    description:
      "Our AI analyzes your responses and market data to generate personalized career recommendations.",
    color: "text-secondary",
  },
  {
    icon: Rocket,
    title: "Explore Paths",
    description:
      "Discover detailed career paths with step-by-step roadmaps, required skills, and growth opportunities.",
    color: "text-accent",
  },
  {
    icon: Trophy,
    title: "Achieve Success",
    description:
      "Follow your personalized plan with ongoing support, mentorship, and progress tracking.",
    color: "text-primary",
  },
];

const CareerProcess = () => {
  return (
    <section id="process" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Your Journey to
            <span className="gradient-text block">Career Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow our proven 4-step process to discover and achieve your dream
            career
          </p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center px-16">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="flex-1 h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30 mx-8"
                />
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="glass p-8 text-center relative group hover:shadow-glow transition-all duration-500"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>

                <div className="space-y-6 pt-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center pt-4">
                      <ArrowRight className="w-6 h-6 text-primary/50" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerProcess;
