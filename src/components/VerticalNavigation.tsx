import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface VerticalNavigationProps {
  onNavigate: (section: string) => void;
  /** When true, shows Home as first item (for use inside section panels) */
  showHome?: boolean;
}

const navItems = [
  { key: 'about', label: 'about' },
  { key: 'services', label: 'services' },
  { key: 'whyUs', label: 'whyUs' },
  { key: 'vision', label: 'vision' },
  { key: 'projects', label: 'projects' },
  { key: 'faq', label: 'faq' },
  { key: 'contact', label: 'contact' },
];

const VerticalNavigation = ({ onNavigate, showHome = false }: VerticalNavigationProps) => {
  const { t } = useLanguage();

  const items = showHome ? [{ key: 'home', label: 'home' }, ...navItems] : navItems;

  return (
    <motion.nav
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="flex flex-col gap-1 relative"
    >
      <div className="gold-line-vertical absolute left-0 rtl:left-auto rtl:right-0 top-0 h-full opacity-30" />
      {items.map((item, i) => (
        <motion.button
          key={item.key}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
          onClick={() => onNavigate(item.key)}
          className="group flex items-center gap-3 px-4 py-2.5 text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors duration-300 text-left rtl:text-right"
        >
          <span className="w-6 h-px bg-muted-foreground group-hover:bg-primary group-hover:w-10 transition-all duration-300" />
          <span className="font-heading text-xs font-medium">{t(item.label)}</span>
        </motion.button>
      ))}
    </motion.nav>
  );
};

export default VerticalNavigation;
