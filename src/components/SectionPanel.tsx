import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactNode } from 'react';
import VerticalNavigation from './VerticalNavigation';
import LanguageSwitcher from './LanguageSwitcher';

interface SectionPanelProps {
  backgroundImage: string;
  onBack: () => void;
  onNavigate: (section: string) => void;
  children: ReactNode;
}

const SectionPanel = ({ backgroundImage, onBack, onNavigate, children }: SectionPanelProps) => {
  const { isRtl } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex"
    >
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
        <div className="section-overlay" />
      </div>

      {/* Left nav (desktop) */}
      <div className="hidden md:flex flex-col justify-between relative z-10 w-64 py-10 shrink-0">
        <div className="flex-1 flex flex-col justify-center pl-8 rtl:pl-0 rtl:pr-8">
          <VerticalNavigation onNavigate={onNavigate} activeSection="" />
        </div>
        <div className="flex justify-center pb-2">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden absolute top-6 left-6 rtl:left-auto rtl:right-6 z-20">
        <MobileNavInSection onNavigate={onNavigate} onBack={onBack} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 md:px-16 lg:px-24 py-12">
        {children}
      </div>
    </motion.div>
  );
};

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const MobileNavInSection = ({ onNavigate, onBack }: { onNavigate: (s: string) => void; onBack: () => void }) => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const items = ['about', 'services', 'whyUs', 'vision', 'projects', 'faq', 'contact'];

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-foreground">
        <Menu size={24} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/98 flex flex-col items-center justify-center gap-6"
          >
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-foreground">
              <X size={24} />
            </button>
            {items.map((item) => (
              <button
                key={item}
                onClick={() => { setOpen(false); onNavigate(item); }}
                className="text-2xl font-heading font-semibold text-muted-foreground hover:text-primary transition-colors tracking-wider uppercase"
              >
                {t(item)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionPanel;
