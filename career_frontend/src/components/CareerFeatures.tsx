import { Card } from "@/components/ui/card";
import { Brain, Compass, LineChart, Users, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze your skills, interests, and personality to suggest perfect career matches.",
    gradient: "from-primary to-primary-glow"
  },
  {
    icon: Compass,
    title: "Career Path Mapping",
    description: "Visualize your journey with detailed roadmaps showing steps to reach your dream career.",
    gradient: "from-secondary to-secondary-glow"
  },
  {
    icon: LineChart,
    title: "Market Insights",
    description: "Real-time job market data and salary insights to make informed career decisions.",
    gradient: "from-accent to-accent-glow"
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "Connect with industry professionals and get personalized guidance for your career journey.",
    gradient: "from-primary to-secondary"
  },
  {
    icon: Zap,
    title: "Skill Assessment",
    description: "Comprehensive skill evaluation with personalized recommendations for improvement.",
    gradient: "from-secondary to-accent"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is secure and private. We never share your personal information.",
    gradient: "from-accent to-primary"
  }
];

const CareerFeatures = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Powerful Features for
            <span className="gradient-text block">Career Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to discover, plan, and achieve your ideal career path
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="glass p-8 hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="space-y-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerFeatures;