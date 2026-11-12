import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Users, 
  Gauge, 
  HeartPulse, 
  UserCog, 
  RefreshCw,
  MapPin,
  Calendar,
  Building2
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'reports'
  | 'cabors'
  | 'athletes'
  | 'physical_tests'
  | 'medical_alerts'
  | 'kop_settings'
  | 'users';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentUser, isAdmin, isMonev, isCabor, medicalAlertCount, resetToDefaultData, userCabor } = useApp();

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    roles: Array<'admin' | 'monev' | 'cabor'>;
    sublabel?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard Monev',
      icon: LayoutDashboard,
      roles: ['admin', 'monev', 'cabor'],
      sublabel: 'Overview & Notifikasi',
    },
    {
      id: 'reports',
      label: 'Laporan Tim Monev',
      icon: FileText,
      roles: ['admin', 'monev', 'cabor'],
      sublabel: isMonev ? 'Buat Laporan & Upload Foto' : 'Feed Laporan & Cetak PDF',
    },
    {
      id: 'cabors',
      label: isCabor ? 'Jadwal & Venue Cabor' : 'Cabang Olahraga',
      icon: Trophy,
      roles: ['admin', 'monev', 'cabor'],
      sublabel: isCabor ? 'Nomor Tanding & Fasilitas' : 'Kelola Cabor & Pelatih',
    },
    {
      id: 'athletes',
      label: 'Data Atlet & Pelatih',
      icon: Users,
      roles: ['admin', 'monev', 'cabor'],
      sublabel: 'Status Kebugaran & Cedera',
    },
    {
      id: 'physical_tests',
      label: 'Parameter & Tes Fisik',
      icon: Gauge,
      roles: ['admin', 'monev', 'cabor'],
      sublabel: 'Spesifik Cabor & Tren Kemajuan',
    },
    {
      id: 'medical_alerts',
      label: 'Perhatian Medis Segera',
      icon: HeartPulse,
      badge: medicalAlertCount > 0 ? medicalAlertCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
      roles: ['admin', 'monev', 'cabor'],
      sublabel: 'Triage Fisioterapi Bapel',
    },
    {
      id: 'kop_settings',
      label: 'Kop & Logo Laporan',
      icon: Building2,
      roles: ['admin', 'monev'],
      sublabel: 'Ganti Logo KONI & Bapel',
    },
    {
      id: 'users',
      label: 'Manajemen Pengguna',
      icon: UserCog,
      roles: ['admin'],
      sublabel: 'Akun Monev & Cabor',
    },
  ];

  const filteredItems = navItems.filter((item) => 
    currentUser ? item.roles.includes(currentUser.role) : false
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col justify-between ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print`}
      >
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {/* User scope badge */}
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
              Hak Akses Aktif
            </span>
            <p className="text-xs font-bold text-white mt-0.5 truncate">
              {currentUser?.name}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {isAdmin && 'Super Administrator (Akses Penuh)'}
              {isMonev && `Tim Monev Pendamping`}
              {isCabor && (userCabor ? userCabor.nama : 'Pengurus Cabor')}
            </p>
          </div>

          <div className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <div className="truncate leading-tight">{item.label}</div>
                      {item.sublabel && (
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isActive ? 'text-slate-800 font-normal' : 'text-slate-400'
                          }`}
                        >
                          {item.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        item.badgeColor || 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer controls & Database reset */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="px-3 py-2 bg-slate-950/40 rounded-lg text-[10px] text-slate-400">
            <span className="font-semibold text-slate-300 block">Puslatkab Sidoarjo 2027</span>
            <span>Target: Sukses Prestasi Porprov Jatim IX</span>
          </div>

          <button
            type="button"
            onClick={resetToDefaultData}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset data ke standar awal puslatkab"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data Demo</span>
          </button>
        </div>
      </aside>
    </>
  );
};
