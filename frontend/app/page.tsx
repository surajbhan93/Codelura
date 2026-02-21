import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import ImageFeatureSection from "@/components/home/ImageFeatureSection";
import ServicesSection from "@/components/home/ServicesSection";
import UseCases from "@/components/home/UseCases";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <ImageFeatureSection />
      <ServicesSection />
      <UseCases />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
