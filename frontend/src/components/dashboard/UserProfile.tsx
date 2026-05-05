import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getSavedSystems } from '../../api/savedSystems';
import { getSavedAppliances, addCustomAppliance } from '../../api/appliances';
import { useAuth } from '../../context/AuthContext';
import type { SavedSystem } from '../../types';
import type { CustomAppliance } from '../../api/appliances';

export function UserProfile({ isOpen, onClose, onNewAppliance }: { isOpen: boolean; onClose: () => void; onNewAppliance: () => void }) {
  const { user, logout } = useAuth();
  const [systems, setSystems] = useState<SavedSystem[]>([]);
  const [appliances, setAppliances] = useState<CustomAppliance[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Other', wattage: '', hoursPerDay: '', daysPerMonth: '' });

  useEffect(() => {
    if (isOpen && user) loadData();
  }, [isOpen, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [systemsData, appliancesData] = await Promise.all([getSavedSystems(), getSavedAppliances()]);
      setSystems(systemsData);
      setAppliances(appliancesData);
    } catch (err) {
      console.error('Failed to load profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.wattage || !formData.hoursPerDay || !formData.daysPerMonth) return;
    try {
      await addCustomAppliance({
        name: formData.name, category: formData.category,
        wattage: parseFloat(formData.wattage), hoursPerDay: parseFloat(formData.hoursPerDay),
        daysPerMonth: parseFloat(formData.daysPerMonth), count: 1, usageTime: 'variable',
        seasonality: 'year-round', isCritical: false, certainty: 'approximate'
      });
      setFormData({ name: '', category: 'Other', wattage: '', hoursPerDay: '', daysPerMonth: '' });
      setShowAddForm(false);
      loadData();
      onNewAppliance();
    } catch (err) {
      console.error('Failed to add appliance:', err);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-auto border-l border-border bg-white text-heading shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-border bg-white/95 backdrop-blur-xl">
              <div className="flex items-center justify-between p-4">
                <h2 className="text-xl font-black text-heading">Мой профил</h2>
                <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="border-t border-border px-4 py-3 text-sm">
                <div className="font-bold text-energy">{user.name}</div>
                <div className="text-xs text-muted">{user.email}</div>
              </div>
            </div>

            <div className="space-y-6 p-4">
              {/* Saved Systems */}
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-lg font-black text-heading">
                  Запазени системи ({systems.length})
                </h3>
                {loading ? (
                  <div className="text-sm text-muted">Зареждане...</div>
                ) : systems.length === 0 ? (
                  <div className="card p-3 text-sm text-muted">Няма запазени системи. Направете оценка и я запазете.</div>
                ) : (
                  <div className="space-y-2">
                    {systems.map((system) => (
                      <div key={system.id} className="rounded-xl border border-border bg-slate-50 p-3">
                        <div className="font-bold text-heading">{system.title}</div>
                        <div className="mt-1 text-xs text-muted">{new Date(system.createdAt).toLocaleDateString('bg-BG')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Custom Appliances */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-lg font-black text-heading">
                    Мои уреди ({appliances.length})
                  </h3>
                  <button onClick={() => setShowAddForm(!showAddForm)} className="inline-flex items-center gap-1 rounded-xl bg-green-100 px-2.5 py-1.5 text-xs font-bold text-energy hover:bg-green-200 transition cursor-pointer">
                    <Plus size={14} /> Добави
                  </button>
                </div>

                {showAddForm && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddAppliance}
                    className="mb-4 space-y-2 rounded-2xl border border-green-200 bg-green-50 p-3"
                  >
                    <input type="text" placeholder="Название (напр. Фризер)" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field h-9 text-sm" required />
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field h-9 text-sm">
                      <option>Охлаждане</option><option>Отопление</option><option>Готвене</option><option>Осветление</option><option>Други</option>
                    </select>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" placeholder="Вати" value={formData.wattage} onChange={(e) => setFormData({ ...formData, wattage: e.target.value })} className="input-field h-9 text-sm" required />
                      <input type="number" placeholder="Часа/ден" value={formData.hoursPerDay} onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })} className="input-field h-9 text-sm" required />
                      <input type="number" placeholder="Дни/месец" value={formData.daysPerMonth} onChange={(e) => setFormData({ ...formData, daysPerMonth: e.target.value })} className="input-field h-9 text-sm" required />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 rounded-xl bg-energy py-1.5 text-xs font-bold text-white cursor-pointer">Запази</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 rounded-xl border border-border bg-white py-1.5 text-xs font-bold text-heading cursor-pointer">Отмени</button>
                    </div>
                  </motion.form>
                )}

                {appliances.length === 0 ? (
                  <div className="card p-3 text-sm text-muted">Няма добавени уреди.</div>
                ) : (
                  <div className="space-y-2">
                    {appliances.map((appliance) => (
                      <div key={appliance.id} className="rounded-xl border border-border bg-slate-50 p-3">
                        <div className="font-bold text-heading">{appliance.name}</div>
                        <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-muted">
                          <span>{appliance.wattage}W</span>
                          <span>{appliance.hoursPerDay}h/ден</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 border-t border-border bg-white/95 p-4 backdrop-blur-xl">
              <button
                onClick={() => { logout(); onClose(); }}
                className="btn-secondary w-full"
              >
                <LogOut size={16} /> Изход
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
