import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Upload, 
  Trash2, 
  RotateCcw, 
  Save, 
  Check, 
  ShieldCheck, 
  FileCheck,
  Eye,
  Info
} from 'lucide-react';

interface KopSettingsViewProps {
  onSaved?: () => void;
  isModal?: boolean;
}

export const KopSettingsView: React.FC<KopSettingsViewProps> = ({ onSaved, isModal = false }) => {
  const { kopConfig, updateKopConfig, resetKopConfig } = useApp();

  const [logoKoni, setLogoKoni] = useState(kopConfig.logoKoniUrl);
  const [logoBapel, setLogoBapel] = useState(kopConfig.logoBapelUrl);
  const [instansiInduk, setInstansiInduk] = useState(kopConfig.instansiInduk);
  const [kabupatenKota, setKabupatenKota] = useState(kopConfig.kabupatenKota);
  const [namaBadan, setNamaBadan] = useState(kopConfig.namaBadan);
  const [alamat, setAlamat] = useState(kopConfig.alamat);
  const [kontak, setKontak] = useState(kopConfig.kontak);
  const [namaKetuaBapel, setNamaKetuaBapel] = useState(kopConfig.namaKetuaBapel);
  const [jabatanKetuaBapel, setJabatanKetuaBapel] = useState(kopConfig.jabatanKetuaBapel);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [fileError, setFileError] = useState('');

  // Handle Logo KONI upload (< 1MB)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'koni' | 'bapel') => {
    setFileError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Format file harus berupa gambar (PNG, JPG, JPEG, WEBP, atau SVG).');
      return;
    }

    if (file.size > 1024 * 1024) {
      setFileError('Ukuran file gambar logo maksimal 1 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'koni') {
        setLogoKoni(result);
      } else {
        setLogoBapel(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateKopConfig({
      logoKoniUrl: logoKoni,
      logoBapelUrl: logoBapel,
      instansiInduk,
      kabupatenKota,
      namaBadan,
      alamat,
      kontak,
      namaKetuaBapel,
      jabatanKetuaBapel,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSaved) onSaved();
    }, 1200);
  };

  const handleReset = () => {
    resetKopConfig();
    setLogoKoni('');
    setLogoBapel('');
    setInstansiInduk('KOMITE OLAHRAGA NASIONAL INDONESIA (KONI)');
    setKabupatenKota('KABUPATEN SIDOARJO');
    setNamaBadan('BADAN PELAKSANA (BAPEL) PUSLATKAB PORPROV JATIM IX 2027');
    setAlamat('Sekretariat: Kompleks GOR Gelora Delta Sidoarjo, Jl. Pahlawan No. 1, Sidoarjo 61212');
    setKontak('Email: bapel.puslatkab2027@konisidoarjo.or.id · Website: puslatkab.konisidoarjo.or.id');
    setNamaKetuaBapel('Drs. H. M. Taufiqurrahman, M.Si');
    setJabatanKetuaBapel('Ketua Badan Pelaksana (BAPEL) Puslatkab KONI Sidoarjo');
  };

  return (
    <div className={`space-y-6 ${isModal ? 'p-2' : ''}`}>
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Pengaturan Kop Surat & Logo Resmi Laporan
              </h1>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl">
              Sesuaikan logo KONI, logo Bapel, teks kepala surat (kop), alamat sekretariat, dan nama Ketua Bapel penandatangan untuk cetak PDF laporan monev.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standar</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {fileError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {fileError}
          </div>
        )}
      </div>

      {/* Live Preview Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Eye className="w-4 h-4 text-amber-600" />
          <span>Pratinjau Langsung Kop Surat (Live Preview)</span>
        </div>

        <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 shadow-inner">
          <div className="flex items-center justify-between pb-4 border-b-4 border-double border-slate-900 gap-4">
            {/* Logo KONI (Kiri) */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {logoKoni ? (
                <img 
                  src={logoKoni} 
                  alt="Logo KONI" 
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex flex-col items-center justify-center text-center p-1 font-bold bg-white">
                  <span className="text-[10px] uppercase leading-none">KONI</span>
                  <span className="text-xs font-black text-amber-600 leading-none my-0.5">SDA</span>
                  <span className="text-[8px] leading-none">JATIM</span>
                </div>
              )}
            </div>

            {/* Kop Text (Tengah) */}
            <div className="flex-1 text-center px-2 min-w-0">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900 leading-tight">
                {instansiInduk || 'KOMITE OLAHRAGA NASIONAL INDONESIA (KONI)'}
              </h2>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 leading-tight mt-0.5">
                {kabupatenKota || 'KABUPATEN SIDOARJO'}
              </h3>
              <h1 className="text-xs sm:text-base font-black uppercase text-amber-700 tracking-tight mt-1 leading-tight">
                {namaBadan || 'BADAN PELAKSANA (BAPEL) PUSLATKAB PORPROV JATIM IX 2027'}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-600 mt-1 leading-normal">
                {alamat || 'Sekretariat: Kompleks GOR Gelora Delta Sidoarjo, Jl. Pahlawan No. 1, Sidoarjo 61212'}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono leading-normal">
                {kontak || 'Email: bapel.puslatkab2027@konisidoarjo.or.id · Website: puslatkab.konisidoarjo.or.id'}
              </p>
            </div>

            {/* Logo Bapel / Porprov (Kanan) */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              {logoBapel ? (
                <img 
                  src={logoBapel} 
                  alt="Logo Bapel" 
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl border border-slate-300 bg-white flex flex-col items-center justify-center text-center p-1 text-[9px] font-bold text-slate-700">
                  <ShieldCheck className="w-7 h-7 text-emerald-600 mb-0.5" />
                  <span>PORPROV</span>
                  <span>JATIM 2027</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Section 1: Logo Uploads */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">
            1. Upload Logo Resmi (Maks. 1 MB per file)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logo KONI (Kiri) */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Logo Kiri: KONI Sidoarjo / KONI Pusat
              </span>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {logoKoni ? (
                    <img src={logoKoni} alt="Preview KONI" className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center font-bold">Default SVG</span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Logo KONI</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleLogoUpload(e, 'koni')} 
                    />
                  </label>
                  {logoKoni && (
                    <button
                      type="button"
                      onClick={() => setLogoKoni('')}
                      className="block text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Hapus & kembali ke default
                    </button>
                  )}
                  <p className="text-[10px] text-slate-500">
                    Format gambar PNG transparan disarankan.
                  </p>
                </div>
              </div>
            </div>

            {/* Logo Bapel / Porprov (Kanan) */}
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Logo Kanan: Bapel Puslatkab / Porprov Jatim 2027
              </span>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {logoBapel ? (
                    <img src={logoBapel} alt="Preview Bapel" className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-[10px] text-slate-400 text-center font-bold">Default SVG</span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Logo Bapel</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleLogoUpload(e, 'bapel')} 
                    />
                  </label>
                  {logoBapel && (
                    <button
                      type="button"
                      onClick={() => setLogoBapel('')}
                      className="block text-[11px] text-rose-600 hover:underline font-semibold"
                    >
                      Hapus & kembali ke default
                    </button>
                  )}
                  <p className="text-[10px] text-slate-500">
                    Format PNG/JPG maskot/logo Bapel 2027.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Text Kop */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">
            2. Teks Kepala Surat (Kop Dokumen Resmi)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 1: Instansi Induk
              </label>
              <input
                type="text"
                required
                value={instansiInduk}
                onChange={(e) => setInstansiInduk(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 2: Daerah / Wilayah
              </label>
              <input
                type="text"
                required
                value={kabupatenKota}
                onChange={(e) => setKabupatenKota(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 3: Nama Badan Pelaksana / Program Utama
              </label>
              <input
                type="text"
                required
                value={namaBadan}
                onChange={(e) => setNamaBadan(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white font-bold text-amber-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 4: Alamat Kantor / Sekretariat
              </label>
              <input
                type="text"
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Baris 5: Kontak, Email & Website
              </label>
              <input
                type="text"
                required
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Pengesahan & Tanda Tangan */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">
            3. Pejabat Pengesahan Laporan (Ketua Bapel Puslatkab)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Lengkap & Gelar Ketua Bapel
              </label>
              <input
                type="text"
                required
                value={namaKetuaBapel}
                onChange={(e) => setNamaKetuaBapel(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jabatan Resmi Penandatangan
              </label>
              <input
                type="text"
                required
                value={jabatanKetuaBapel}
                onChange={(e) => setJabatanKetuaBapel(e.target.value)}
                className="w-full border rounded-xl p-2.5 bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-50 text-slate-700"
          >
            Reset Default
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Kop & Logo</span>
          </button>
        </div>

      </form>
    </div>
  );
};
