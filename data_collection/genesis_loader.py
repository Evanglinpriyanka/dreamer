import json
import os
from neo4j import GraphDatabase

# --- CONFIGURATION ---
# Ensure these match your Neo4j Desktop settings
URI = "bolt://localhost:7687"
USERNAME = "neo4j"
PASSWORD = "password123"  # <--- REPLACE WITH YOUR PASSWORD

# Connect to Neo4j
try:
    driver = GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD))
    driver.verify_connectivity()
    print("✅ Connected to Neo4j successfully!")
except Exception as e:
    print(f"❌ Could not connect to Neo4j: {e}")
    print("   (Did you start the 'roles' database in Neo4j Desktop?)")
    exit()

def load_career_data(tx, job_data):
    # This Cypher query handles the Deeply Nested JSON structure
    query = """
    // 1. Create the Main Career Node (Identity)
    MERGE (job:Role {title: $data.identity.role_title})
    SET job.nco_code = $data.identity.nco_code_official,
        job.sector = $data.identity.sector,
        job.sub_sector = $data.identity.sub_sector,
        job.description = $data.definitions.description_short,
        job.govt_description = $data.definitions.ncs_occupation_standard.description,
        job.salary_fresher = $data.career_path.salary_insights.fresher_avg,
        job.market_demand = $data.career_path.salary_insights.market_demand,
        job.work_stress = $data.career_path.work_environment.stress_level

    // 2. Link Technical Skills (Categorized)
    
    // Languages (e.g., Python)
    FOREACH (skill IN $data.skills_matrix.technical.languages | 
        MERGE (s:Skill {name: skill})
        SET s.category = 'Language', s.type = 'Technical'
        MERGE (job)-[:REQUIRES_SKILL {priority: 'High'}]->(s)
    )

    // Frameworks (e.g., React)
    FOREACH (skill IN $data.skills_matrix.technical.frameworks | 
        MERGE (s:Skill {name: skill})
        SET s.category = 'Framework', s.type = 'Technical'
        MERGE (job)-[:REQUIRES_SKILL {priority: 'High'}]->(s)
    )

    // Tools (e.g., Docker, Git)
    FOREACH (skill IN $data.skills_matrix.technical.tools | 
        MERGE (s:Skill {name: skill})
        SET s.category = 'Tool', s.type = 'Technical'
        MERGE (job)-[:REQUIRES_SKILL {priority: 'Medium'}]->(s)
    )

    // Core Concepts (e.g., System Design)
    FOREACH (skill IN $data.skills_matrix.technical.core_concepts | 
        MERGE (s:Skill {name: skill})
        SET s.category = 'Concept', s.type = 'Technical'
        MERGE (job)-[:REQUIRES_SKILL {priority: 'Critical'}]->(s)
    )

    // 3. Link Soft Skills
    FOREACH (skill IN $data.skills_matrix.soft_skills | 
        MERGE (s:Skill {name: skill})
        SET s.type = 'Soft'
        MERGE (job)-[:REQUIRES_SKILL]->(s)
    )

    // 4. Link Education (Degrees)
    FOREACH (degree IN $data.education_requirements.degrees_preferred | 
        MERGE (d:Degree {name: degree})
        MERGE (job)-[:REQUIRES_DEGREE]->(d)
    )

    // 5. Build the Roadmap (Phases)
    FOREACH (phase IN $data.roadmap | 
        // Create a unique Phase node for this specific job
        MERGE (p:RoadmapPhase {
            id: $data.identity.role_title + '_Phase_' + toString(phase.phase)
        })
        SET p.title = phase.title,
            p.order = phase.phase,
            p.duration_weeks = phase.duration_weeks,
            p.topics = phase.topics,
            p.resources = phase.resources_keywords
        
        MERGE (job)-[:HAS_ROADMAP_PHASE {order: phase.phase}]->(p)
    )
    """
    
    # We pass the entire JSON object as a parameter named 'data'
    tx.run(query, data=job_data)

# --- THE LOADER LOOP ---
folder_path = "career_database"

if not os.path.exists(folder_path):
    print(f"❌ Error: Folder '{folder_path}' not found. Run genesis_generator.py first!")
    exit()

# IMPORTANT: connect to the specific 'roles' database
try:
    with driver.session() as session:
        files = [f for f in os.listdir(folder_path) if f.endswith(".json")]
        
        if not files:
            print("⚠️  No JSON files found in 'career_database'. Did you run the generator?")
            exit()
            
        print(f"🚀 Loading {len(files)} detailed profiles into 'roles' DB...\n")

        for filename in files:
            filepath = os.path.join(folder_path, filename)
            with open(filepath, "r") as f:
                try:
                    job_data = json.load(f)
                    
                    # Check if file is empty or valid
                    if not job_data:
                        print(f"   ⚠️  Skipping empty file: {filename}")
                        continue
                        
                    session.execute_write(load_career_data, job_data)
                    print(f"   ✅ Loaded: {job_data['identity']['role_title']}")
                    
                except Exception as e:
                    print(f"   ❌ Failed to load {filename}: {e}")

except Exception as e:
    print(f"❌ Session Error: {e}")
    print("   (Ensure database 'roles' is STARTING/ACTIVE in Neo4j Desktop)")

driver.close()
print("\n🎉 Database Injection Complete! Your Knowledge Graph is live.")