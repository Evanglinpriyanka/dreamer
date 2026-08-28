export interface AuthUser {
  id: string;
  name?: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token?: string;
}

export interface CareerRecommendation {
  careerId: string;
  careerName: string;
  matchScore: number;
  description?: string;
  reasons?: string[];
  skills?: string[];
  skillGaps?: string[];
}

export interface Resource {
  title: string;
  url?: string;
  type?: string;
}

export type RoadmapStepStatus = "locked" | "not_started" | "in_progress" | "completed";

export interface RoadmapStep {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  estimatedHours?: number;
  resources?: Resource[];
  status: RoadmapStepStatus;
}

export interface Roadmap {
  careerId: string;
  title?: string;
  progress?: number;
  steps: RoadmapStep[];
}

export interface UserProfile extends AuthUser {
  education?: string;
  skills?: string[];
  interests?: string[];
  goals?: string[];
  experience?: string;
}
