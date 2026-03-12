import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  BrainCircuit, Sparkles, MonitorSmartphone, 
  Users, ShoppingBag, BookOpen, Calculator, FlaskConical, ArrowRight
} from "lucide-react";

// --- STRICT SCHEMAS ---
interface VerifiedSkills {
  math_aptitude: number;
  math_affinity: number;
  english_communication: number;
  science_logic: number;
  digital_creation: number;
  system_troubleshooting: number;
  community_management: number;
  commercial_hustle: number;
}

export default function SkillSelector() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isFusing, setIsFusing] = useState(false);

  // The Silent Skill Tracker
  const [skills, setSkills] = useState<VerifiedSkills>({
    math_aptitude: 50, math_affinity: 50,
    english_communication: 50, science_logic: 50,
    digital_creation: 0, system_troubleshooting: 0,
    community_management: 0, commercial_hustle: 0
  });

  // --- ACADEMIC STATE ---
  const [mathApt, setMathApt] = useState<number | null>(null);
  const [mathAff, setMathAff] = useState<number | null>(null);

  // --- HOBBY CHECKLIST STATE ---
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const hobbies = [
    { id: "video", label: "Edit videos or design posts for social media", icon: <MonitorSmartphone className="w-5 h-5" />, impact: { digital_creation: 80 } },
    { id: "discord", label: "Manage a Discord server or gaming clan", icon: <Users className="w-5 h-5" />, impact: { community_management: 80, english_communication: 20 } },
    { id: "fix", label: "Fix the family Wi-Fi, PC, or phone issues", icon: <BrainCircuit className="w-5 h-5" />, impact: { system_troubleshooting: 80, science_logic: 20 } },
    { id: "sell", label: "Buy, sell, or trade things online (shoes, game items)", icon: <ShoppingBag className="w-5 h-5" />, impact: { commercial_hustle: 80, math_aptitude: 10 } },
    { id: "write", label: "Write stories, blogs, or deep-dive threads", icon: <BookOpen className="w-5 h-5" />, impact: { english_communication: 80, digital_creation: 20 } },
  ];

  const toggleHobby = (id: string) => {
    setSelectedHobbies(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (mathApt === null || mathAff === null) {
        toast.error("Please answer both questions to proceed.");
        return;
      }
      setSkills(prev => ({ ...prev, math_aptitude: mathApt, math_affinity: mathAff }));
      setStep(2);
    } else if (step === 2) {
      finalizeFusion();
    }
  };

  const finalizeFusion = async () => {
    setIsFusing(true);

    // Calculate final hobby impacts
    const finalSkills = { ...skills };
    selectedHobbies.forEach(hobbyId => {
      const hobby = hobbies.find(h => h.id === hobbyId);
      if (hobby) {
        Object.entries(hobby.impact).forEach(([key, value]) => {
          finalSkills[key as keyof VerifiedSkills] += value;
        });
      }
    });

    try {
      // 1. Retrieve the Psychological Profile from Part A
      const storedDraft = localStorage.getItem("prismDraft");
      if (!storedDraft) throw new Error("No Psychometric Profile found. Please retake Part A.");
      const psychometric_draft = JSON.parse(storedDraft);

      // 2. Fire the Graph Fusion Payload to Gemini
      const response = await fetch("http://127.0.0.1:8000/api/v1/roles/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "student_mvp_01",
          psychometric_draft: psychometric_draft,
          verified_skills: finalSkills
        }),
      });

      if (!response.ok) throw new Error("Graph Fusion failed");
      const data = await response.json();

      // 3. Save the final jobs and route to Dashboard
      localStorage.setItem("finalMatches", JSON.stringify(data.matches));
      toast.success("Graph Fusion Complete!");
      navigate("/dashboard");

    } catch (error) {
      console.error("Fusion Error:", error);
      toast.error("Failed to connect to the Graph Engine.");
      setIsFusing(false);
    }
  };

  if (isFusing) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-mono text-emerald-500">
        <BrainCircuit className="w-20 h-20 animate-pulse mb-8" />
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">Initiating Graph Fusion...</h2>
        <p className="text-emerald-500/70 font-medium text-center max-w-md mb-8">
          Gemini 1.5 Flash is mapping your psychology and verified skills against 10,000+ Indian career nodes.
        </p>
        <Progress value={100} className="w-full max-w-md h-1 bg-slate-800 [&>div]:bg-emerald-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Capability Check {step} of 2
          </span>
        </div>
        <Progress value={step * 50} className="h-2 bg-slate-200" />
      </div>

      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white rounded-[2rem] overflow-hidden p-8 md:p-10">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">The Academic Matrix</h2>
            <p className="text-slate-500 mb-8">Let's separate your actual ability from your interests.</p>

            <div className="space-y-8">
              {/* APTITUDE ROW */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-slate-700">How would you rate your Math Aptitude?</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "I struggle to pass", val: 20 },
                    { label: "I get average marks", val: 50 },
                    { label: "I easily score high", val: 90 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setMathApt(opt.val)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${mathApt === opt.val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-blue-200 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AFFINITY ROW */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-slate-700">How much do you actually enjoy Math?</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "I absolutely hate it", val: 10 },
                    { label: "I tolerate it", val: 50 },
                    { label: "I love the challenge", val: 90 }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setMathAff(opt.val)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${mathAff === opt.val ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 hover:border-purple-200 text-slate-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">The "Proof of Action" Tracker</h2>
            <p className="text-slate-500 mb-8">Select any activities you do naturally in your free time.</p>

            <div className="space-y-3">
              {hobbies.map((hobby) => {
                const isSelected = selectedHobbies.includes(hobby.id);
                return (
                  <button
                    key={hobby.id}
                    onClick={() => toggleHobby(hobby.id)}
                    className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                  >
                    <div className={`p-3 rounded-xl mr-4 transition-colors ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                      {hobby.icon}
                    </div>
                    <span className={`text-base md:text-lg font-medium ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                      {hobby.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleNextStep}
            className="bg-black hover:bg-slate-800 text-white px-8 py-4 rounded-xl flex items-center gap-2 font-medium transition-all active:scale-95"
          >
            {step === 1 ? "Next Step" : "Initialize Fusion"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
}