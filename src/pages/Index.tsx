import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import VisionSection from '@/components/sections/VisionSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import FAQSection from '@/components/sections/FAQSection';
import ContactSection from '@/components/sections/ContactSection';
import HomeSection from './HomeSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBack = () => setActiveSection(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section === 'home' ? null : section);
  };

  const sectionProps = { onBack: handleBack, onNavigate: handleNavigate };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background">
      <AnimatePresence mode="wait">
        {activeSection === null && <HomeSection key="home" {...sectionProps} />}
        {activeSection === 'about' && <AboutSection key="about" {...sectionProps} />}
        {activeSection === 'services' && <ServicesSection key="services" {...sectionProps} />}
        {activeSection === 'whyUs' && <WhyUsSection key="whyUs" {...sectionProps} />}
        {activeSection === 'vision' && <VisionSection key="vision" {...sectionProps} />}
        {activeSection === 'projects' && <ProjectsSection key="projects" {...sectionProps} />}
        {activeSection === 'faq' && <FAQSection key="faq" {...sectionProps} />}
        {activeSection === 'contact' && <ContactSection key="contact" {...sectionProps} />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
