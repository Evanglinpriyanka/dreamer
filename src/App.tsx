import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonaSelection from "./pages/PersonaSelection";
import PotentialPrism from "./pages/PotentialPrism";
import SkillSelector from "./pages/SkillSelector";
import GoalDeclaration from "./pages/GoalDeclaration";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/persona-selection" element={<PersonaSelection />} />
          <Route path="/potential-prism" element={<PotentialPrism />} />
          <Route path="/skill-selector" element={<SkillSelector />} />
          <Route path="/goal-declaration" element={<GoalDeclaration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap/:careerType" element={<Roadmap />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
