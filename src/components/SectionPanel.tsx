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

      {/* Layout: Nav | Content | Logo - same as main section */}
      <div className="relative z-10 flex-1 flex rtl:flex-row-reverse min-h-0">
        {/* Left nav (desktop) */}
        <div className="hidden md:flex flex-col justify-between w-64 py-10 shrink-0">
          <div className="flex-1 flex flex-col justify-center pl-8 rtl:pl-0 rtl:pr-8">
            <VerticalNavigation onNavigate={onNavigate} showHome />
          </div>
          <div className="flex justify-center pb-2">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden absolute top-6 left-6 rtl:left-auto rtl:right-6 z-20">
          <MobileNavInSection onNavigate={onNavigate} onBack={onBack} />
        </div>

        {/* Center: Content */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 md:px-16 lg:px-24 py-12 min-w-0 flex flex-col items-center">
          {/* Mobile: logo at top when desktop logo is hidden */}
          <div className="md:hidden flex justify-center mb-6">
            <img src="/logo.png" alt="UFUG Kifat" className="h-16 object-contain" />
          </div>
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Right: Logo - big and visible, same as main section */}
        <div className="hidden md:flex flex-col justify-center items-center w-72 xl:w-80 py-10 pr-8 rtl:pr-0 rtl:pl-8 shrink-0">
          <img src="/logo.png" alt="UFUG Kifat" className="h-40 lg:h-52 xl:h-60 object-contain drop-shadow-lg" />
        </div>
      </div>
    </motion.div>
  );
};

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const MobileNavInSection = ({ onNavigate, onBack }: { onNavigate: (s: string) => void; onBack: () => void }) => {
  const [open, setOpen] = useState(false);
  const { t, isRtl } = useLanguage();
  const items = ['home', 'about', 'services', 'whyUs', 'vision', 'projects', 'faq', 'contact'];

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-foreground" aria-label="Open menu">
        <Menu size={24} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
          >
            {/* Dim background + frosted glass panel */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

            <div className="relative mx-auto w-[92%] max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-8 flex flex-col items-center justify-center gap-6">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-6 right-6 rtl:right-auto rtl:left-6 text-foreground"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
              <button
                onClick={() => { setOpen(false); onBack(); }}
                className="absolute top-6 left-6 rtl:left-auto rtl:right-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={t('back')}
              >
                {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                <span className="text-sm font-heading uppercase tracking-wider">{t('back')}</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SectionPanel;
