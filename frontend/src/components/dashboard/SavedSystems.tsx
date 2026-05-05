import { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { deleteSystem, listSystems } from '../../api/savedSystems';
import { useAuth } from '../../context/AuthContext';
import { SystemDetailModal } from '../results/SystemDetailModal';
import type { SavedSystem } from '../../types';

export function SavedSystems({ refreshKey = 0 }: { refreshKey?: number }) {
  const { user } = useAuth();
  const [systems, setSystems] = useState<SavedSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<SavedSystem | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listSystems().then((data) => setSystems(data.systems)).finally(() => setLoading(false));
  }, [user, refreshKey]);

  if (!user) return <div className="card p-5 text-muted sm:p-6">Влез в профил, за да виждаш запазени сценарии и история.</div>;
  if (loading) return <div className="card p-5 text-muted sm:p-6">Зареждаме сценариите...</div>;
  if (!systems.length) return <div className="card p-5 text-muted sm:p-6">Още няма запазени системи. Направи оценка и натисни "Запази".</div>;

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        {systems.map((system) => (
          <div key={system.id} className="card min-w-0 p-4 sm:p-5">
            {/* Header */}
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-black text-heading">{system.title}</h3>
                <p className="text-sm text-muted">
                  {new Date(system.createdAt).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-slate-100 text-slate-500 hover:text-danger hover:border-red-200 transition cursor-pointer"
                onClick={async () => { await deleteSystem(system.id); setSystems((items) => items.filter((item) => item.id !== system.id)); }}
                aria-label="Изтрий"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-slate-100 p-2 text-center">
                <div className="font-black text-heading">{system.resultSnapshot.recommendedPowerRange ?? system.recommendedPowerKwp} kWp</div>
                <div className="text-xs text-muted">мощност</div>
              </div>
              <div className="rounded-xl bg-slate-100 p-2 text-center">
                <div className="font-black text-heading">{system.resultSnapshot.recommendedBatteryRange ?? system.recommendedBatteryKwh} kWh</div>
                <div className="text-xs text-muted">батерия</div>
              </div>
              <div className="rounded-xl bg-green-100 p-2 text-center">
                <div className="font-black capitalize text-energy">{system.systemType}</div>
                <div className="text-xs text-muted">тип</div>
              </div>
            </div>

            {/* Advice excerpt */}
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">{system.advice}</p>

            {/* View full analysis */}
            <button
              onClick={() => setSelectedSystem(system)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-slate-50 py-2.5 text-sm font-bold text-slate-700 hover:border-energy hover:bg-green-50 hover:text-energy transition cursor-pointer"
            >
              <Eye size={16} /> Виж пълен анализ
            </button>
          </div>
        ))}
      </div>

      <SystemDetailModal system={selectedSystem} onClose={() => setSelectedSystem(null)} />
    </>
  );
}
