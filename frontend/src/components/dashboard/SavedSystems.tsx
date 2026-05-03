import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteSystem, listSystems } from '../../api/savedSystems';
import { useAuth } from '../../context/AuthContext';
import type { SavedSystem } from '../../types';

export function SavedSystems({ refreshKey = 0 }: { refreshKey?: number }) {
  const { user } = useAuth();
  const [systems, setSystems] = useState<SavedSystem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    listSystems().then((data) => setSystems(data.systems)).finally(() => setLoading(false));
  }, [user, refreshKey]);

  if (!user) return <div className="mobile-card border border-white/12 bg-white/[0.055] p-5 text-muted shadow-card backdrop-blur-xl sm:p-6">Влез в профил, за да виждаш запазени сценарии и история.</div>;
  if (loading) return <div className="mobile-card border border-white/12 bg-white/[0.055] p-5 text-white shadow-card backdrop-blur-xl sm:p-6">Зареждаме сценариите...</div>;
  if (!systems.length) return <div className="mobile-card border border-white/12 bg-white/[0.055] p-5 text-muted shadow-card backdrop-blur-xl sm:p-6">Още няма запазени системи. Направи оценка и натисни “Запази”.</div>;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {systems.map((system) => (
        <div key={system.id} className="mobile-card min-w-0 border border-white/12 bg-white/[0.055] p-4 shadow-card backdrop-blur-xl sm:p-5">
          <div className="flex justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-black text-white">{system.title}</h3>
              <p className="text-sm text-muted">{new Date(system.createdAt).toLocaleDateString('bg-BG')}</p>
            </div>
            <button className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-white/12 bg-white/8 text-slate-300" onClick={async () => { await deleteSystem(system.id); setSystems((items) => items.filter((item) => item.id !== system.id)); }} aria-label="Изтрий">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <b className="rounded-md bg-white/8 p-2 text-center text-white">{system.resultSnapshot.recommendedPowerRange ?? system.recommendedPowerKwp} kWp</b>
            <b className="rounded-md bg-white/8 p-2 text-center text-white">{system.resultSnapshot.recommendedBatteryRange ?? system.recommendedBatteryKwh} kWh</b>
            <b className="rounded-md bg-mint/12 p-2 text-center text-mint">{system.systemType}</b>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{system.advice}</p>
        </div>
      ))}
    </div>
  );
}
