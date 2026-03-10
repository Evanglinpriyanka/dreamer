import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Star,
  ArrowRight,
  Target,
  Users,
  Lightbulb,
  Sparkles,
  Brain,
  Clock,
} from "lucide-react";

interface UserProfile {
  persona: string;
  profileName: string;
  profileDescription: string;
  coreStrengths: string[];
  recommendations: CareerRecommendation[];
}

interface CareerRecommendation {
  id: string;
  title: string;
  match: number;
  description: string;
  keySkills: string[];
  marketDemand: "High" | "Medium" | "Growing";
  salaryRange: string;
  timeToEntry: string;
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateProfile = () => {
      const potentialPrismResults = JSON.parse(
        localStorage.getItem("potentialPrismResults") || "{}",
      );
      const skillSelectorResults = JSON.parse(
        localStorage.getItem("skillSelectorResults") || "{}",
      );
      const goalDeclarationResults = JSON.parse(
        localStorage.getItem("goalDeclarationResults") || "{}",
      );
      const selectedPersona = JSON.parse(
        localStorage.getItem("selectedPersona") || "{}",
      );

      let profile: UserProfile;

      if (potentialPrismResults.completed) {
        profile = {
          persona: "first-stepper",
          profileName: "The Versatile Explorer",
          profileDescription:
            "You have a natural curiosity and adaptability that opens doors to multiple career paths. Your diverse interests and collaborative nature make you ideal for dynamic, people-centered roles.",
          coreStrengths: [
            "Adaptability",
            "Collaboration",
            "Creative Problem Solving",
            "Communication",
            "Learning Agility",
          ],
          recommendations: [
            {
              id: "product-manager",
              title: "Product Manager",
              match: 92,
              description:
                "Lead cross-functional teams to build amazing products that users love.",
              keySkills: [
                "Strategic Thinking",
                "User Research",
                "Data Analysis",
                "Communication",
              ],
              marketDemand: "High",
              salaryRange: "₹15-40 LPA",
              timeToEntry: "2-3 years",
            },
            {
              id: "ux-designer",
              title: "UX/UI Designer",
              match: 88,
              description:
                "Create intuitive and beautiful digital experiences for millions of users.",
              keySkills: [
                "Design Thinking",
                "User Research",
                "Prototyping",
                "Visual Design",
              ],
              marketDemand: "Growing",
              salaryRange: "₹8-25 LPA",
              timeToEntry: "1-2 years",
            },
            {
              id: "business-analyst",
              title: "Business Analyst",
              match: 85,
              description:
                "Bridge the gap between business needs and technical solutions.",
              keySkills: [
                "Analysis",
                "Process Optimization",
                "Communication",
                "Problem Solving",
              ],
              marketDemand: "High",
              salaryRange: "₹6-20 LPA",
              timeToEntry: "1-2 years",
            },
          ],
        };
      } else if (skillSelectorResults.completed) {
        const skills = skillSelectorResults.selectedSkills;
        profile = {
          persona: "choice-maker",
          profileName: "The Multi-Talented Achiever",
          profileDescription: `With ${skills.length} diverse skills, you're a rare blend of technical expertise and creative thinking. Your versatility is your superpower.`,
          coreStrengths: skills.slice(0, 5),
          recommendations: [
            {
              id: "full-stack-developer",
              title: "Full-Stack Developer",
              match: 94,
              description:
                "Build complete web applications from frontend to backend using your diverse technical skills.",
              keySkills: [
                "Programming",
                "Web Development",
                "Database Design",
                "Problem Solving",
              ],
              marketDemand: "High",
              salaryRange: "₹8-30 LPA",
              timeToEntry: "1-2 years",
            },
            {
              id: "tech-consultant",
              title: "Technology Consultant",
              match: 90,
              description:
                "Help businesses solve complex problems using your broad technical knowledge.",
              keySkills: [
                "Technical Expertise",
                "Business Analysis",
                "Communication",
                "Strategy",
              ],
              marketDemand: "Growing",
              salaryRange: "₹12-35 LPA",
              timeToEntry: "2-3 years",
            },
            {
              id: "product-owner",
              title: "Product Owner",
              match: 87,
              description:
                "Define product vision and requirements using your understanding of both tech and business.",
              keySkills: [
                "Product Strategy",
                "Technical Understanding",
                "Stakeholder Management",
              ],
              marketDemand: "High",
              salaryRange: "₹15-40 LPA",
              timeToEntry: "2-4 years",
            },
          ],
        };
      } else if (goalDeclarationResults.completed) {
        const dreamCareer = goalDeclarationResults.dreamCareer;
        profile = {
          persona: "future-builder",
          profileName: "The Focused Achiever",
          profileDescription: `Your clear vision for becoming a ${dreamCareer} shows remarkable focus and determination. You have the goal-oriented mindset needed to excel.`,
          coreStrengths: [
            "Goal-Oriented",
            "Determination",
            "Strategic Planning",
            "Focus",
            "Self-Motivation",
          ],
          recommendations: [
            {
              id: "target-career",
              title: dreamCareer,
              match: 95,
              description: `Your dream career! Here's your personalized roadmap to become a successful ${dreamCareer}.`,
              keySkills: [
                "Domain Expertise",
                "Professional Skills",
                "Industry Knowledge",
                "Networking",
              ],
              marketDemand: "High",
              salaryRange: "₹6-50 LPA",
              timeToEntry: "1-4 years",
            },
            {
              id: "related-career-1",
              title: `Senior ${dreamCareer}`,
              match: 90,
              description: `The advanced version of your target role with leadership responsibilities.`,
              keySkills: [
                "Leadership",
                "Mentoring",
                "Strategic Vision",
                "Team Management",
              ],
              marketDemand: "Medium",
              salaryRange: "₹20-80 LPA",
              timeToEntry: "5-8 years",
            },
            {
              id: "related-career-2",
              title: `${dreamCareer} Consultant`,
              match: 85,
              description: `Use your expertise to advise organizations and solve complex challenges.`,
              keySkills: [
                "Consulting",
                "Problem Solving",
                "Client Management",
                "Expertise",
              ],
              marketDemand: "Growing",
              salaryRange: "₹25-100 LPA",
              timeToEntry: "6-10 years",
            },
          ],
        };
      } else {
        profile = {
          persona: "explorer",
          profileName: "The Career Explorer",
          profileDescription:
            "You're at the beginning of an exciting journey! Let's explore different paths to find what truly excites you.",
          coreStrengths: [
            "Curiosity",
            "Openness",
            "Learning",
            "Exploration",
            "Potential",
          ],
          recommendations: [
            {
              id: "software-engineer",
              title: "Software Engineer",
              match: 85,
              description:
                "Build the digital products and services that power our modern world.",
              keySkills: [
                "Programming",
                "Problem Solving",
                "Logic",
                "Creativity",
              ],
              marketDemand: "High",
              salaryRange: "₹6-25 LPA",
              timeToEntry: "1-2 years",
            },
            {
              id: "data-scientist",
              title: "Data Scientist",
              match: 80,
              description:
                "Uncover insights from data to help businesses make smarter decisions.",
              keySkills: [
                "Statistics",
                "Programming",
                "Analysis",
                "Communication",
              ],
              marketDemand: "High",
              salaryRange: "₹8-30 LPA",
              timeToEntry: "2-3 years",
            },
            {
              id: "marketing-manager",
              title: "Digital Marketing Manager",
              match: 75,
              description:
                "Create compelling campaigns that connect brands with their audiences.",
              keySkills: [
                "Creativity",
                "Analytics",
                "Communication",
                "Strategy",
              ],
              marketDemand: "Growing",
              salaryRange: "₹5-20 LPA",
              timeToEntry: "1-2 years",
            },
          ],
        };
      }

      setUserProfile(profile);
      setLoading(false);
    };

    setTimeout(generateProfile, 2000);
  }, []);

  const handleViewRoadmap = (career: CareerRecommendation) => {
    localStorage.setItem("selectedCareer", JSON.stringify(career));
    navigate(`/roadmap/${career.id}`);
  };

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case "future-builder":
        return Target;
      case "choice-maker":
        return Users;
      case "first-stepper":
        return Lightbulb;
      default:
        return User;
    }
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600 bg-green-100";
    if (match >= 80) return "text-blue-600 bg-blue-100";
    return "text-orange-600 bg-orange-100";
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case "High":
        return "text-green-600 bg-green-100";
      case "Growing":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="glass p-8 max-w-md text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mx-auto">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">
                Analyzing Your Potential
              </h3>
              <p className="text-muted-foreground">
                Our AI is creating your personalized career profile...
              </p>
              <Progress value={100} className="h-2" />
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                This usually takes a few seconds
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    navigate("/persona-selection");
    return null;
  }

  const PersonaIcon = getPersonaIcon(userProfile.persona);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold gradient-text">
          Your Career Profile
        </h1>
        <p className="text-muted-foreground">
          Based on your assessment, here's what we discovered about you
        </p>
      </motion.div>

      {/* Profile Summary */}
      <motion.div variants={itemVariants}>
        <Card className="glass p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center flex-shrink-0">
              <PersonaIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {userProfile.profileName}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {userProfile.profileDescription}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Your Core Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.coreStrengths.map((strength) => (
                    <Badge
                      key={strength}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Career Recommendations */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold">
            Perfect Career Matches
          </h2>
          <p className="text-muted-foreground">
            AI-curated career paths that align with your unique profile
          </p>
        </div>

        <div className="grid gap-4">
          {userProfile.recommendations.map((career, index) => (
            <motion.div
              key={career.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
            >
              <Card className="glass p-5 hover:shadow-glow transition-all duration-300">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-semibold">
                          {career.title}
                        </h3>
                        <Badge
                          className={`${getMatchColor(career.match)} border-0 text-xs`}
                        >
                          {career.match}% Match
                        </Badge>
                        {index === 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Best Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {career.description}
                      </p>
                    </div>
                  </div>

                  {/* Match Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Match Score</span>
                      <span className="font-medium">{career.match}%</span>
                    </div>
                    <Progress value={career.match} className="h-2" />
                  </div>

                  {/* Career Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Market Demand
                      </p>
                      <Badge
                        className={`${getDemandColor(career.marketDemand)} border-0 text-xs`}
                      >
                        {career.marketDemand}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Salary Range
                      </p>
                      <p className="font-medium text-sm">
                        {career.salaryRange}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Time to Entry
                      </p>
                      <p className="font-medium text-sm">
                        {career.timeToEntry}
                      </p>
                    </div>
                    <div>
                      <Button
                        onClick={() => handleViewRoadmap(career)}
                        size="sm"
                        className="w-full"
                        variant={index === 0 ? "hero" : "outline"}
                      >
                        View Roadmap
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Key Skills Required
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {career.keySkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-center gap-3"
      >
        <Button
          variant="outline"
          onClick={() => navigate("/persona-selection")}
        >
          Retake Assessment
        </Button>
        <Button
          variant="hero"
          onClick={() => handleViewRoadmap(userProfile.recommendations[0])}
        >
          Start with Best Match
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
