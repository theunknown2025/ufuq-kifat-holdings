import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-projects.jpg';
import { X } from 'lucide-react';
import p1 from '@/assets/project-1.jpg';
import p2 from '@/assets/project-2.jpg';
import p3 from '@/assets/project-3.jpg';
import p4 from '@/assets/project-4.jpg';
import p5 from '@/assets/project-5.jpg';
import p6 from '@/assets/project-6.jpg';

const projectsData = [
  { img: p1, titleEn: 'Al-Wadi Dam', titleAr: 'سد الوادي', descEn: 'Hydroelectric infrastructure', descAr: 'بنية تحتية للطاقة الكهرومائية' },
  { img: p2, titleEn: 'Riyadh Tower', titleAr: 'برج الرياض', descEn: 'Commercial high-rise', descAr: 'مبنى تجاري شاهق' },
  { img: p3, titleEn: 'King Fahd Interchange', titleAr: 'تقاطع الملك فهد', descEn: 'Highway interchange', descAr: 'تقاطع طرق سريعة' },
  { img: p4, titleEn: 'Jubail Bridge', titleAr: 'جسر الجبيل', descEn: 'Steel bridge construction', descAr: 'بناء جسر فولاذي' },
  { img: p5, titleEn: 'Metro Line 3', titleAr: 'خط المترو 3', descEn: 'Underground transit', descAr: 'نقل تحت الأرض' },
  { img: p6, titleEn: 'Solar Grid Station', titleAr: 'محطة الشبكة الشمسية', descEn: 'Renewable energy', descAr: 'طاقة متجددة' },
];

const ProjectsSection = ({ onBack }: { onBack: () => void }) => {
  const { lang } = useLanguage();
  const { t } = useLanguage();
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack}>
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-12"
        >
          {t('projects')}
        </motion.h1>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {projectsData.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="break-inside-avoid group cursor-pointer relative overflow-hidden rounded"
              onClick={() => setLightbox(i)}
            >
              <img src={p.img} alt={lang === 'ar' ? p.titleAr : p.titleEn} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-foreground font-heading font-semibold">{lang === 'ar' ? p.titleAr : p.titleEn}</h3>
                <p className="text-primary text-sm">{lang === 'ar' ? p.descAr : p.descEn}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 flex items-center justify-center p-8"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-muted-foreground hover:text-foreground" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={projectsData[lightbox].img}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionPanel>
  );
};

export default ProjectsSection;
