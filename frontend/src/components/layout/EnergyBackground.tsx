import { motion } from 'framer-motion';

export function EnergyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02050a]" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(53,229,139,.095),transparent_34%),linear-gradient(245deg,rgba(56,189,248,.08),transparent_31%),linear-gradient(135deg,#02050a_0%,#07111d_52%,#0b1724_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(164,231,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(164,231,255,.18)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,5,10,.12),transparent_35%,rgba(2,5,10,.78)_100%)]" />
      <motion.div
        className="absolute left-[-18%] top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-cyan/10 to-transparent blur-xl"
        animate={{ x: ['0%', '410%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#02050a] via-[#02050a]/72 to-transparent" />
    </div>
  );
}
