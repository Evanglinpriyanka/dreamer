import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, CheckCircle, Circle, Clock, TrendingUp, 
  DollarSign, Users, Briefcase, BookOpen, Trophy,
  MapPin, Calendar, Target, Zap
} from "lucide-react";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  completed?: boolean;
}

interface JobMarketData {
  demand: "High" | "Medium" | "Growing";
  growth: string;
  averageSalary: string;
  topCompanies: string[];
  locations: string[];
  jobOpenings: number;
}

const Roadmap = () => {
  const { careerType } = useParams();
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [jobMarketData, setJobMarketData] = useState<JobMarketData | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load selected career from localStorage
    const career = JSON.parse(localStorage.getItem('selectedCareer') || '{}');
    if (!career.id) {
      navigate('/dashboard');
      return;
    }
    
    setSelectedCareer(career);
    generateRoadmap(career);
    generateJobMarketData(career);
  }, [careerType, navigate]);

  const generateRoadmap = (career: any) => {
    // Generate personalized roadmap based on career
    const baseSteps: RoadmapStep[] = [
      {
        id: "foundation",
        title: "Build Strong Foundations",
        description: "Master the fundamental concepts and tools essential for your career",
        duration: "2-4 months",
        skills: ["Basic Concepts", "Industry Tools", "Professional Communication"],
        resources: ["Online Courses", "Books", "Practice Projects"]
      },
      {
        id: "practical",
        title: "Gain Practical Experience", 
        description: "Apply your knowledge through projects and real-world scenarios",
        duration: "3-6 months",
        skills: ["Hands-on Practice", "Project Management", "Problem Solving"],
        resources: ["Personal Projects", "Internships", "Freelance Work"]
      },
      {
        id: "specialize",
        title: "Develop Specialization",
        description: "Focus on specific areas that align with your interests and market demand",
        duration: "4-8 months", 
        skills: ["Advanced Skills", "Niche Expertise", "Industry Knowledge"],
        resources: ["Advanced Courses", "Certifications", "Mentorship"]
      },
      {
        id: "network",
        title: "Build Professional Network",
        description: "Connect with industry professionals and build your personal brand",
        duration: "Ongoing",
        skills: ["Networking", "Personal Branding", "Communication"],
        resources: ["LinkedIn", "Industry Events", "Professional Communities"]
      },
      {
        id: "apply",
        title: "Apply for Positions",
        description: "Prepare for and actively apply to relevant job opportunities",
        duration: "2-6 months",
        skills: ["Interview Skills", "Resume Writing", "Portfolio Development"],
        resources: ["Job Boards", "Recruitment Agencies", "Direct Applications"]
      }
    ];

    // Customize steps based on career type
    if (career.title.toLowerCase().includes('software') || career.title.toLowerCase().includes('developer')) {
      baseSteps[0].skills = ["Programming Fundamentals", "Data Structures", "Algorithms", "Version Control"];
      baseSteps[1].skills = ["Web Development", "Database Design", "API Development", "Testing"];
      baseSteps[2].skills = ["Framework Mastery", "System Design", "DevOps", "Advanced Programming"];
    } else if (career.title.toLowerCase().includes('data')) {
      baseSteps[0].skills = ["Statistics", "Python/R", "SQL", "Data Analysis"];
      baseSteps[1].skills = ["Machine Learning", "Data Visualization", "ETL Processes", "Business Intelligence"];
      baseSteps[2].skills = ["Deep Learning", "Big Data Tools", "MLOps", "Domain Expertise"];
    } else if (career.title.toLowerCase().includes('product')) {
      baseSteps[0].skills = ["Product Management", "User Research", "Analytics", "Agile Methodology"];
      baseSteps[1].skills = ["Roadmap Planning", "Stakeholder Management", "A/B Testing", "Metrics"];
      baseSteps[2].skills = ["Strategy", "Growth Hacking", "Technical Understanding", "Leadership"];
    }

    setRoadmapSteps(baseSteps);
  };

  const generateJobMarketData = (career: any) => {
    // Generate market data based on career
    const marketData: JobMarketData = {
      demand: "High",
      growth: "+15% annually",
      averageSalary: career.salaryRange || "₹8-25 LPA",
      topCompanies: ["Google", "Microsoft", "Amazon", "Flipkart", "Zomato", "Paytm", "Swiggy", "BYJU'S"],
      locations: ["Bangalore", "Pune", "Hyderabad", "Mumbai", "Delhi NCR", "Chennai"],
      jobOpenings: Math.floor(Math.random() * 5000) + 1000
    };

    if (career.title.toLowerCase().includes('data')) {
      marketData.topCompanies = ["Netflix", "Uber", "LinkedIn", "Flipkart", "Amazon", "Microsoft", "Google", "Meta"];
      marketData.growth = "+22% annually";
    } else if (career.title.toLowerCase().includes('product')) {
      marketData.topCompanies = ["Google", "Meta", "Amazon", "Flipkart", "Zomato", "PhonePe", "Razorpay", "Swiggy"];
      marketData.growth = "+18% annually";
    }

    setJobMarketData(marketData);
  };

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
    
    // Save progress to localStorage
    localStorage.setItem('roadmapProgress', JSON.stringify([...newCompleted]));
  };

  const completionPercentage = (completedSteps.size / roadmapSteps.length) * 100;

  if (!selectedCareer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold">
            Your Roadmap to <span className="gradient-text">{selectedCareer.title}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A step-by-step guide tailored specifically for you. Follow this roadmap to achieve your career goals systematically.
          </p>
          
          {/* Progress Overview */}
          <Card className="glass p-6 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Overall Progress</span>
                <span className="text-primary font-bold">{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {completedSteps.size} of {roadmapSteps.length} steps completed
              </p>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Your Learning Path
            </h2>

            {roadmapSteps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isActive = !isCompleted && index === 0 || (!isCompleted && completedSteps.has(roadmapSteps[index - 1]?.id));
              
              return (
                <Card 
                  key={step.id} 
                  className={`glass p-6 transition-all duration-300 ${
                    isCompleted ? 'bg-green-50/50 border-green-200' : 
                    isActive ? 'border-primary shadow-glow' : ''
                  }`}
                >
                  <div className="space-y-4">
                    {/* Step Header */}
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className="mt-1 transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-xl font-semibold ${isCompleted ? 'text-green-700' : ''}`}>
                            Step {index + 1}: {step.title}
                          </h3>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </Badge>
                          {isActive && (
                            <Badge className="bg-primary text-primary-foreground">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    {/* Skills to Learn */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Skills to Master
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Recommended Resources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {step.resources.map((resource) => (
                          <Badge key={resource} variant="outline">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isActive && (
                      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Zap className="w-4 h-4" />
                          <span>Focus on this step next!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Market Analysis */}
            {jobMarketData && (
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Job Market Insights
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Market Demand</p>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {jobMarketData.demand}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Rate</p>
                    <p className="font-medium text-green-600">{jobMarketData.growth}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Salary Range</p>
                    <p className="font-medium">{jobMarketData.averageSalary}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Active Job Openings</p>
                    <p className="font-medium">{jobMarketData.jobOpenings.toLocaleString()}+</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Top Companies */}
            {jobMarketData && (
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Top Hiring Companies
                </h3>
                <div className="space-y-2">
                  {jobMarketData.topCompanies.map((company) => (
                    <div key={company} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{company}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Top Locations */}
            {jobMarketData && (
              <Card className="glass p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Best Locations
                </h3>
                <div className="space-y-2">
                  {jobMarketData.locations.map((location) => (
                    <div key={location} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm">{location}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Action Items */}
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Set Learning Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Find Resources
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;