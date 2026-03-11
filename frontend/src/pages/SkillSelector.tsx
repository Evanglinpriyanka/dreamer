import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Users, Code, Palette, Calculator, Megaphone, Heart, Globe, Zap } from "lucide-react";

const skillCategories = [
  {
    id: "technical",
    title: "Technical Skills",
    icon: Code,
    color: "from-blue-500 to-blue-600",
    skills: [
      "Programming", "Web Development", "Data Analysis", "AI/Machine Learning", 
      "Cybersecurity", "Mobile Development", "Cloud Computing", "DevOps",
      "Database Management", "UI/UX Design", "Game Development", "Blockchain"
    ]
  },
  {
    id: "creative",
    title: "Creative Skills", 
    icon: Palette,
    color: "from-purple-500 to-purple-600",
    skills: [
      "Graphic Design", "Photography", "Video Editing", "Writing", 
      "Music Production", "3D Modeling", "Animation", "Digital Art",
      "Content Creation", "Storytelling", "Brand Design", "Illustration"
    ]
  },
  {
    id: "analytical",
    title: "Analytical Skills",
    icon: Calculator, 
    color: "from-green-500 to-green-600",
    skills: [
      "Market Research", "Financial Analysis", "Statistics", "Problem Solving",
      "Strategic Planning", "Risk Assessment", "Quality Assurance", "Process Optimization",
      "Research Methods", "Critical Thinking", "Data Visualization", "Forecasting"
    ]
  },
  {
    id: "communication",
    title: "Communication Skills",
    icon: Megaphone,
    color: "from-orange-500 to-orange-600", 
    skills: [
      "Public Speaking", "Writing", "Social Media", "Marketing",
      "Sales", "Negotiation", "Presentation", "Copywriting",
      "Public Relations", "Event Planning", "Journalism", "Podcasting"
    ]
  },
  {
    id: "interpersonal",
    title: "Interpersonal Skills",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
    skills: [
      "Leadership", "Team Management", "Counseling", "Teaching",
      "Customer Service", "Conflict Resolution", "Mentoring", "Coaching",
      "Human Resources", "Community Building", "Networking", "Empathy"
    ]
  },
  {
    id: "business",
    title: "Business Skills",
    icon: Globe,
    color: "from-cyan-500 to-cyan-600",
    skills: [
      "Project Management", "Entrepreneurship", "Operations", "Strategy",
      "Finance", "Accounting", "Supply Chain", "Business Development",
      "Consulting", "Legal", "Compliance", "Innovation Management"
    ]
  }
];

const SkillSelector = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleComplete = () => {
    localStorage.setItem('skillSelectorResults', JSON.stringify({
      selectedSkills,
      completed: true
    }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary-glow rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Visual Skill Selector</h1>
          </div>
          <h2 className="text-3xl font-bold">What are your skills & interests?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select all the skills you have or are interested in developing. Don't worry about expertise level!
          </p>
          
          {selectedSkills.length > 0 && (
            <div className="bg-primary/10 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-primary font-medium">
                {selectedSkills.length} skills selected
              </p>
            </div>
          )}
        </div>

        {/* Skill Categories */}
        <div className="space-y-6">
          {skillCategories.map((category) => (
            <Card key={category.id} className="glass p-6">
              <div 
                className="flex items-center gap-4 mb-4 cursor-pointer"
                onClick={() => setActiveCategory(
                  activeCategory === category.id ? null : category.id
                )}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.skills.filter(skill => selectedSkills.includes(skill)).length} of {category.skills.length} selected
                  </p>
                </div>
                <div className="text-muted-foreground">
                  {activeCategory === category.id ? "−" : "+"}
                </div>
              </div>

              {/* Skills Grid */}
              <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 transition-all duration-200 ${
                activeCategory === category.id || activeCategory === null 
                  ? "opacity-100 max-h-none" 
                  : "opacity-50 max-h-20 overflow-hidden"
              }`}>
                {category.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer p-3 text-center transition-all duration-200 hover:scale-105 ${
                      selectedSkills.includes(skill) 
                        ? "bg-primary text-primary-foreground shadow-glow" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Selected Skills Summary */}
        {selectedSkills.length > 0 && (
          <Card className="glass p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4">Your Selected Skills ({selectedSkills.length})</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="default"
                  className="bg-primary text-primary-foreground"
                >
                  {skill}
                  <button 
                    className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleComplete}
            disabled={selectedSkills.length === 0}
            size="lg"
            variant="hero"
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Find My Career Matches ({selectedSkills.length} skills)
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted-foreground text-sm">
            Select at least one skill to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillSelector;