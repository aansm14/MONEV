import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Users, 
  Activity, 
  HeartPulse, 
  FileCheck2, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Printer, 
  TrendingUp, 
  ShieldAlert,
  ChevronRight,
  Clock
} from 'lucide-react';
import { LaporanMonev } from '../types';

interface DashboardViewProps {
  onOpenReport: (laporan: LaporanMonev) => void;
  onNavigateTab: (tab: any) => void;
  onOpenCreateReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenReport, 
  onNavigateTab,
  onOpenCreateReport 
}) => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    atlets, 
    laporanMonevList, 
    criticalAthletes,
    sesiTesList,
    parameters
  } = useApp();

  // Filter athletes and reports based on accessible cabors
  const accessibleCaborIds = accessibleCabors.map((c) => c.id);
  const relevantAthletes = atlets.filter((a) => accessibleCaborIds.includes(a.caborId));
  
  // For Admin: receives ALL reports automatically in real-time
  // For Monev: receives reports from their assigned cabors
  // For Cabor: receives reports for their cabor
  const relevantReports = laporanMonevList.filter((r) => 
    isAdmin ? true : accessibleCaborIds.includes(r.caborId)
  );

  const bugarCount = relevantAthletes.filter((a) => a.statusKondisi === 'Bugar').length;
  const rehabCount = relevantAthletes.filter((a) => a.statusKondisi === 'Pemulihan Cedera').length;
  const criticalCount = relevantAthletes.filter((a) => a.statusKondisi === 'Perhatian Medis Segera').length;
  const sakitCount = relevantAthletes.filter((a) => a.statusKondisi === 'Sakit/Izin').length;

  const bugarPercentage = relevantAthletes.length > 0 
    ? Math.round((bugarCount / relevantAthletes.length) * 100) 
    : 0;

  const totalTargetEmas = accessibleCabors.reduce((acc, c) => acc + c.targetMedali.emas, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Puslatkab Porprov Jatim 2027
            </span>
            <span className="text-xs text-slate-500">
              KONI Kabupaten Sidoarjo
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {isAdmin && 'Dashboard Monitoring Utama Bapel KONI'}
            {isMonev && 'Dashboard Pendampingan Tim Monev'}
            {isCabor && `Dashboard Pelatda Cabor ${accessibleCabors[0]?.nama || ''}`}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin && 'Semua pelaporan tim monev dan kondisi fisik atlet terintegrasi secara otomatis dan terperinci.'}
            {isMonev && 'Pantau cabor binaan, catat hasil evaluasi latihan, input foto dokumentasi, dan unduh PDF resmi.'}
            {isCabor && 'Perbarui jadwal latihan, venue, nomor pertandingan, dan pantau grafik tren fisik atlet secara berkala.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(isMonev || isAdmin) && (
            <button
              type="button"
              onClick={onOpenCreateReport}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Input Laporan Monev</span>
            </button>
          )}

          {isCabor && (
            <>
              <button
                type="button"
                onClick={onOpenCreateReport}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Input Laporan Cabor</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('physical_tests')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Input Tes Fisik</span>
              </button>
            </>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Rekap Semua Laporan</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cabor Dampingan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isCabor ? 'Cabor Naungan' : 'Cabor Dampingan'}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {accessibleCabors.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Target Emas: <span className="font-bold text-amber-600 font-mono">{totalTargetEmas} Medali</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total Atlet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Atlet Puslatkab</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {relevantAthletes.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Kesiapan Bugar: <span className="font-bold text-emerald-600 font-mono">{bugarPercentage}%</span>
            </p>
          </div>
        </div>

        {/* Card 3: Perhatian Medis Segera */}
        <div 
          onClick={() => onNavigateTab('medical_alerts')}
          className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between cursor-pointer transition-all ${
            criticalCount > 0 
              ? 'bg-rose-50 border-rose-200 hover:border-rose-400' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${criticalCount > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
              Perhatian Medis Segera
            </span>
            <div className={`p-2 rounded-xl ${criticalCount > 0 ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-500'}`}>
              <HeartPulse className={`w-4 h-4 ${criticalCount > 0 ? 'animate-pulse text-rose-600' : ''}`} />
            </div>
          </div>
          <div className="mt-4">
            <div className={`text-3xl font-extrabold font-mono tabular-nums ${criticalCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
              {criticalCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              {criticalCount > 0 ? (
                <span className="text-rose-600 font-bold">Butuh rujukan BapelSegera →</span>
              ) : (
                'Tidak ada cedera berisiko'
              )}
            </p>
          </div>
        </div>

        {/* Card 4: Laporan Monev Terkirim */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {isAdmin ? 'Laporan Monev Masuk' : 'Laporan Terinput'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {relevantReports.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              <span className="text-emerald-700 font-semibold font-mono">100% Terverifikasi</span> & Tersinkron
            </p>
          </div>
        </div>
      </div>

      {/* Athlete Fitness Distribution Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Status Kebugaran & Kesiapan Atlet Puslatkab
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Distribusi kondisi atlet hasil tes fisik dan visitasi tim monev
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('athletes')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Detail Atlet</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stacked Progress Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {relevantAthletes.length > 0 ? (
            <>
              <div 
                style={{ width: `${(bugarCount / relevantAthletes.length) * 100}%` }} 
                className="bg-emerald-500 transition-all" 
                title={`Bugar: ${bugarCount} atlet`}
              />
              <div 
                style={{ width: `${(rehabCount / relevantAthletes.length) * 100}%` }} 
                className="bg-amber-400 transition-all" 
                title={`Pemulihan: ${rehabCount} atlet`}
              />
              <div 
                style={{ width: `${(criticalCount / relevantAthletes.length) * 100}%` }} 
                className="bg-rose-500 transition-all" 
                title={`Perhatian Medis Segera: ${criticalCount} atlet`}
              />
              <div 
                style={{ width: `${(sakitCount / relevantAthletes.length) * 100}%` }} 
                className="bg-sky-400 transition-all" 
                title={`Sakit/Izin: ${sakitCount} atlet`}
              />
            </>
          ) : (
            <div className="w-full bg-slate-200" />
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <span className="text-slate-600 font-medium">Bugar Siap Latih:</span>
            <span className="font-bold text-slate-900 font-mono">{bugarCount} Atlet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-amber-400 shrink-0" />
            <span className="text-slate-600 font-medium">Pemulihan / Rehab:</span>
            <span className="font-bold text-slate-900 font-mono">{rehabCount} Atlet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
            <span className="text-slate-600 font-medium">Perhatian Medis Segera:</span>
            <span className="font-bold text-rose-700 font-mono">{criticalCount} Atlet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-sky-400 shrink-0" />
            <span className="text-slate-600 font-medium">Sakit / Izin:</span>
            <span className="font-bold text-slate-900 font-mono">{sakitCount} Atlet</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Feed Laporan Monev Otomatis (Left) + Jadwal & Progres Cabor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Feed Laporan Tim Monev Otomatis Masuk */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  <span>Laporan Tim Monev Bapel Terkini (Masuk Otomatis)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan visitasi lapangan tim pendamping langsung tercatat di sistem admin
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of reports */}
            <div className="divide-y divide-slate-100 mt-2">
              {relevantReports.slice(0, 4).map((lap) => (
                <div key={lap.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {lap.caborNama}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {lap.nomorLaporan}
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        {lap.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1">
                      {lap.materiLatihan}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lap.tanggalMonev} ({lap.waktuMulai}-{lap.waktuSelesai})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[200px]">{lap.tempatLatihan}</span>
                      </span>
                      <span className="text-slate-700 font-medium">
                        Petugas: {lap.petugasMonevNama}
                      </span>
                      <span className="text-amber-700 font-medium">
                        {lap.fotoDokumentasi.length} Foto Dokumentasi (&lt;1MB)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onOpenReport(lap)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
                      title="Lihat detail laporan & Cetak PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cetak PDF</span>
                    </button>
                  </div>
                </div>
              ))}

              {relevantReports.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  Belum ada laporan monev yang terinput untuk cabor ini.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right (1 col): Jadwal & Tempat Latihan Cabor Puslatkab */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Venue & Jadwal Latihan</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigateTab('cabors')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                Kelola
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {accessibleCabors.slice(0, 3).map((cabor) => (
                <div key={cabor.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{cabor.nama}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Pelatih: {cabor.pelatihKepala}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 flex items-start gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{cabor.tempatLatihan}</span>
                  </p>
                  <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5 space-y-0.5">
                    {cabor.jadwalLatihan.slice(0, 2).map((j, i) => (
                      <p key={i} className="line-clamp-1">⏱ {j}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => onNavigateTab('physical_tests')}
              className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              <span>Pantau Tren Fisik Berkala Atlet</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
