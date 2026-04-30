import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RecommendationResult } from '../../types';

export function DayNightChart({ result }: { result: RecommendationResult }) {
  return (
    <div className="mobile-card h-72 min-w-0 border border-white/12 bg-white/[0.055] p-3 shadow-card backdrop-blur-xl sm:p-4">
      <h3 className="mb-2 font-black text-white">Дневно срещу вечерно</h3>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={result.chartData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="78%" paddingAngle={4}>
            <Cell fill="#35e58b" />
            <Cell fill="#facc15" />
          </Pie>
          <Tooltip contentStyle={{ background: '#071a2f', border: '1px solid rgba(255,255,255,.14)', borderRadius: 16, color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
