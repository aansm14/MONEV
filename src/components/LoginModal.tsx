import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Award, Users, CheckCircle, ArrowRight, Activity, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, users } = useApp();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Silakan masukkan username akun Anda.');
      return;
    }
    const success = login(username.trim());
    if (!success) {
      setError(`Username "${username}" tidak ditemukan. Silakan gunakan akun demo di bawah.`);
    }
  };

  const handleQuickLogin = (uname: string) => {
    login(uname);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative sports subtle background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg ring-2 ring-amber-400/40">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">
              BAPEL PUSLATKAB
            </h1>
            <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mt-0.5">
              KONI KABUPATEN SIDOARJO · PORPROV 2027
            </p>
          </div>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-white tracking-tight">
          Sistem Informasi Monev Puslatkab
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Aplikasi Pelaporan Tim Monev Bapel & Pemantauan Progres Cabor
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-200">
                Username Akses
              </label>
              <div className="mt-1.5">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Contoh: admin, monev1, angkatbesi"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="appearance-none block w-full px-3.5 py-2.5 border border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-slate-900 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-200 bg-rose-950/60 border border-rose-800 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              <span>Masuk Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Role Access Guide & Quick Login */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">
              Pilih Hak Akses Cepat (Demo Akun)
            </p>

            <div className="space-y-2.5">
              {/* 1. Admin Utama */}
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="w-full text-left p-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-amber-500/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      1. Admin Utama Bapel KONI
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      admin
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    Kelola semua hal: Tim monev, cabor, nomor tanding, atlet/pelatih, parameter, terima semua laporan otomatis & notifikasi medis.
                  </p>
                </div>
              </button>

              {/* 2. Tim Monev */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('monev1')}
                  className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-sky-500/50 transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-bold text-white group-hover:text-sky-300">
                      Tim Monev 1
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Monev Bulutangkis & Panahan (Buat Laporan, 4 foto &lt;1MB, PDF)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('monev2')}
                  className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-sky-500/50 transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-xs font-bold text-white group-hover:text-sky-300">
                      Tim Monev 2
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Monev Angkat Besi & Atletik (Evaluasi latihan & kondisi fisik)
                  </p>
                </button>
              </div>

              {/* 3. Cabor */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('angkatbesi')}
                  className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-emerald-500/50 transition-all group"
                >
                  <span className="text-xs font-bold text-emerald-400 block truncate">
                    PABSI
                  </span>
                  <span className="text-[10px] text-slate-300 block">Angkat Besi</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Tes 1RM & Jadwal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('bulutangkis')}
                  className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-emerald-500/50 transition-all group"
                >
                  <span className="text-xs font-bold text-emerald-400 block truncate">
                    PBSI
                  </span>
                  <span className="text-[10px] text-slate-300 block">Bulutangkis</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">VO2Max & Venue</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('atletik')}
                  className="text-left p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-700/60 hover:border-emerald-500/50 transition-all group"
                >
                  <span className="text-xs font-bold text-emerald-400 block truncate">
                    PASI
                  </span>
                  <span className="text-[10px] text-slate-300 block">Atletik</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Sprint & Fisik</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Pusat Latihan Kabupaten (Puslatkab) KONI Kabupaten Sidoarjo © 2026-2027
        </p>
      </div>
    </div>
  );
};
