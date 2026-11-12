import React from 'react';
import { LaporanMonev } from '../types';
import { Printer, X, Download, ShieldCheck, Award } from 'lucide-react';

interface PrintableReportProps {
  laporan: LaporanMonev;
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ laporan, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 flex justify-center">
      {/* Container */}
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto print-container">
        
        {/* Floating control toolbar (hidden in print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-tight">
              Preview Dokumen Resmi Laporan Monev (Siap Cetak / Download PDF)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 text-slate-900 text-sm leading-relaxed bg-white">
          
          {/* KOP SURAT RESMI */}
          <div className="flex items-center justify-between pb-4 border-b-4 border-double border-slate-900 mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-slate-900 flex flex-col items-center justify-center text-center p-1 font-bold shrink-0">
              <span className="text-[10px] uppercase leading-none">KONI</span>
              <span className="text-xs font-black text-amber-600 leading-none my-0.5">SDA</span>
              <span className="text-[8px] leading-none">JATIM</span>
            </div>
            
            <div className="flex-1 text-center px-4">
              <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                KOMITE OLAHRAGA NASIONAL INDONESIA (KONI)
              </h2>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                KABUPATEN SIDOARJO
              </h3>
              <h1 className="text-lg font-black uppercase text-amber-700 tracking-tight mt-0.5">
                BADAN PELAKSANA (BAPEL) PUSLATKAB PORPROV JATIM IX 2027
              </h1>
              <p className="text-[11px] text-slate-600 mt-1">
                Sekretariat: Kompleks GOR Gelora Delta Sidoarjo, Jl. Pahlawan No. 1, Sidoarjo 61212
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Email: bapel.puslatkab2027@konisidoarjo.or.id · Website: puslatkab.konisidoarjo.or.id
              </p>
            </div>

            <div className="w-20 h-20 rounded-xl border border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center p-1 text-[9px] font-bold text-slate-700 shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-600 mb-0.5" />
              <span>PORPROV</span>
              <span>JATIM 2027</span>
            </div>
          </div>

          {/* DOKUMEN HEADER */}
          <div className="text-center mb-6">
            <h2 className="text-base font-black uppercase underline decoration-2 underline-offset-4 tracking-wider">
              BERITA ACARA MONITORING & EVALUASI CABOR PUSLATKAB
            </h2>
            <p className="text-xs font-mono font-bold text-slate-600 mt-1">
              Nomor: {laporan.nomorLaporan}
            </p>
          </div>

          {/* DATA UMUM KUNJUNGAN */}
          <div className="border border-slate-300 rounded-lg p-4 mb-6 bg-slate-50/50">
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

          {/* REKAP KEHADIRAN ATLET */}
          <div className="mb-6">
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

          {/* HASIL EVALUASI LAPANGAN */}
          <div className="mb-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              III. Catatan Evaluasi Latihan Lapangan
            </h3>
            
            <div className="border border-slate-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-slate-900 block mb-1">A. Materi & Program Latihan:</span>
              <p className="text-slate-700 whitespace-pre-line">{laporan.materiLatihan}</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-slate-900 block mb-1">B. Evaluasi Kondisi Fisik Atlet:</span>
              <p className="text-slate-700 whitespace-pre-line">{laporan.evaluasiFisik}</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-slate-900 block mb-1">C. Evaluasi Teknik, Taktik & Strategi:</span>
              <p className="text-slate-700 whitespace-pre-line">{laporan.evaluasiTeknikTaktik}</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-slate-900 block mb-1">D. Kondisi Sarana & Prasarana Latihan:</span>
              <p className="text-slate-700 whitespace-pre-line">{laporan.kondisiSaranaPrasarana}</p>
            </div>

            <div className="border border-slate-200 rounded-lg p-3 text-xs">
              <span className="font-bold text-slate-900 block mb-1">E. Kendala Cabor & Permasalahan:</span>
              <p className="text-slate-700 whitespace-pre-line">{laporan.kendalaCabor}</p>
            </div>

            <div className="border border-amber-300 rounded-lg p-3 text-xs bg-amber-50/60">
              <span className="font-bold text-amber-900 block mb-1">F. Rekomendasi Tim Monev & Tindak Lanjut Bapel:</span>
              <p className="text-slate-800 font-medium whitespace-pre-line">{laporan.rekomendasiBapel}</p>
            </div>

            {/* Atlet butuh tindakan medis */}
            {laporan.atletButuhMedis && laporan.atletButuhMedis.length > 0 && (
              <div className="border border-rose-300 rounded-lg p-3 text-xs bg-rose-50">
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

          {/* DOKUMENTASI FOTO (MAKS 4 FOTO, SIAP CETAK) */}
          <div className="mb-8 print-page-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              IV. Lampiran Foto Dokumentasi Lapangan (Maksimal 4 Foto Terverifikasi)
            </h3>
            
            {laporan.fotoDokumentasi && laporan.fotoDokumentasi.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {laporan.fotoDokumentasi.map((foto, idx) => (
                  <div 
                    key={foto.id || idx}
                    className="border border-slate-300 rounded-lg p-2 bg-slate-50 flex flex-col"
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

          {/* LEMBAR PENGESAHAN TANDA TANGAN */}
          <div className="mt-8 pt-6 border-t border-slate-300">
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
                Ketua Badan Pelaksana (BAPEL) Puslatkab KONI Sidoarjo
              </p>
              <p className="font-bold underline text-slate-900 uppercase">
                ( Drs. H. M. Taufiqurrahman, M.Si )
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                KONI Kabupaten Sidoarjo
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
