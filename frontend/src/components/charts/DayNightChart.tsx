import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RecommendationResult } from '../../types';

export function DayNightChart({ result }: { result: RecommendationResult }) {
  return (
    <div className="card h-72 min-w-0 p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-black text-heading">Дневно срещу вечерно</h3>
        <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-solar">split</span>
      </div>
      <ResponsiveContainer width="100%" height="88%">
        <PieChart>
          <Pie data={result.chartData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="78%" paddingAngle={4}>
            <Cell fill="#16A34A" />
            <Cell fill="#F59E0B" />
          </Pie>
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#0F172A' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
