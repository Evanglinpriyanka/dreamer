// Career Dreamer Type Definitions

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface CoreStrength {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'domain';
}

export interface CareerRecommendation {
  id: string;
  title: string;
  match: number;
  description: string;
  keySkills: string[];
  marketDemand: 'High' | 'Medium' | 'Growing';
  salaryRange: string;
  timeToEntry: string;
  icon?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: string[];
  completed?: boolean;
  order: number;
}

export interface JobMarketData {
  demand: 'High' | 'Medium' | 'Growing';
  growth: string;
  averageSalary: string;
  topCompanies: string[];
  locations: string[];
  jobOpenings: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export interface GoalDeclaration {
  dreamCareer: string;
  targetTimeline: string;
  motivation: string;
}

export interface AssessmentResults {
  personaSelection?: {
    completed: boolean;
    selectedPersona: string;
    timestamp: number;
  };
  potentialPrism?: {
    completed: boolean;
    results: Record<string, number>;
    timestamp: number;
  };
  skillSelector?: {
    completed: boolean;
    selectedSkills: string[];
    timestamp: number;
  };
  goalDeclaration?: {
    completed: boolean;
    dreamCareer: string;
    targetTimeline: string;
    motivation: string;
    timestamp: number;
  };
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export interface SkeletonProps {
  className?: string;
  variant?: 'circular' | 'rectangular' | 'text';
  width?: string | number;
  height?: string | number;
}

export interface LoadingStateProps {
  isLoading: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

