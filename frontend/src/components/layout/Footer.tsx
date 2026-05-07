import Logo from '../../assets/SolarPick.png';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white/76 px-4 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <img src={Logo} alt="SolarPick Logo" className="h-10 w-10 rounded-xl object-cover shadow-green" />
          <div>
            <div className="font-black text-heading">SolarPick</div>
            <p className="mt-1 text-sm leading-6 text-muted">Ориентировъчни препоръки. Не заменя професионален оглед.</p>
          </div>
        </div>
        <div className="text-sm font-bold text-muted">Energy-tech MVP · 2026</div>
      </div>
    </footer>
  );
}
