import os
import json
from groq import Groq

# --- CONFIGURATION ---
# PASTE YOUR KEY HERE
API_KEY = os.getenv("GROQ_API_KEY")



client = Groq(api_key=API_KEY)
os.makedirs("career_database", exist_ok=True)

# --- THE "FLAWLESS MASTER" SYSTEM PROMPT ---
system_prompt = """
You are the Chief Talent Officer and NCS Data Architect for India (2026).
Your goal is to create the 'Ultimate Career Profile' for a specific job role.

STRICT RULES & EDGE CASES:
1. ZERO COLLEGES: Do not mention any specific university or college.
2. THE 4 PERSONAS: You MUST map the journey for all 4 distinct personas (First Stepper, Choice Maker, Future Builder, U-Turn).
3. SKILLS > DEGREES: Ensure the 'Problem Solver/U-Turn' pathway relies purely on skills and portfolios.
4. EXACT STANDARDS: Provide realistic NCO codes, Indian salary metrics, and actionable weekly roadmaps.

Output ONLY valid JSON matching this EXACT MASTER SCHEMA:
{
  "identity": {
    "role_title": "Standard Industry Title",
    "alternate_titles": ["Title1", "Title2"],
    "nco_code_official": "String (Exact NCO-2015 code, or 'Pending Update')",
    "sector": "String (e.g., 'Agriculture & Allied Sciences')",
    "sub_sector": "String"
  },
  "ncs_standard_definition": {
    "description_short": "2-sentence elevator pitch.",
    "description_detailed": "Comprehensive day-to-day reality.",
    "official_min_education": "String (e.g., '12th Pass' or 'B.Tech')"
  },
  "persona_pathways": {
    "first_stepper": {
      "description": "Standard route for a high school student.",
      "target_exams": ["Exam 1 (e.g., ICAR AIEEA)"],
      "target_degrees": ["Degree 1 (e.g., B.Sc Agriculture)"]
    },
    "choice_maker": {
      "description": "Has a generic degree, needs a bridge.",
      "acceptable_base_degrees": ["Degree A"],
      "certifications_or_bridge_needed": ["Cert 1", "Cert 2"]
    },
    "future_builder": {
      "description": "Already in the sector, looking to advance.",
      "prerequisite_experience": "String (e.g., 2 years as Junior Analyst)",
      "advanced_skills_to_learn": ["Skill X"]
    },
    "problem_solver_uturn": {
      "description": "Switching from an unrelated field. No degree required.",
      "is_u_turn_possible": true,
      "survival_skills_needed": ["Skill 1", "Skill 2"],
      "portfolio_proof_required": ["Project Type 1"]
    }
  },
  "skills_matrix": {
    "technical": {
        "languages": ["Java", "Python", "N/A"],
        "frameworks": ["React", "Django", "N/A"],
        "tools": ["Git", "Docker", "QGIS"],
        "core_concepts": ["Data Structures", "Soil Analysis"]
    },
    "soft_skills": ["Skill1", "Skill2"]
  },
  "career_insights": {
    "progression": {
        "entry_level": "Job Title (0-2 yrs)",
        "mid_level": "Job Title (3-5 yrs)",
        "senior_level": "Job Title (5+ yrs)"
    },
    "work_environment": {
        "remote_possibility": "High/Medium/Low",
        "stress_level": "High/Medium/Low"
    },
    "salary_india": {
        "fresher_avg": "INR X-Y LPA",
        "mid_senior_avg": "INR X-Y LPA"
    }
  },
  "roadmap": [
    {
      "phase": 1,
      "title": "The Fundamentals",
      "topics": ["Topic A", "Topic B"],
      "duration_weeks": 4,
      "resources_keywords": ["NCERT", "Official Docs"]
    },
    {
      "phase": 2,
      "title": "Core Competency",
      "topics": ["Topic C", "Topic D"],
      "duration_weeks": 8,
      "resources_keywords": ["Udemy", "Coursera"]
    },
    {
      "phase": 3,
      "title": "Capstone & Portfolio",
      "topics": ["Build a Full Project", "Deploy"],
      "duration_weeks": 4,
      "resources_keywords": ["GitHub", "Kaggle"]
    }
  ]
}
"""

# --- 1. READ THE TARGET LIST ---
# To go sector-by-sector, ensure your target_roles.txt is grouped by Sector!
try:
    with open("target_roles.txt", "r") as f:
        roles = [line.strip() for line in f if line.strip()]
except FileNotFoundError:
    print("❌ ERROR: Could not find 'target_roles.txt'. Please check the file name!")
    exit()

print(f"🚀 Starting IMMACULATE PRODUCTION RUN for {len(roles)} roles...\n")

# --- 2. THE GENERATOR LOOP ---
for role in roles:
    print(f"⚡ Extracting Complete Ecosystem Data for: {role}...")
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate the Flawless Master profile for: {role}. Ensure Indian context and strict Persona pathways."}
            ],
            temperature=0.1, # Extremely low for strict JSON compliance
            response_format={"type": "json_object"}
        )
        
        job_data = json.loads(completion.choices[0].message.content)
        
        # Safe filename fix
        safe_filename = role.replace(' ', '_').replace('/', '-').lower() + ".json"
        filepath = os.path.join("career_database", safe_filename)
        
        with open(filepath, "w") as outfile:
            json.dump(job_data, outfile, indent=2)
            
        print(f"   ✅ Saved Flawless Profile: {filepath}")

    except json.JSONDecodeError as e:
        print(f"   ❌ AI returned invalid JSON. Skipping {role} to maintain zero-error database. Error: {e}")
    except Exception as e:
        print(f"   ❌ Failed for {role}: {e}")

print("\n🎉 BATCH COMPLETED. Your Master Database is secure and formatted.")