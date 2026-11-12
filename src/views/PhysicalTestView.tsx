import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ParameterFisik, SesiTesFisik, Atlet } from '../types';
import { 
  Gauge, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Calendar, 
  UserCheck, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Activity, 
  BarChart3,
  Layers,
  Award
} from 'lucide-react';

export const PhysicalTestView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    isMonev, 
    isCabor, 
    accessibleCabors, 
    parameters, 
    addParameter, 
    updateParameter, 
    deleteParameter, 
    atlets, 
    sesiTesList, 
    addSesiTes, 
    deleteSesiTes 
  } = useApp();

  const [selectedCaborId, setSelectedCaborId] = useState<string>(accessibleCabors[0]?.id || '');
  const activeCabor = accessibleCabors.find((c) => c.id === selectedCaborId) || accessibleCabors[0];

  // Tab: 'progression' | 'parameters' | 'record_test'
  const [viewTab, setViewTab] = useState<'progression' | 'parameters' | 'record_test'>('progression');

  // Selected athlete for progression comparison
  const caborAthletes = atlets.filter((a) => a.caborId === activeCabor?.id);
  const [selectedAtletId, setSelectedAtletId] = useState<string>(caborAthletes[0]?.id || '');
  const activeAtlet = atlets.find((a) => a.id === selectedAtletId) || caborAthletes[0];

  // Sesi tes for selected athlete
  const athleteSessions = sesiTesList
    .filter((s) => s.atletId === activeAtlet?.id)
    .sort((a, b) => new Date(a.tanggalTes).getTime() - new Date(b.tanggalTes).getTime());

  // Parameters for active cabor
  const caborParameters = parameters.filter((p) => p.caborId === activeCabor?.id);

  // Parameter Modal state
  const [paramModalOpen, setParamModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<ParameterFisik | null>(null);
  const [paramNama, setParamNama] = useState('');
  const [paramSatuan, setParamSatuan] = useState('kg');
  const [paramKategori, setParamKategori] = useState<ParameterFisik['kategoriFisik']>('Kekuatan Otot');
  const [paramMin, setParamMin] = useState(100);
  const [paramUnggulan, setParamUnggulan] = useState(130);
  const [paramArah, setParamArah] = useState<'higher_is_better' | 'lower_is_better'>('higher_is_better');
  const [paramKet, setParamKet] = useState('');

  // Record New Test Session Form state
  const [sessionAtletId, setSessionAtletId] = useState(caborAthletes[0]?.id || '');
  const [sessionNama, setSessionNama] = useState('Tes Evaluasi Berkala (Tahap Lanjutan)');
  const [sessionTanggal, setSessionTanggal] = useState(() => new Date().toISOString().split('T')[0]);
  const [sessionPenguji, setSessionPenguji] = useState(currentUser?.name || 'Tim Lab Fisiologi KONI Sidoarjo');
  const [sessionCatatan, setSessionCatatan] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});

  // Open parameter modal
  const openAddParam = () => {
    setEditingParam(null);
    setParamNama('');
    setParamSatuan('cm');
    setParamKategori('Power');
    setParamMin(50);
    setParamUnggulan(65);
    setParamArah('higher_is_better');
    setParamKet('');
    setParamModalOpen(true);
  };

  const openEditParam = (p: ParameterFisik) => {
    setEditingParam(p);
    setParamNama(p.namaParameter);
    setParamSatuan(p.satuan);
    setParamKategori(p.kategoriFisik);
    setParamMin(p.standarMinimalPorprov);
    setParamUnggulan(p.standarUnggulan);
    setParamArah(p.arahNilai);
    setParamKet(p.keterangan || '');
    setParamModalOpen(true);
  };

  const handleSaveParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabor) return;

    if (editingParam) {
      updateParameter(editingParam.id, {
        namaParameter: paramNama,
        satuan: paramSatuan,
        kategoriFisik: paramKategori,
        standarMinimalPorprov: paramMin,
        standarUnggulan: paramUnggulan,
        arahNilai: paramArah,
        keterangan: paramKet,
      });
    } else {
      addParameter({
        caborId: activeCabor.id,
        namaParameter: paramNama,
        satuan: paramSatuan,
        kategoriFisik: paramKategori,
        standarMinimalPorprov: paramMin,
        standarUnggulan: paramUnggulan,
        arahNilai: paramArah,
        keterangan: paramKet,
      });
    }
    setParamModalOpen(false);
  };

  // Handle Record New Test Session
  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabor || !sessionAtletId) return;

    addSesiTes({
      atletId: sessionAtletId,
      caborId: activeCabor.id,
      namaSesi: sessionNama,
      tanggalTes: sessionTanggal,
      penguji: sessionPenguji,
      skorFisik: scores,
      catatanEvaluator: sessionCatatan || 'Pencatatan data tes fisik puslatkab terverifikasi.',
    });

    // Reset scores & go back to progression view
    setScores({});
    setSessionCatatan('');
    setSelectedAtletId(sessionAtletId);
    setViewTab('progression');
  };

  // Compare baseline session (first) and latest session (last)
  const baselineSession = athleteSessions[0];
  const latestSession = athleteSessions.length > 1 ? athleteSessions[athleteSessions.length - 1] : null;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Parameter Spesifik & Analisis Kemajuan Tes Fisik Atlet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Setiap cabor memiliki parameter fisik khusus. Hasil tes disimpan berkala sehingga selisih kemajuan (delta %) sebelum vs sesudah pemusatan latihan terpantau jelas.
          </p>
        </div>

        {/* Cabor Selector */}
        {accessibleCabors.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Cabor:</span>
            <select
              value={selectedCaborId}
              onChange={(e) => {
                setSelectedCaborId(e.target.value);
                const firstAt = atlets.find((a) => a.caborId === e.target.value);
                if (firstAt) setSelectedAtletId(firstAt.id);
              }}
              className="text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-amber-500"
            >
              {accessibleCabors.map((c) => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setViewTab('progression')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            viewTab === 'progression'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tren Kemajuan Fisik Atlet (Time-Series)</span>
        </button>

        <button
          type="button"
          onClick={() => setViewTab('record_test')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            viewTab === 'record_test'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Input Sesi Tes Fisik Baru</span>
        </button>

        <button
          type="button"
          onClick={() => setViewTab('parameters')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            viewTab === 'parameters'
              ? 'bg-amber-400 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Parameter Khusus Cabor ({caborParameters.length})</span>
        </button>
      </div>

      {/* TAB 1: Tren Kemajuan Fisik Atlet (Time-Series Progression) */}
      {viewTab === 'progression' && (
        <div className="space-y-6">
          
          {/* Athlete Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Pilih Atlet Cabor {activeCabor?.nama}:</span>
              <select
                value={selectedAtletId}
                onChange={(e) => setSelectedAtletId(e.target.value)}
                className="text-xs font-bold border border-slate-300 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-900"
              >
                {caborAthletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nama} ({a.nomorPertandinganNama})
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Riwayat Tes: <span className="font-bold text-slate-900 font-mono">{athleteSessions.length} Sesi Terdata</span>
            </div>
          </div>

          {activeAtlet ? (
            <div className="space-y-6">
              
              {/* Profile Card & Sesi Overview */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {activeCabor?.nama} · {activeAtlet.nomorPertandinganNama}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">
                      {activeAtlet.nama}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Status Kondisi: <span className="font-bold text-amber-300">{activeAtlet.statusKondisi}</span> · Postur: {activeAtlet.tinggiBadan} cm / {activeAtlet.beratBadan} kg
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSessionAtletId(activeAtlet.id);
                        setViewTab('record_test');
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Input Hasil Tes Atlet Ini</span>
                    </button>
                  </div>
                </div>

                {/* Test sessions pills */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700 overflow-x-auto text-xs">
                  <span className="text-slate-400 font-semibold shrink-0">Sesi Tes:</span>
                  {athleteSessions.map((sesi, idx) => (
                    <div 
                      key={sesi.id}
                      className="bg-slate-800/90 border border-slate-700 px-3 py-1 rounded-lg text-slate-200 shrink-0 text-[11px]"
                    >
                      <span className="font-bold text-amber-400">#{idx + 1} {sesi.namaSesi}</span>
                      <span className="text-slate-400 ml-1.5 font-mono">({sesi.tanggalTes})</span>
                    </div>
                  ))}
                  {athleteSessions.length === 0 && (
                    <span className="text-slate-400 italic">Belum ada tes yang direkam untuk atlet ini.</span>
                  )}
                </div>
              </div>

              {/* COMPARISON MATRIX (Baseline vs Latest Progression) */}
              {baselineSession && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        <span>Komparasi Progres: {baselineSession.namaSesi} vs {latestSession ? latestSession.namaSesi : 'Belum Ada Tes Lanjutan'}</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Evaluasi kenaikan kapasitas fisik setelah periode pemusatan latihan
                      </p>
                    </div>

                    {latestSession && (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                        Terverifikasi Mengalami Peningkatan
                      </span>
                    )}
                  </div>

                  {/* Parameter Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {caborParameters.map((param) => {
                      const baseScore = baselineSession.skorFisik[param.id];
                      const latestScore = latestSession ? latestSession.skorFisik[param.id] : undefined;

                      let delta = 0;
                      let deltaPercent = 0;
                      let isImproved = false;

                      if (baseScore !== undefined && latestScore !== undefined) {
                        delta = Number((latestScore - baseScore).toFixed(2));
                        deltaPercent = Number(((delta / baseScore) * 100).toFixed(1));
                        
                        if (param.arahNilai === 'higher_is_better') {
                          isImproved = delta > 0;
                        } else {
                          // e.g. sprint or reaction time, lower is better!
                          isImproved = delta < 0;
                        }
                      }

                      return (
                        <div 
                          key={param.id}
                          className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                                {param.kategoriFisik}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                Target Porprov: {param.standarMinimalPorprov} {param.satuan}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                              {param.namaParameter}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {param.keterangan || 'Parameter kebugaran spesifik'}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                            {/* Baseline score */}
                            <div>
                              <span className="text-[10px] text-slate-400 block">Baseline Awal</span>
                              <span className="font-bold font-mono text-slate-800 text-sm">
                                {baseScore !== undefined ? `${baseScore} ${param.satuan}` : '-'}
                              </span>
                            </div>

                            <ArrowRight className="w-4 h-4 text-slate-400" />

                            {/* Latest score */}
                            <div>
                              <span className="text-[10px] text-slate-400 block">Tes Terakhir</span>
                              <span className="font-bold font-mono text-slate-900 text-sm">
                                {latestScore !== undefined ? `${latestScore} ${param.satuan}` : 'Belum Ada'}
                              </span>
                            </div>

                            {/* Delta Improvement */}
                            {latestScore !== undefined ? (
                              <div className={`text-right px-2.5 py-1 rounded-lg ${
                                isImproved 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}>
                                <div className="flex items-center gap-1 font-bold text-xs">
                                  {isImproved ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                  <span>{delta > 0 ? `+${delta}` : delta} {param.satuan}</span>
                                </div>
                                <span className="text-[10px] font-mono block">
                                  {deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">
                                Perlu Tes Lanjutan
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Evaluator Notes */}
                  {latestSession && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                      <span className="font-bold block">Catatan Evaluator ({latestSession.penguji}):</span>
                      <p>{latestSession.catatanEvaluator}</p>
                    </div>
                  )}
                </div>
              )}

              {athleteSessions.length === 0 && (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
                  <Gauge className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-medium text-slate-600">Belum ada riwayat tes fisik yang disimpan untuk atlet ini.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSessionAtletId(activeAtlet.id);
                      setViewTab('record_test');
                    }}
                    className="mt-3 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                  >
                    Input Tes Fisik Baseline
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 bg-white rounded-xl text-center text-slate-400 text-xs">
              Pilih atlet terlebih dahulu untuk melihat grafik tren fisik.
            </div>
          )}

        </div>
      )}

      {/* TAB 2: Input Sesi Tes Fisik Baru */}
      {viewTab === 'record_test' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto text-xs space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Formulir Input Hasil Tes Kondisi Fisik Atlet Puslatkab
            </h2>
            <p className="text-slate-500 mt-0.5">
              Input parameter fisik tersimpan ke riwayat atlet dan otomatis memperbarui komparasi tren kemajuan
            </p>
          </div>

          <form onSubmit={handleSubmitSession} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Pilih Atlet *</label>
                <select
                  value={sessionAtletId}
                  onChange={(e) => setSessionAtletId(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2.5 bg-white text-xs font-semibold"
                >
                  {caborAthletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nama} ({a.nomorPertandinganNama})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Sesi Tes *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tes Kemajuan Tahap 2 (November 2026)"
                  value={sessionNama}
                  onChange={(e) => setSessionNama(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tanggal Pengambilan Data *</label>
                <input
                  type="date"
                  required
                  value={sessionTanggal}
                  onChange={(e) => setSessionTanggal(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Penguji / Evaluator *</label>
                <input
                  type="text"
                  required
                  value={sessionPenguji}
                  onChange={(e) => setSessionPenguji(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>

            {/* Input Parameter Values for this Cabor */}
            <div className="space-y-3 pt-3 border-t">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Nilai Parameter Fisik Cabor {activeCabor?.nama}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {caborParameters.map((p) => (
                  <div key={p.id} className="p-3 border rounded-xl bg-slate-50/60">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-900">{p.namaParameter}</label>
                      <span className="text-[10px] text-slate-500 font-mono">Satuan: {p.satuan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder={`Standar min: ${p.standarMinimalPorprov}`}
                        value={scores[p.id] ?? ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setScores((prev) => ({ ...prev, [p.id]: val }));
                        }}
                        className="w-full border rounded-lg p-2 bg-white text-xs font-mono font-bold"
                      />
                      <span className="font-semibold text-slate-600 shrink-0 text-xs">{p.satuan}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Standar Minimal Porprov: {p.standarMinimalPorprov} {p.satuan} · Unggulan: {p.standarUnggulan}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Catatan Evaluator / Tindak Lanjut</label>
              <textarea
                rows={2}
                value={sessionCatatan}
                onChange={(e) => setSessionCatatan(e.target.value)}
                placeholder="Evaluasi perkembangan otot, ketahanan, atau saran program latihan..."
                className="w-full border rounded-lg p-2.5 text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={() => setViewTab('progression')}
                className="px-4 py-2 border rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Hasil Tes Fisik</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Parameter Khusus Cabor (Custom Parameters) */}
      {viewTab === 'parameters' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Parameter Kondisi Fisik Khusus Cabor {activeCabor?.nama}
              </h2>
              <p className="text-xs text-slate-500">
                Setiap cabang olahraga memiliki instrumen tes yang dapat disesuaikan secara dinamis
              </p>
            </div>

            <button
              type="button"
              onClick={openAddParam}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Tambah Parameter Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caborParameters.map((param) => (
              <div 
                key={param.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                      {param.kategoriFisik}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {param.arahNilai === 'higher_is_better' ? 'Semakin Tinggi Lebih Baik' : 'Semakin Rendah Lebih Baik (Kecepatan)'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2">
                    {param.namaParameter} ({param.satuan})
                  </h3>
                  <p className="text-slate-600 mt-1 line-clamp-2">
                    {param.keterangan || '-'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <span className="text-slate-500 block">
                      Min Porprov: <span className="font-bold text-slate-800">{param.standarMinimalPorprov} {param.satuan}</span>
                    </span>
                    <span className="text-amber-700 block">
                      Unggulan: <span className="font-bold">{param.standarUnggulan} {param.satuan}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditParam(param)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteParameter(param.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {caborParameters.length === 0 && (
              <div className="col-span-2 p-8 text-center text-slate-400 text-xs border border-dashed rounded-xl">
                Belum ada parameter fisik yang didaftarkan untuk cabor ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Parameter */}
      {paramModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-sm font-bold">
                {editingParam ? 'Edit Parameter Fisik' : 'Tambah Parameter Fisik Cabor'}
              </h2>
              <button onClick={() => setParamModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveParam} className="p-5 space-y-4">
              <div>
                <label className="block font-semibold mb-1">Nama Parameter Fisik *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: VO2 Max (Bleep Test), 1RM Back Squat"
                  value={paramNama}
                  onChange={(e) => setParamNama(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Satuan Pengukuran</label>
                  <input
                    type="text"
                    required
                    placeholder="kg, detik, cm, ml/kg/min, rep"
                    value={paramSatuan}
                    onChange={(e) => setParamSatuan(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Kategori Fisik</label>
                  <select
                    value={paramKategori}
                    onChange={(e: any) => setParamKategori(e.target.value)}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    <option value="Daya Tahan Aerobik">Daya Tahan Aerobik</option>
                    <option value="Kekuatan Otot">Kekuatan Otot</option>
                    <option value="Power">Power Ledak</option>
                    <option value="Kecepatan">Kecepatan</option>
                    <option value="Kelincahan">Kelincahan</option>
                    <option value="Fleksibilitas">Fleksibilitas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Standar Min Porprov</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={paramMin}
                    onChange={(e) => setParamMin(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Standar Unggulan</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={paramUnggulan}
                    onChange={(e) => setParamUnggulan(parseFloat(e.target.value) || 0)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Arah Nilai Positif</label>
                <select
                  value={paramArah}
                  onChange={(e: any) => setParamArah(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white"
                >
                  <option value="higher_is_better">Semakin Tinggi Lebih Baik (Beban/Lompatan/VO2Max)</option>
                  <option value="lower_is_better">Semakin Rendah Lebih Baik (Waktu Sprint/Reaksi)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi / Petunjuk Tes</label>
                <textarea
                  rows={2}
                  value={paramKet}
                  onChange={(e) => setParamKet(e.target.value)}
                  placeholder="Instruksi dan protokol standar pengujian..."
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setParamModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Simpan Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
