import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import VerticalNavigation from './VerticalNavigation';
import LanguageSwitcher from './LanguageSwitcher';
import heroBg from '@/assets/hero-bridge.jpg';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const HeroSection = ({ onNavigate }: HeroSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img src={heroBg} alt="Engineering infrastructure" className="w-full h-full object-cover" />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />

      {/* Animated gold line at top */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-0 left-0 h-px bg-gradient-to-r from-primary via-primary/50 to-transparent z-20"
      />

      {/* Content grid */}
      <div className="relative z-10 h-full flex rtl:flex-row-reverse">
        {/* Left: Navigation */}
        <div className="hidden md:flex flex-col justify-center w-64 pl-8 rtl:pl-0 rtl:pr-8 shrink-0">
          <VerticalNavigation onNavigate={onNavigate} />
        </div>

        {/* Mobile nav button */}
        <div className="md:hidden absolute top-6 left-6 rtl:left-auto rtl:right-6 z-20">
          <MobileNav onNavigate={onNavigate} />
        </div>

        {/* Center: Hero content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 min-w-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '3rem' }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-px bg-primary mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xs font-heading tracking-[0.3em] uppercase text-primary mb-4"
            >
              {t('companyName')}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              {t('heroTitle')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              {t('heroSub')}
            </motion.p>
          </motion.div>
        </div>

        {/* Right: Logo - big and visible */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden md:flex flex-col justify-center items-center w-72 xl:w-80 pr-8 rtl:pr-0 rtl:pl-8 shrink-0"
        >
          <img src="/logo.png" alt="Ufuq Kifat" className="h-40 lg:h-52 xl:h-60 object-contain drop-shadow-lg" />
        </motion.div>
      </div>

      {/* Mobile: logo below content area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
      >
        <img src="/logo.png" alt="Ufuq Kifat" className="h-20 object-contain" />
      </motion.div>

      {/* Bottom center: Language switcher */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <LanguageSwitcher />
      </motion.div>

      {/* Bottom gold line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.5, delay: 1 }}
        className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-20"
      />
    </div>
  );
};

// Mobile navigation overlay
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const MobileNav = ({ onNavigate }: { onNavigate: (s: string) => void }) => {
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
            className="fixed inset-0 z-50 bg-background/98 flex flex-col items-center justify-center gap-6"
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

export default HeroSection;
