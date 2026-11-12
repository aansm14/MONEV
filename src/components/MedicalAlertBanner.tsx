import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ArrowRight, HeartPulse } from 'lucide-react';

interface MedicalAlertBannerProps {
  onOpenMedicalView: () => void;
}

export const MedicalAlertBanner: React.FC<MedicalAlertBannerProps> = ({ onOpenMedicalView }) => {
  const { criticalAthletes, cabors } = useApp();

  if (criticalAthletes.length === 0) return null;

  const caborMap = new Map(cabors.map((c) => [c.id, c.nama]));

  return (
    <div className="mb-6 rounded-xl bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 border border-rose-700/80 p-4 text-white shadow-lg relative overflow-hidden no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-600/30 text-rose-300 ring-1 ring-rose-500/40 shrink-0">
            <HeartPulse className="w-5 h-5 text-rose-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700/50">
                Peringatan Medis Segera
              </span>
              <span className="text-xs text-rose-200 font-medium">
                {criticalAthletes.length} Atlet Butuh Penanganan
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              {criticalAthletes.map((a) => `${a.nama} (${caborMap.get(a.caborId) || 'Cabor'})`).join(' · ')}
            </p>
            <p className="text-xs text-rose-200 mt-0.5 line-clamp-1">
              {criticalAthletes[0]?.catatanKondisi}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenMedicalView}
          className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 bg-white text-rose-900 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-sm"
        >
          <span>Tindak Lanjut Fisioterapi Bapel</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
