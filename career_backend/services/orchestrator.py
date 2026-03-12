import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from models.schemas import (
    PrismCalculationRequest, UserDraft, CompleteFusionPayload, FusionResponse,
    SkillAssessmentRequest, SkillAssessmentResponse, EvaluationRequest, SkillEvaluationResponse,
    IdentityStatementRequest, IdentityStatementResponse
)

load_dotenv()

# ==========================================
# PHASE 1: GROQ (The Psychological Profiler)
# ==========================================
groq_llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile",
    temperature=0.4 
)
structured_groq = groq_llm.with_structured_output(UserDraft)

analysis_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite, highly empathetic career psychologist. 
    Analyze the user's 12-trait psychometric matrix.
    1. archetype_title: e.g., "The Empathetic Architect".
    2. psychological_profile: Write 4 empowering sentences validating their highest traits. Talk directly to them using "You". Do not mention specific jobs.
    3. hidden_potential: One unexpected strength based on their unique combination.
    4. work_environment: The culture they need to thrive.
    """),
    ("human", "Psychometric matrix: {scores}")
])

prism_chain = analysis_prompt | structured_groq

async def run_prism_orchestration(payload: PrismCalculationRequest) -> UserDraft:
    print(f"Executing Deep Psychological Synthesis for User: {payload.user_id}")
    return prism_chain.invoke({
        "scores": payload.final_scores.model_dump_json()
    })

# ==========================================
# PHASE 2: GEMINI (The Graph Fusion Engine)
# ==========================================
# We use Gemini 1.5 Flash because it is vastly superior at strict data mapping and routing
gemini_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro-latest",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.1 # Strict logic, no hallucination
)
structured_gemini = gemini_llm.with_structured_output(FusionResponse)

fusion_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an advanced AI Career Graph Database operating in the Indian Labor Market.
    You will receive a user's Psychometric Persona AND their Verified Hard Skills.
    
    YOUR DIRECTIVE:
    Run a simulated graph match. Find the intersection between who they are (Psychology) and what they can do (Skills).
    
    RULES:
    1. Output exactly 3 distinct Job Matches.
    2. The 'match_percentage' must be highly calculated based on the data provided (e.g., 94%).
    3. 'why_it_fits' MUST explicitly mention one psychometric trait AND one verified skill from the payload. (e.g., 'Your high Systems Thinking paired with your proven Digital Creation skills makes you a natural for UI/UX Design.')
    4. Ensure the jobs are realistic, modern roles relevant to the Indian market.
    """),
    ("human", """
    PSYCHOMETRIC PERSONA:
    {persona_data}
    
    VERIFIED SKILLS (0-100):
    {skills_data}
    
    Execute Graph Fusion and return 3 optimal matches.
    """)
])

fusion_chain = fusion_prompt | structured_gemini

async def run_skill_fusion(payload: CompleteFusionPayload) -> FusionResponse:
    print(f"Executing Gemini Graph Fusion for User: {payload.user_id}")
    return fusion_chain.invoke({
        "persona_data": payload.psychometric_draft.model_dump_json(),
        "skills_data": payload.verified_skills.model_dump_json()
    })

# ==========================================
# PHASE 3: GROQ (Dynamic Skill Assessment Generator)
# ==========================================
# Using Groq for fast question generation based on psychometric traits
groq_for_assessment = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile",
    temperature=0.7
)
structured_assessment = groq_for_assessment.with_structured_output(SkillAssessmentResponse)

skill_assessment_system_prompt = """You are an elite Technical Recruiter and Skill Evaluator AI.

Your objective is to ingest a user's Psychometric Profile (their natural cognitive traits) and dynamically generate a custom 5-question "Skill Verification Assessment" tailored specifically to their brain.

THE LOGIC PIPELINE:
1. Analyze the user's top psychometric traits.
2. Determine which 3-5 Hard Skills make the most sense to test for this specific user (e.g., If they have high Analytical IQ, test Data Logic/Coding. If they have high Empathy/Diplomacy, test Communication/Management).
3. Generate exactly 5 multiple-choice questions testing those specific skills.

RULES FOR THE QUESTIONS:
- Do NOT make them boring academic questions (e.g., "What is 2+2?").
- Make them "Proof of Action" micro-scenarios relevant to Indian students (e.g., Spotting an error in a spreadsheet, choosing the best response to an angry client, fixing a logical flaw in a schedule).
- Keep the 'question_context' under 40 words.
- Provide exactly 4 options per question. ONLY ONE option can be correct.
- Make the incorrect options plausible but definitively wrong.

CRITICAL JSON OUTPUT SCHEMA:
You must return your entire response in perfectly formatted JSON matching this exact structure. Do not include markdown formatting or conversational text outside the JSON.

{{
  "targeted_skills_tested": ["Skill 1", "Skill 2", "Skill 3"],
  "dynamic_assessment": [
    {{
      "id": "q1",
      "skill_category": "Name of the specific skill being tested (e.g., Data Logic)",
      "question_context": "The 40-word scenario-based question.",
      "options": [
        {{
          "option_id": "a",
          "text": "Option 1 text",
          "is_correct": true
        }},
        {{
          "option_id": "b",
          "text": "Option 2 text",
          "is_correct": false
        }},
        {{
          "option_id": "c",
          "text": "Option 3 text",
          "is_correct": false
        }},
        {{
          "option_id": "d",
          "text": "Option 4 text",
          "is_correct": false
        }}
      ],
      "explanation": "One short sentence explaining why the correct answer is right. (To be shown to the user at the end)."
    }}
  ]
}}"""

assessment_prompt = ChatPromptTemplate.from_messages([
    ("system", skill_assessment_system_prompt),
    ("human", "Psychometric Traits (scores 0-100): {traits}")
])

assessment_chain = assessment_prompt | structured_assessment

async def generate_dynamic_assessment(payload: SkillAssessmentRequest) -> SkillAssessmentResponse:
    """Generate 5 skill verification questions based on psychometric traits using Groq."""
    print(f"Generating Dynamic Skill Assessment for User: {payload.user_id}")
    
    # Get top traits for context
    traits = payload.psychometric_traits
    sorted_traits = sorted(traits.items(), key=lambda x: x[1], reverse=True)[:5]
    top_traits_str = ", ".join([f"{t[0]}: {t[1]}" for t in sorted_traits])
    
    return await assessment_chain.ainvoke({
        "traits": top_traits_str
    })

# ==========================================
# PHASE 4: GEMINI (Skill Evaluation & Identity Statement)
# ==========================================
gemini_for_evaluation = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-exp",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.3
)
structured_evaluation = gemini_for_evaluation.with_structured_output(SkillEvaluationResponse)

evaluation_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an elite Technical Recruiter. Analyze the user's answers to skill verification questions and their psychometric traits to identify their TOP 5 verified skills.

RULES:
1. Output exactly 5 skills in order of proficiency (highest first).
2. Each skill must have a score (0-100) based on their answers.
3. Provide a brief reasoning for why each skill is verified.
4. Write an assessment_summary (2 sentences) describing their overall capability profile.
"""),
    ("human", """
PSYCHOMETRIC TRAITS: {traits}
USER ANSWERS: {answers}

Analyze and return the top 5 verified skills with scores and reasoning.
""")
])

evaluation_chain = evaluation_prompt | structured_evaluation

async def evaluate_skill_answers(payload: EvaluationRequest) -> SkillEvaluationResponse:
    """Evaluate user answers and determine top 5 skills using Gemini."""
    print(f"Evaluating Skill Assessment for User: {payload.user_id}")
    
    traits_str = ", ".join([f"{k}: {v}" for k, v in payload.psychometric_traits.items()])
    answers_str = ", ".join([f"Q{a.question_id}: {a.selected_option_id}" for a in payload.answers])
    
    return await evaluation_chain.ainvoke({
        "traits": traits_str,
        "answers": answers_str
    })

# ==========================================
# PHASE 5: GEMINI (Identity Statement Generator)
# ==========================================
gemini_for_identity = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-exp",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7
)
structured_identity = gemini_for_identity.with_structured_output(IdentityStatementResponse)

identity_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a professional career statement generator. Create a compelling "Career Identity Statement" that combines the user's education, skills, interests, and psychological profile.

RULES:
1. Write in first person ("I am...", "By applying my knowledge...").
2. Naturally weave in the education, skills, and interests from the constraints.
3. Make it sound professional yet personal.
4. Keep it to 2-3 powerful paragraphs.
5. Do NOT list skills as bullet points - integrate them into flowing narrative.
6. The statement should be 150-200 words.
"""),
    ("human", """
Education: {education}
Skills: {skills}
Interests: {interests}

Psychometric Profile: {profile}

Generate a compelling career identity statement.
""")
])

identity_chain = identity_prompt | structured_identity

async def generate_identity_statement(payload: IdentityStatementRequest) -> IdentityStatementResponse:
    """Generate career identity statement using Gemini."""
    print(f"Generating Identity Statement for User: {payload.user_id}")
    
    return await identity_chain.ainvoke({
        "education": ", ".join(payload.constraints.education),
        "skills": ", ".join(payload.constraints.skills),
        "interests": ", ".join(payload.constraints.interests),
        "profile": payload.psychometric_profile
    })
