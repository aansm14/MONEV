import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LaporanMonev, FotoLaporan } from '../types';
import { 
  FileText, 
  Plus, 
  Search, 
  Printer, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  UserCheck,
  HeartPulse,
  Info
} from 'lucide-react';

interface MonevReportsViewProps {
  onOpenPrintReport: (laporan: LaporanMonev) => void;
  createModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const MonevReportsView: React.FC<MonevReportsViewProps> = ({ 
  onOpenPrintReport,
  createModalOpen: externalCreateOpen,
  onCloseCreateModal: externalCloseCreate 
}) => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    laporanMonevList, 
    addLaporanMonev,
    atlets,
    updateAtletCondition
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaborFilter, setSelectedCaborFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync external open trigger (e.g., from Dashboard shortcut)
  useEffect(() => {
    if (externalCreateOpen) {
      handleOpenModal();
    }
  }, [externalCreateOpen]);

  const handleOpenModal = () => {
    const availableCb = accessibleCabors.find((c) => c.id === caborId) || accessibleCabors[0];
    if (availableCb) {
      setCaborId(availableCb.id);
      setTempatLatihan(availableCb.tempatLatihan);
      setPelatihHadirText(availableCb.pelatihKepala);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (externalCloseCreate) {
      externalCloseCreate();
    }
  };

  // Filter reports
  const accessibleCaborIds = accessibleCabors.map((c) => c.id);
  const filteredReports = laporanMonevList.filter((lap) => {
    // Role accessibility
    if (!isAdmin && !accessibleCaborIds.includes(lap.caborId)) {
      return false;
    }
    // Cabor filter
    if (selectedCaborFilter !== 'all' && lap.caborId !== selectedCaborFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lap.caborNama.toLowerCase().includes(q) ||
        lap.nomorLaporan.toLowerCase().includes(q) ||
        lap.materiLatihan.toLowerCase().includes(q) ||
        lap.petugasMonevNama.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // FORM STATE for new Monev Report
  const defaultCaborId = accessibleCabors[0]?.id || '';
  const [caborId, setCaborId] = useState(defaultCaborId);
  const [tanggalMonev, setTanggalMonev] = useState(() => new Date().toISOString().split('T')[0]);
  const [waktuMulai, setWaktuMulai] = useState('15.30');
  const [waktuSelesai, setWaktuSelesai] = useState('18.00');
  const [tempatLatihan, setTempatLatihan] = useState(accessibleCabors[0]?.tempatLatihan || '');
  
  // Attendance
  const [hadir, setHadir] = useState(8);
  const [izin, setIzin] = useState(1);
  const [sakit, setSakit] = useState(0);
  const [cedera, setCedera] = useState(0);
  const [pelatihHadirText, setPelatihHadirText] = useState(accessibleCabors[0]?.pelatihKepala || '');

  // Qualitative evaluations
  const [materiLatihan, setMateriLatihan] = useState('');
  const [evaluasiFisik, setEvaluasiFisik] = useState('');
  const [evaluasiTeknikTaktik, setEvaluasiTeknikTaktik] = useState('');
  const [kondisiSaranaPrasarana, setKondisiSaranaPrasarana] = useState('Kondisi peralatan dan venue dalam keadaan memadai dan terawat.');
  const [kendalaCabor, setKendalaCabor] = useState('');
  const [rekomendasiBapel, setRekomendasiBapel] = useState('');

  // Medical alert flag
  const [hasMedicalIssue, setHasMedicalIssue] = useState(false);
  const [selectedAtletMedisId, setSelectedAtletMedisId] = useState('');
  const [keluhanMedis, setKeluhanMedis] = useState('');
  const [tindakanMedisDibutuhkan, setTindakanMedisDibutuhkan] = useState('Rujukan penanganan ke Fisioterapi Bapel KONI Sidoarjo');

  // Photo uploads (Max 4 photos, each <= 1024 KB)
  const [uploadedPhotos, setUploadedPhotos] = useState<FotoLaporan[]>([]);
  const [photoError, setPhotoError] = useState('');

  // When changing cabor in form, auto-fill default venue
  const handleCaborChange = (newCaborId: string) => {
    setCaborId(newCaborId);
    const cb = accessibleCabors.find((c) => c.id === newCaborId);
    if (cb) {
      setTempatLatihan(cb.tempatLatihan);
      setPelatihHadirText(cb.pelatihKepala);
    }
  };

  // Handle file upload with strict 1MB (1024 KB) and max 4 photos validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedPhotos.length >= 4) {
      setPhotoError('Batas maksimum 4 foto telah tercapai. Hapus salah satu foto untuk mengganti.');
      return;
    }

    const availableSlots = 4 - uploadedPhotos.length;
    const filesToProcess = Array.from(files).slice(0, availableSlots);

    filesToProcess.forEach((file) => {
      // 1MB = 1024 * 1024 bytes = 1,048,576 bytes
      const sizeInKb = Math.round(file.size / 1024);
      if (file.size > 1024 * 1024) {
        setPhotoError(`File "${file.name}" berukuran ${sizeInKb} KB, melebihi batas maksimal 1MB (1024 KB). Silakan kompres atau pilih foto yang lebih kecil.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedPhotos((prev) => {
          if (prev.length >= 4) return prev;
          return [
            ...prev,
            {
              id: `foto-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              dataUrl,
              caption: file.name.replace(/\.[^/.]+$/, ''),
              sizeKb: sizeInKb,
              fileName: file.name,
            },
          ];
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemovePhoto = (id: string) => {
    setUploadedPhotos((prev) => prev.filter((p) => p.id !== id));
    setPhotoError('');
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setUploadedPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  // Submit report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCabor = accessibleCabors.find((c) => c.id === caborId) || accessibleCabors[0];
    if (!currentCabor) {
      setPhotoError('Silakan pilih cabang olahraga terlebih dahulu.');
      return;
    }

    const total = hadir + izin + sakit + cedera;
    const now = new Date();
    const nomorLaporan = `BAPEL/MONEV/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/CB-${currentCabor.singkatan}`;

    const pelatihHadirArray = pelatihHadirText
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const atletButuhMedis: LaporanMonev['atletButuhMedis'] = [];
    if (hasMedicalIssue && selectedAtletMedisId && keluhanMedis.trim()) {
      const at = atlets.find((a) => a.id === selectedAtletMedisId);
      if (at) {
        atletButuhMedis.push({
          atletId: at.id,
          namaAtlet: at.nama,
          keluhan: keluhanMedis,
          tindakanDibutuhkan: tindakanMedisDibutuhkan,
        });

        // Update status of this athlete to 'Perhatian Medis Segera'
        updateAtletCondition(at.id, 'Perhatian Medis Segera', keluhanMedis, tindakanMedisDibutuhkan);
      }
    }

    addLaporanMonev({
      nomorLaporan,
      caborId: currentCabor.id,
      caborNama: currentCabor.nama,
      tanggalMonev,
      waktuMulai,
      waktuSelesai,
      tempatLatihan,
      petugasMonevId: currentUser?.id || 'monev-unknown',
      petugasMonevNama: currentUser?.name || 'Tim Monev Bapel',
      kehadiranAtlet: {
        hadir,
        izin,
        sakit,
        cedera,
        total,
      },
      pelatihHadir: pelatihHadirArray,
      materiLatihan,
      evaluasiFisik,
      evaluasiTeknikTaktik,
      kondisiSaranaPrasarana,
      kendalaCabor,
      rekomendasiBapel,
      atletButuhMedis,
      fotoDokumentasi: uploadedPhotos,
      status: 'Terkirim',
      tandaTangan: {
        monevSigned: true,
        caborSigned: true,
        pelatihNama: pelatihHadirArray[0] || currentCabor.pelatihKepala,
      },
    });

    // Reset form
    setMateriLatihan('');
    setEvaluasiFisik('');
    setEvaluasiTeknikTaktik('');
    setKendalaCabor('');
    setRekomendasiBapel('');
    setUploadedPhotos([]);
    setHasMedicalIssue(false);
    setSelectedAtletMedisId('');
    setKeluhanMedis('');
    handleCloseModal();
  };

  const caborAthletes = atlets.filter((a) => a.caborId === caborId);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Laporan Monitoring & Evaluasi Tim Monev Bapel
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin 
              ? 'Seluruh laporan visitasi lapangan tim monev masuk secara otomatis ke dashboard admin dan dapat dicetak/disimpan sebagai PDF resmi.'
              : 'Susun laporan visitasi lapangan cabor dampingan Anda, unggah maksimal 4 foto (maks 1MB), dan unduh dokumen siap cetak.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{isCabor ? 'Input Laporan Evaluasi Cabor' : 'Buat Laporan Monev Baru'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari cabor, nomor laporan, atau materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Cabor:</span>
          <select
            value={selectedCaborFilter}
            onChange={(e) => setSelectedCaborFilter(e.target.value)}
            className="w-full sm:w-auto text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Semua Cabor ({accessibleCabors.length})</option>
            {accessibleCabors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Grid / List */}
      <div className="space-y-4">
        {filteredReports.map((laporan) => (
          <div
            key={laporan.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-base">
                  {laporan.caborNama}
                </span>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded font-semibold">
                  {laporan.nomorLaporan}
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                  {laporan.status}
                </span>
                {laporan.atletButuhMedis && laporan.atletButuhMedis.length > 0 && (
                  <span className="text-xs text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <HeartPulse className="w-3 h-3 text-rose-600" />
                    <span>{laporan.atletButuhMedis.length} Atlet Butuh Medis</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                <span className="font-semibold text-slate-900">Materi & Evaluasi:</span> {laporan.materiLatihan} — {laporan.evaluasiFisik}
              </p>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 pt-1">
                <div>
                  <span className="text-slate-400 block">Tanggal & Waktu</span>
                  <span className="font-semibold text-slate-800">{laporan.tanggalMonev} ({laporan.waktuMulai}-{laporan.waktuSelesai})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Petugas Monev</span>
                  <span className="font-semibold text-slate-800">{laporan.petugasMonevNama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Presensi Atlet</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    Hadir: {laporan.kehadiranAtlet.hadir}/{laporan.kehadiranAtlet.total}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Dokumentasi</span>
                  <span className="font-semibold text-amber-700 font-mono">
                    {laporan.fotoDokumentasi?.length || 0} Foto Lampiran
                  </span>
                </div>
              </div>

              {/* Photo Thumbnails Preview */}
              {laporan.fotoDokumentasi && laporan.fotoDokumentasi.length > 0 && (
                <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                  {laporan.fotoDokumentasi.map((foto, idx) => (
                    <div 
                      key={foto.id || idx}
                      className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0 group relative"
                      title={foto.caption || `Foto ${idx + 1}`}
                    >
                      <img src={foto.dataUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Maks 1MB per foto · Siap Cetak)
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => onOpenPrintReport(laporan)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cetak / Download PDF</span>
              </button>
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-xs">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-600">Tidak ada laporan monev yang sesuai kriteria pencarian.</p>
            <p className="mt-1">Gunakan tombol di bawah untuk menambahkan catatan visitasi lapangan cabor.</p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isCabor ? 'Input Laporan Evaluasi Cabor' : 'Buat Laporan Monev Baru'}</span>
            </button>
          </div>
        )}
      </div>

      {/* MODAL: Form Buat Laporan Monev Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 sm:p-6 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <span>Formulir Laporan Monev Lapangan Bapel Puslatkab</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Laporan akan otomatis tersimpan dan masuk ke dashboard pimpinan Bapel KONI Sidoarjo
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmitReport} className="p-6 space-y-6 overflow-y-auto max-h-[80vh] text-xs">
              
              {/* Bagian 1: Identitas Kunjungan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
                  1. Data Cabang Olahraga & Waktu Monitoring
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Cabang Olahraga Binaan *
                    </label>
                    <select
                      value={caborId}
                      onChange={(e) => handleCaborChange(e.target.value)}
                      required
                      className="w-full border border-slate-300 rounded-lg p-2.5 bg-white text-slate-900 focus:ring-2 focus:ring-amber-500"
                    >
                      {accessibleCabors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nama} ({c.singkatan})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tanggal Monev *
                    </label>
                    <input
                      type="date"
                      required
                      value={tanggalMonev}
                      onChange={(e) => setTanggalMonev(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Waktu Latihan (Mulai - Selesai)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="time"
                        value={waktuMulai}
                        onChange={(e) => setWaktuMulai(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-center"
                      />
                      <input
                        type="time"
                        value={waktuSelesai}
                        onChange={(e) => setWaktuSelesai(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tempat/Venue Latihan *
                    </label>
                    <input
                      type="text"
                      required
                      value={tempatLatihan}
                      onChange={(e) => setTempatLatihan(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 2: Presensi Atlet & Pelatih */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
                  2. Presensi Atlet & Pelatih di Lapangan
                </h3>

                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                      Atlet Hadir
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={hadir}
                      onChange={(e) => setHadir(parseInt(e.target.value) || 0)}
                      className="w-full border border-emerald-300 bg-emerald-50/50 rounded-lg p-2 text-center font-bold text-emerald-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                      Izin
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={izin}
                      onChange={(e) => setIzin(parseInt(e.target.value) || 0)}
                      className="w-full border border-amber-300 bg-amber-50/50 rounded-lg p-2 text-center font-bold text-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-sky-800 mb-1">
                      Sakit
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={sakit}
                      onChange={(e) => setSakit(parseInt(e.target.value) || 0)}
                      className="w-full border border-sky-300 bg-sky-50/50 rounded-lg p-2 text-center font-bold text-sky-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-rose-800 mb-1">
                      Cedera
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={cedera}
                      onChange={(e) => setCedera(parseInt(e.target.value) || 0)}
                      className="w-full border border-rose-300 bg-rose-50/50 rounded-lg p-2 text-center font-bold text-rose-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pelatih yang Hadir (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={pelatihHadirText}
                    onChange={(e) => setPelatihHadirText(e.target.value)}
                    placeholder="Contoh: Hendra Setiawan, S.Pd, Rudi Hartono, M.Pd"
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Bagian 3: Materi & Evaluasi Lapangan */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-1">
                  3. Hasil Evaluasi & Monitoring Latihan
                </h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Materi / Program Latihan yang Dilaksanakan *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={materiLatihan}
                    onChange={(e) => setMateriLatihan(e.target.value)}
                    placeholder="Tuliskan materi latihan, menu fisik, intensitas latihan..."
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Evaluasi Aspek Kondisi Fisik Atlet *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={evaluasiFisik}
                      onChange={(e) => setEvaluasiFisik(e.target.value)}
                      placeholder="Ketahanan aerobik, power tungkai, daya tahan otot..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Evaluasi Teknik, Taktik & Disiplin *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={evaluasiTeknikTaktik}
                      onChange={(e) => setEvaluasiTeknikTaktik(e.target.value)}
                      placeholder="Kepatuhan instruksi pelatih, teknik gerakan..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kondisi Sarana & Prasarana Latihan
                    </label>
                    <textarea
                      rows={2}
                      value={kondisiSaranaPrasarana}
                      onChange={(e) => setKondisiSaranaPrasarana(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Kendala Lapangan Cabor
                    </label>
                    <textarea
                      rows={2}
                      value={kendalaCabor}
                      onChange={(e) => setKendalaCabor(e.target.value)}
                      placeholder="Kebutuhan alat, nutrisi, jam penggunaan venue..."
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-amber-900 mb-1">
                    Rekomendasi Tim Monev & Tindak Lanjut Bapel *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={rekomendasiBapel}
                    onChange={(e) => setRekomendasiBapel(e.target.value)}
                    placeholder="Langkah tindak lanjut Bapel untuk mendukung cabor..."
                    className="w-full border border-amber-300 bg-amber-50/40 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Bagian 4: Deteksi Atlet Butuh Perhatian Medis Segera */}
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="medicalCheck"
                    checked={hasMedicalIssue}
                    onChange={(e) => setHasMedicalIssue(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                  />
                  <label htmlFor="medicalCheck" className="font-bold text-rose-900 text-xs flex items-center gap-1.5 cursor-pointer">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    <span>Ada atlet yang memerlukan perhatian medis segera / rujukan fisioterapi Bapel</span>
                  </label>
                </div>

                {hasMedicalIssue && (
                  <div className="space-y-3 pt-2 border-t border-rose-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-rose-900 mb-1">
                          Pilih Atlet Cabor Tersebut:
                        </label>
                        <select
                          value={selectedAtletMedisId}
                          onChange={(e) => setSelectedAtletMedisId(e.target.value)}
                          required={hasMedicalIssue}
                          className="w-full border border-rose-300 rounded-lg p-2 bg-white text-xs focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="">-- Pilih Atlet --</option>
                          {caborAthletes.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.nama} ({a.nomorPertandinganNama})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-rose-900 mb-1">
                          Tindakan Rujukan Medis:
                        </label>
                        <input
                          type="text"
                          value={tindakanMedisDibutuhkan}
                          onChange={(e) => setTindakanMedisDibutuhkan(e.target.value)}
                          className="w-full border border-rose-300 rounded-lg p-2 bg-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-rose-900 mb-1">
                        Deskripsi Keluhan / Cedera Lapangan:
                      </label>
                      <input
                        type="text"
                        required={hasMedicalIssue}
                        value={keluhanMedis}
                        onChange={(e) => setKeluhanMedis(e.target.value)}
                        placeholder="Contoh: Nyeri tajam pada pergelangan kaki kanan saat mendarat dari smash"
                        className="w-full border border-rose-300 rounded-lg p-2 bg-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bagian 5: Upload Foto Dokumentasi (Max 4 foto, Max 1MB) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-600" />
                    <span>4. Upload Foto Dokumentasi (Maks. 4 Foto, Maks. 1MB per foto)</span>
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {uploadedPhotos.length} / 4 Foto
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">Pilih Berkas Foto Lapangan</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Format JPG/PNG/WebP. Sistem membatasi ukuran maksimal 1MB (1024 KB) per foto demi kecepatan cetak PDF.
                      </p>
                    </div>

                    <label className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shrink-0 ${
                      uploadedPhotos.length >= 4 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                    }`}>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Unggah Foto ({uploadedPhotos.length}/4)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadedPhotos.length >= 4}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Photo Error Banner */}
                  {photoError && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{photoError}</span>
                    </div>
                  )}

                  {/* Uploaded Photo Thumbnails List */}
                  {uploadedPhotos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {uploadedPhotos.map((photo, idx) => (
                        <div
                          key={photo.id}
                          className="border border-slate-300 rounded-lg p-2.5 bg-white flex items-start gap-3 relative shadow-xs"
                        >
                          <div className="w-16 h-16 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img src={photo.dataUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                                Foto #{idx + 1} · {photo.sizeKb} KB
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.id)}
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                                title="Hapus foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={photo.caption}
                              onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                              placeholder="Keterangan foto..."
                              className="w-full text-xs border border-slate-200 rounded px-2 py-1 mt-1 focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Laporan Monev ke Admin Bapel</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
