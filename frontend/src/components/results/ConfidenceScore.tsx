import { motion } from 'framer-motion';
import type { RecommendationResult } from '../../types';

export function ConfidenceScore({ result }: { result: RecommendationResult }) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (result.confidenceScore / 100) * circumference;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
          <circle cx="36" cy="36" r="28" stroke="#E2E8F0" strokeWidth="8" fill="none" />
          <motion.circle
            cx="36" cy="36" r="28"
            stroke="url(#confidenceGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-sm font-black text-heading">{result.confidenceScore}%</div>
      </div>
      <div>
        <div className="font-black text-heading">Увереност: {result.confidence}</div>
        <p className="mt-1 text-sm leading-5 text-muted">По-ниска стойност означава повече средни стойности или несигурни условия.</p>
      </div>
    </div>
  );
}
