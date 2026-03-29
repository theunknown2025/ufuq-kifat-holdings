import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-projects.jpg';
import { X } from 'lucide-react';

const PROJECT_FILES = [
  'Reaslisation 1.jpeg',
  'Reaslisation 2.jpeg',
  'Reaslisation 3.jpeg',
  'Reaslisation 4.jpeg',
  'Reaslisation 5.jpeg',
  'Reaslisation 6.jpeg',
  'Reaslisation 7.jpeg',
  'Reaslisation 8.jpeg',
  'Reaslisation 9.jpeg',
  'Reaslisation 11.jpeg',
] as const;

const projectsMeta = [
  { dateEn: 'September 2019', dateAr: 'سبتمبر 2019' },
  { dateEn: 'April 2020', dateAr: 'أبريل 2020' },
  { dateEn: 'November 2020', dateAr: 'نوفمبر 2020' },
  { dateEn: 'February 2021', dateAr: 'فبراير 2021' },
  { dateEn: 'July 2021', dateAr: 'يوليو 2021' },
  { dateEn: 'January 2022', dateAr: 'يناير 2022' },
  { dateEn: 'August 2022', dateAr: 'أغسطس 2022' },
  { dateEn: 'May 2023', dateAr: 'مايو 2023' },
  { dateEn: 'October 2023', dateAr: 'أكتوبر 2023' },
  { dateEn: 'December 2024', dateAr: 'ديسمبر 2024' },
] as const;

const projectsData = PROJECT_FILES.map((file, i) => ({
  img: `/images/Projects/${encodeURIComponent(file)}`,
  ...projectsMeta[i],
}));

const projectLabel = (index: number, lang: 'ar' | 'en') =>
  lang === 'ar' ? `مشروع (${index + 1})` : `Project (${index + 1})`;

const ProjectsSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { lang, t } = useLanguage();
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-12">
          {t('projects')}
        </motion.h1>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {projectsData.map((p, i) => (
            <motion.div key={p.img} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }} className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded" onClick={() => setLightbox(i)}>
              <img src={p.img} alt={projectLabel(i, lang)} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-foreground font-heading font-semibold">{projectLabel(i, lang)}</h3>
                <p className="text-primary text-sm">{lang === 'ar' ? p.dateAr : p.dateEn}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background/95 flex flex-col items-center justify-center p-8 gap-4" onClick={() => setLightbox(null)}>
            <button type="button" className="absolute top-6 right-6 text-muted-foreground hover:text-foreground" onClick={() => setLightbox(null)}><X size={28} /></button>
            <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} src={projectsData[lightbox].img} alt={projectLabel(lightbox, lang)} className="max-w-full max-h-[75vh] object-contain rounded" />
            <p className="text-center text-foreground font-heading font-semibold">{projectLabel(lightbox, lang)}</p>
            <p className="text-center text-primary text-sm">
              {lang === 'ar' ? projectsData[lightbox].dateAr : projectsData[lightbox].dateEn}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionPanel>
  );
};

export default ProjectsSection;
