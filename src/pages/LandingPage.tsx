import Navbar from "@/components/layout/Navbar";
// import { HeroSection } from "@/components/layout/HeroSection";
import HeroSection from "@/components/layout/HeroSection";
import { Obesity } from "@/components/layout/Obesity";
import BMI from "@/components/layout/BMI";
import WeightLossSteps from "@/components/layout/Journey";
import StatisticsComponent from "@/components/layout/Know";
import Partner from "@/components/layout/Partner";
import TestimonialSection from "@/components/layout/Testimonial";
import PricingSection from "@/components/layout/Pricing";
import HealthJournalSection from "@/components/layout/Journal";
import FAQSection from "@/components/layout/FAQ";
import FooterSection from "@/components/layout/Footer";

export const LandingPage = () => {
  return (
    <>
      <div className="w-full shadow-2xs ">
        <Navbar />
      </div>
      <div className="overflow-y-auto w-full h-full bg-[#E6F9F6] py-2  mx-auto">
        <div id="hero">
          <HeroSection />
        </div>
        <div id="how-it-works">
          <WeightLossSteps />
        </div>
        <div id="our-story">
          <StatisticsComponent />
        </div>
        <div id="understanding-obesity">
          <Obesity />
        </div>
        <div>
          <BMI />
        </div>
        <div>
          <Partner />
        </div>
        <div>
          <TestimonialSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="insights-tips">
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
