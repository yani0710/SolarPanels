import { useRef, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RecommendationResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export function ConsumptionChart({ result }: { result: RecommendationResult }) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const data = [
    { name: t('Results', 'Monthly'), kWh: result.monthlyConsumptionKwh }
  ];

  return (
    <div className="card min-w-0 p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-black text-heading">{t('Results', 'Consumption')}</h3>
        <span className="rounded-lg border border-energy/30 bg-amber-100 px-2 py-1 text-xs font-bold text-energy">kWh</span>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: '300px' }}>
        {width > 0 && (
          <ResponsiveContainer width={width} height={300}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: width < 400 ? -10 : 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: width < 400 ? 10 : 11, fill: '#64748B' }} interval={0} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: width < 400 ? 10 : 11, fill: '#64748B' }} width={width < 400 ? 30 : 38} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#0F172A' }} />
              <Bar dataKey="kWh" fill="#16A34A" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
