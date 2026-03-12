from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum

class PersonaType(str, Enum):
    FIRST_STEPPER = "First Stepper"
    CHOICE_MAKER = "Choice Maker"
    FUTURE_BUILDER = "Future Builder"
    U_TURN = "Problem Solver (U-Turn)"

# --- PART A SCHEMAS ---
class ComprehensiveTraits(BaseModel):
    agility: int = 0
    risk_tolerance: int = 0
    process_adherence: int = 0
    analytical_iq: int = 0
    creative_abstraction: int = 0
    systems_thinking: int = 0
    empathy: int = 0
    diplomacy: int = 0
    leadership: int = 0
    autonomy: int = 0
    stability_seeking: int = 0
    ambition: int = 0

class PrismCalculationRequest(BaseModel):
    user_id: str
    persona: PersonaType
    final_scores: ComprehensiveTraits

class UserDraft(BaseModel):
    archetype_title: str
    psychological_profile: str
    core_traits: List[str]
    hidden_potential: str
    work_environment: str

# --- PART B SCHEMAS (THE SKILL FUSION) ---
class VerifiedSkills(BaseModel):
    # Core Academics (0-100)
    math_aptitude: int = 0
    math_affinity: int = 0
    english_communication: int = 0
    science_logic: int = 0
    
    # Proof of Action Hobbies (0-100)
    digital_creation: int = 0
    system_troubleshooting: int = 0
    community_management: int = 0
    commercial_hustle: int = 0

class CompleteFusionPayload(BaseModel):
    user_id: str
    psychometric_draft: UserDraft
    verified_skills: VerifiedSkills

class JobMatch(BaseModel):
    role_name: str = Field(description="The exact professional job title in the Indian market.")
    match_percentage: int = Field(description="A calculated match score between 80 and 99.")
    why_it_fits: str = Field(description="2 sentences explaining exactly how their psychometric traits and verified skills fuse perfectly for this role.")
    core_domain: str = Field(description="e.g., 'Information Technology', 'Business Operations', 'Design'")

class FusionResponse(BaseModel):
    matches: List[JobMatch] = Field(description="Exactly 3 highly accurate job recommendations.")

# --- PART C SCHEMAS ---
class FinalRoadmap(BaseModel):
    target_role: str
    estimated_weeks: int
    timeline: List[dict]

# ==========================================
# PART D: DYNAMIC SKILL ASSESSMENT (YUKTI)
# ==========================================
class AssessmentOption(BaseModel):
    option_id: str
    text: str
    is_correct: bool

class AssessmentQuestion(BaseModel):
    id: str
    skill_category: str
    question_context: str
    options: List[AssessmentOption]
    explanation: str

class SkillAssessmentRequest(BaseModel):
    user_id: str
    psychometric_traits: dict  # Flexible dict to match frontend UserDraft

class SkillAssessmentResponse(BaseModel):
    targeted_skills_tested: List[str]
    dynamic_assessment: List[AssessmentQuestion]

class AnswerSubmission(BaseModel):
    user_id: str
    question_id: str
    selected_option_id: str

class EvaluationRequest(BaseModel):
    user_id: str
    psychometric_traits: dict  # Flexible dict to match frontend UserDraft
    answers: List[AnswerSubmission]

class TopSkill(BaseModel):
    skill_name: str
    score: int
    reasoning: str

class SkillEvaluationResponse(BaseModel):
    top_5_skills: List[TopSkill]
    assessment_summary: str

# ==========================================
# PART E: IDENTITY STATEMENT
# ==========================================
class IdentityConstraints(BaseModel):
    education: List[str]
    skills: List[str]
    interests: List[str]

class IdentityStatementRequest(BaseModel):
    user_id: str
    constraints: IdentityConstraints
    psychometric_profile: str  # From Part A

class IdentityStatementResponse(BaseModel):
    identity_statement: str
