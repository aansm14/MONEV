import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Atlet, ConditionStatus } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  HeartPulse, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const AthletesView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    atlets, 
    addAtlet, 
    updateAtlet, 
    deleteAtlet,
    updateAtletCondition,
    nomorPertandingan 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaborFilter, setSelectedCaborFilter] = useState('all');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState('all');

  // Add/Edit Atlet Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtlet, setEditingAtlet] = useState<Atlet | null>(null);
  const [formNama, setFormNama] = useState('');
  const [formNik, setFormNik] = useState('');
  const [formTtl, setFormTtl] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formCaborId, setFormCaborId] = useState(accessibleCabors[0]?.id || '');
  const [formNomorId, setFormNomorId] = useState('');
  const [formTinggi, setFormTinggi] = useState(170);
  const [formBerat, setFormBerat] = useState(65);
  const [formStatus, setFormStatus] = useState<ConditionStatus>('Bugar');
  const [formCatatan, setFormCatatan] = useState('');

  // Quick Condition Status Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetAtlet, setTargetAtlet] = useState<Atlet | null>(null);
  const [newStatus, setNewStatus] = useState<ConditionStatus>('Bugar');
  const [newCatatan, setNewCatatan] = useState('');
  const [newRujukan, setNewRujukan] = useState('');

  const accessibleCaborIds = accessibleCabors.map((c) => c.id);

  // Filtered Athletes
  const filteredAthletes = atlets.filter((a) => {
    if (!isAdmin && !accessibleCaborIds.includes(a.caborId)) {
      return false;
    }
    if (selectedCaborFilter !== 'all' && a.caborId !== selectedCaborFilter) {
      return false;
    }
    if (selectedConditionFilter !== 'all' && a.statusKondisi !== selectedConditionFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.nama.toLowerCase().includes(q) ||
        a.nik.includes(q) ||
        a.nomorPertandinganNama.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const availableNomor = nomorPertandingan.filter((n) => n.caborId === formCaborId);

  const openAddModal = () => {
    setEditingAtlet(null);
    setFormNama('');
    setFormNik(`35150${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setFormTtl('Sidoarjo, 15 Mei 2004');
    setFormGender('L');
    const firstCabor = accessibleCabors[0]?.id || '';
    setFormCaborId(firstCabor);
    const nom = nomorPertandingan.find((n) => n.caborId === firstCabor);
    setFormNomorId(nom ? nom.id : '');
    setFormTinggi(172);
    setFormBerat(66);
    setFormStatus('Bugar');
    setFormCatatan('Kondisi fisik prima, siap latihan.');
    setIsModalOpen(true);
  };

  const openEditModal = (a: Atlet) => {
    setEditingAtlet(a);
    setFormNama(a.nama);
    setFormNik(a.nik);
    setFormTtl(a.tempatTanggalLahir);
    setFormGender(a.jenisKelamin);
    setFormCaborId(a.caborId);
    setFormNomorId(a.nomorPertandinganId);
    setFormTinggi(a.tinggiBadan);
    setFormBerat(a.beratBadan);
    setFormStatus(a.statusKondisi);
    setFormCatatan(a.catatanKondisi);
    setIsModalOpen(true);
  };

  const handleSaveAtlet = (e: React.FormEvent) => {
    e.preventDefault();
    const nom = nomorPertandingan.find((n) => n.id === formNomorId);
    const nomorNama = nom ? nom.namaNomor : 'Umum';

    if (editingAtlet) {
      updateAtlet(editingAtlet.id, {
        nama: formNama,
        nik: formNik,
        tempatTanggalLahir: formTtl,
        jenisKelamin: formGender,
        caborId: formCaborId,
        nomorPertandinganId: formNomorId,
        nomorPertandinganNama: nomorNama,
        tinggiBadan: formTinggi,
        beratBadan: formBerat,
        statusKondisi: formStatus,
        catatanKondisi: formCatatan,
      });
    } else {
      addAtlet({
        nama: formNama,
        nik: formNik,
        tempatTanggalLahir: formTtl,
        jenisKelamin: formGender,
        caborId: formCaborId,
        nomorPertandinganId: formNomorId,
        nomorPertandinganNama: nomorNama,
        tinggiBadan: formTinggi,
        beratBadan: formBerat,
        statusKondisi: formStatus,
        catatanKondisi: formCatatan,
      });
    }
    setIsModalOpen(false);
  };

  const openStatusModal = (a: Atlet) => {
    setTargetAtlet(a);
    setNewStatus(a.statusKondisi);
    setNewCatatan(a.catatanKondisi);
    setNewRujukan('Rujukan Fisioterapi Bapel KONI Sidoarjo');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAtlet) return;
    updateAtletCondition(
      targetAtlet.id, 
      newStatus, 
      newCatatan, 
      newStatus === 'Perhatian Medis Segera' ? newRujukan : undefined
    );
    setStatusModalOpen(false);
  };

  const caborMap = new Map(accessibleCabors.map((c) => [c.id, c.nama]));

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Data Atlet & Pemantauan Kebugaran Puslatkab
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau status kondisi fisik harian: Bugar, Pemulihan Cedera, Sakit/Izin, serta notifikasi Atlet yang Memerlukan Perhatian Medis Segera.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Atlet Puslatkab</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama atlet, nomor pertandingan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Cabor:</span>
            <select
              value={selectedCaborFilter}
              onChange={(e) => setSelectedCaborFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">Semua Cabor ({accessibleCabors.length})</option>
              {accessibleCabors.map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status Kondisi:</span>
            <select
              value={selectedConditionFilter}
              onChange={(e) => setSelectedConditionFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="Bugar">Bugar (Siap Latih)</option>
              <option value="Pemulihan Cedera">Pemulihan Cedera</option>
              <option value="Perhatian Medis Segera">Perhatian Medis Segera</option>
              <option value="Sakit/Izin">Sakit / Izin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Athletes Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="py-3 px-4 font-bold">Nama Atlet</th>
                <th className="py-3 px-4 font-bold">Cabor & Nomor Pertandingan</th>
                <th className="py-3 px-4 font-bold text-center">Postur</th>
                <th className="py-3 px-4 font-bold">Status Kondisi Fisik</th>
                <th className="py-3 px-4 font-bold">Catatan Kebugaran / Medis</th>
                <th className="py-3 px-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAthletes.map((atlet) => (
                <tr key={atlet.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Name & NIK */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {atlet.nama}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      NIK: {atlet.nik} · {atlet.jenisKelamin === 'L' ? 'Putra' : 'Putri'}
                    </div>
                  </td>

                  {/* Cabor & Discipline */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      {caborMap.get(atlet.caborId) || 'Cabor'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {atlet.nomorPertandinganNama}
                    </div>
                  </td>

                  {/* Body measurement */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    <span className="font-semibold text-slate-800">{atlet.tinggiBadan} cm</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span className="font-semibold text-slate-800">{atlet.beratBadan} kg</span>
                  </td>

                  {/* Condition Status with Quick Updater Button */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => openStatusModal(atlet)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-xs ${
                        atlet.statusKondisi === 'Bugar'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                          : atlet.statusKondisi === 'Pemulihan Cedera'
                          ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                          : atlet.statusKondisi === 'Perhatian Medis Segera'
                          ? 'bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 animate-pulse'
                          : 'bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100'
                      }`}
                      title="Klik untuk ubah status kondisi"
                    >
                      {atlet.statusKondisi === 'Perhatian Medis Segera' && (
                        <HeartPulse className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      )}
                      <span>{atlet.statusKondisi}</span>
                      <Edit2 className="w-2.5 h-2.5 opacity-60" />
                    </button>
                  </td>

                  {/* Notes / Injuries */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-[11px] text-slate-700 line-clamp-2">
                      {atlet.catatanKondisi || '-'}
                    </p>
                    {atlet.riwayatCedera && atlet.riwayatCedera.length > 0 && (
                      <span className="text-[10px] text-rose-700 font-semibold mt-0.5 block">
                        Riwayat: {atlet.riwayatCedera[0].diagnosa} ({atlet.riwayatCedera[0].status})
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(atlet)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-100"
                        title="Edit Data Atlet"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAtlet(atlet.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="Hapus Atlet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredAthletes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    Tidak ada atlet yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah/Edit Atlet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-sm font-bold">
                {editingAtlet ? 'Edit Data Atlet Puslatkab' : 'Tambah Atlet Puslatkab Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveAtlet} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nama Lengkap Atlet *</label>
                  <input
                    type="text"
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">NIK (16 Digit)</label>
                  <input
                    type="text"
                    required
                    value={formNik}
                    onChange={(e) => setFormNik(e.target.value)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tempat, Tanggal Lahir</label>
                  <input
                    type="text"
                    value={formTtl}
                    onChange={(e) => setFormTtl(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={formGender}
                    onChange={(e: any) => setFormGender(e.target.value)}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    <option value="L">Laki-laki (Putra)</option>
                    <option value="P">Perempuan (Putri)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Cabang Olahraga *</label>
                  <select
                    value={formCaborId}
                    onChange={(e) => {
                      setFormCaborId(e.target.value);
                      const nom = nomorPertandingan.find((n) => n.caborId === e.target.value);
                      setFormNomorId(nom ? nom.id : '');
                    }}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    {accessibleCabors.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nomor Pertandingan *</label>
                  <select
                    value={formNomorId}
                    onChange={(e) => setFormNomorId(e.target.value)}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    {availableNomor.map((n) => (
                      <option key={n.id} value={n.id}>{n.namaNomor}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={formTinggi}
                    onChange={(e) => setFormTinggi(parseInt(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formBerat}
                    onChange={(e) => setFormBerat(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Status Kebugaran Atlet</label>
                <select
                  value={formStatus}
                  onChange={(e: any) => setFormStatus(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white font-semibold"
                >
                  <option value="Bugar">Bugar (Siap Latih Penuh)</option>
                  <option value="Pemulihan Cedera">Pemulihan Cedera (Latihan Ringan / Fisioterapi)</option>
                  <option value="Perhatian Medis Segera">Perhatian Medis Segera (Butuh Rujukan Bapel)</option>
                  <option value="Sakit/Izin">Sakit / Izin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Kondisi / Keluhan Fisik</label>
                <textarea
                  rows={2}
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Catatan kebugaran atau keluhan nyeri..."
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Simpan Atlet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Update Status Kebugaran Cepat */}
      {statusModalOpen && targetAtlet && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold">Update Status Kebugaran Atlet</h2>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">{targetAtlet.nama}</p>
              </div>
              <button onClick={() => setStatusModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Pilih Status Baru:</label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white text-xs font-bold"
                >
                  <option value="Bugar">Bugar (Siap Latih)</option>
                  <option value="Pemulihan Cedera">Pemulihan Cedera</option>
                  <option value="Perhatian Medis Segera">Perhatian Medis Segera (Memicu Alert Notifikasi Bapel)</option>
                  <option value="Sakit/Izin">Sakit / Izin</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Kondisi / Diagnosa:</label>
                <textarea
                  rows={2}
                  required
                  value={newCatatan}
                  onChange={(e) => setNewCatatan(e.target.value)}
                  placeholder="Keterangan keluhan atau perkembangan kebugaran..."
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>

              {newStatus === 'Perhatian Medis Segera' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-1">
                  <label className="block font-bold text-rose-900">Rencana Rujukan / Tindakan:</label>
                  <input
                    type="text"
                    value={newRujukan}
                    onChange={(e) => setNewRujukan(e.target.value)}
                    placeholder="Contoh: Fisioterapi Bapel KONI Sidoarjo / RSUD Sidoarjo"
                    className="w-full border border-rose-300 rounded p-1.5 bg-white text-xs"
                  />
                  <p className="text-[10px] text-rose-700 mt-1">
                    Status ini otomatis memicu banner notifikasi real-time di dashboard admin & tim monev!
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
