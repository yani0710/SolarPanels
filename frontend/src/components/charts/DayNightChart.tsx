import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RecommendationResult } from '../../types';

export function DayNightChart({ result }: { result: RecommendationResult }) {
  return (
    <div className="mobile-card h-72 min-w-0 border border-white/12 bg-white/[0.055] p-3 shadow-card backdrop-blur-xl sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-black text-white">Дневно срещу вечерно</h3>
        <span className="rounded-md border border-solar/25 bg-solar/10 px-2 py-1 text-xs font-bold text-solar">split</span>
      </div>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={result.chartData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="78%" paddingAngle={4}>
            <Cell fill="#35e58b" />
            <Cell fill="#facc15" />
          </Pie>
          <Tooltip contentStyle={{ background: '#02050a', border: '1px solid rgba(255,255,255,.14)', borderRadius: 8, color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
