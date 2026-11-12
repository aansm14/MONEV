import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Atlet, ConditionStatus } from '../types';
import { 
  HeartPulse, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Stethoscope, 
  ShieldCheck, 
  Phone, 
  FileText, 
  Calendar,
  Check,
  Edit2
} from 'lucide-react';

export const MedicalAlertsView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    atlets, 
    updateAtletCondition 
  } = useApp();

  const accessibleCaborIds = accessibleCabors.map((c) => c.id);
  const relevantAthletes = atlets.filter((a) => {
    if (!isAdmin && !accessibleCaborIds.includes(a.caborId)) {
      return false;
    }
    return true;
  });

  const caborMap = new Map(accessibleCabors.map((c) => [c.id, c.nama]));

  // Athletes needing immediate medical intervention
  const urgentAthletes = relevantAthletes.filter((a) => a.statusKondisi === 'Perhatian Medis Segera');
  // Athletes in recovery / rehabilitation
  const rehabAthletes = relevantAthletes.filter((a) => a.statusKondisi === 'Pemulihan Cedera');

  // Medical action modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAtlet, setSelectedAtlet] = useState<Atlet | null>(null);
  const [newStatus, setNewStatus] = useState<ConditionStatus>('Pemulihan Cedera');
  const [catatan, setCatatan] = useState('');
  const [tindakanRujukan, setTindakanRujukan] = useState('');

  const openActionModal = (atlet: Atlet) => {
    setSelectedAtlet(atlet);
    setNewStatus(atlet.statusKondisi === 'Perhatian Medis Segera' ? 'Pemulihan Cedera' : 'Bugar');
    setCatatan(atlet.catatanKondisi);
    setTindakanRujukan('Telah ditangani oleh tim fisioterapi Bapel KONI Sidoarjo.');
    setModalOpen(true);
  };

  const handleSaveMedicalAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAtlet) return;

    updateAtletCondition(
      selectedAtlet.id,
      newStatus,
      catatan,
      tindakanRujukan
    );

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              <span>Pusat Layanan Medis & Fisioterapi Bapel</span>
            </span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
            Monitoring Cedera & Tindakan Medis Segera Atlet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistem triase darurat dan rujukan penanganan atlet puslatkab yang mengalami cedera atau gangguan muskuloskeletal saat latihan cabor.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold font-mono">
            {urgentAthletes.length} Kasus Darurat Aktif
          </div>
          <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-bold font-mono">
            {rehabAthletes.length} Dalam Fisioterapi
          </div>
        </div>
      </div>

      {/* SECTION 1: PERHATIAN MEDIS SEGERA (URGENT ATTENTION) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Kasus Cedera Memerlukan Perhatian Medis Segera ({urgentAthletes.length})</span>
          </h2>
          <span className="text-xs text-rose-700 font-medium">
            Prioritas Penanganan Bapel KONI Sidoarjo
          </span>
        </div>

        {urgentAthletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentAthletes.map((atlet) => (
              <div 
                key={atlet.id}
                className="bg-white rounded-2xl border-2 border-rose-300 p-5 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded uppercase">
                      Darurat Medis Lapangan
                    </span>
                    <h3 className="text-base font-black text-slate-900 pt-1">
                      {atlet.nama}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {caborMap.get(atlet.caborId) || 'Cabor'} · {atlet.nomorPertandinganNama}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 space-y-1">
                  <span className="font-bold block">Keluhan & Catatan Lapangan:</span>
                  <p className="leading-relaxed">{atlet.catatanKondisi}</p>
                </div>

                {atlet.riwayatCedera && atlet.riwayatCedera.length > 0 && (
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <span className="font-semibold text-slate-800">Tindakan Rujukan:</span>
                    <p>{atlet.riwayatCedera[0].tindakanMedis}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Tanggal Laporan: {atlet.riwayatCedera[0].tanggal} · Status: {atlet.riwayatCedera[0].status}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Postur: {atlet.tinggiBadan}cm / {atlet.beratBadan}kg
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => openActionModal(atlet)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Tangani / Rujuk Bapel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="font-bold text-slate-700">Tidak ada atlet yang berstatus darurat medis saat ini.</p>
            <p className="mt-0.5">Semua atlet dalam kondisi bugar atau dalam masa pemulihan terarah.</p>
          </div>
        )}
      </div>

      {/* SECTION 2: PEMULIHAN CEDERA (REHABILITATION & PHYSIOTHERAPY) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Atlet Dalam Masa Pemulihan / Return-To-Sport ({rehabAthletes.length})</span>
          </h2>
          <span className="text-xs text-slate-500">
            Fase penguatan proprioseptif & latihan terbatas
          </span>
        </div>

        {rehabAthletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rehabAthletes.map((atlet) => (
              <div 
                key={atlet.id}
                className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                      Pemulihan Cedera (Rehab)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 pt-1">
                      {atlet.nama}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {caborMap.get(atlet.caborId) || 'Cabor'} · {atlet.nomorPertandinganNama}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openActionModal(atlet)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                  >
                    Evaluasi Kesiapan
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 text-xs text-slate-700">
                  <p>{atlet.catatanKondisi}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Tidak ada atlet dalam masa pemulihan cedera.
          </div>
        )}
      </div>

      {/* MODAL: Update Tindakan Medis & Disposisi Bapel */}
      {modalOpen && selectedAtlet && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-rose-400" />
                  <span>Tindakan & Triase Medis Bapel Puslatkab</span>
                </h2>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                  Atlet: {selectedAtlet.nama} ({caborMap.get(selectedAtlet.caborId)})
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveMedicalAction} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Perbarui Status Kebugaran:</label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white text-xs font-bold"
                >
                  <option value="Bugar">Bugar (Dinyatakan Sembuh & Siap Latih Penuh)</option>
                  <option value="Pemulihan Cedera">Pemulihan Cedera (Latihan Khusus / Penguatan)</option>
                  <option value="Perhatian Medis Segera">Perhatian Medis Segera (Masih Membutuhkan Tindakan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Medis & Evaluasi Terkini:</label>
                <textarea
                  rows={2}
                  required
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Hasil pemeriksaan dokter/fisioterapi, tes mobilitas..."
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tindakan Rujukan / Penanganan Fisioterapi Bapel:</label>
                <input
                  type="text"
                  required
                  value={tindakanRujukan}
                  onChange={(e) => setTindakanRujukan(e.target.value)}
                  placeholder="Contoh: Terapi ultrasound + strengthening quadriceps di Poli Bapel KONI"
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow"
                >
                  Simpan Tindakan Medis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
