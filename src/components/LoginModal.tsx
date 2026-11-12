import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, ArrowRight, AlertCircle, Eye, EyeOff, Lock, User, Info, Shield, Activity, Users } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Silakan masukkan username akun Anda.');
      return;
    }

    if (!password) {
      setError('Silakan masukkan kata sandi / password akun Anda.');
      return;
    }

    const res = login(username.trim(), password);
    if (!res.success) {
      setError(res.message || 'Username atau password yang Anda masukkan tidak sesuai.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle sports grid backdrop */}
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
        <p className="mt-1 text-center text-xs text-slate-400">
          Silakan masukkan kredensial akun resmi Anda untuk mengakses sistem
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 backdrop-blur border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Username Akun
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Masukkan username akun Anda"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="appearance-none block w-full pl-10 pr-3.5 py-2.5 border border-slate-600 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-slate-900 text-white font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Kata Sandi / Password
              </label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-slate-600 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-slate-900 text-white font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 text-xs text-rose-200 bg-rose-950/70 border border-rose-800 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Collapsible Credential Guide */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Lihat Panduan Hak Akses Akun Resmi</span>
              </span>
              <span>{showGuide ? '▲ Tutup' : '▼ Lihat'}</span>
            </button>

            {showGuide && (
              <div className="mt-3.5 space-y-3 text-[11px] bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 text-slate-300">
                
                {/* 1. Admin */}
                <div className="space-y-1 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>1. Admin Utama Bapel</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-white">
                      admin / admin2027
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight">
                    Hak akses penuh: kelola akun & tim monev, cabor, nomor tanding, atlet & pelatih, parameter fisik, rekap seluruh laporan visitasi, rujukan medis darurat.
                  </p>
                </div>

                {/* 2. Tim Monev */}
                <div className="space-y-1 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center justify-between text-sky-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sky-400" />
                      <span>2. Tim Monev Bapel</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-white">
                      monev1 / monev2027
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight">
                    Hanya melihat cabor dampingan: monev1 (Bulutangkis, Panahan), monev2 (Angkat Besi, Atletik). Input laporan monev, upload 4 foto (&lt;1MB), cetak PDF.
                  </p>
                </div>

                {/* 3. Pengurus Cabor */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>3. Pengurus / Pelatih Cabor</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-300 pt-1">
                    <div>PABSI: <span className="text-emerald-400">angkatbesi / pabsi2027</span></div>
                    <div>PBSI: <span className="text-emerald-400">bulutangkis / pbsi2027</span></div>
                    <div>PASI: <span className="text-emerald-400">atletik / pasi2027</span></div>
                    <div>PERPANI: <span className="text-emerald-400">panahan / perpani2027</span></div>
                    <div>AQUATIK: <span className="text-emerald-400">renang / aquatik2027</span></div>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight pt-1">
                    Kelola venue, jadwal latihan, nomor tanding, data atlet & pelatih, serta rekam sesi tes fisik bertahap untuk grafik perkembangan.
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Badan Pelaksana (Bapel) Puslatkab · Komite Olahraga Nasional Indonesia Kabupaten Sidoarjo
        </p>
      </div>
    </div>
  );
};
