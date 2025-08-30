import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TestimonialSection = () => {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      text: t('testimonial.testimonials.testimonial1'),
      name: t('testimonial.names.name1'),
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      text: t('testimonial.testimonials.testimonial2'),
      name: t('testimonial.names.name2'),
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c1af?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      text: t('testimonial.testimonials.testimonial3'),
      name: t('testimonial.names.name3'),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const 
  prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const StarRating = () => (
    <div className="flex justify-center items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-6 h-6 fill-teal-600 text-teal-600" />
      ))}
    </div>
  );

  const NavigationButton = ({ direction = "", onClick = () => {}, className = "" }) => (
    <button
      onClick={onClick}
      className={`p-3 bg-stone-50 rounded-full border border-zinc-300 hover:bg-stone-100 transition-colors duration-200 ${className}`}
      aria-label={`${direction} testimonial`}
    >
      {direction === 'previous' ? (
        <ChevronLeft className="w-4 h-4 text-black" />
      ) : (
        <ChevronRight className="w-4 h-4 text-black" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-emerald-50 py-8 px-4 sm:py-12 sm:px-6 lg:py-20 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white rounded-3xl shadow-lg border-0">
          <CardContent className="p-8 sm:p-12 lg:p-14">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sora leading-tight">
                <span className="text-zinc-800">{t('testimonial.title')} </span>
                <span className="text-teal-600">{t('testimonial.titleHighlight')}</span>
              </h2>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex justify-center items-center gap-16">
              <NavigationButton direction="previous" onClick={prevTestimonial} />
              
              <div className="flex-1 max-w-4xl">
                <div className="flex flex-col items-center gap-8">
                  <StarRating />
                  
                  <blockquote className="text-center text-zinc-800 text-xl font-bold font-sora leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        className="w-full h-full object-cover" 
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                      />
                    </div>
                    <p className="text-zinc-800 text-base font-bold font-manrope">
                      -- {testimonials[currentTestimonial].name}
                    </p>
                  </div>
                </div>
              </div>
              
              <NavigationButton direction="next" onClick={nextTestimonial} />
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden">
              <div className="flex flex-col items-center gap-8">
                <StarRating />
                
                <blockquote className="text-center text-zinc-800 text-lg sm:text-xl font-bold font-sora leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      className="w-full h-full object-cover" 
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                    />
                  </div>
                  <p className="text-zinc-800 text-base font-bold font-manrope">
                    -- {testimonials[currentTestimonial].name}
                  </p>
                </div>
                
                {/* Mobile Navigation */}
                <div className="flex items-center gap-6 mt-4">
                  <NavigationButton direction="previous" onClick={prevTestimonial} />
                  <NavigationButton direction="next" onClick={nextTestimonial} />
                </div>
                
                {/* Pagination Dots */}
                <div className="flex gap-2 mt-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentTestimonial ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialSection;