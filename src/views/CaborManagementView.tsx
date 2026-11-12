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
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CaborManagementView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    addCabor,
    updateCabor, 
    deleteCabor,
    nomorPertandingan,
    addNomorPertandingan,
    updateNomorPertandingan,
    deleteNomorPertandingan,
    pelatihList,
    addPelatih,
    updatePelatih,
    deletePelatih,
    atlets
  } = useApp();

  // Allow admin and monev to switch between list view and detail view
  const canManageAll = isAdmin || isMonev;
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('detail');

  const [selectedCaborId, setSelectedCaborId] = useState<string>(accessibleCabors[0]?.id || '');
  const activeCabor = accessibleCabors.find((c) => c.id === selectedCaborId) || accessibleCabors[0];

  // Search & filter for list view
  const [searchQuery, setSearchQuery] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<string>('all');

  // SubTab within detail view: 'info' | 'nomor' | 'pelatih'
  const [subTab, setSubTab] = useState<'info' | 'nomor' | 'pelatih'>('info');

  // Add Cabor Modal state
  const [isAddCaborModalOpen, setIsAddCaborModalOpen] = useState(false);
  const [newNama, setNewNama] = useState('');
  const [newSingkatan, setNewSingkatan] = useState('');
  const [newKategori, setNewKategori] = useState<'Terukur' | 'Bela Diri' | 'Akurasi' | 'Permainan'>('Terukur');
  const [newTempatLatihan, setNewTempatLatihan] = useState('');
  const [newJadwalLatihanText, setNewJadwalLatihanText] = useState('Senin, Rabu, Jumat: 15.30 - 18.00 WIB\nSabtu: 07.00 - 10.00 WIB (Fisik)');
  const [newKetuaPengkab, setNewKetuaPengkab] = useState('');
  const [newPelatihKepala, setNewPelatihKepala] = useState('');
  const [newKontak, setNewKontak] = useState('');
  const [newTargetEmas, setNewTargetEmas] = useState(1);
  const [newTargetPerak, setNewTargetPerak] = useState(1);
  const [newTargetPerunggu, setNewTargetPerunggu] = useState(1);
  const [newDeskripsi, setNewDeskripsi] = useState('');

  // Edit Cabor Modal state
  const [isEditCaborModalOpen, setIsEditCaborModalOpen] = useState(false);
  const [editingCaborId, setEditingCaborId] = useState<string>('');
  const [editCaborNama, setEditCaborNama] = useState('');
  const [editCaborSingkatan, setEditCaborSingkatan] = useState('');
  const [editKategori, setEditKategori] = useState<'Terukur' | 'Bela Diri' | 'Akurasi' | 'Permainan'>('Terukur');
  const [editTempatLatihan, setEditTempatLatihan] = useState('');
  const [editJadwalLatihanText, setEditJadwalLatihanText] = useState('');
  const [editKetuaPengkab, setEditKetuaPengkab] = useState('');
  const [editPelatihKepala, setEditPelatihKepala] = useState('');
  const [editKontak, setEditKontak] = useState('');
  const [editTargetEmas, setEditTargetEmas] = useState(0);
  const [editTargetPerak, setEditTargetPerak] = useState(0);
  const [editTargetPerunggu, setEditTargetPerunggu] = useState(0);
  const [editDeskripsi, setEditDeskripsi] = useState('');

  // Delete confirmation modal
  const [caborToDelete, setCaborToDelete] = useState<Cabor | null>(null);

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

  // Open Add Cabor Modal
  const openAddCaborModal = () => {
    setNewNama('');
    setNewSingkatan('');
    setNewKategori('Terukur');
    setNewTempatLatihan('');
    setNewJadwalLatihanText('Senin, Rabu, Jumat: 15.30 - 18.00 WIB\nSabtu: 07.00 - 10.00 WIB (Pemusatan Fisik)');
    setNewKetuaPengkab('');
    setNewPelatihKepala('');
    setNewKontak('');
    setNewTargetEmas(1);
    setNewTargetPerak(1);
    setNewTargetPerunggu(1);
    setNewDeskripsi('');
    setIsAddCaborModalOpen(true);
  };

  const handleCreateCabor = (e: React.FormEvent) => {
    e.preventDefault();
    const jadwalArray = newJadwalLatihanText
      .split('\n')
      .map((j) => j.trim())
      .filter(Boolean);

    const created = addCabor({
      nama: newNama,
      singkatan: newSingkatan.toUpperCase(),
      kategori: newKategori,
      tempatLatihan: newTempatLatihan,
      jadwalLatihan: jadwalArray.length > 0 ? jadwalArray : ['Senin - Jumat: 16.00 WIB'],
      ketuaPengkab: newKetuaPengkab || 'Pengurus Pengkab Sidoarjo',
      pelatihKepala: newPelatihKepala || 'Pelatih Puslatkab',
      kontak: newKontak || '081234567890',
      targetMedali: {
        emas: Number(newTargetEmas) || 0,
        perak: Number(newTargetPerak) || 0,
        perunggu: Number(newTargetPerunggu) || 0,
      },
      deskripsiProgram: newDeskripsi || `Pemusatan latihan intensif cabang olahraga ${newNama} Porprov 2027.`,
    });

    setIsAddCaborModalOpen(false);
    setSelectedCaborId(created.id);
    setViewMode('detail');
  };

  // Open edit cabor
  const openEditCabor = (c: Cabor) => {
    setEditingCaborId(c.id);
    setEditCaborNama(c.nama);
    setEditCaborSingkatan(c.singkatan);
    setEditKategori(c.kategori);
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
    if (!editingCaborId) return;

    const jadwalArray = editJadwalLatihanText
      .split('\n')
      .map((j) => j.trim())
      .filter(Boolean);

    updateCabor(editingCaborId, {
      nama: editCaborNama,
      singkatan: editCaborSingkatan.toUpperCase(),
      kategori: editKategori,
      tempatLatihan: editTempatLatihan,
      jadwalLatihan: jadwalArray,
      ketuaPengkab: editKetuaPengkab,
      pelatihKepala: editPelatihKepala,
      kontak: editKontak,
      targetMedali: {
        emas: Number(editTargetEmas) || 0,
        perak: Number(editTargetPerak) || 0,
        perunggu: Number(editTargetPerunggu) || 0,
      },
      deskripsiProgram: editDeskripsi,
    });

    setIsEditCaborModalOpen(false);
  };

  const confirmDeleteCabor = () => {
    if (!caborToDelete) return;
    deleteCabor(caborToDelete.id);
    setCaborToDelete(null);
    if (selectedCaborId === caborToDelete.id) {
      const remaining = accessibleCabors.filter((c) => c.id !== caborToDelete.id);
      setSelectedCaborId(remaining[0]?.id || '');
    }
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

  const filteredCabors = accessibleCabors.filter((c) => {
    const matchQuery = 
      c.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.singkatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tempatLatihan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKategori = kategoriFilter === 'all' || c.kategori === kategoriFilter;
    return matchQuery && matchKategori;
  });

  const caborNomorList = nomorPertandingan.filter((n) => n.caborId === activeCabor?.id);
  const caborPelatihList = pelatihList.filter((p) => p.caborId === activeCabor?.id);
  const caborAtletList = atlets.filter((a) => a.caborId === activeCabor?.id);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 rounded-xl text-amber-600 border border-amber-200">
              <Trophy className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Pengelolaan Cabang Olahraga & Sarana Latihan
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAdmin && 'Kelola seluruh cabang olahraga binaan Puslatkab KONI Sidoarjo, venue latihan, nomor tanding, dan pelatih.'}
            {isMonev && 'Kelola cabang olahraga di bawah naungan tim monev Anda, tambah cabor baru, nomor tanding, dan jajaran pelatih.'}
            {isCabor && 'Pengaturan venue resmi, jadwal latihan mingguan, nomor pertandingan, dan jajaran pelatih cabor Anda.'}
          </p>
        </div>

        {/* Action Controls for Admin and Monev */}
        <div className="flex items-center gap-2 flex-wrap">
          {canManageAll && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('detail')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  viewMode === 'detail' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Detail Cabor
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daftar Cabor ({accessibleCabors.length})
              </button>
            </div>
          )}

          {/* "+ Tambah Cabang Olahraga Baru" button (Available for Admin and Tim Monev) */}
          {canManageAll && (
            <button
              type="button"
              onClick={openAddCaborModal}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Tambah Cabor Baru</span>
            </button>
          )}

          {/* Cabor quick select if in detail view */}
          {viewMode === 'detail' && accessibleCabors.length > 1 && (
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
          )}
        </div>
      </div>

      {/* VIEW MODE 1: LIST VIEW (OVERVIEW OF ALL CABORS) */}
      {viewMode === 'list' && canManageAll && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari cabang olahraga, singkatan, atau tempat latihan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-slate-50/50 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Kategori:</span>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="text-xs border rounded-xl px-3 py-2 bg-slate-50 font-semibold"
              >
                <option value="all">Semua Kategori</option>
                <option value="Terukur">Terukur</option>
                <option value="Bela Diri">Bela Diri</option>
                <option value="Akurasi">Akurasi</option>
                <option value="Permainan">Permainan</option>
              </select>
            </div>
          </div>

          {/* Cabor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCabors.map((cabor) => {
              const cNomor = nomorPertandingan.filter((n) => n.caborId === cabor.id);
              const cPelatih = pelatihList.filter((p) => p.caborId === cabor.id);
              const cAtlet = atlets.filter((a) => a.caborId === cabor.id);

              return (
                <div 
                  key={cabor.id} 
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                        {cabor.kategori}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {cabor.singkatan}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {cabor.nama}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{cabor.tempatLatihan}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Atlet</span>
                        <span className="text-sm font-bold font-mono text-slate-800">{cAtlet.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Nomor</span>
                        <span className="text-sm font-bold font-mono text-slate-800">{cNomor.length}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Pelatih</span>
                        <span className="text-sm font-bold font-mono text-slate-800">{cPelatih.length}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Target Emas:</span>
                      <span className="font-bold text-amber-600 font-mono">
                        {cabor.targetMedali.emas} Emas · {cabor.targetMedali.perak} Perak · {cabor.targetMedali.perunggu} Prg
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditCabor(cabor)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Edit Cabor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => setCaborToDelete(cabor)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Hapus Cabor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCaborId(cabor.id);
                        setViewMode('detail');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <span>Kelola & Venue</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredCabors.length === 0 && (
              <div className="col-span-full p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed">
                Tidak ada cabor yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ACTIVE CABOR DETAIL VIEW */}
      {viewMode === 'detail' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Cabor Banner Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full uppercase">
                    {activeCabor ? activeCabor.kategori : '-'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Pengkab: {activeCabor ? activeCabor.singkatan : '-'}
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {activeCabor ? activeCabor.nama : 'Pilih Cabang Olahraga'}
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl line-clamp-2">
                  {activeCabor?.deskripsiProgram || 'Fokus pemusatan latihan intensif menuju medali Porprov Jatim 2027.'}
                </p>
              </div>

              {activeCabor && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditCabor(activeCabor)}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Data Cabor & Venue</span>
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setCaborToDelete(activeCabor)}
                      className="p-2 bg-slate-800 hover:bg-rose-900/80 text-rose-400 hover:text-white rounded-xl transition-colors border border-slate-700"
                      title="Hapus Cabor Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sub Navigation Tabs */}
            {activeCabor && (
              <div className="flex items-center gap-2 mt-6 border-t border-slate-700/80 pt-4 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSubTab('info')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
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
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
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
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                    subTab === 'pelatih'
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Data Pelatih ({caborPelatihList.length})
                </button>
              </div>
            )}
          </div>

          {/* Tab 1: Info Venue & Jadwal */}
          {activeCabor && subTab === 'info' && (
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
          {activeCabor && subTab === 'nomor' && (
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
          {activeCabor && subTab === 'pelatih' && (
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
      )}

      {/* MODAL: Tambah Cabang Olahraga Baru (Admin & Tim Monev) */}
      {isAddCaborModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold">Tambah Cabang Olahraga Baru</h2>
              </div>
              <button 
                type="button" 
                onClick={() => setIsAddCaborModalOpen(false)} 
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCabor} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Cabor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Taekwondo, Karate, Wushu"
                    value={newNama}
                    onChange={(e) => setNewNama(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Singkatan / Pengkab *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TI, FORKI, WI"
                    value={newSingkatan}
                    onChange={(e) => setNewSingkatan(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori Olahraga</label>
                <select
                  value={newKategori}
                  onChange={(e: any) => setNewKategori(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                >
                  <option value="Terukur">Terukur (Atletik, Renang, Angkat Besi, dll.)</option>
                  <option value="Bela Diri">Bela Diri (Taekwondo, Karate, Judo, Pencak Silat, dll.)</option>
                  <option value="Akurasi">Akurasi (Panahan, Menembak, Biliar, dll.)</option>
                  <option value="Permainan">Permainan (Bulutangkis, Sepakbola, Bola Voli, Tenis Meja, dll.)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tempat / Venue Latihan Resmi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dojo KONI Sidoarjo, Jl. Pahlawan No. 1"
                  value={newTempatLatihan}
                  onChange={(e) => setNewTempatLatihan(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Jadwal Latihan Mingguan (1 baris per sesi)</label>
                <textarea
                  rows={3}
                  required
                  value={newJadwalLatihanText}
                  onChange={(e) => setNewJadwalLatihanText(e.target.value)}
                  className="w-full border rounded-lg p-2.5 font-mono text-[11px] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <label className="block font-semibold text-amber-700 mb-1">Target Emas</label>
                  <input
                    type="number"
                    min={0}
                    value={newTargetEmas}
                    onChange={(e) => setNewTargetEmas(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Perak</label>
                  <input
                    type="number"
                    min={0}
                    value={newTargetPerak}
                    onChange={(e) => setNewTargetPerak(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-orange-700 mb-1">Target Perunggu</label>
                  <input
                    type="number"
                    min={0}
                    value={newTargetPerunggu}
                    onChange={(e) => setNewTargetPerunggu(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Ketua Pengkab</label>
                  <input
                    type="text"
                    placeholder="Nama Ketua Pengkab"
                    value={newKetuaPengkab}
                    onChange={(e) => setNewKetuaPengkab(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pelatih Kepala</label>
                  <input
                    type="text"
                    placeholder="Nama Pelatih Kepala"
                    value={newPelatihKepala}
                    onChange={(e) => setNewPelatihKepala(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">No. Kontak / WhatsApp Pengurus</label>
                <input
                  type="text"
                  placeholder="0812xxxxxxxx"
                  value={newKontak}
                  onChange={(e) => setNewKontak(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi / Program Puslatkab</label>
                <textarea
                  rows={2}
                  placeholder="Target dan program latihan intensif Porprov 2027..."
                  value={newDeskripsi}
                  onChange={(e) => setNewDeskripsi(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddCaborModalOpen(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Tambahkan Cabang Olahraga</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Cabor Details */}
      {isEditCaborModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold">Edit Cabang Olahraga, Venue & Jadwal</h2>
              </div>
              <button onClick={() => setIsEditCaborModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCabor} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Cabor</label>
                  <input
                    type="text"
                    required
                    value={editCaborNama}
                    onChange={(e) => setEditCaborNama(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Singkatan / Pengkab</label>
                  <input
                    type="text"
                    required
                    value={editCaborSingkatan}
                    onChange={(e) => setEditCaborSingkatan(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kategori Olahraga</label>
                <select
                  value={editKategori}
                  onChange={(e: any) => setEditKategori(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                >
                  <option value="Terukur">Terukur</option>
                  <option value="Bela Diri">Bela Diri</option>
                  <option value="Akurasi">Akurasi</option>
                  <option value="Permainan">Permainan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Tempat / Venue Latihan</label>
                <input
                  type="text"
                  required
                  value={editTempatLatihan}
                  onChange={(e) => setEditTempatLatihan(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Jadwal Latihan (1 baris per sesi)</label>
                <textarea
                  rows={3}
                  required
                  value={editJadwalLatihanText}
                  onChange={(e) => setEditJadwalLatihanText(e.target.value)}
                  className="w-full border rounded-lg p-2.5 font-mono text-[11px] bg-slate-50 focus:bg-white"
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
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Pelatih Kepala</label>
                  <input
                    type="text"
                    value={editPelatihKepala}
                    onChange={(e) => setEditPelatihKepala(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">No. Kontak WhatsApp</label>
                <input
                  type="text"
                  value={editKontak}
                  onChange={(e) => setEditKontak(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi / Program Puslatkab</label>
                <textarea
                  rows={2}
                  value={editDeskripsi}
                  onChange={(e) => setEditDeskripsi(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditCaborModalOpen(false)}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Cabor Confirmation */}
      {caborToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl p-6 my-auto border border-slate-200 text-xs space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Konfirmasi Hapus Cabang Olahraga</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed">
              Apakah Anda yakin ingin menghapus cabor <strong className="text-slate-900">{caborToDelete.nama} ({caborToDelete.singkatan})</strong> beserta seluruh data nomor pertandingan, pelatih, atlet, dan tes fisik terkait?
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => setCaborToDelete(null)}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteCabor}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
              >
                Ya, Hapus Cabor
              </button>
            </div>
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
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori Gender</label>
                  <select
                    value={nomorGender}
                    onChange={(e: any) => setNomorGender(e.target.value)}
                    className="w-full border rounded-lg p-2.5 bg-white"
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
                    className="w-full border rounded-lg p-2.5 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Prestasi Porprov</label>
                <select
                  value={nomorTarget}
                  onChange={(e: any) => setNomorTarget(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-white"
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
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl"
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
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Peran / Jabatan Pelatih</label>
                <select
                  value={pelatihPeran}
                  onChange={(e: any) => setPelatihPeran(e.target.value)}
                  className="w-full border rounded-lg p-2.5 bg-white"
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
                  className="w-full border rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  placeholder="0812xxxxxxxx"
                  value={pelatihKontak}
                  onChange={(e) => setPelatihKontak(e.target.value)}
                  className="w-full border rounded-lg p-2.5 font-mono bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setPelatihModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl"
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
