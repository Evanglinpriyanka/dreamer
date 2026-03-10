from fastapi import APIRouter, HTTPException
from models.schemas import AssessmentPayload, DraftApprovalPayload, FinalRoadmap, UserDraft, PrismStepRequest, PrismStepResponse

# Initialize the router
router = APIRouter()

@router.post("/prism/step", response_model=PrismStepResponse)
async def next_prism_question(payload: PrismStepRequest):
    """
    The Adaptive Loop: Takes the user's chat history, passes it to Groq, 
    and returns either the NEXT question + visual tag, OR the final UserDraft.
    """
    history_length = len(payload.history)
    print(f"User is on question step: {history_length + 1} for {payload.persona}")

    # TODO: Connect to LangChain Groq Service here
    
    # MOCK LOGIC: If we have asked less than 5 questions, keep asking.
    if history_length < 5:
        return PrismStepResponse(
            is_complete=False,
            question_text="Do you find yourself drawn more to creative design or logical problem solving?",
            visual_tag="animation_brain_gears_vs_paint", # Frontend reads this and shows the animation
            final_draft=None
        )
    
    # MOCK LOGIC: If we hit 5 questions, the AI finishes and returns the Draft.
    else:
        print("Assessment complete. Generating psychological draft.")
        mock_draft = UserDraft(
            core_traits=["Analytical", "Visual Thinker"],
            hard_skills=["Basic Logic"],
            interests=["Design", "Technology"],
            constraints=["Prefers visual learning"]
        )
        return PrismStepResponse(
            is_complete=True,
            question_text=None,
            visual_tag=None,
            final_draft=mock_draft
        )

@router.post("/roles/match")
async def find_matching_roles(payload: DraftApprovalPayload):
    """
    Step 2: Takes the approved Draft, queries Neo4j via Gemini, 
    and returns the top 3 matching job roles.
    """
    print("Received approved draft. Querying Neo4j...")
    
    # TODO: Connect to LangChain Gemini + Neo4j Service here
    
    return {"status": "success", "matched_roles": ["Data Analyst", "Backend Developer", "Cloud Architect"]}

@router.post("/roadmap/generate", response_model=FinalRoadmap)
async def generate_final_roadmap(role_name: str, payload: DraftApprovalPayload):
    """
    Step 3: Computes the delta between the UserDraft and the Neo4j Gold Standard.
    Returns the chronological week-by-week JSON roadmap.
    """
    print(f"Generating roadmap for {role_name}")
    
    # TODO: Connect to LangChain Delta Computation here
    
    # Temporary mock response
    return FinalRoadmap(
        target_role=role_name,
        estimated_weeks=12,
        timeline=[
            {"week_number": 1, "focus_area": "Fundamentals", "action_items": ["Learn X", "Do Y"]}
        ]
    )