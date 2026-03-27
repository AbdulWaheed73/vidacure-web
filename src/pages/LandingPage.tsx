import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { SEOHead } from "@/components/seo/SEOHead";
import { createOrganizationSchema } from "@/utils/structuredData";
import { useTranslation } from "react-i18next";
// import { PromoBanner } from "@/components/dashboard";

export const LandingPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Handle hash navigation when page loads or hash changes
  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      // Small delay to ensure the page is rendered
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  // Organization schema for home page
  const organizationSchema = createOrganizationSchema(t('seo.defaultDescription'));

  return (
    <>
      <SEOHead
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        keywords={t('seo.defaultKeywords')}
        structuredData={organizationSchema}
      />
      <div className="w-full shadow-2xs fixed z-50">
        <Navbar />
      </div>
      <div className="overflow-y-auto overflow-x-hidden w-full h-full bg-[#E6F9F6] py-2 mx-auto pt-11 lg:pt-0">
        <div className="pt-16 lg:pt-20">
          {/* <PromoBanner /> */}
        </div>
        <div id="hero" className="scroll-mt-16">
          <HeroSection />
        </div>
        <div id="the-treatment" className="scroll-mt-16">
          <WeightLossSteps />
        </div>
        <div>
          <StatisticsComponent />
        </div>
        <div id="bmi" className="scroll-mt-16">
          <BMI />
        </div>
        <div id="about-us" >
          <Partner />
        </div>
        <div id="pricing" >
          <PricingSection />
        </div>
        <div id="education" >
          <HealthJournalSection />
        </div>
        <div id="faq" className="scroll-mt-16">
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
