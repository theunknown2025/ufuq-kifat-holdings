import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactNode } from 'react';

interface SectionPanelProps {
  backgroundImage: string;
  onBack: () => void;
  children: ReactNode;
}

const SectionPanel = ({ backgroundImage, onBack, children }: SectionPanelProps) => {
  const { t, isRtl } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        <div className="section-overlay" />
      </div>

      <div className="relative z-10 flex items-center p-6 md:p-10">
        <motion.button
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
        >
          {isRtl ? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> : <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />}
          <span className="text-xs font-heading tracking-widest uppercase">{t('back')}</span>
        </motion.button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-6 md:px-16 lg:px-24 pb-12">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionPanel;
