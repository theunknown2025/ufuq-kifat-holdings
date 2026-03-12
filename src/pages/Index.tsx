import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import VisionSection from '@/components/sections/VisionSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBack = () => setActiveSection(null);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <HeroSection onNavigate={setActiveSection} />
      <AnimatePresence mode="wait">
        {activeSection === 'about' && <AboutSection key="about" onBack={handleBack} />}
        {activeSection === 'services' && <ServicesSection key="services" onBack={handleBack} />}
        {activeSection === 'whyUs' && <WhyUsSection key="whyUs" onBack={handleBack} />}
        {activeSection === 'vision' && <VisionSection key="vision" onBack={handleBack} />}
        {activeSection === 'projects' && <ProjectsSection key="projects" onBack={handleBack} />}
        {activeSection === 'faq' && <FAQSection key="faq" onBack={handleBack} />}
        {activeSection === 'contact' && <ContactSection key="contact" onBack={handleBack} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
