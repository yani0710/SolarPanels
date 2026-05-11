import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useAppContext();

  return (
    <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-card-md min-w-[260px] max-w-[90vw] ${
               toast.type === 'success'
                ? 'border-energy/30 bg-white text-heading'
                : 'border-red-200 bg-white text-heading'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 size={20} className="shrink-0 text-energy" />
              : <AlertCircle size={20} className="shrink-0 text-danger" />}
            <span className="flex-1 text-sm font-semibold">{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-muted hover:text-heading transition cursor-pointer"
              aria-label="Затвори"
            >
              <X size={14} />
            </button>
            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3.5, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-full ${toast.type === 'success' ? 'bg-energy' : 'bg-danger'}`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
