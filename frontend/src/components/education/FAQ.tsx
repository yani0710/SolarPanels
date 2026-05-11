import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const items = [
  ['What does kWp mean?', 'kWp is the peak capacity of a solar array under standard test conditions. It is useful for sizing, but real production changes with weather, orientation, season, and shade.'],
  ['What does kWh mean?', 'kWh measures energy used or stored. Electricity bills, daily consumption, and battery capacity are usually discussed in kWh.'],
  ['When does a battery make sense?', 'A battery is strongest when you have evening demand, backup needs, time-of-use tariffs, or a goal to use more of your own solar production.'],
  ['Will an on-grid system work during an outage?', 'A standard on-grid system usually shuts down during an outage. Backup generally requires a hybrid inverter, battery, and a protected load setup.'],
  ['Why does shading matter so much?', 'Shade can reduce production more than people expect, especially when it hits key panels during peak solar hours. It can affect both output and payback.'],
  ['Are the results final engineering specs?', 'No. They are decision-grade estimates for planning and comparison. A professional site survey is still needed before installation.']
] as const;

export function FAQ() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [open, setOpen] = useState(0);

  return (
    <div className="grid gap-3">
      {items.map(([question, answer], index) => (
        <div key={question} className={"overflow-hidden rounded-xl border shadow-[0_18px_55px_rgba(0,0,0,0.18)] backdrop-blur-xl " + (isLight ? "border-slate-200 bg-white/80" : "border-white/10 bg-[#181B1F]/72")}>
          <button
            onClick={() => setOpen(open === index ? -1 : index)}
            className={"flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-black transition-colors " + (isLight ? "text-navy hover:bg-slate-50" : "text-[#F5F7FA] hover:bg-white/[0.04]")}
          >
            {question}
            <ChevronDown
              size={20}
              className={`shrink-0 text-[#4FD1FF] transition-transform duration-200 ${open === index ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {open === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className={"border-t px-5 pb-5 pt-4 leading-7 " + (isLight ? "border-slate-200 text-slate-600" : "border-white/10 text-[#AAB3C2]")}>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
