import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-vision.jpg';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqData = [
  { qEn: 'What services does UFUG Kifat offer?', qAr: 'ما هي الخدمات التي تقدمها أفق كفات؟', aEn: 'We offer comprehensive engineering services including consulting, infrastructure design, project management, construction supervision, technical studies, and facilities management.', aAr: 'نقدم خدمات هندسية شاملة تشمل الاستشارات وتصميم البنية التحتية وإدارة المشاريع والإشراف على البناء والدراسات الفنية وإدارة المرافق.' },
  { qEn: 'Where are you located?', qAr: 'أين يقع مقركم؟', aEn: 'Our headquarters are in Riyadh, Saudi Arabia, with project operations across the region.', aAr: 'يقع مقرنا الرئيسي في الرياض، المملكة العربية السعودية، مع عمليات مشاريع في جميع أنحاء المنطقة.' },
  { qEn: 'How can I request a project consultation?', qAr: 'كيف يمكنني طلب استشارة لمشروع؟', aEn: 'You can reach out through our contact form or call us directly. Our team will schedule a consultation within 48 hours.', aAr: 'يمكنكم التواصل معنا من خلال نموذج الاتصال أو الاتصال بنا مباشرة. سيقوم فريقنا بجدولة استشارة خلال 48 ساعة.' },
  { qEn: 'What industries do you serve?', qAr: 'ما هي القطاعات التي تخدمونها؟', aEn: 'We serve transportation, energy, water, commercial, residential, and industrial sectors with specialized engineering solutions.', aAr: 'نخدم قطاعات النقل والطاقة والمياه والتجارة والسكن والصناعة بحلول هندسية متخصصة.' },
];

const FAQSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t, lang } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-12">
          {t('faq')}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded bg-card/50 backdrop-blur-sm px-6 gold-border-glow">
                <AccordionTrigger className="text-foreground font-heading text-sm md:text-base font-medium hover:text-primary transition-colors">
                  {lang === 'ar' ? item.qAr : item.qEn}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {lang === 'ar' ? item.aAr : item.aEn}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </SectionPanel>
  );
};

export default FAQSection;
