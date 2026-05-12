import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

type Warning = string | { bg: string; en: string };

export function WarningsList({ warnings }: { warnings: Warning[] }) {
  const { t, language } = useLanguage();
  if (!warnings.length) {
    return (
      <div className="rounded-2xl border border-energy/30 bg-amber-50 p-4 text-sm font-semibold text-energy">
        <CheckCircle2 className="mr-2 inline text-energy" size={18} />
        {t('Results', 'No strong warnings for the entered conditions.')}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {warnings.map((warning, index) => {
        const text = typeof warning === 'string' ? warning : warning[language];
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            key={index}
            className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
          >
            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={18} />
            {text}
          </motion.div>
        );
      })}
    </div>
  );
}
