import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Bell, 
  LogOut, 
  ChevronDown, 
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
  const { currentUser, logout, switchUser, users, medicalAlertCount } = useApp();
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);

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

            {/* Quick Switch Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSwitchDropdown(!showSwitchDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
              >
                <div className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5" />
                  ) : currentUser.role === 'monev' ? (
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
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
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showSwitchDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 focus:outline-none"
                  onMouseLeave={() => setShowSwitchDropdown(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-700/70 mb-1">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Ganti Akun Cepat (Testing)
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/40">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          switchUser(u.id);
                          setShowSwitchDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/60 transition-colors ${
                          u.id === currentUser.id ? 'bg-amber-500/10 text-amber-300 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-medium">{u.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">
                            {u.role} · @{u.username}
                          </p>
                        </div>
                        {u.id === currentUser.id && (
                          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded shrink-0">
                            Aktif
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
