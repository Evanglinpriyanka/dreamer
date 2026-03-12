import CareerHero from "@/components/CareerHero";
import CareerFeatures from "@/components/CareerFeatures";
import CareerProcess from "@/components/CareerProcess";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <main>
        <CareerHero />
        <CareerFeatures />
        <CareerProcess />

        {/* CTA Section */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Discover Your Perfect Career?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students who've found their dream careers with
              CareerDreamer's AI-powered guidance.
            </p>
            {/* CTA Button removed as per user request */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
