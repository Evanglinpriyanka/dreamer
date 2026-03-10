import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const stages = [
  {
    title: "Aspiration Canvas",
    subtitle: "What inspires you?",
    type: "visual-grid",
    options: [
      { id: "innovation", label: "Innovation & Technology", image: "🚀", color: "bg-blue-500" },
      { id: "creativity", label: "Art & Creativity", image: "🎨", color: "bg-purple-500" },
      { id: "helping", label: "Helping Others", image: "🤝", color: "bg-green-500" },
      { id: "business", label: "Business & Leadership", image: "💼", color: "bg-orange-500" },
      { id: "science", label: "Science & Research", image: "🔬", color: "bg-cyan-500" },
      { id: "communication", label: "Media & Communication", image: "📢", color: "bg-pink-500" },
    ]
  },
  {
    title: "Action Deck", 
    subtitle: "How do you prefer to work?",
    type: "cards",
    options: [
      { id: "team", label: "Team Collaboration", description: "Working with others towards common goals" },
      { id: "independent", label: "Independent Work", description: "Self-directed and autonomous projects" },
      { id: "leadership", label: "Leading Others", description: "Guiding and inspiring team members" },
      { id: "analysis", label: "Problem Analysis", description: "Breaking down complex challenges" },
      { id: "creation", label: "Creating Solutions", description: "Building and designing new things" },
      { id: "communication", label: "Communication", description: "Sharing ideas and connecting people" },
    ]
  },
  {
    title: "Role Choice",
    subtitle: "Which role appeals to you most?",
    type: "role-cards",
    options: [
      { id: "strategist", label: "The Strategist", description: "Planning and big-picture thinking" },
      { id: "creator", label: "The Creator", description: "Bringing ideas to life" },
      { id: "connector", label: "The Connector", description: "Building relationships and networks" },
      { id: "analyst", label: "The Analyst", description: "Deep research and data insights" },
      { id: "builder", label: "The Builder", description: "Hands-on development and construction" },
      { id: "guide", label: "The Guide", description: "Teaching and mentoring others" },
    ]
  }
];

const PotentialPrism = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [selections, setSelections] = useState<Record<number, string[]>>({});
  const [timeStarted] = useState(Date.now());

  const handleSelection = (optionId: string) => {
    const currentSelections = selections[currentStage] || [];
    const newSelections = currentSelections.includes(optionId)
      ? currentSelections.filter(id => id !== optionId)
      : [...currentSelections, optionId];
    
    setSelections({
      ...selections,
      [currentStage]: newSelections
    });
  };

  const handleNext = () => {
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      // Complete assessment
      const timeCompleted = Date.now();
      const duration = timeCompleted - timeStarted;
      
      localStorage.setItem('potentialPrismResults', JSON.stringify({
        selections,
        duration,
        completed: true
      }));
      
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const currentStageData = stages[currentStage];
  const hasSelections = (selections[currentStage] || []).length > 0;
  const progress = ((currentStage + 1) / stages.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-glow rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Potential Prism</h1>
          </div>
          <p className="text-muted-foreground">Discover your innate potential in under 90 seconds</p>
          
          <div className="max-w-md mx-auto space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Stage {currentStage + 1} of {stages.length}
            </p>
          </div>
        </div>

        {/* Current Stage */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold">{currentStageData.title}</h2>
            <p className="text-xl text-muted-foreground">{currentStageData.subtitle}</p>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
          </div>

          {/* Visual Grid Layout */}
          {currentStageData.type === "visual-grid" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {currentStageData.options.map((option) => (
                <Card
                  key={option.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    (selections[currentStage] || []).includes(option.id)
                      ? "ring-2 ring-primary shadow-glow"
                      : "hover:-translate-y-1"
                  }`}
                  onClick={() => handleSelection(option.id)}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{option.image}</div>
                    <div className={`w-12 h-12 rounded-full ${option.color} mx-auto opacity-80`}></div>
                    <p className="font-medium text-sm">{option.label}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Cards Layout */}
          {(currentStageData.type === "cards" || currentStageData.type === "role-cards") && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {currentStageData.options.map((option) => (
                <Card
                  key={option.id}
                  className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    (selections[currentStage] || []).includes(option.id)
                      ? "ring-2 ring-primary shadow-glow"
                      : "hover:-translate-y-1"
                  }`}
                  onClick={() => handleSelection(option.id)}
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{option.label}</h3>
                    <p className="text-muted-foreground text-sm">{option.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStage === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {(selections[currentStage] || []).length} selected
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!hasSelections}
              className="flex items-center gap-2"
              variant="hero"
            >
              {currentStage === stages.length - 1 ? "Complete" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PotentialPrism;