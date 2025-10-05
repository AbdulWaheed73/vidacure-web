import Navbar from "@/components/layout/Navbar";
// import { HeroSection } from "@/components/layout/HeroSection";
import HeroSection from "@/components/layout/HeroSection";
import BMI from "@/components/layout/BMI";
import WeightLossSteps from "@/components/layout/Journey";
import StatisticsComponent from "@/components/layout/Know";
import Partner from "@/components/layout/Partner";
import PricingSection from "@/components/layout/Pricing";
import HealthJournalSection from "@/components/layout/Journal";
import FAQSection from "@/components/layout/FAQ";
import FooterSection from "@/components/layout/Footer";

export const LandingPage = () => {
  return (
    <>
      <div className="w-full shadow-2xs fixed z-50">
        <Navbar />
      </div>
      <div className="overflow-y-auto w-full h-full bg-[#E6F9F6] py-2  mx-auto">
        <div id="hero">
          <HeroSection />
        </div>
        <div id="the-treatment">
          <WeightLossSteps />
        </div>
        <div>
          <StatisticsComponent />
        </div>
        <div>
          <BMI />
        </div>
        <div id="about-us">
          <Partner />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="education">
          <HealthJournalSection />
        </div>
        <div id="faq">
          <FAQSection />
        </div>
        <div>
          <FooterSection />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
