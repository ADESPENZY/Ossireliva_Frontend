import { StorySection } from "@/sections/homeSection/StorySection";
import { HeroSection } from "../sections/homeSection/HeroSection";
import DifferentSection from "@/sections/homeSection/DifferentSection";
import BenefitsSection from "@/sections/homeSection/BenefitsSection";
import { TestimonialSection } from "@/sections/homeSection/TestimonialSection";
import TrustSection from "@/sections/homeSection/TrustSection";
import CtaSection from "@/sections/homeSection/CtaSection";
import { FeaturedTestimonialsSection } from "@/sections/homeSection/FeaturedTestimonialsSection";

export function HomePage() {
  return (
    <div className="bg-black font-body">
      <HeroSection />
      <FeaturedTestimonialsSection/>
      <DifferentSection/>
      <StorySection/>
      <BenefitsSection/>
      <TestimonialSection/>
      <TrustSection/>
      <CtaSection/>
    </div>
  );
}
