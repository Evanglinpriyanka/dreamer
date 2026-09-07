from fastapi import APIRouter, HTTPException
from models.schemas import (
    PrismCalculationRequest, UserDraft, CompleteFusionPayload, FusionResponse, FinalRoadmap,
    SkillAssessmentRequest, SkillAssessmentResponse, EvaluationRequest, SkillEvaluationResponse,
    IdentityStatementRequest, IdentityStatementResponse
)
from services.orchestrator import (
    run_prism_orchestration, run_skill_fusion,
    generate_dynamic_assessment, evaluate_skill_answers, generate_identity_statement
)
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/prism/calculate", response_model=UserDraft)
async def calculate_prism_results(payload: PrismCalculationRequest):
    try:
        return await run_prism_orchestration(payload)
    except Exception as e:
        logger.exception("AI Synthesis Error")
        raise HTTPException(status_code=500, detail="Failed to synthesize psychological profile.")

@router.post("/roles/match", response_model=FusionResponse)
async def find_matching_roles(payload: CompleteFusionPayload):
    """
    Step 2: Takes the Groq Draft AND the new Skill Data, 
    fuses them using Gemini 1.5 Flash, and returns 3 hyper-accurate jobs.
    """
    try:
        return await run_skill_fusion(payload)
    except Exception as e:
        logger.exception("Gemini Graph Fusion Error")
        raise HTTPException(status_code=500, detail="Failed to fuse skills and match roles.")

@router.post("/roadmap/generate", response_model=FinalRoadmap)
async def generate_final_roadmap(role_name: str):
    # Mock for Phase 3
    return FinalRoadmap(target_role=role_name, estimated_weeks=12, timeline=[])

# ==========================================
# NEW ROUTES: DYNAMIC SKILL ASSESSMENT
# ==========================================

@router.post("/assessment/generate", response_model=SkillAssessmentResponse)
async def create_dynamic_assessment(payload: SkillAssessmentRequest):
    """
    Generate 5 AI-powered skill verification questions based on psychometric traits (MOCK).
    """
    logger.info(f"Assessment request for %s - traits keys: %s", payload.user_id, list(payload.psychometric_traits.keys()))
    
    # Bulletproof mock response
    mock_questions = [
        {
            "id": "q1",
            "skill_category": "Analytical Thinking",
            "question_context": "You're debugging a spreadsheet where sales numbers don't add up. Which is first step?",
            "options": [
                {"option_id": "a", "text": "Check SUM formula syntax", "is_correct": True},
                {"option_id": "b", "text": "Recalculate all raw data", "is_correct": False},
                {"option_id": "c", "text": "Copy paste from new sheet", "is_correct": False},
                {"option_id": "d", "text": "Ask colleague to verify", "is_correct": False}
            ],
            "explanation": "Always verify formula first - it's the fastest fix in most cases."
        },
        {
            "id": "q2",
            "skill_category": "Problem Solving",
            "question_context": "Client calls angry - their order status shows 'shipped' but hasn't arrived. What's your opening response?",
            "options": [
                {"option_id": "a", "text": "I'll check tracking and call you back in 5 mins", "is_correct": True},
                {"option_id": "b", "text": "That's impossible, our system never lies", "is_correct": False},
                {"option_id": "c", "text": "Let me blame the courier partner", "is_correct": False},
                {"option_id": "d", "text": "Please wait on hold 30 mins", "is_correct": False}
            ],
            "explanation": "Own the problem and commit to a short, clear timeline to build trust."
        },
        # Add 3 more mock questions...
        {
            "id": "q3",
            "skill_category": "Technical Aptitude",
            "question_context": "Python script throws KeyError on production. Quickest debug?",
            "options": [
                {"option_id": "a", "text": "Print keys before access", "is_correct": True},
                {"option_id": "b", "text": "Restart server", "is_correct": False},
                {"option_id": "c", "text": "Google the error message", "is_correct": False},
                {"option_id": "d", "text": "Ask on Stack Overflow", "is_correct": False}
            ],
            "explanation": "Printing or logging keys reveals missing data immediately."
        },
        {
            "id": "q4",
            "skill_category": "Communication",
            "question_context": "Team meeting, boss asks for status update. You've hit blocker.",
            "options": [
                {"option_id": "a", "text": "State the blocker, give an ETA to resolve, and ask for help if needed", "is_correct": True},
                {"option_id": "b", "text": "Say 'almost done' to avoid looking bad", "is_correct": False},
                {"option_id": "c", "text": "Skip your turn and let others talk", "is_correct": False},
                {"option_id": "d", "text": "Complain about the blocker without proposed actions", "is_correct": False}
            ],
            "explanation": "Transparency combined with an ETA and a request for help shows maturity."
        },
        {
            "id": "q5",
            "skill_category": "Leadership",
            "question_context": "Intern asks a basic question you've answered 5 times. Your response?",
            "options": [
                {"option_id": "a", "text": "Create a 2-min doc and CC the team for future reference", "is_correct": True},
                {"option_id": "b", "text": "Answer again patiently", "is_correct": False},
                {"option_id": "c", "text": "Tell them to Google it", "is_correct": False},
                {"option_id": "d", "text": "Ignore", "is_correct": False}
            ],
            "explanation": "Scaling knowledge with a short reference reduces repeated questions and empowers the team."
        }
    ]
    
    return SkillAssessmentResponse(
        targeted_skills_tested=["Analytical Thinking", "Problem Solving", "Technical Aptitude", "Communication", "Leadership"],
        dynamic_assessment=mock_questions
    )

@router.post("/assessment/evaluate", response_model=SkillEvaluationResponse)
async def evaluate_assessment_answers(payload: EvaluationRequest):
    """
    Evaluate user's answers to skill assessment (MOCK - Bulletproof).
    """
    logger.info("Evaluation request for %s - %d answers", payload.user_id, len(payload.answers))
    
    # Bulletproof mock response
    mock_skills = [
        {"skill_name": "Data Analysis", "score": 92, "reasoning": "Excellent pattern recognition in scenario responses."},
        {"skill_name": "Problem Solving", "score": 87, "reasoning": "Quick, logical approach to blockers."},
        {"skill_name": "Technical Debugging", "score": 84, "reasoning": "Prioritizes systematic root cause analysis."},
        {"skill_name": "Client Communication", "score": 81, "reasoning": "Calm under pressure, commits to timelines."},
        {"skill_name": "Team Coordination", "score": 79, "reasoning": "Balances individual help with group efficiency."}
    ]
    
    return SkillEvaluationResponse(
        top_5_skills=mock_skills,
        assessment_summary=(
            "You demonstrate strong analytical and problem-solving capabilities with good communication under pressure. "
            "Your natural inclination toward systematic thinking positions you well for roles requiring structured problem solving."
        )
    )

@router.post("/identity/generate", response_model=IdentityStatementResponse)
async def create_identity_statement(payload: IdentityStatementRequest):
    """
    Generate a professional career identity statement based on user's 
    education, skills, interests, and psychometric profile.
    Uses Gemini 1.5 Pro for smart drafting.
    """
    try:
        return await generate_identity_statement(payload)
    except Exception as e:
        logger.exception("Identity Statement Generation Error")
        raise HTTPException(status_code=500, detail="Failed to generate identity statement.")
