import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp,
  Briefcase,
  BookOpen,
  Trophy,
  MapPin,
  Target,
  Zap,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Roadmap = () => {
  const { careerType } = useParams();
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [jobMarketData, setJobMarketData] = useState<JobMarketData | null>(
    null,
  );
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    const career = JSON.parse(localStorage.getItem("selectedCareer") || "{}");
    if (!career.id) {
      navigate("/dashboard");
      return;
    }

    setSelectedCareer(career);
    generateRoadmap(career);
    generateJobMarketData(career);
  }, [careerType, navigate]);

  const generateRoadmap = (career: any) => {
    const baseSteps: RoadmapStep[] = [
      {
        id: "foundation",
        title: "Build Strong Foundations",
        description:
          "Master the fundamental concepts and tools essential for your career",
        duration: "2-4 months",
        skills: [
          "Basic Concepts",
          "Industry Tools",
          "Professional Communication",
        ],
        resources: ["Online Courses", "Books", "Practice Projects"],
      },
      {
        id: "practical",
        title: "Gain Practical Experience",
        description:
          "Apply your knowledge through projects and real-world scenarios",
        duration: "3-6 months",
        skills: ["Hands-on Practice", "Project Management", "Problem Solving"],
        resources: ["Personal Projects", "Internships", "Freelance Work"],
      },
      {
        id: "specialize",
        title: "Develop Specialization",
        description:
          "Focus on specific areas that align with your interests and market demand",
        duration: "4-8 months",
        skills: ["Advanced Skills", "Niche Expertise", "Industry Knowledge"],
        resources: ["Advanced Courses", "Certifications", "Mentorship"],
      },
      {
        id: "network",
        title: "Build Professional Network",
        description:
          "Connect with industry professionals and build your personal brand",
        duration: "Ongoing",
        skills: ["Networking", "Personal Branding", "Communication"],
        resources: ["LinkedIn", "Industry Events", "Professional Communities"],
      },
      {
        id: "apply",
        title: "Apply for Positions",
        description:
          "Prepare for and actively apply to relevant job opportunities",
        duration: "2-6 months",
        skills: ["Interview Skills", "Resume Writing", "Portfolio Development"],
        resources: [
          "Job Boards",
          "Recruitment Agencies",
          "Direct Applications",
        ],
      },
    ];

    if (
      career.title.toLowerCase().includes("software") ||
      career.title.toLowerCase().includes("developer")
    ) {
      baseSteps[0].skills = [
        "Programming Fundamentals",
        "Data Structures",
        "Algorithms",
        "Version Control",
      ];
      baseSteps[1].skills = [
        "Web Development",
        "Database Design",
        "API Development",
        "Testing",
      ];
      baseSteps[2].skills = [
        "Framework Mastery",
        "System Design",
        "DevOps",
        "Advanced Programming",
      ];
    } else if (career.title.toLowerCase().includes("data")) {
      baseSteps[0].skills = ["Statistics", "Python/R", "SQL", "Data Analysis"];
      baseSteps[1].skills = [
        "Machine Learning",
        "Data Visualization",
        "ETL Processes",
        "Business Intelligence",
      ];
      baseSteps[2].skills = [
        "Deep Learning",
        "Big Data Tools",
        "MLOps",
        "Domain Expertise",
      ];
    } else if (career.title.toLowerCase().includes("product")) {
      baseSteps[0].skills = [
        "Product Management",
        "User Research",
        "Analytics",
        "Agile Methodology",
      ];
      baseSteps[1].skills = [
        "Roadmap Planning",
        "Stakeholder Management",
        "A/B Testing",
        "Metrics",
      ];
      baseSteps[2].skills = [
        "Strategy",
        "Growth Hacking",
        "Technical Understanding",
        "Leadership",
      ];
    }

    setRoadmapSteps(baseSteps);
  };

  const generateJobMarketData = (career: any) => {
    const marketData: JobMarketData = {
      demand: "High",
      growth: "+15% annually",
      averageSalary: career.salaryRange || "₹8-25 LPA",
      topCompanies: [
        "Google",
        "Microsoft",
        "Amazon",
        "Flipkart",
        "Zomato",
        "Paytm",
        "Swiggy",
        "BYJU'S",
      ],
      locations: [
        "Bangalore",
        "Pune",
        "Hyderabad",
        "Mumbai",
        "Delhi NCR",
        "Chennai",
      ],
      jobOpenings: Math.floor(Math.random() * 5000) + 1000,
    };

    if (career.title.toLowerCase().includes("data")) {
      marketData.topCompanies = [
        "Netflix",
        "Uber",
        "LinkedIn",
        "Flipkart",
        "Amazon",
        "Microsoft",
        "Google",
        "Meta",
      ];
      marketData.growth = "+22% annually";
    } else if (career.title.toLowerCase().includes("product")) {
      marketData.topCompanies = [
        "Google",
        "Meta",
        "Amazon",
        "Flipkart",
        "Zomato",
        "PhonePe",
        "Razorpay",
        "Swiggy",
      ];
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
    localStorage.setItem("roadmapProgress", JSON.stringify([...newCompleted]));
  };

  const completionPercentage =
    roadmapSteps.length > 0
      ? (completedSteps.size / roadmapSteps.length) * 100
      : 0;

  if (!selectedCareer) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 mb-4"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          Your Roadmap to{" "}
          <span className="gradient-text">{selectedCareer.title}</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
          A step-by-step guide tailored specifically for you. Follow this
          roadmap to achieve your career goals.
        </p>

        {/* Progress Overview */}
        <Card className="glass p-4 max-w-md mx-auto mt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-primary font-bold">
                {Math.round(completionPercentage)}%
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedSteps.size} of {roadmapSteps.length} steps completed
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Roadmap */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Your Learning Path
          </h2>

          {roadmapSteps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isActive =
              !isCompleted &&
              (index === 0 || completedSteps.has(roadmapSteps[index - 1]?.id));

            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  className={`glass p-5 transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-50/50 border-green-200"
                      : isActive
                        ? "border-primary shadow-glow"
                        : ""
                  }`}
                >
                  <div className="space-y-3">
                    {/* Step Header */}
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStepCompletion(step.id)}
                        className="mt-1 transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3
                            className={`font-semibold ${isCompleted ? "text-green-700" : ""}`}
                          >
                            Step {index + 1}: {step.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </Badge>
                          {isActive && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Skills to Learn */}
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Skills to Master
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {step.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isActive && (
                      <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                        <div className="flex items-center gap-2 text-primary text-sm font-medium">
                          <Zap className="w-4 h-4" />
                          <span>Focus on this step next!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Job Market Analysis */}
          {jobMarketData && (
            <Card className="glass p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                Job Market Insights
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Market Demand</p>
                  <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                    {jobMarketData.demand}
                  </Badge>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                  <p className="font-medium text-sm text-green-600">
                    {jobMarketData.growth}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Salary Range</p>
                  <p className="font-medium text-sm">
                    {jobMarketData.averageSalary}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Active Job Openings
                  </p>
                  <p className="font-medium text-sm">
                    {jobMarketData.jobOpenings.toLocaleString()}+
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Top Companies */}
          {jobMarketData && (
            <Card className="glass p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-primary" />
                Top Hiring Companies
              </h3>
              <div className="space-y-1.5">
                {jobMarketData.topCompanies.slice(0, 5).map((company) => (
                  <div
                    key={company}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span>{company}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="glass p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Trophy className="w-4 h-4 text-primary" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                Set Learning Schedule
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                Join Community
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                Find Resources
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Roadmap;
