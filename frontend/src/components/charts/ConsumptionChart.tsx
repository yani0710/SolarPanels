import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RecommendationResult } from '../../types';

export function ConsumptionChart({ result }: { result: RecommendationResult }) {
  const data = [
    { name: 'Ден', kWh: result.dayConsumptionKwh },
    { name: 'Вечер', kWh: result.eveningConsumptionKwh },
    { name: 'Месечно / 10', kWh: Math.round(result.monthlyConsumptionKwh / 10) }
  ];
  return (
    <div className="card h-72 min-w-0 p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-black text-heading">Потребление</h3>
        <span className="rounded-lg border border-energy/30 bg-amber-100 px-2 py-1 text-xs font-bold text-energy">kWh</span>
      </div>
      <ResponsiveContainer width="100%" height="86%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748B' }} width={38} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, color: '#0F172A' }} />
          <Bar dataKey="kWh" fill="#16A34A" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
