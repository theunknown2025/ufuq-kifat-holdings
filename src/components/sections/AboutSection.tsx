import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-about.jpg';

const AboutSection = ({ onBack }: { onBack: () => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack}>
      <div className="max-w-4xl mx-auto flex flex-col justify-center min-h-[60vh]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '4rem' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-primary mb-8"
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-foreground mb-8"
        >
          {t('aboutTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl"
        >
          {t('aboutText')}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="h-px bg-gradient-to-r from-primary/50 to-transparent mt-12"
        />
      </div>
    </SectionPanel>
  );
};

export default AboutSection;
