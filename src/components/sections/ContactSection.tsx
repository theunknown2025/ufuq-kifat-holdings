import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import SectionPanel from '@/components/SectionPanel';
import sectionBg from '@/assets/section-contact.jpg';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const WHATSAPP_E164 = '447429007272';
const WHATSAPP_DISPLAY = '+447429007272';
const CONTACT_EMAIL = 'info@ufugkifatalmutahida.com';

const ContactSection = ({ onBack, onNavigate }: { onBack: () => void; onNavigate: (s: string) => void }) => {
  const { t } = useLanguage();

  return (
    <SectionPanel backgroundImage={sectionBg} onBack={onBack} onNavigate={onNavigate}>
      <div className="max-w-5xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="text-4xl md:text-6xl font-heading font-bold tracking-tight text-foreground mb-12">
          {t('contact')}
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.form initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-2 block">{t('name')}</label>
              <input className="w-full bg-card/50 border border-border rounded px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-2 block">{t('email')}</label>
              <input type="email" className="w-full bg-card/50 border border-border rounded px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-2 block">{t('message')}</label>
              <textarea rows={5} className="w-full bg-card/50 border border-border rounded px-4 py-3 text-foreground text-sm focus:border-primary focus:outline-none transition-colors resize-none" />
            </div>
            <button type="submit" className="bg-primary text-primary-foreground px-8 py-3 rounded text-sm font-heading font-semibold tracking-widest uppercase hover:bg-gold-light transition-colors">
              {t('send')}
            </button>
          </motion.form>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-8">
            <div className="flex items-start gap-4">
              <Phone size={20} className="text-primary mt-1" />
              <div>
                <h4 className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-1">{t('phone')}</h4>
                <p className="text-foreground">+966 54 502 6624</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={20} className="text-primary mt-1" />
              <div>
                <h4 className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-1">{t('email')}</h4>
                <p className="text-foreground">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary transition-colors">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MessageCircle size={20} className="text-primary mt-1" />
              <div>
                <h4 className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-1">{t('whatsapp')}</h4>
                <p className="text-foreground">
                  <a
                    href={`https://wa.me/${WHATSAPP_E164}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <h4 className="text-xs font-heading tracking-widest uppercase text-muted-foreground mb-1">{t('address')}</h4>
                <p className="text-foreground">{t('addressVal')}</p>
              </div>
            </div>
            <div className="rounded overflow-hidden border border-border h-48 mt-4">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463876.0684!2d46.5423!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh!5e0!3m2!1sen!2ssa!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" />
            </div>
          </motion.div>
        </div>
      </div>
    </SectionPanel>
  );
};

export default ContactSection;
