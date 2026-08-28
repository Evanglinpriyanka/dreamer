"use client";

import CareerHero from "@/components/CareerHero";
import CareerFeatures from "@/components/CareerFeatures";
import CareerProcess from "@/components/CareerProcess";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();

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
              Start with a clearer understanding of your strengths, then turn
              that insight into a practical next step.
            </p>
            <Button
              size="lg"
              variant="hero"
              onClick={() => router.push("/signup")}
              className="text-lg px-8 py-4"
            >
              Start Your Journey Now
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
