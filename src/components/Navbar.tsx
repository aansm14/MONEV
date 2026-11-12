import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  LogOut, 
  Shield, 
  Activity, 
  Users, 
  Menu,
  HeartPulse
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenMedicalAlerts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleMobileMenu, 
  onOpenMedicalAlerts 
}) => {
  const { currentUser, logout, medicalAlertCount } = useApp();

  if (!currentUser) return null;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight leading-none whitespace-nowrap">
                  BAPEL PUSLATKAB PORPROV 2027
                </span>
                <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase mt-1 leading-none whitespace-nowrap">
                  KONI KABUPATEN SIDOARJO
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Status & Real-time Medical Alert Indicator */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            {medicalAlertCount > 0 ? (
              <button
                type="button"
                onClick={onOpenMedicalAlerts}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-700/80 text-rose-200 hover:bg-rose-900 transition-colors shadow-sm animate-pulse cursor-pointer"
                title="Klik untuk melihat penanganan medis segera"
              >
                <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold whitespace-nowrap">
                  {medicalAlertCount} Atlet Memerlukan Tindakan Medis
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Kondisi Atlet Prima & Terpantau</span>
              </div>
            )}
          </div>

          {/* Zone 3: User & Quick Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile medical alert icon */}
            {medicalAlertCount > 0 && (
              <button
                type="button"
                onClick={onOpenMedicalAlerts}
                className="md:hidden relative p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg"
                title="Atlet butuh tindakan medis"
              >
                <HeartPulse className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900" />
              </button>
            )}

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
              <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                {currentUser.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : currentUser.role === 'monev' ? (
                  <Activity className="w-3.5 h-3.5 text-sky-400" />
                ) : (
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                  {currentUser.name.split(',')[0]}
                </div>
                <div className="text-[10px] text-amber-400 font-mono leading-none capitalize">
                  {currentUser.role === 'admin' 
                    ? 'Admin Bapel' 
                    : currentUser.role === 'monev' 
                    ? 'Tim Monev' 
                    : 'Pengurus Cabor'}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              type="button"
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
