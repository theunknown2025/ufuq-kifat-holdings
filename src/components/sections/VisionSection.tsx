import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-vision.jpg';
import { Target, Eye, Heart, Workflow } from 'lucide-react';

const blocks = [
  { key: 'mission', icon: Target, descKey: 'missionText' },
  { key: 'vision', icon: Eye, descKey: 'visionText' },
  { key: 'values', icon: Heart, descKey: 'valuesText' },
  { key: 'process', icon: Workflow, descKey: 'processText' },
];

const VisionSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-5xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-12">
          {t('vision')}
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blocks.map((b, i) => (
            <motion.div key={b.key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }} className="border border-border rounded bg-card/50 backdrop-blur-sm p-8 gold-border-glow">
              <b.icon size={32} className="text-primary mb-4" />
              <h3 className="text-xl font-heading font-bold text-foreground mb-3 uppercase tracking-wider">{t(b.key)}</h3>
              <p className="text-muted-foreground leading-relaxed">{t(b.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionPanel>
  );
};

export default VisionSection;
