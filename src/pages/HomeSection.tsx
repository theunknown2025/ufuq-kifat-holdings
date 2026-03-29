import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
const HomeSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage="/hero-canopy.png" onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[60vh]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '3rem' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-primary mb-6"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xs font-heading tracking-[0.3em] uppercase text-primary mb-4"
        >
          {t('companyName')}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1] mb-6"
        >
          {t('heroTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
        >
          {t('heroSub')}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="h-px bg-gradient-to-r from-primary/50 to-transparent mt-12"
        />
      </div>
    </SectionPanel>
  );
};

export default HomeSection;

