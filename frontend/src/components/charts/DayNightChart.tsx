import { useRef, useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RecommendationResult } from '../../types';

export function DayNightChart({ result }: { result: RecommendationResult }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="card min-w-0 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-heading">Дневно срещу вечерно</h3>
        <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-solar">split</span>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '300px' }}>
        {width > 0 && (
          <ResponsiveContainer width={width} height={300}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie data={result.chartData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={width < 400 ? 30 : 50} outerRadius={width < 400 ? 60 : 90} paddingAngle={2}>
                <Cell fill="#16A34A" />
                <Cell fill="#F59E0B" />
              </Pie>
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#0F172A' }} />
              <Legend verticalAlign="bottom" height={20} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
