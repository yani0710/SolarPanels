import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function WarningsList({ warnings }: { warnings: string[] }) {
  if (!warnings.length) {
    return <div className="rounded-[1.3rem] border border-mint/25 bg-mint/10 p-4 text-sm font-semibold text-slate-100"><CheckCircle2 className="mr-2 inline text-mint" size={18} />Няма силни предупреждения при въведените условия.</div>;
  }
  return (
    <div className="space-y-2">
      {warnings.map((warning, index) => (
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} key={warning} className="flex gap-3 rounded-[1.3rem] border border-warning/30 bg-warning/10 p-4 text-sm leading-6 text-amber-50">
          <AlertTriangle className="mt-0.5 shrink-0 text-warning" size={18} />{warning}
        </motion.div>
      ))}
    </div>
  );
}
