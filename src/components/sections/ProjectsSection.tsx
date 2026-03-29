import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-projects.jpg';

const ProjectsSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-3xl mx-auto flex flex-col justify-center min-h-[40vh]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-8"
        >
          {t('projects')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {t('projectsComingSoon')}
        </motion.p>
      </div>
    </SectionPanel>
  );
};

export default ProjectsSection;
