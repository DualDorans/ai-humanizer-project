import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}