import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.3 }}
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-primary transition-colors duration-300"
      >
        <Settings size={20} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-3 flex gap-3 bg-card border border-border rounded px-4 py-2"
          >
            <button
              onClick={() => { setLang('en'); setOpen(false); }}
              className={`text-xs font-heading tracking-wider uppercase transition-colors ${lang === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              English
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => { setLang('ar'); setOpen(false); }}
              className={`text-xs font-heading-ar tracking-wider transition-colors ${lang === 'ar' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              العربية
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
