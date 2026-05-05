import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { ResultsDashboard } from './ResultsDashboard';
import type { SavedSystem } from '../../types';

interface Props {
  system: SavedSystem | null;
  onClose: () => void;
}

export function SystemDetailModal({ system, onClose }: Props) {
  return (
    <AnimatePresence>
      {system && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Full-screen modal */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[70] flex flex-col bg-surface overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 border-b border-border bg-white px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-7xl items-center gap-4">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer shrink-0"
                >
                  <ArrowLeft size={16} /> Назад
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-black text-heading">{system.title}</h2>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={12} />
                    <span>Запазена на {new Date(system.createdAt).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  aria-label="Затвори"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-7xl">
                <ResultsDashboard
                  result={system.resultSnapshot}
                  title={system.title}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
