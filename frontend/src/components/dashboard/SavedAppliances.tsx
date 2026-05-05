import { useAuth } from '../../context/AuthContext';

export function SavedAppliances() {
  const { user } = useAuth();
  return (
    <div className="card p-6">
      <h3 className="text-xl font-black text-heading">Собствени уреди</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        {user
          ? 'Добавянето през детайлната оценка е активно за профила ти. Новите уреди се появяват веднага в configurator-а.'
          : 'Създай профил, за да добавяш и пазиш собствени уреди.'}
      </p>
    </div>
  );
}
