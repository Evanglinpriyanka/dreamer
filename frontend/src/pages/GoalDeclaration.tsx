import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Target, Search, Sparkles, TrendingUp } from "lucide-react";

const popularCareers = [
  "Software Engineer", "Data Scientist", "Product Manager", "UX Designer", 
  "Digital Marketing Manager", "Financial Analyst", "Doctor", "Teacher",
  "Lawyer", "Architect", "Graphic Designer", "Content Creator",
  "Cybersecurity Specialist", "AI Engineer", "Business Analyst", "Consultant"
];

const careerSuggestions = [
  "Software Developer", "Data Scientist", "Product Manager", "UX/UI Designer",
  "Digital Marketing Manager", "Financial Analyst", "Management Consultant", 
  "Cybersecurity Analyst", "AI/ML Engineer", "Business Analyst", "Content Creator",
  "Graphic Designer", "Medical Doctor", "Teacher", "Lawyer", "Architect",
  "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Pharmacist",
  "Nurse", "Psychologist", "Chartered Accountant", "Investment Banker",
  "Marketing Manager", "Sales Manager", "HR Manager", "Operations Manager"
];

const GoalDeclaration = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCareer, setSelectedCareer] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = careerSuggestions.filter(career =>
    career.toLowerCase().includes(searchTerm.toLowerCase()) && 
    career.toLowerCase() !== searchTerm.toLowerCase()
  ).slice(0, 8);

  const handleCareerSelect = (career: string) => {
    setSelectedCareer(career);
    setSearchTerm(career);
    setShowSuggestions(false);
  };

  const handleComplete = () => {
    if (selectedCareer || searchTerm) {
      localStorage.setItem('goalDeclarationResults', JSON.stringify({
        dreamCareer: selectedCareer || searchTerm,
        completed: true
      }));
      navigate("/dashboard");
    }
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setSelectedCareer(value);
    setShowSuggestions(value.length > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Goal Declaration</h1>
          </div>
          <h2 className="text-4xl font-bold">What's your dream career?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about the career you're passionate about, and we'll create a personalized roadmap to get you there.
          </p>
        </div>

        {/* Search Interface */}
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glass p-8">
            <div className="space-y-6">
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Type your dream career (e.g., Software Engineer, Doctor, Teacher)"
                    value={searchTerm}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg"
                    onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                  />
                </div>

                {/* Autocomplete Suggestions */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-2 z-10 glass border shadow-lg">
                    <div className="p-2">
                      {filteredSuggestions.map((career) => (
                        <div
                          key={career}
                          className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleCareerSelect(career)}
                        >
                          <TrendingUp className="w-4 h-4 text-muted-foreground" />
                          <span>{career}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {selectedCareer && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">Your Goal</span>
                  </div>
                  <p className="text-lg font-semibold">{selectedCareer}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Popular Careers */}
          {!searchTerm && (
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Popular Career Choices
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {popularCareers.map((career) => (
                  <Badge
                    key={career}
                    variant="outline"
                    className="cursor-pointer p-3 text-center transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleCareerSelect(career)}
                  >
                    {career}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Inspiration Section */}
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-3">💡 Need Inspiration?</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>• Think about what excites you most in your studies or hobbies</p>
              <p>• Consider careers of people you admire</p>
              <p>• Reflect on problems you'd love to solve in the world</p>
              <p>• Don't worry about being specific - we'll help you refine it!</p>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleComplete}
            disabled={!selectedCareer && !searchTerm}
            size="lg"
            variant="hero"
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Create My Roadmap
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted-foreground text-sm">
            {selectedCareer || searchTerm ? "Ready to build your path!" : "Enter your dream career to continue"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalDeclaration;