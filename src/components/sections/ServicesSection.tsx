import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-services.jpg';
import { Compass, Building2, ClipboardList, HardHat, FileSearch } from 'lucide-react';

const services = [
  { icon: Compass, titleKey: 'engConsulting', descKey: 'engConsultingDesc' },
  { icon: Building2, titleKey: 'infraDesign', descKey: 'infraDesignDesc' },
  { icon: ClipboardList, titleKey: 'projMgmt', descKey: 'projMgmtDesc' },
  { icon: HardHat, titleKey: 'constSuper', descKey: 'constSuperDesc' },
  { icon: FileSearch, titleKey: 'techStudies', descKey: 'techStudiesDesc' },
];

const ServicesSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-12">
          {t('services')}
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div key={s.titleKey} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }} className="group border border-border rounded bg-card/50 backdrop-blur-sm p-8 gold-border-glow cursor-default">
              <s.icon size={28} className="text-primary mb-4" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-3">{t(s.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(s.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionPanel>
  );
};

export default ServicesSection;
