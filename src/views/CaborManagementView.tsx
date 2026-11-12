import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cabor, NomorPertandingan, Pelatih } from '../types';
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Medal, 
  Check, 
  Phone,
  Layers,
  Sparkles
} from 'lucide-react';

export const CaborManagementView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    updateCabor, 
    addCabor,
    nomorPertandingan,
    addNomorPertandingan,
    updateNomorPertandingan,
    deleteNomorPertandingan,
    pelatihList,
    addPelatih,
    updatePelatih,
    deletePelatih
  } = useApp();

  const [selectedCaborId, setSelectedCaborId] = useState<string>(accessibleCabors[0]?.id || '');
  const activeCabor = accessibleCabors.find((c) => c.id === selectedCaborId) || accessibleCabors[0];

  // Tab within cabor management: 'info' | 'nomor' | 'pelatih'
  const [subTab, setSubTab] = useState<'info' | 'nomor' | 'pelatih'>('info');

  // Edit Cabor Modal state
  const [isEditCaborModalOpen, setIsEditCaborModalOpen] = useState(false);
  const [editCaborNama, setEditCaborNama] = useState('');
  const [editCaborSingkatan, setEditCaborSingkatan] = useState('');
  const [editTempatLatihan, setEditTempatLatihan] = useState('');
  const [editJadwalLatihanText, setEditJadwalLatihanText] = useState('');
  const [editKetuaPengkab, setEditKetuaPengkab] = useState('');
  const [editPelatihKepala, setEditPelatihKepala] = useState('');
  const [editKontak, setEditKontak] = useState('');
  const [editTargetEmas, setEditTargetEmas] = useState(0);
  const [editTargetPerak, setEditTargetPerak] = useState(0);
  const [editTargetPerunggu, setEditTargetPerunggu] = useState(0);
  const [editDeskripsi, setEditDeskripsi] = useState('');

  // Add/Edit Nomor Pertandingan Modal
  const [nomorModalOpen, setNomorModalOpen] = useState(false);
  const [editingNomor, setEditingNomor] = useState<NomorPertandingan | null>(null);
  const [nomorNama, setNomorNama] = useState('');
  const [nomorGender, setNomorGender] = useState<'Putra' | 'Putri' | 'Campuran'>('Putra');
  const [nomorTarget, setNomorTarget] = useState<'Target Emas' | 'Target Perak' | 'Target Medali' | 'Lolos Porprov'>('Target Emas');
  const [nomorKuota, setNomorKuota] = useState(2);

  // Add/Edit Pelatih Modal
  const [pelatihModalOpen, setPelatihModalOpen] = useState(false);
  const [editingPelatih, setEditingPelatih] = useState<Pelatih | null>(null);
  const [pelatihNama, setPelatihNama] = useState('');
  const [pelatihPeran, setPelatihPeran] = useState<'Pelatih Kepala' | 'Pelatih Fisik' | 'Pelatih Teknik' | 'Asisten Pelatih'>('Pelatih Kepala');
  const [pelatihLisensi, setPelatihLisensi] = useState('');
  const [pelatihKontak, setPelatihKontak] = useState('');

  // Open edit cabor
  const openEditCabor = (c: Cabor) => {
    setEditCaborNama(c.nama);
    setEditCaborSingkatan(c.singkatan);
    setEditTempatLatihan(c.tempatLatihan);
    setEditJadwalLatihanText(c.jadwalLatihan.join('\n'));
    setEditKetuaPengkab(c.ketuaPengkab);
    setEditPelatihKepala(c.pelatihKepala);
    setEditKontak(c.kontak);
    setEditTargetEmas(c.targetMedali.emas);
    setEditTargetPerak(c.targetMedali.perak);
    setEditTargetPerunggu(c.targetMedali.perunggu);
    setEditDeskripsi(c.deskripsiProgram || '');
    setIsEditCaborModalOpen(true);
  };

  const handleSaveCabor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabor) return;

    const jadwalArray = editJadwalLatihanText
      .split('\n')
      .map((j) => j.trim())
      .filter(Boolean);

    updateCabor(activeCabor.id, {
      nama: editCaborNama,
      singkatan: editCaborSingkatan,
      tempatLatihan: editTempatLatihan,
      jadwalLatihan: jadwalArray,
      ketuaPengkab: editKetuaPengkab,
      pelatihKepala: editPelatihKepala,
      kontak: editKontak,
      targetMedali: {
        emas: editTargetEmas,
        perak: editTargetPerak,
        perunggu: editTargetPerunggu,
      },
      deskripsiProgram: editDeskripsi,
    });

    setIsEditCaborModalOpen(false);
  };

  // Nomor Pertandingan handlers
  const openAddNomor = () => {
    setEditingNomor(null);
    setNomorNama('');
    setNomorGender('Putra');
    setNomorTarget('Target Emas');
    setNomorKuota(2);
    setNomorModalOpen(true);
  };

  const openEditNomor = (n: NomorPertandingan) => {
    setEditingNomor(n);
    setNomorNama(n.namaNomor);
    setNomorGender(n.gender);
    setNomorTarget(n.targetPrestasi);
    setNomorKuota(n.kuotaAtlet);
    setNomorModalOpen(true);
  };

  const handleSaveNomor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabor) return;

    if (editingNomor) {
      updateNomorPertandingan(editingNomor.id, {
        namaNomor: nomorNama,
        gender: nomorGender,
        targetPrestasi: nomorTarget,
        kuotaAtlet: nomorKuota,
      });
    } else {
      addNomorPertandingan({
        caborId: activeCabor.id,
        namaNomor: nomorNama,
        gender: nomorGender,
        targetPrestasi: nomorTarget,
        kuotaAtlet: nomorKuota,
      });
    }
    setNomorModalOpen(false);
  };

  // Pelatih handlers
  const openAddPelatih = () => {
    setEditingPelatih(null);
    setPelatihNama('');
    setPelatihPeran('Pelatih Kepala');
    setPelatihLisensi('');
    setPelatihKontak('');
    setPelatihModalOpen(true);
  };

  const openEditPelatih = (p: Pelatih) => {
    setEditingPelatih(p);
    setPelatihNama(p.nama);
    setPelatihPeran(p.peran);
    setPelatihLisensi(p.lisensi);
    setPelatihKontak(p.kontak);
    setPelatihModalOpen(true);
  };

  const handleSavePelatih = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabor) return;

    if (editingPelatih) {
      updatePelatih(editingPelatih.id, {
        nama: pelatihNama,
        peran: pelatihPeran,
        lisensi: pelatihLisensi,
        kontak: pelatihKontak,
      });
    } else {
      addPelatih({
        caborId: activeCabor.id,
        nama: pelatihNama,
        peran: pelatihPeran,
        lisensi: pelatihLisensi,
        kontak: pelatihKontak,
      });
    }
    setPelatihModalOpen(false);
  };

  const caborNomorList = nomorPertandingan.filter((n) => n.caborId === activeCabor?.id);
  const caborPelatihList = pelatihList.filter((p) => p.caborId === activeCabor?.id);

  if (!activeCabor) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Tidak ada cabor yang dapat diakses oleh akun Anda.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Pengelolaan Cabang Olahraga & Sarana Latihan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengaturan tempat latihan (venue), jadwal latihan mingguan, nomor pertandingan, dan jajaran pelatih Porprov 2027.
          </p>
        </div>

        {/* Cabor Selector if multiple cabors accessible */}
        {accessibleCabors.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Pilih Cabor:</span>
            <select
              value={selectedCaborId}
              onChange={(e) => setSelectedCaborId(e.target.value)}
              className="text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500"
            >
              {accessibleCabors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama} ({c.kategori})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Active Cabor Card with Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Cabor Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase">
                  {activeCabor.kategori}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Pengkab: {activeCabor.singkatan}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {activeCabor.nama}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">
                {activeCabor.deskripsiProgram || 'Fokus pemusatan latihan intensif menuju medali Porprov Jatim 2027.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openEditCabor(activeCabor)}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Venue & Jadwal</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 border-t border-slate-700/80 pt-4">
            <button
              type="button"
              onClick={() => setSubTab('info')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                subTab === 'info'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Info Venue & Jadwal
            </button>
            <button
              type="button"
              onClick={() => setSubTab('nomor')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                subTab === 'nomor'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Nomor Pertandingan ({caborNomorList.length})
            </button>
            <button
              type="button"
              onClick={() => setSubTab('pelatih')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                subTab === 'pelatih'
                  ? 'bg-amber-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Data Pelatih ({caborPelatihList.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Info Venue & Jadwal */}
        {subTab === 'info' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left: Venue & Schedule */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Tempat / Venue Latihan Resmi</span>
                  </h3>
                  <p className="text-sm font-semibold text-slate-800">
                    {activeCabor.tempatLatihan}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Jadwal Latihan Pemusatan Latihan</span>
                  </h3>
                  <div className="space-y-2">
                    {activeCabor.jadwalLatihan.map((j, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-amber-600 font-bold font-mono">0{idx + 1}.</span>
                        <span className="font-medium">{j}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Target Medali & Struktur */}
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Medal className="w-4 h-4 text-amber-500" />
                    <span>Target Medali Porprov Jatim 2027</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <span className="text-[11px] font-bold text-amber-800 block">Emas</span>
                      <span className="text-2xl font-black text-amber-700 font-mono">
                        {activeCabor.targetMedali.emas}
                      </span>
                    </div>
                    <div className="bg-slate-100 border border-slate-300 rounded-xl p-3">
                      <span className="text-[11px] font-bold text-slate-700 block">Perak</span>
                      <span className="text-2xl font-black text-slate-700 font-mono">
                        {activeCabor.targetMedali.perak}
                      </span>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <span className="text-[11px] font-bold text-orange-800 block">Perunggu</span>
                      <span className="text-2xl font-black text-orange-700 font-mono">
                        {activeCabor.targetMedali.perunggu}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 text-xs space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Kontak & Kepengurusan
                  </h3>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">Ketua Pengkab:</span>
                    <span className="font-bold text-slate-800">{activeCabor.ketuaPengkab}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-slate-500">Pelatih Kepala:</span>
                    <span className="font-bold text-slate-800">{activeCabor.pelatihKepala}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kontak Person:</span>
                    <span className="font-bold text-slate-800 font-mono">{activeCabor.kontak}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Nomor Pertandingan */}
        {subTab === 'nomor' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Nomor Pertandingan Diikuti
                </h3>
                <p className="text-xs text-slate-500">
                  Nomor disiplin yang diikuti cabor {activeCabor.nama} untuk Porprov 2027
                </p>
              </div>

              <button
                type="button"
                onClick={openAddNomor}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Tambah Nomor Pertandingan</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {caborNomorList.map((nomor) => (
                <div key={nomor.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {nomor.namaNomor}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Kategori: {nomor.gender}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        {nomor.targetPrestasi}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Kuota Atlet Terdaftar: <span className="font-mono font-bold text-slate-700">{nomor.kuotaAtlet} Atlet</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditNomor(nomor)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-100"
                      title="Edit Nomor"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNomorPertandingan(nomor.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Hapus Nomor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {caborNomorList.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Belum ada nomor pertandingan yang ditambahkan untuk cabor ini.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Data Pelatih */}
        {subTab === 'pelatih' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Jajaran Tim Pelatih Puslatkab
                </h3>
                <p className="text-xs text-slate-500">
                  Pelatih kepala, pelatih fisik, dan asisten pelatih pendamping atlet
                </p>
              </div>

              <button
                type="button"
                onClick={openAddPelatih}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Tambah Pelatih</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caborPelatihList.map((pelatih) => (
                <div key={pelatih.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {pelatih.peran}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 pt-1">
                      {pelatih.nama}
                    </h4>
                    <p className="text-slate-600 font-medium">
                      Lisensi: {pelatih.lisensi}
                    </p>
                    <p className="text-slate-500 font-mono text-[11px] pt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{pelatih.kontak}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditPelatih(pelatih)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePelatih(pelatih.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {caborPelatihList.length === 0 && (
                <div className="col-span-2 p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                  Belum ada pelatih yang terdata untuk cabor ini.
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: Edit Cabor Details */}
      {isEditCaborModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-sm font-bold">Edit Informasi Cabor, Venue & Jadwal</h2>
              <button onClick={() => setIsEditCaborModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCabor} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Cabor</label>
                  <input
                    type="text"
                    required
                    value={editCaborNama}
                    onChange={(e) => setEditCaborNama(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Singkatan / Pengkab</label>
                  <input
                    type="text"
                    required
                    value={editCaborSingkatan}
                    onChange={(e) => setEditCaborSingkatan(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tempat / Venue Latihan</label>
                <input
                  type="text"
                  required
                  value={editTempatLatihan}
                  onChange={(e) => setEditTempatLatihan(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Jadwal Latihan (1 baris per sesi)</label>
                <textarea
                  rows={3}
                  required
                  value={editJadwalLatihanText}
                  onChange={(e) => setEditJadwalLatihanText(e.target.value)}
                  className="w-full border rounded-lg p-2 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <label className="block font-semibold text-amber-700 mb-1">Target Emas</label>
                  <input
                    type="number"
                    min={0}
                    value={editTargetEmas}
                    onChange={(e) => setEditTargetEmas(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Perak</label>
                  <input
                    type="number"
                    min={0}
                    value={editTargetPerak}
                    onChange={(e) => setEditTargetPerak(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-orange-700 mb-1">Target Perunggu</label>
                  <input
                    type="number"
                    min={0}
                    value={editTargetPerunggu}
                    onChange={(e) => setEditTargetPerunggu(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Ketua Pengkab</label>
                  <input
                    type="text"
                    value={editKetuaPengkab}
                    onChange={(e) => setEditKetuaPengkab(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">No. Kontak</label>
                  <input
                    type="text"
                    value={editKontak}
                    onChange={(e) => setEditKontak(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi / Program Puslatkab</label>
                <textarea
                  rows={2}
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditCaborModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Nomor Pertandingan */}
      {nomorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-sm font-bold">
                {editingNomor ? 'Edit Nomor Pertandingan' : 'Tambah Nomor Pertandingan'}
              </h2>
              <button onClick={() => setNomorModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveNomor} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Nama Nomor Pertandingan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tunggal Putra, Kelas 61kg, Sprint 100m"
                  value={nomorNama}
                  onChange={(e) => setNomorNama(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori Gender</label>
                  <select
                    value={nomorGender}
                    onChange={(e: any) => setNomorGender(e.target.value)}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    <option value="Putra">Putra</option>
                    <option value="Putri">Putri</option>
                    <option value="Campuran">Campuran</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Kuota Atlet</label>
                  <input
                    type="number"
                    min={1}
                    value={nomorKuota}
                    onChange={(e) => setNomorKuota(parseInt(e.target.value) || 1)}
                    className="w-full border rounded-lg p-2 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Prestasi Porprov</label>
                <select
                  value={nomorTarget}
                  onChange={(e: any) => setNomorTarget(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white"
                >
                  <option value="Target Emas">Target Emas</option>
                  <option value="Target Perak">Target Perak</option>
                  <option value="Target Medali">Target Medali</option>
                  <option value="Lolos Porprov">Lolos Porprov</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setNomorModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Simpan Nomor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Pelatih */}
      {pelatihModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-sm font-bold">
                {editingPelatih ? 'Edit Data Pelatih' : 'Tambah Pelatih Baru'}
              </h2>
              <button onClick={() => setPelatihModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSavePelatih} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Hendra Setiawan, S.Pd"
                  value={pelatihNama}
                  onChange={(e) => setPelatihNama(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Peran / Jabatan Pelatih</label>
                <select
                  value={pelatihPeran}
                  onChange={(e: any) => setPelatihPeran(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white"
                >
                  <option value="Pelatih Kepala">Pelatih Kepala</option>
                  <option value="Pelatih Fisik">Pelatih Fisik</option>
                  <option value="Pelatih Teknik">Pelatih Teknik</option>
                  <option value="Asisten Pelatih">Asisten Pelatih</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lisensi Kepelatihan</label>
                <input
                  type="text"
                  placeholder="Contoh: BWF Level 2, Sertifikasi Kemenpora"
                  value={pelatihLisensi}
                  onChange={(e) => setPelatihLisensi(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="0812xxxxxxxx"
                  value={pelatihKontak}
                  onChange={(e) => setPelatihKontak(e.target.value)}
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPelatihModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Simpan Pelatih
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
