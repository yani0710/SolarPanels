import { motion } from 'framer-motion';

export function EnergyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: '#F8FAFC' }} aria-hidden="true">
      {/* Amber radial — top left (solar warmth) */}
      <div className="absolute -left-48 -top-48 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
      {/* Green radial — bottom right (energy) */}
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-green-100/60 blur-3xl" />
      {/* Sky radial — top right */}
      <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-sky-100/40 blur-3xl" />
      {/* Animated subtle overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-green-50/40"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
