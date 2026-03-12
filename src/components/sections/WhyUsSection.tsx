import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-whyus.jpg';

const pillars = [
  { key: 'cost', descKey: 'costDesc' },
  { key: 'time', descKey: 'timeDesc' },
  { key: 'quality', descKey: 'qualityDesc' },
];

const WhyUsSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-6xl mx-auto flex flex-col justify-center min-h-[60vh]">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-16">
          {t('whyUs')}
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {pillars.map((p, i) => (
            <motion.div key={p.key} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }} className="text-center">
              <h2 className="text-5xl md:text-7xl font-heading font-black text-gradient-gold mb-4">{t(p.key)}</h2>
              <div className="gold-line w-16 mx-auto mb-6" />
              <p className="text-muted-foreground leading-relaxed">{t(p.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionPanel>
  );
};

export default WhyUsSection;
