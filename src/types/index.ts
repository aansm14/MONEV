export type Role = 'admin' | 'monev' | 'cabor';

export type ConditionStatus = 
  | 'Bugar' 
  | 'Pemulihan Cedera' 
  | 'Perhatian Medis Segera' 
  | 'Sakit/Izin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  caborId?: string; // For role 'cabor'
  assignedCaborIds?: string[]; // For role 'monev'
  phone: string;
  jabatan: string;
}

export interface Cabor {
  id: string;
  nama: string;
  singkatan: string;
  kategori: 'Terukur' | 'Bela Diri' | 'Akurasi' | 'Permainan';
  ketuaPengkab: string;
  pelatihKepala: string;
  kontak: string;
  tempatLatihan: string;
  jadwalLatihan: string[];
  targetMedali: {
    emas: number;
    perak: number;
    perunggu: number;
  };
  deskripsiProgram?: string;
}

export interface NomorPertandingan {
  id: string;
  caborId: string;
  namaNomor: string;
  gender: 'Putra' | 'Putri' | 'Campuran';
  targetPrestasi: 'Target Emas' | 'Target Perak' | 'Target Medali' | 'Lolos Porprov';
  kuotaAtlet: number;
}

export interface Pelatih {
  id: string;
  caborId: string;
  nama: string;
  peran: 'Pelatih Kepala' | 'Pelatih Fisik' | 'Pelatih Teknik' | 'Asisten Pelatih';
  lisensi: string;
  kontak: string;
}

export interface Atlet {
  id: string;
  caborId: string;
  nama: string;
  nik: string;
  tempatTanggalLahir: string;
  jenisKelamin: 'L' | 'P';
  nomorPertandinganId: string;
  nomorPertandinganNama: string;
  tinggiBadan: number; // cm
  beratBadan: number; // kg
  statusKondisi: ConditionStatus;
  catatanKondisi: string;
  riwayatCedera?: Array<{
    tanggal: string;
    diagnosa: string;
    status: 'Aktif Perlu Rujukan' | 'Dalam Fisioterapi' | 'Pulih';
    tindakanMedis: string;
  }>;
}

export interface ParameterFisik {
  id: string;
  caborId: string;
  namaParameter: string;
  satuan: string; // e.g. "ml/kg/min", "kg", "detik", "cm", "repetisi"
  kategoriFisik: 'Daya Tahan Aerobik' | 'Kekuatan Otot' | 'Kecepatan' | 'Kelincahan' | 'Fleksibilitas' | 'Power';
  standarMinimalPorprov: number;
  standarUnggulan: number;
  arahNilai: 'higher_is_better' | 'lower_is_better';
  keterangan?: string;
}

export interface SesiTesFisik {
  id: string;
  atletId: string;
  caborId: string;
  namaSesi: string; // e.g., "Tes Awal (Tahap 1 - Jan 2026)", "Tes Berkala (Tahap 2 - Mei 2026)"
  tanggalTes: string;
  penguji: string;
  skorFisik: Record<string, number>; // parameterId -> nilai numerik
  catatanEvaluator: string;
}

export interface FotoLaporan {
  id: string;
  dataUrl: string; // Base64
  caption: string;
  sizeKb: number;
  fileName: string;
}

export interface LaporanMonev {
  id: string;
  nomorLaporan: string;
  caborId: string;
  caborNama: string;
  tanggalMonev: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempatLatihan: string;
  petugasMonevId: string;
  petugasMonevNama: string;
  kehadiranAtlet: {
    hadir: number;
    izin: number;
    sakit: number;
    cedera: number;
    total: number;
  };
  pelatihHadir: string[];
  materiLatihan: string;
  evaluasiFisik: string;
  evaluasiTeknikTaktik: string;
  kondisiSaranaPrasarana: string;
  kendalaCabor: string;
  rekomendasiBapel: string;
  atletButuhMedis: Array<{
    atletId: string;
    namaAtlet: string;
    keluhan: string;
    tindakanDibutuhkan: string;
  }>;
  fotoDokumentasi: FotoLaporan[]; // Max 4, max 1MB each
  status: 'Terkirim' | 'Ditinjau Bapel' | 'Tindak Lanjut Disetujui';
  tandaTangan?: {
    monevSigned: boolean;
    caborSigned: boolean;
    pelatihNama: string;
  };
  createdAt: string;
}
