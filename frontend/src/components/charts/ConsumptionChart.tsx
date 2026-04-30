import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RecommendationResult } from '../../types';

export function ConsumptionChart({ result }: { result: RecommendationResult }) {
  const data = [
    { name: 'Ден', kWh: result.dayConsumptionKwh },
    { name: 'Вечер', kWh: result.eveningConsumptionKwh },
    { name: 'Месечно / 10', kWh: Math.round(result.monthlyConsumptionKwh / 10) }
  ];

  return (
    <div className="mobile-card h-72 min-w-0 border border-white/12 bg-white/[0.055] p-3 shadow-card backdrop-blur-xl sm:p-4">
      <h3 className="mb-2 font-black text-white">Потребление</h3>
      <ResponsiveContainer width="100%" height="86%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.10)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9fb7c9' }} interval={0} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9fb7c9' }} width={38} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#071a2f', border: '1px solid rgba(255,255,255,.14)', borderRadius: 16, color: '#fff' }} />
          <Bar dataKey="kWh" fill="#35e58b" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
