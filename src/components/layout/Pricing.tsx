import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Stethoscope, Pill, MessageCircle, ArrowRight } from 'lucide-react';

const PricingSection = () => {
  const features = [
    {
      icon: <Stethoscope className="w-6 h-6 text-teal-700" />,
      text: "Receive ongoing care from a board-certified doctor who creates your plan, manages your prescriptions, and safely guides your progress."
    },
    {
      icon: <Pill className="w-6 h-6 text-teal-700" />,
      text: "We manage the entire prescription process, with your approved medication delivered discreetly to your home from a certified pharmacy."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-teal-700" />,
      text: "Enjoy unlimited messaging with your personal care team for continuous support, coaching, and answers to all your questions."
    }
  ];

  const lifestyleFeatures = [
    "Initial Health Assessment",
    "Personalized Lifestyle Plan", 
    "Regular Medical Check-ins",
    "Unlimited Care Team Messaging",
    "Ongoing Progress Tracking",
    "Nutrition & Habit Coaching"
  ];

  const medicalFeatures = [
    "Initial Doctor Consultation",
    "Personalized Treatment Plan",
    "Regular Medical Check-ins", 
    "GLP-1 Medication Prescription",
    "Unlimited Care Team Messaging",
    "Ongoing Progress Tracking",
    "Nutrition & Habit Coaching",
    "Discreet Delivery Management"
  ];

  const PricingCard = ({ 
    title, 
    price, 
    currency, 
    description, 
    features, 
    buttonText, 
    isPrimary = false,
    badge
  }) => (
    <Card className={`${isPrimary ? 'bg-teal-800 text-white border-teal-700' : 'bg-white'} rounded-2xl shadow-lg h-full`}>
      <CardContent className="p-8 flex flex-col gap-8 h-full">
        <div className="flex flex-col gap-8">
          {/* Header with Badge */}
          <div className="pb-4 border-b border-opacity-30 border-gray-400">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              isPrimary 
                ? 'bg-gradient-to-r from-teal-600 to-teal-600 text-emerald-50' 
                : 'border border-gray-400 text-gray-800'
            }`}>
              {badge}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-8">
            <div className="flex items-baseline">
              <span className={`text-5xl font-bold font-sora ${isPrimary ? 'text-white' : 'text-gray-800'}`}>
                {price}
              </span>
              <span className={`text-2xl font-bold font-sora ml-2 ${isPrimary ? 'text-white' : 'text-gray-800'}`}>
                {currency}
              </span>
            </div>
            <p className={`text-xl font-bold font-sora ${isPrimary ? 'text-white' : 'text-gray-800'}`}>
              {description}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4">
            <p className={`font-bold font-manrope ${isPrimary ? 'text-emerald-50' : 'text-gray-800'}`}>
              Includes:
            </p>
            <div className="flex flex-col gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-6">
                  <Check className={`w-5 h-5 flex-shrink-0 ${isPrimary ? 'text-emerald-50' : 'text-gray-400'}`} />
                  <span className={`font-manrope ${isPrimary ? 'text-emerald-50' : 'text-gray-800'}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <button className={`w-full h-11 px-6 py-2.5 rounded-full flex items-center justify-center gap-2.5 font-semibold text-sm transition-colors duration-200 ${
            isPrimary 
              ? 'bg-white text-gray-800 hover:bg-gray-100' 
              : 'bg-emerald-50 text-gray-800 hover:bg-emerald-100'
          }`}>
            {buttonText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-emerald-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-20 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8">
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex gap-8">
            {/* Left Content */}
            <div className="flex-1 flex flex-col justify-start gap-16 pr-4 py-8">
              {/* Header */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <p className="text-teal-700 text-base font-medium font-manrope uppercase">
                    An Investment In Your Long-Term Health
                  </p>
                  <h2 className="text-4xl font-bold font-sora leading-10">
                    <span className="text-gray-800">Simple, </span>
                    <span className="text-teal-600">Transparent Pricing</span>
                  </h2>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-14">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                        {feature.icon}
                      </div>
                      <p className="text-teal-700 text-base font-manrope leading-snug flex-1">
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Cards */}
            <div className="flex-1">
              <PricingCard
                badge="Lifestyle Program Membership"
                price="795"
                currency="SEK/mo"
                description="Your access to expert coaching and support for a healthier lifestyle."
                features={lifestyleFeatures}
                buttonText="Get Started"
              />
            </div>

            <div className="flex-1">
              <PricingCard
                badge="Medical Program Membership"
                price="1495"
                currency="SEK/mo"
                description="Your all-in-one access to our medical team, coaching, and support."
                features={medicalFeatures}
                buttonText="Get Started"
                isPrimary={true}
              />
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="lg:hidden">
            {/* Header */}
            <div className="text-center mb-8 px-4">
              <p className="text-teal-700 text-base font-medium font-manrope uppercase mb-4">
                An Investment In Your Long-Term Health
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold font-sora leading-tight mb-6">
                <span className="text-gray-800">Simple, </span>
                <span className="text-teal-600">Transparent Pricing</span>
              </h2>
              <p className="text-teal-700 text-base font-manrope leading-snug">
                We believe in being completely open about the cost of our program. There are no hidden fees or long-term commitments. Your monthly membership gives you complete access to our medical team and the support you need to succeed on your journey.
              </p>
            </div>

            {/* Features */}
            <div className="mb-8 px-4">
              <div className="flex flex-col gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <p className="text-teal-700 text-base font-manrope leading-snug">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="flex flex-col gap-8 px-4">
              <PricingCard
                badge="Lifestyle Program Membership"
                price="795"
                currency="SEK/mo"
                description="Your access to expert coaching and support for a healthier lifestyle."
                features={lifestyleFeatures}
                buttonText="Get Started"
              />

              <PricingCard
                badge="Medical Program Membership"
                price="1495"
                currency="SEK/mo"
                description="Your all-in-one access to our medical team, coaching, and support."
                features={medicalFeatures}
                buttonText="Get Started"
                isPrimary={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;