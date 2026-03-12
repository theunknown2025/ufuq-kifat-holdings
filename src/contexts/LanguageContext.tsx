import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: { en: string; ar: string };
}

const translations: Translations = {
  companyName: { en: 'Ufuq Kifat Almutahida', ar: 'أفق كفات المتحدة' },
  heroTitle: { en: 'Engineering Excellence for Sustainable Solutions', ar: 'التميز الهندسي لحلول مستدامة' },
  heroSub: { en: 'Delivering integrated engineering solutions that combine precision, efficiency, and innovation.', ar: 'تقديم حلول هندسية متكاملة تجمع بين الدقة والكفاءة والابتكار.' },
  about: { en: 'About Us', ar: 'نبذة عنا' },
  services: { en: 'Services', ar: 'خدماتنا' },
  whyUs: { en: 'Why Us', ar: 'لماذا نحن' },
  vision: { en: 'Vision', ar: 'رؤيتنا' },
  projects: { en: 'Projects', ar: 'مشاريعنا' },
  faq: { en: 'FAQ', ar: 'الأسئلة الشائعة' },
  contact: { en: 'Contact Us', ar: 'تواصل معنا' },
  mission: { en: 'Mission', ar: 'المهمة' },
  values: { en: 'Values', ar: 'القيم' },
  process: { en: 'Process', ar: 'العملية' },
  aboutTitle: { en: 'About Us', ar: 'نبذة تعريفية' },
  aboutText: { en: 'Ufuq Kifat is a leading engineering company committed to delivering innovative and sustainable engineering solutions for our clients. We are distinguished by a team of specialized engineers with extensive experience and advanced technical capabilities, enabling us to provide integrated, high-quality engineering services across various sectors.', ar: 'أفق كفات هي شركة رائدة في مجال الهندسة، ملتزمة بتقديم حلول هندسية مبتكرة ومستدامة لعملائنا. نتميز بفريق من المهندسين المتخصصين ذوي الخبرة الواسعة والقدرات التقنية المتقدمة، مما يمكننا من تقديم خدمات هندسية متكاملة وعالية الجودة عبر مختلف القطاعات.' },
  cost: { en: 'Cost', ar: 'التكلفة' },
  time: { en: 'Time', ar: 'الزمن' },
  quality: { en: 'Quality', ar: 'الجودة' },
  costDesc: { en: 'Optimized engineering solutions that maximize value while maintaining the highest standards.', ar: 'حلول هندسية محسّنة تعظّم القيمة مع الحفاظ على أعلى المعايير.' },
  timeDesc: { en: 'Efficient project delivery with precise scheduling and milestone management.', ar: 'تسليم المشاريع بكفاءة مع جدولة دقيقة وإدارة مراحل محكمة.' },
  qualityDesc: { en: 'Uncompromising quality standards backed by rigorous testing and certification.', ar: 'معايير جودة لا هوادة فيها مدعومة باختبارات وشهادات صارمة.' },
  engConsulting: { en: 'Engineering Consulting', ar: 'الاستشارات الهندسية' },
  infraDesign: { en: 'Infrastructure Design', ar: 'تصميم البنية التحتية' },
  projMgmt: { en: 'Project Management', ar: 'إدارة المشاريع' },
  constSuper: { en: 'Construction Supervision', ar: 'الإشراف على البناء' },
  techStudies: { en: 'Technical Studies', ar: 'الدراسات الفنية' },
  engConsultingDesc: { en: 'Expert guidance for complex engineering challenges across all project phases.', ar: 'إرشاد خبير للتحديات الهندسية المعقدة عبر جميع مراحل المشروع.' },
  infraDesignDesc: { en: 'Comprehensive infrastructure planning and design for sustainable development.', ar: 'تخطيط وتصميم شامل للبنية التحتية من أجل التنمية المستدامة.' },
  projMgmtDesc: { en: 'End-to-end project management ensuring on-time, on-budget delivery.', ar: 'إدارة مشاريع شاملة تضمن التسليم في الوقت المحدد وضمن الميزانية.' },
  constSuperDesc: { en: 'On-site supervision ensuring quality standards and safety compliance.', ar: 'إشراف ميداني يضمن معايير الجودة والامتثال للسلامة.' },
  techStudiesDesc: { en: 'In-depth technical analysis and feasibility studies for informed decisions.', ar: 'تحليل فني معمق ودراسات جدوى لاتخاذ قرارات مستنيرة.' },
  missionText: { en: 'To deliver engineering excellence that transforms communities and builds lasting infrastructure.', ar: 'تقديم التميز الهندسي الذي يحوّل المجتمعات ويبني بنية تحتية دائمة.' },
  visionText: { en: 'To be the leading engineering firm in the region, recognized for innovation and sustainability.', ar: 'أن نكون الشركة الهندسية الرائدة في المنطقة، معروفة بالابتكار والاستدامة.' },
  valuesText: { en: 'Integrity, innovation, excellence, and commitment to our clients and communities.', ar: 'النزاهة والابتكار والتميز والالتزام تجاه عملائنا ومجتمعاتنا.' },
  processText: { en: 'A systematic approach from concept to completion, ensuring quality at every stage.', ar: 'نهج منظم من المفهوم إلى الإنجاز، يضمن الجودة في كل مرحلة.' },
  back: { en: 'Back', ar: 'رجوع' },
  name: { en: 'Name', ar: 'الاسم' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  message: { en: 'Message', ar: 'الرسالة' },
  send: { en: 'Send', ar: 'إرسال' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  address: { en: 'Address', ar: 'العنوان' },
  addressVal: { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>('en');

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  }, []);

  const t = useCallback((key: string) => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
