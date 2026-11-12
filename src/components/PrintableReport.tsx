import React, { useState } from 'react';
import { LaporanMonev } from '../types';
import { useApp } from '../context/AppContext';
import { Printer, X, ShieldCheck, Award, Settings, Check, Phone } from 'lucide-react';
import { KopSettingsView } from '../views/KopSettingsView';

interface PrintableReportProps {
  laporan: LaporanMonev;
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ laporan, onClose }) => {
  const { kopConfig } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-2 sm:p-6 flex justify-center print-modal-overlay">
        {/* Printable Document Container */}
        <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto print-container print:shadow-none print:border-none print:rounded-none print:m-0 print:p-0">
          
          {/* Floating Control Toolbar (Hidden during print) */}
          <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row items-center justify-between gap-3 no-print border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-sm font-bold tracking-tight block">
                  Pratinjau Dokumen Resmi Laporan Monev (Siap Cetak PDF)
                </span>
                <span className="text-[11px] text-slate-400">
                  Format Berita Acara Resmi Bapel Puslatkab Porprov Jatim IX 2027
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Ganti Logo KONI, Logo Bapel, dan Teks Kepala Surat"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span>Ubah Logo & Kop</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Tutup Preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="p-6 sm:p-10 text-slate-900 text-sm leading-relaxed bg-white">
            
            {/* KOP SURAT RESMI (DINAMIS DENGAN KOP CONFIG) */}
            <div className="print-section flex items-center justify-between pb-4 border-b-4 border-double border-slate-900 mb-6 gap-4">
              
              {/* Logo Kiri (KONI Sidoarjo) */}
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                {kopConfig.logoKoniUrl ? (
                  <img 
                    src={kopConfig.logoKoniUrl} 
                    alt="Logo KONI" 
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex flex-col items-center justify-center text-center p-1 font-bold shrink-0 bg-white">
                    <span className="text-[10px] uppercase leading-none">KONI</span>
                    <span className="text-xs font-black text-amber-600 leading-none my-0.5">SDA</span>
                    <span className="text-[8px] leading-none">JATIM</span>
                  </div>
                )}
              </div>
              
              {/* Teks Kop Surat */}
              <div className="flex-1 text-center px-2">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-slate-900 leading-tight">
                  {kopConfig.instansiInduk || 'KOMITE OLAHRAGA NASIONAL INDONESIA (KONI)'}
                </h2>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 leading-tight mt-0.5">
                  {kopConfig.kabupatenKota || 'KABUPATEN SIDOARJO'}
                </h3>
                <h1 className="text-sm sm:text-lg font-black uppercase text-amber-700 tracking-tight mt-1 leading-tight">
                  {kopConfig.namaBadan || 'BADAN PELAKSANA (BAPEL) PUSLATKAB PORPROV JATIM IX 2027'}
                </h1>
                <p className="text-[10px] sm:text-[11px] text-slate-600 mt-1 leading-normal">
                  {kopConfig.alamat || 'Sekretariat: Kompleks GOR Gelora Delta Sidoarjo, Jl. Pahlawan No. 1, Sidoarjo 61212'}
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono leading-normal">
                  {kopConfig.kontak || 'Email: bapel.puslatkab2027@konisidoarjo.or.id · Website: puslatkab.konisidoarjo.or.id'}
                </p>
              </div>

              {/* Logo Kanan (Bapel / Porprov) */}
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                {kopConfig.logoBapelUrl ? (
                  <img 
                    src={kopConfig.logoBapelUrl} 
                    alt="Logo Bapel" 
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl border border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-1 text-[9px] font-bold text-slate-700 shrink-0">
                    <ShieldCheck className="w-7 h-7 text-emerald-600 mb-0.5" />
                    <span>PORPROV</span>
                    <span>JATIM 2027</span>
                  </div>
                )}
              </div>
            </div>

            {/* DOKUMEN TITLE */}
            <div className="print-section text-center mb-6">
              <h2 className="text-base font-black uppercase underline decoration-2 underline-offset-4 tracking-wider">
                BERITA ACARA MONITORING & EVALUASI CABOR PUSLATKAB
              </h2>
              <p className="text-xs font-mono font-bold text-slate-600 mt-1">
                Nomor: {laporan.nomorLaporan}
              </p>
            </div>

            {/* I. DATA UMUM KUNJUNGAN */}
            <div className="print-section border border-slate-300 rounded-lg p-4 mb-6 bg-slate-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b border-slate-200 pb-1">
                I. Identitas Kunjungan Lapangan
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                <div>
                  <span className="text-slate-500 w-32 inline-block">Cabang Olahraga:</span>
                  <span className="font-bold text-slate-900">{laporan.caborNama}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block">Hari, Tanggal:</span>
                  <span className="font-semibold text-slate-900">{laporan.tanggalMonev}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block">Waktu Monitoring:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {laporan.waktuMulai} - {laporan.waktuSelesai} WIB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block">Tempat/Venue:</span>
                  <span className="font-semibold text-slate-900">{laporan.tempatLatihan}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block">Tim Monev Bapel:</span>
                  <span className="font-bold text-slate-900">{laporan.petugasMonevNama}</span>
                </div>
                <div>
                  <span className="text-slate-500 w-32 inline-block">Pelatih yang Hadir:</span>
                  <span className="font-semibold text-slate-900">
                    {laporan.pelatihHadir.join(', ') || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* II. REKAP KEHADIRAN ATLET */}
            <div className="print-section mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                II. Rekapitulasi Presensi Atlet Puslatkab
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50">
                  <span className="text-slate-500 text-[11px] block">Total Atlet Kuota</span>
                  <span className="text-base font-extrabold font-mono text-slate-900">
                    {laporan.kehadiranAtlet.total}
                  </span>
                </div>
                <div className="border border-emerald-300 rounded-lg p-2.5 bg-emerald-50">
                  <span className="text-emerald-700 text-[11px] block font-medium">Hadir Latihan</span>
                  <span className="text-base font-extrabold font-mono text-emerald-800">
                    {laporan.kehadiranAtlet.hadir}
                  </span>
                </div>
                <div className="border border-amber-300 rounded-lg p-2.5 bg-amber-50">
                  <span className="text-amber-700 text-[11px] block font-medium">Izin Terkonfirmasi</span>
                  <span className="text-base font-extrabold font-mono text-amber-800">
                    {laporan.kehadiranAtlet.izin}
                  </span>
                </div>
                <div className="border border-sky-300 rounded-lg p-2.5 bg-sky-50">
                  <span className="text-sky-700 text-[11px] block font-medium">Sakit</span>
                  <span className="text-base font-extrabold font-mono text-sky-800">
                    {laporan.kehadiranAtlet.sakit}
                  </span>
                </div>
                <div className="border border-rose-300 rounded-lg p-2.5 bg-rose-50">
                  <span className="text-rose-700 text-[11px] block font-medium">Cedera Terdata</span>
                  <span className="text-base font-extrabold font-mono text-rose-800">
                    {laporan.kehadiranAtlet.cedera}
                  </span>
                </div>
              </div>
            </div>

            {/* III. HASIL EVALUASI LAPANGAN */}
            <div className="print-section mb-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                III. Catatan Evaluasi Latihan Lapangan
              </h3>
              
              <div className="border border-slate-200 rounded-lg p-3 text-xs print-section">
                <span className="font-bold text-slate-900 block mb-1">A. Materi & Program Latihan:</span>
                <p className="text-slate-700 whitespace-pre-line">{laporan.materiLatihan}</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs print-section">
                <span className="font-bold text-slate-900 block mb-1">B. Evaluasi Kondisi Fisik Atlet:</span>
                <p className="text-slate-700 whitespace-pre-line">{laporan.evaluasiFisik}</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs print-section">
                <span className="font-bold text-slate-900 block mb-1">C. Evaluasi Teknik, Taktik & Strategi:</span>
                <p className="text-slate-700 whitespace-pre-line">{laporan.evaluasiTeknikTaktik}</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs print-section">
                <span className="font-bold text-slate-900 block mb-1">D. Kondisi Sarana & Prasarana Latihan:</span>
                <p className="text-slate-700 whitespace-pre-line">{laporan.kondisiSaranaPrasarana}</p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs print-section">
                <span className="font-bold text-slate-900 block mb-1">E. Kendala Cabor & Permasalahan:</span>
                <p className="text-slate-700 whitespace-pre-line">{laporan.kendalaCabor}</p>
              </div>

              <div className="border border-amber-300 rounded-lg p-3 text-xs bg-amber-50/60 print-section">
                <span className="font-bold text-amber-900 block mb-1">F. Rekomendasi Tim Monev & Tindak Lanjut Bapel:</span>
                <p className="text-slate-800 font-medium whitespace-pre-line">{laporan.rekomendasiBapel}</p>
              </div>

              {/* Atlet butuh tindakan medis */}
              {laporan.atletButuhMedis && laporan.atletButuhMedis.length > 0 && (
                <div className="border border-rose-300 rounded-lg p-3 text-xs bg-rose-50 print-section">
                  <span className="font-bold text-rose-900 block mb-1.5 uppercase">
                    G. Perhatian Medis Segera (Rujukan Fisioterapi Bapel):
                  </span>
                  <ul className="list-disc pl-5 space-y-1 text-rose-800">
                    {laporan.atletButuhMedis.map((med, idx) => (
                      <li key={idx}>
                        <span className="font-bold">{med.namaAtlet}</span>: {med.keluhan} — Tindakan: {med.tindakanDibutuhkan}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* IV. DOKUMENTASI FOTO (MAKS 4 FOTO, SIAP CETAK) */}
            <div className="mb-8 print-section">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                IV. Lampiran Foto Dokumentasi Lapangan (Maksimal 4 Foto Terverifikasi)
              </h3>
              
              {laporan.fotoDokumentasi && laporan.fotoDokumentasi.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {laporan.fotoDokumentasi.map((foto, idx) => (
                    <div 
                      key={foto.id || idx}
                      className="border border-slate-300 rounded-lg p-2 bg-slate-50 flex flex-col print-section"
                    >
                      <div className="aspect-[4/3] w-full rounded overflow-hidden bg-slate-200 flex items-center justify-center">
                        <img 
                          src={foto.dataUrl} 
                          alt={foto.caption || `Dokumentasi Monev ${idx + 1}`}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-slate-700">
                        <p className="font-semibold line-clamp-2">
                          Foto {idx + 1}: {foto.caption || 'Dokumentasi kegiatan monev latihan cabor'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Ukuran File: {foto.sizeKb} KB (&lt;1MB)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-4 border border-dashed rounded-lg text-center">
                  Tidak ada foto dokumentasi yang dilampirkan.
                </p>
              )}
            </div>

            {/* V. LEMBAR PENGESAHAN TANDA TANGAN */}
            <div className="print-section pt-6 border-t border-slate-300">
              <p className="text-xs text-right text-slate-600 mb-6 font-medium">
                Sidoarjo, {laporan.tanggalMonev}
              </p>

              <div className="grid grid-cols-2 gap-8 text-center text-xs">
                <div>
                  <p className="text-slate-600 font-medium">Pihak Cabang Olahraga,</p>
                  <p className="text-slate-800 font-bold mb-16">
                    {laporan.tandaTangan?.pelatihNama ? 'Pelatih Kepala / Pengurus' : 'Pengurus Cabor'}
                  </p>
                  <p className="font-bold underline text-slate-900 uppercase">
                    ( {laporan.tandaTangan?.pelatihNama || '...........................................'} )
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Cabang Olahraga {laporan.caborNama}
                  </p>
                </div>

                <div>
                  <p className="text-slate-600 font-medium">Tim Monitoring & Evaluasi,</p>
                  <p className="text-slate-800 font-bold mb-16">
                    Bapel Puslatkab KONI Sidoarjo
                  </p>
                  <p className="font-bold underline text-slate-900 uppercase">
                    ( {laporan.petugasMonevNama} )
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    Petugas Monev Pendamping
                  </p>
                </div>
              </div>

              <div className="mt-12 text-center text-xs">
                <p className="text-slate-600 font-medium">Mengetahui & Menyetujui,</p>
                <p className="text-slate-900 font-bold mb-16">
                  {kopConfig.jabatanKetuaBapel || 'Ketua Badan Pelaksana (BAPEL) Puslatkab KONI Sidoarjo'}
                </p>
                <p className="font-bold underline text-slate-900 uppercase">
                  ( {kopConfig.namaKetuaBapel || 'Drs. H. M. Taufiqurrahman, M.Si'} )
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  KONI Kabupaten Sidoarjo
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Modal Dialog for Kop & Logo Settings directly accessible from report */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 flex justify-center no-print">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold">Pengaturan Logo & Kop Surat Laporan</h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <KopSettingsView isModal onSaved={() => setIsSettingsOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
