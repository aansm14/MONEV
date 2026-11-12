import { User, Cabor, NomorPertandingan, Pelatih, Atlet, ParameterFisik, SesiTesFisik, LaporanMonev } from '../types';

// Helper inline SVG data URL for sample documentation photos (KONI training sessions)
const createMockPhotoUrl = (label: string, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="${color}"/>
    <rect x="20" y="20" width="560" height="360" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="6,6" opacity="0.4"/>
    <circle cx="300" cy="160" r="48" fill="#ffffff" opacity="0.2"/>
    <path d="M280 180 L320 180 L300 135 Z" fill="#ffffff" opacity="0.8"/>
    <text x="300" y="240" fill="#ffffff" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle">DOKUMENTASI MONEV PUSLATKAB</text>
    <text x="300" y="270" fill="#ffffff" font-family="Arial, sans-serif" font-size="15" text-anchor="middle" opacity="0.9">${label}</text>
    <text x="300" y="300" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" opacity="0.75">KONI KABUPATEN SIDOARJO - PORPROV 2027</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    username: 'admin',
    password: 'admin2027',
    name: 'Drs. H. M. Taufiqurrahman, M.Si',
    role: 'admin',
    phone: '081234567890',
    jabatan: 'Ketua Bapel Puslatkab KONI Sidoarjo',
  },
  {
    id: 'usr-monev-1',
    username: 'monev1',
    password: 'monev2027',
    name: 'Drs. Bambang Wijaya, M.Pd',
    role: 'monev',
    assignedCaborIds: ['cabor-bulutangkis', 'cabor-panahan'],
    phone: '081398765432',
    jabatan: 'Koordinator Monev Klaster Akurasi & Raket',
  },
  {
    id: 'usr-monev-2',
    username: 'monev2',
    password: 'monev2027',
    name: 'Aris Prasetyo, S.Or, M.Fis',
    role: 'monev',
    assignedCaborIds: ['cabor-angkat-besi', 'cabor-atletik'],
    phone: '081255443322',
    jabatan: 'Monev Spesialis Kondisi Fisik & Beban',
  },
  {
    id: 'usr-cabor-1',
    username: 'angkatbesi',
    password: 'pabsi2027',
    name: 'M. Subeki, S.Pd (PABSI)',
    role: 'cabor',
    caborId: 'cabor-angkat-besi',
    phone: '081333112244',
    jabatan: 'Pelatih Kepala Angkat Besi Sidoarjo',
  },
  {
    id: 'usr-cabor-2',
    username: 'bulutangkis',
    password: 'pbsi2027',
    name: 'Hendra Setiawan, S.Pd (PBSI)',
    role: 'cabor',
    caborId: 'cabor-bulutangkis',
    phone: '081244556677',
    jabatan: 'Koordinator Pelatih Puslatkab Bulutangkis',
  },
  {
    id: 'usr-cabor-3',
    username: 'atletik',
    password: 'pasi2027',
    name: 'Dian Wahyudi, S.Or (PASI)',
    role: 'cabor',
    caborId: 'cabor-atletik',
    phone: '081377889900',
    jabatan: 'Pelatih Kepala Lintasan PASI Sidoarjo',
  },
  {
    id: 'usr-cabor-4',
    username: 'panahan',
    password: 'perpani2027',
    name: 'Siti Rohimah, S.Pd (PERPANI)',
    role: 'cabor',
    caborId: 'cabor-panahan',
    phone: '081234991122',
    jabatan: 'Pelatih Kepala Panahan Puslatkab',
  },
  {
    id: 'usr-cabor-5',
    username: 'renang',
    password: 'aquatik2027',
    name: 'Agus Santoso, M.Pd (AQUATIK)',
    role: 'cabor',
    caborId: 'cabor-renang',
    phone: '081322334455',
    jabatan: 'Pelatih Kepala Renang Sidoarjo',
  },
];

export const INITIAL_CABORS: Cabor[] = [
  {
    id: 'cabor-angkat-besi',
    nama: 'Angkat Besi (PABSI)',
    singkatan: 'PABSI',
    kategori: 'Terukur',
    ketuaPengkab: 'H. Suwandi, ST',
    pelatihKepala: 'M. Subeki, S.Pd',
    kontak: '081333112244',
    tempatLatihan: 'Sasana Angkat Besi Gedung Serbaguna GOR Delta Sidoarjo',
    jadwalLatihan: [
      'Senin, Rabu, Jumat: 15.30 - 18.00 WIB (Teknik & Snatch/C&J)',
      'Selasa & Kamis: 07.30 - 10.30 WIB (Beban Dasar & Squat Max)',
      'Sabtu: 07.00 - 10.00 WIB (Kebugaran & Evaluasi Berat Badan)',
    ],
    targetMedali: {
      emas: 4,
      perak: 2,
      perunggu: 3,
    },
    deskripsiProgram: 'Fokus peningkatan 1RM Squat dan stabilitas teknik Snatch menjelang babak kualifikasi Porprov 2027.',
  },
  {
    id: 'cabor-bulutangkis',
    nama: 'Bulutangkis (PBSI)',
    singkatan: 'PBSI',
    kategori: 'Permainan',
    ketuaPengkab: 'Drs. H. M. Anshori',
    pelatihKepala: 'Hendra Setiawan, S.Pd',
    kontak: '081244556677',
    tempatLatihan: 'Hall Bulutangkis GOR Sidoarjo (Lapangan 1 - 4)',
    jadwalLatihan: [
      'Senin s/d Kamis: 15.00 - 18.30 WIB (Drill Stroke, Footwork & Game)',
      'Jumat: 06.00 - 08.30 WIB (Daya Tahan VO2Max & Agility)',
      'Sabtu: 14.30 - 17.30 WIB (Simulasi Turnamen Bapel)',
    ],
    targetMedali: {
      emas: 3,
      perak: 3,
      perunggu: 2,
    },
    deskripsiProgram: 'Pemantapan fisik aerobik level tinggi, footwork 6 titik, dan penguatan mental bertanding ganda.',
  },
  {
    id: 'cabor-atletik',
    nama: 'Atletik (PASI)',
    singkatan: 'PASI',
    kategori: 'Terukur',
    ketuaPengkab: 'H. Bambang Harjo, SE',
    pelatihKepala: 'Dian Wahyudi, S.Or',
    kontak: '081377889900',
    tempatLatihan: 'Lintasan Sintetis Stadion Gelora Delta Sidoarjo',
    jadwalLatihan: [
      'Senin, Rabu, Sabtu: 06.00 - 09.00 WIB (Speed Endurance & Start Block)',
      'Selasa & Kamis: 15.30 - 18.00 WIB (Strength & Core Conditioning)',
    ],
    targetMedali: {
      emas: 5,
      perak: 4,
      perunggu: 3,
    },
    deskripsiProgram: 'Target emas pada nomor lari 100m, 200m, 400m putra serta lompat jauh.',
  },
  {
    id: 'cabor-panahan',
    nama: 'Panahan (PERPANI)',
    singkatan: 'PERPANI',
    kategori: 'Akurasi',
    ketuaPengkab: 'Ir. Moch. Ilyas',
    pelatihKepala: 'Siti Rohimah, S.Pd',
    kontak: '081234991122',
    tempatLatihan: 'Lapangan Panahan Timur GOR Delta Sidoarjo',
    jadwalLatihan: [
      'Selasa, Kamis, Sabtu: 14.00 - 17.30 WIB (Skor Jarak 50m & 70m)',
      'Minggu: 07.00 - 11.00 WIB (Kondisi Fisik Isometrik & Simulasi Eliminasi)',
    ],
    targetMedali: {
      emas: 2,
      perak: 2,
      perunggu: 1,
    },
    deskripsiProgram: 'Stabilisasi postur isometrik tarikan bow dan pengendalian denyut jantung pra-tembakan.',
  },
  {
    id: 'cabor-renang',
    nama: 'Renang (AQUATIK / PRSI)',
    singkatan: 'AQUATIK',
    kategori: 'Terukur',
    ketuaPengkab: 'dr. H. Rizal Fachrudin, Sp.OT',
    pelatihKepala: 'Agus Santoso, M.Pd',
    kontak: '081322334455',
    tempatLatihan: 'Kolam Renang Gelora Delta Sidoarjo (50 Meter)',
    jadwalLatihan: [
      'Senin - Sabtu: 05.00 - 07.30 WIB (Volume Meteran Aerobik)',
      'Senin, Rabu, Jumat: 15.30 - 17.30 WIB (Kecepatan & Dryland Core)',
    ],
    targetMedali: {
      emas: 4,
      perak: 3,
      perunggu: 4,
    },
    deskripsiProgram: 'Fokus perbaikan kick underwater dan daya tahan laktat di nomor 100m dan 200m gaya bebas & dada.',
  },
];

export const INITIAL_NOMOR_PERTANDINGAN: NomorPertandingan[] = [
  // Angkat Besi
  { id: 'nomor-ab-1', caborId: 'cabor-angkat-besi', namaNomor: 'Kelas 61 Kg Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 2 },
  { id: 'nomor-ab-2', caborId: 'cabor-angkat-besi', namaNomor: 'Kelas 73 Kg Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 2 },
  { id: 'nomor-ab-3', caborId: 'cabor-angkat-besi', namaNomor: 'Kelas 55 Kg Putri', gender: 'Putri', targetPrestasi: 'Target Perak', kuotaAtlet: 2 },
  { id: 'nomor-ab-4', caborId: 'cabor-angkat-besi', namaNomor: 'Kelas 64 Kg Putri', gender: 'Putri', targetPrestasi: 'Target Emas', kuotaAtlet: 1 },
  // Bulutangkis
  { id: 'nomor-bt-1', caborId: 'cabor-bulutangkis', namaNomor: 'Tunggal Putra (MS)', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 3 },
  { id: 'nomor-bt-2', caborId: 'cabor-bulutangkis', namaNomor: 'Tunggal Putri (WS)', gender: 'Putri', targetPrestasi: 'Target Perak', kuotaAtlet: 2 },
  { id: 'nomor-bt-3', caborId: 'cabor-bulutangkis', namaNomor: 'Ganda Putra (MD)', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 4 },
  { id: 'nomor-bt-4', caborId: 'cabor-bulutangkis', namaNomor: 'Ganda Campuran (XD)', gender: 'Campuran', targetPrestasi: 'Target Medali', kuotaAtlet: 4 },
  // Atletik
  { id: 'nomor-atl-1', caborId: 'cabor-atletik', namaNomor: 'Lari 100 Meter Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 2 },
  { id: 'nomor-atl-2', caborId: 'cabor-atletik', namaNomor: 'Lari 200 Meter Putri', gender: 'Putri', targetPrestasi: 'Target Perak', kuotaAtlet: 2 },
  { id: 'nomor-atl-3', caborId: 'cabor-atletik', namaNomor: 'Lompat Jauh Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 1 },
  { id: 'nomor-atl-4', caborId: 'cabor-atletik', namaNomor: 'Estafet 4x100m Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 5 },
  // Panahan
  { id: 'nomor-pan-1', caborId: 'cabor-panahan', namaNomor: 'Recurve 70 Meter Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 3 },
  { id: 'nomor-pan-2', caborId: 'cabor-panahan', namaNomor: 'Compound 50 Meter Putri', gender: 'Putri', targetPrestasi: 'Target Perak', kuotaAtlet: 2 },
  // Renang
  { id: 'nomor-rng-1', caborId: 'cabor-renang', namaNomor: '50m Gaya Bebas Putra', gender: 'Putra', targetPrestasi: 'Target Emas', kuotaAtlet: 2 },
  { id: 'nomor-rng-2', caborId: 'cabor-renang', namaNomor: '100m Gaya Dada Putri', gender: 'Putri', targetPrestasi: 'Target Emas', kuotaAtlet: 2 },
];

export const INITIAL_PELATIH: Pelatih[] = [
  { id: 'plt-ab-1', caborId: 'cabor-angkat-besi', nama: 'M. Subeki, S.Pd', peran: 'Pelatih Kepala', lisensi: 'Level 2 Nasional PABSI', kontak: '081333112244' },
  { id: 'plt-ab-2', caborId: 'cabor-angkat-besi', nama: 'Didik Prasetya', peran: 'Pelatih Fisik', lisensi: 'Sertifikasi Pelatih Fisik Kemenpora', kontak: '081322445566' },
  { id: 'plt-bt-1', caborId: 'cabor-bulutangkis', nama: 'Hendra Setiawan, S.Pd', peran: 'Pelatih Kepala', lisensi: 'BWF Coach Level 2', kontak: '081244556677' },
  { id: 'plt-bt-2', caborId: 'cabor-bulutangkis', nama: 'Rudi Hartono, M.Pd', peran: 'Pelatih Fisik', lisensi: 'Fisik Olahraga Jawa Timur', kontak: '081266778899' },
  { id: 'plt-atl-1', caborId: 'cabor-atletik', nama: 'Dian Wahyudi, S.Or', peran: 'Pelatih Kepala', lisensi: 'World Athletics Level 1', kontak: '081377889900' },
  { id: 'plt-pan-1', caborId: 'cabor-panahan', nama: 'Siti Rohimah, S.Pd', peran: 'Pelatih Kepala', lisensi: 'Nasional PERPANI B', kontak: '081234991122' },
  { id: 'plt-rng-1', caborId: 'cabor-renang', nama: 'Agus Santoso, M.Pd', peran: 'Pelatih Kepala', lisensi: 'World Aquatics Coach', kontak: '081322334455' },
];

export const INITIAL_PARAMETERS: ParameterFisik[] = [
  // Angkat Besi
  { id: 'param-ab-1', caborId: 'cabor-angkat-besi', namaParameter: 'Snatch 1RM', satuan: 'kg', kategoriFisik: 'Power', standarMinimalPorprov: 95, standarUnggulan: 115, arahNilai: 'higher_is_better', keterangan: 'Angkatan Snatch maksimal resmi dengan teknik valid' },
  { id: 'param-ab-2', caborId: 'cabor-angkat-besi', namaParameter: 'Clean & Jerk 1RM', satuan: 'kg', kategoriFisik: 'Power', standarMinimalPorprov: 120, standarUnggulan: 145, arahNilai: 'higher_is_better', keterangan: 'Angkatan Clean and Jerk maksimal' },
  { id: 'param-ab-3', caborId: 'cabor-angkat-besi', namaParameter: 'Back Squat Maksimal', satuan: 'kg', kategoriFisik: 'Kekuatan Otot', standarMinimalPorprov: 160, standarUnggulan: 190, arahNilai: 'higher_is_better', keterangan: 'Kekuatan tungkai absolut dasar' },
  { id: 'param-ab-4', caborId: 'cabor-angkat-besi', namaParameter: 'Plank Core Endurance', satuan: 'detik', kategoriFisik: 'Daya Tahan Aerobik', standarMinimalPorprov: 120, standarUnggulan: 180, arahNilai: 'higher_is_better', keterangan: 'Stabilitas otot inti punggung & perut' },
  
  // Bulutangkis
  { id: 'param-bt-1', caborId: 'cabor-bulutangkis', namaParameter: 'VO2 Max (Bleep Test)', satuan: 'ml/kg/min', kategoriFisik: 'Daya Tahan Aerobik', standarMinimalPorprov: 52, standarUnggulan: 60, arahNilai: 'higher_is_better', keterangan: 'Daya tahan kardiorespirasi untuk rubber game' },
  { id: 'param-bt-2', caborId: 'cabor-bulutangkis', namaParameter: 'Agility T-Test', satuan: 'detik', kategoriFisik: 'Kelincahan', standarMinimalPorprov: 9.8, standarUnggulan: 9.1, arahNilai: 'lower_is_better', keterangan: 'Kecepatan reaksi perubahan arah gerak kaki' },
  { id: 'param-bt-3', caborId: 'cabor-bulutangkis', namaParameter: 'Vertical Jump', satuan: 'cm', kategoriFisik: 'Power', standarMinimalPorprov: 55, standarUnggulan: 68, arahNilai: 'higher_is_better', keterangan: 'Tinggi lompatan jumping smash' },
  { id: 'param-bt-4', caborId: 'cabor-bulutangkis', namaParameter: 'Sit & Reach Kelenturan', satuan: 'cm', kategoriFisik: 'Fleksibilitas', standarMinimalPorprov: 18, standarUnggulan: 25, arahNilai: 'higher_is_better', keterangan: 'Fleksibilitas panggul dan hamstring' },
  { id: 'param-bt-5', caborId: 'cabor-bulutangkis', namaParameter: 'Court Footwork 1 Menit', satuan: 'repetisi', kategoriFisik: 'Kecepatan', standarMinimalPorprov: 36, standarUnggulan: 44, arahNilai: 'higher_is_better', keterangan: 'Frekuensi sentuhan 6 sudut lapangan' },

  // Atletik
  { id: 'param-atl-1', caborId: 'cabor-atletik', namaParameter: 'Sprint 30 Meter', satuan: 'detik', kategoriFisik: 'Kecepatan', standarMinimalPorprov: 4.15, standarUnggulan: 3.88, arahNilai: 'lower_is_better', keterangan: 'Akselerasi start block 30 meter' },
  { id: 'param-atl-2', caborId: 'cabor-atletik', namaParameter: 'Standing Broad Jump', satuan: 'cm', kategoriFisik: 'Power', standarMinimalPorprov: 260, standarUnggulan: 290, arahNilai: 'higher_is_better', keterangan: 'Daya ledak otot tungkai horizontal' },
  { id: 'param-atl-3', caborId: 'cabor-atletik', namaParameter: 'Cooper Test 12 Menit', satuan: 'meter', kategoriFisik: 'Daya Tahan Aerobik', standarMinimalPorprov: 2900, standarUnggulan: 3300, arahNilai: 'higher_is_better', keterangan: 'Jarak tempuh lari 12 menit' },
  { id: 'param-atl-4', caborId: 'cabor-atletik', namaParameter: 'Sit & Reach Fleksibilitas', satuan: 'cm', kategoriFisik: 'Fleksibilitas', standarMinimalPorprov: 16, standarUnggulan: 24, arahNilai: 'higher_is_better', keterangan: 'Kelenturan tulang belakang & panggul' },

  // Panahan
  { id: 'param-pan-1', caborId: 'cabor-panahan', namaParameter: 'Bow Draw Isometric Hold', satuan: 'detik', kategoriFisik: 'Kekuatan Otot', standarMinimalPorprov: 45, standarUnggulan: 70, arahNilai: 'higher_is_better', keterangan: 'Ketahanan menarik busur dalam posisi full draw' },
  { id: 'param-pan-2', caborId: 'cabor-panahan', namaParameter: 'Denyut Nadi Istirahat', satuan: 'bpm', kategoriFisik: 'Daya Tahan Aerobik', standarMinimalPorprov: 68, standarUnggulan: 55, arahNilai: 'lower_is_better', keterangan: 'Kebugaran kardiovaskular dan ketenangan' },
  { id: 'param-pan-3', caborId: 'cabor-panahan', namaParameter: 'Core Plank Test', satuan: 'detik', kategoriFisik: 'Kekuatan Otot', standarMinimalPorprov: 120, standarUnggulan: 180, arahNilai: 'higher_is_better', keterangan: 'Kestabilan postur tubuh penembak' },

  // Renang
  { id: 'param-rng-1', caborId: 'cabor-renang', namaParameter: 'VO2 Max Balke Swim', satuan: 'ml/kg/min', kategoriFisik: 'Daya Tahan Aerobik', standarMinimalPorprov: 55, standarUnggulan: 64, arahNilai: 'higher_is_better', keterangan: 'Kapasitas aerobik perenang jarak menengah' },
  { id: 'param-rng-2', caborId: 'cabor-renang', namaParameter: 'Pull-up 1 Menit', satuan: 'repetisi', kategoriFisik: 'Kekuatan Otot', standarMinimalPorprov: 18, standarUnggulan: 26, arahNilai: 'higher_is_better', keterangan: 'Kekuatan otot latissimus dorsi & bahu' },
  { id: 'param-rng-3', caborId: 'cabor-renang', namaParameter: 'Sit & Reach Kelenturan', satuan: 'cm', kategoriFisik: 'Fleksibilitas', standarMinimalPorprov: 20, standarUnggulan: 28, arahNilai: 'higher_is_better', keterangan: 'Kelenturan sendi bahu dan panggul' },
];

export const INITIAL_ATLETS: Atlet[] = [
  // Angkat Besi
  {
    id: 'atl-ab-1',
    caborId: 'cabor-angkat-besi',
    nama: 'Rizky Alamsyah',
    nik: '3515082103040001',
    tempatTanggalLahir: 'Sidoarjo, 21 Maret 2004',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-ab-1',
    nomorPertandinganNama: 'Kelas 61 Kg Putra',
    tinggiBadan: 164,
    beratBadan: 60.8,
    statusKondisi: 'Bugar',
    catatanKondisi: 'Kondisi fisik prima, siap menjalani peningkatan beban tahap lanjut.',
  },
  {
    id: 'atl-ab-2',
    caborId: 'cabor-angkat-besi',
    nama: 'Bagus Prakoso',
    nik: '3515081408030002',
    tempatTanggalLahir: 'Sidoarjo, 14 Agustus 2003',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-ab-2',
    nomorPertandinganNama: 'Kelas 73 Kg Putra',
    tinggiBadan: 171,
    beratBadan: 72.4,
    statusKondisi: 'Perhatian Medis Segera',
    catatanKondisi: 'Mengeluhkan nyeri tajam pada patellar tendon lutut kanan saat beban squat 170kg. Butuh pemeriksaan fisioterapi Bapel segera.',
    riwayatCedera: [
      {
        tanggal: '2026-11-09',
        diagnosa: 'Suspect Patellar Tendinopathy akut lutut kanan',
        status: 'Aktif Perlu Rujukan',
        tindakanMedis: 'Kompres es, istirahatkan angkatan berat, rujukan USG muskuloskeletal ke RSUD Sidoarjo & Poli Fisioterapi Bapel.',
      },
    ],
  },
  {
    id: 'atl-ab-3',
    caborId: 'cabor-angkat-besi',
    nama: 'Nurul Fauziah',
    nik: '3515080512050003',
    tempatTanggalLahir: 'Krian Sidoarjo, 5 Desember 2005',
    jenisKelamin: 'P',
    nomorPertandinganId: 'nomor-ab-3',
    nomorPertandinganNama: 'Kelas 55 Kg Putri',
    tinggiBadan: 156,
    beratBadan: 54.2,
    statusKondisi: 'Bugar',
    catatanKondisi: 'Perkembangan kekuatan punggung signifikan, teknik Snatch semakin konsisten.',
  },

  // Bulutangkis
  {
    id: 'atl-bt-1',
    caborId: 'cabor-bulutangkis',
    nama: 'Kevin Dwi Wicaksono',
    nik: '3515041002040001',
    tempatTanggalLahir: 'Sidoarjo, 10 Februari 2004',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-bt-1',
    nomorPertandinganNama: 'Tunggal Putra (MS)',
    tinggiBadan: 177,
    beratBadan: 68.5,
    statusKondisi: 'Bugar',
    catatanKondisi: 'VO2Max meningkat dari 55.4 ke 58.2 ml/kg/min, stabilitas rally 3 set sangat baik.',
  },
  {
    id: 'atl-bt-2',
    caborId: 'cabor-bulutangkis',
    nama: 'Nabila Syahrani',
    nik: '3515042807050002',
    tempatTanggalLahir: 'Waru Sidoarjo, 28 Juli 2005',
    jenisKelamin: 'P',
    nomorPertandinganId: 'nomor-bt-2',
    nomorPertandinganNama: 'Tunggal Putri (WS)',
    tinggiBadan: 166,
    beratBadan: 57.0,
    statusKondisi: 'Pemulihan Cedera',
    catatanKondisi: 'Fase akhir pemulihan pasca sprain pergelangan kaki kanan ringan. Sudah bisa drill netting halus, belum full jumping smash.',
    riwayatCedera: [
      {
        tanggal: '2026-10-18',
        diagnosa: 'Sprain Ankle Dextra Grade 1',
        status: 'Dalam Fisioterapi',
        tindakanMedis: 'Taping terarah, fisioterapi penguatan proprioseptif, progres recovery 85%.',
      },
    ],
  },
  {
    id: 'atl-bt-3',
    caborId: 'cabor-bulutangkis',
    nama: 'Fajar Kurnia / Dimas Aditya',
    nik: '3515041505030003',
    tempatTanggalLahir: 'Sidoarjo, 15 Mei 2003',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-bt-3',
    nomorPertandinganNama: 'Ganda Putra (MD)',
    tinggiBadan: 179,
    beratBadan: 71.2,
    statusKondisi: 'Bugar',
    catatanKondisi: 'Kompak dan agresif pada rotasi menyerang. Daya tahan kecepatan prima.',
  },

  // Atletik
  {
    id: 'atl-atl-1',
    caborId: 'cabor-atletik',
    nama: 'Bayu Arya Pratama',
    nik: '3515061909030001',
    tempatTanggalLahir: 'Candi Sidoarjo, 19 September 2003',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-atl-1',
    nomorPertandinganNama: 'Lari 100 Meter Putra',
    tinggiBadan: 175,
    beratBadan: 66.0,
    statusKondisi: 'Bugar',
    catatanKondisi: 'Catatan 30m tembus 3.92 detik. Target medali emas sangat realistis.',
  },
  {
    id: 'atl-atl-2',
    caborId: 'cabor-atletik',
    nama: 'Rina Oktaviani',
    nik: '3515060410040002',
    tempatTanggalLahir: 'Tanggulangin Sidoarjo, 4 Oktober 2004',
    jenisKelamin: 'P',
    nomorPertandinganId: 'nomor-atl-2',
    nomorPertandinganNama: 'Lari 200 Meter Putri',
    tinggiBadan: 168,
    beratBadan: 55.4,
    statusKondisi: 'Perhatian Medis Segera',
    catatanKondisi: 'Mengalami kekakuan mendadak pada otot hamstring kiri saat lari interval 150m. Memerlukan penanganan fisioterapi Bapel segera untuk cegah robekan (tear).',
    riwayatCedera: [
      {
        tanggal: '2026-11-10',
        diagnosa: 'Hamstring Strain Sinistra Grade 1/2',
        status: 'Aktif Perlu Rujukan',
        tindakanMedis: 'Protokol PRICE, rujukan darurat ke tim fisioterapi Bapel Puslatkab KONI Sidoarjo.',
      },
    ],
  },

  // Panahan
  {
    id: 'atl-pan-1',
    caborId: 'cabor-panahan',
    nama: 'Galih Firmansyah',
    nik: '3515031201040001',
    tempatTanggalLahir: 'Sedati Sidoarjo, 12 Januari 2004',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-pan-1',
    nomorPertandinganNama: 'Recurve 70 Meter Putra',
    tinggiBadan: 176,
    beratBadan: 69.0,
    statusKondisi: 'Bugar',
    catatanKondisi: 'Stabilitas tarikan bow 52 detik, grouping panah jarak 70m konsisten di zona kuning (9-10).',
  },

  // Renang
  {
    id: 'atl-rng-1',
    caborId: 'cabor-renang',
    nama: 'Aldo Febrian',
    nik: '3515021106040001',
    tempatTanggalLahir: 'Sidoarjo, 11 Juni 2004',
    jenisKelamin: 'L',
    nomorPertandinganId: 'nomor-rng-1',
    nomorPertandinganNama: '50m Gaya Bebas Putra',
    tinggiBadan: 182,
    beratBadan: 74.0,
    statusKondisi: 'Bugar',
    catatanKondisi: 'Pull-up meningkat jadi 24 repetisi, kekuatan dorongan start bertambah.',
  },
];

export const INITIAL_SESI_TES: SesiTesFisik[] = [
  // Rizky Alamsyah (Angkat Besi) - 2 Sesi Perbandingan
  {
    id: 'sesi-ab-1',
    atletId: 'atl-ab-1',
    caborId: 'cabor-angkat-besi',
    namaSesi: 'Tes Awal Baseline (Januari 2026)',
    tanggalTes: '2026-01-20',
    penguji: 'Aris Prasetyo, S.Or & Tim Lab Fisiologi KONI',
    skorFisik: {
      'param-ab-1': 95,  // Snatch
      'param-ab-2': 120, // Clean & Jerk
      'param-ab-3': 162, // Back Squat
      'param-ab-4': 130, // Core Plank
    },
    catatanEvaluator: 'Titik tolak fisik awal Puslatkab. Otot punggung perlu penguatan.',
  },
  {
    id: 'sesi-ab-2',
    atletId: 'atl-ab-1',
    caborId: 'cabor-angkat-besi',
    namaSesi: 'Tes Kemajuan Tahap 2 (Oktober 2026)',
    tanggalTes: '2026-10-25',
    penguji: 'Aris Prasetyo, S.Or & Didik Prasetya',
    skorFisik: {
      'param-ab-1': 105, // Snatch (+10.5%)
      'param-ab-2': 135, // Clean & Jerk (+12.5%)
      'param-ab-3': 180, // Back Squat (+11.1%)
      'param-ab-4': 175, // Core Plank (+34.6%)
    },
    catatanEvaluator: 'Peningkatan signifikan! Mendekati standar unggulan Porprov Jatim 2027.',
  },

  // Kevin Dwi Wicaksono (Bulutangkis) - 2 Sesi Perbandingan
  {
    id: 'sesi-bt-1',
    atletId: 'atl-bt-1',
    caborId: 'cabor-bulutangkis',
    namaSesi: 'Tes Awal Baseline (Februari 2026)',
    tanggalTes: '2026-02-15',
    penguji: 'Drs. Bambang Wijaya & Tim Monev Bapel',
    skorFisik: {
      'param-bt-1': 53.5, // VO2 Max
      'param-bt-2': 9.75, // Agility T-Test (detik)
      'param-bt-3': 58,   // Vertical Jump (cm)
      'param-bt-4': 19,   // Sit & Reach (cm)
      'param-bt-5': 37,   // Footwork 1 Min
    },
    catatanEvaluator: 'Kapasitas aerobik dasar sudah di atas batas minimal, kelincahan perlu akselerasi.',
  },
  {
    id: 'sesi-bt-2',
    atletId: 'atl-bt-1',
    caborId: 'cabor-bulutangkis',
    namaSesi: 'Tes Kemajuan Tahap 2 (November 2026)',
    tanggalTes: '2026-11-04',
    penguji: 'Drs. Bambang Wijaya & Rudi Hartono, M.Pd',
    skorFisik: {
      'param-bt-1': 58.8, // VO2 Max (+9.9%)
      'param-bt-2': 9.20, // Agility T-Test (Lebih cepat 0.55 detik!)
      'param-bt-3': 64,   // Vertical Jump (+6 cm)
      'param-bt-4': 23,   // Sit & Reach (+4 cm)
      'param-bt-5': 43,   // Footwork (+6 repetisi)
    },
    catatanEvaluator: 'Kemajuan sangat impresif di semua parameter. Footwork dan stamina sangat siap kompetisi.',
  },

  // Bayu Arya Pratama (Atletik) - 2 Sesi
  {
    id: 'sesi-atl-1',
    atletId: 'atl-atl-1',
    caborId: 'cabor-atletik',
    namaSesi: 'Tes Awal Baseline (Januari 2026)',
    tanggalTes: '2026-01-22',
    penguji: 'Dian Wahyudi & Tim Tes Fisik KONI',
    skorFisik: {
      'param-atl-1': 4.12, // Sprint 30m
      'param-atl-2': 268,  // Broad jump
      'param-atl-3': 3050, // Cooper
      'param-atl-4': 18,   // Sit & Reach
    },
    catatanEvaluator: 'Daya ledak start block butuh pembenahan angle dorongan.',
  },
  {
    id: 'sesi-atl-2',
    atletId: 'atl-atl-1',
    caborId: 'cabor-atletik',
    namaSesi: 'Tes Kemajuan Tahap 2 (Oktober 2026)',
    tanggalTes: '2026-10-28',
    penguji: 'Dian Wahyudi, S.Or & Aris Prasetyo',
    skorFisik: {
      'param-atl-1': 3.92, // Sprint 30m (Memotong 0.20 detik!)
      'param-atl-2': 288,  // Broad jump (+20 cm)
      'param-atl-3': 3240, // Cooper (+190m)
      'param-atl-4': 22,   // Sit & Reach (+4 cm)
    },
    catatanEvaluator: 'Kecepatan awal 30 meter sangat tajam, berada pada tier calon peraih medali emas Porprov.',
  },
];

export const INITIAL_LAPORAN_MONEV: LaporanMonev[] = [
  {
    id: 'lap-monev-001',
    nomorLaporan: 'BAPEL/MONEV/2026/11/CB-AB01',
    caborId: 'cabor-angkat-besi',
    caborNama: 'Angkat Besi (PABSI)',
    tanggalMonev: '2026-11-09',
    waktuMulai: '15.30',
    waktuSelesai: '17.45',
    tempatLatihan: 'Sasana Angkat Besi GOR Delta Sidoarjo',
    petugasMonevId: 'usr-monev-2',
    petugasMonevNama: 'Aris Prasetyo, S.Or, M.Fis',
    kehadiranAtlet: {
      hadir: 7,
      izin: 0,
      sakit: 0,
      cedera: 1,
      total: 8,
    },
    pelatihHadir: ['M. Subeki, S.Pd', 'Didik Prasetya'],
    materiLatihan: 'Program Hypertrophy & Transisi Kekuatan Maksimal 1RM Squat serta Drill Snatch Balance.',
    evaluasiFisik: 'Daya tahan otot inti dan kestabilan bahu rata-rata meningkat 12% dibanding bulan lalu. Namun beban tinggi memicu resiko pada lutut jika pemanasan kurang intensif.',
    evaluasiTeknikTaktik: 'Teknik catch barbel pada saat drop snatch Rizky Alamsyah semakin stabil. Posisi siku terkunci rapat.',
    kondisiSaranaPrasarana: 'Bagus, namun plat barbel kalibrasi 2.5kg dan 5kg mulai menipis dan perlu penambahan chalk/kapur magnesium.',
    kendalaCabor: 'Atlet Bagus Prakoso mengeluhkan lutut kanan nyeri tajam saat repetisi ketiga squat 170kg.',
    rekomendasiBapel: 'Segera istirahatkan Bagus Prakoso dari angkatan beban tumpuan lutut dan rujuk ke Fisioterapi Bapel KONI Sidoarjo untuk observasi patellar tendinopathy.',
    atletButuhMedis: [
      {
        atletId: 'atl-ab-2',
        namaAtlet: 'Bagus Prakoso',
        keluhan: 'Nyeri tajam patellar tendon lutut kanan saat squat 170kg',
        tindakanDibutuhkan: 'Rujukan USG muskuloskeletal dan fisioterapi kompresif Bapel',
      },
    ],
    fotoDokumentasi: [
      {
        id: 'foto-1',
        fileName: 'snatch_drill_sesi_1.jpg',
        sizeKb: 420,
        caption: 'Drill teknik snatch Rizky Alamsyah disupervisi pelatih M. Subeki',
        dataUrl: createMockPhotoUrl('Sesi Drill Angkat Besi GOR Delta', '#1e3a8a'),
      },
      {
        id: 'foto-2',
        fileName: 'evaluasi_beban_squat.jpg',
        sizeKb: 512,
        caption: 'Pencatatan repetisi dan volume tonase beban atlet puslatkab',
        dataUrl: createMockPhotoUrl('Monitoring Volume Beban & Kebugaran', '#065f46'),
      },
      {
        id: 'foto-3',
        fileName: 'pemeriksaan_lutut_bagus.jpg',
        sizeKb: 380,
        caption: 'Pemeriksaan awal nyeri lutut atlet Bagus Prakoso di pinggir sasana',
        dataUrl: createMockPhotoUrl('Screening Fisik Atlet Cedera', '#991b1b'),
      },
      {
        id: 'foto-4',
        fileName: 'briefing_akhir_monev.jpg',
        sizeKb: 460,
        caption: 'Briefing dan evaluasi Tim Monev Bapel bersama jajaran pelatih PABSI',
        dataUrl: createMockPhotoUrl('Pengarahan Tim Monev Bapel Sidoarjo', '#854d0e'),
      },
    ],
    status: 'Terkirim',
    tandaTangan: {
      monevSigned: true,
      caborSigned: true,
      pelatihNama: 'M. Subeki, S.Pd',
    },
    createdAt: '2026-11-09T18:15:00Z',
  },
  {
    id: 'lap-monev-002',
    nomorLaporan: 'BAPEL/MONEV/2026/11/CB-BT02',
    caborId: 'cabor-bulutangkis',
    caborNama: 'Bulutangkis (PBSI)',
    tanggalMonev: '2026-11-07',
    waktuMulai: '15.00',
    waktuSelesai: '18.15',
    tempatLatihan: 'Hall Bulutangkis GOR Sidoarjo Lapangan 2 & 3',
    petugasMonevId: 'usr-monev-1',
    petugasMonevNama: 'Drs. Bambang Wijaya, M.Pd',
    kehadiranAtlet: {
      hadir: 9,
      izin: 1,
      sakit: 0,
      cedera: 1,
      total: 11,
    },
    pelatihHadir: ['Hendra Setiawan, S.Pd', 'Rudi Hartono, M.Pd'],
    materiLatihan: 'Simulasi game match 3x21 poin dan drill footwork defensif 6 titik under pressure.',
    evaluasiFisik: 'Stamina atlet tunggal putra Kevin Dwi Wicaksono sangat prima, bugar hingga set ketiga tanpa penurunan kecepatan gerak.',
    evaluasiTeknikTaktik: 'Pola serang ganda putra sangat cepat dalam mematikan shuttlecock di depan net.',
    kondisiSaranaPrasarana: 'Lantai karpet karpet lapangan 3 perlu pengeleman ulang di bagian baseline karena sedikit bergelombang.',
    kendalaCabor: 'Shuttlecock standar turnamen Porprov (speed 77) stok mulai berkurang.',
    rekomendasiBapel: 'Bapel akan mengusulkan perbaikan karpet lapangan 3 dan penambahan suplai shuttlecock resmi Porprov ke KONI Sidoarjo.',
    atletButuhMedis: [
      {
        atletId: 'atl-bt-2',
        namaAtlet: 'Nabila Syahrani',
        keluhan: 'Dalam masa pemulihan ankle sprain kanan, butuh kontrol lanjutan',
        tindakanDibutuhkan: 'Evaluasi kesiapan return-to-sport oleh dokter Bapel',
      },
    ],
    fotoDokumentasi: [
      {
        id: 'foto-bt-1',
        fileName: 'drill_footwork_bulutangkis.jpg',
        sizeKb: 540,
        caption: 'Drill footwork kelincahan Kevin Dwi Wicaksono di lapangan 2',
        dataUrl: createMockPhotoUrl('Drill Footwork PBSI GOR Sidoarjo', '#1e3a8a'),
      },
      {
        id: 'foto-bt-2',
        fileName: 'simulasi_game_ganda.jpg',
        sizeKb: 610,
        caption: 'Simulasi game intensitas tinggi ganda putra puslatkab',
        dataUrl: createMockPhotoUrl('Simulasi Match Atlet Bulutangkis', '#0f766e'),
      },
      {
        id: 'foto-bt-3',
        fileName: 'diskusi_program_pelatih.jpg',
        sizeKb: 430,
        caption: 'Diskusi Tim Monev Bapel bersama pelatih kepala Hendra Setiawan',
        dataUrl: createMockPhotoUrl('Evaluasi Monev Bersama Pelatih Cabor', '#4338ca'),
      },
    ],
    status: 'Terkirim',
    tandaTangan: {
      monevSigned: true,
      caborSigned: true,
      pelatihNama: 'Hendra Setiawan, S.Pd',
    },
    createdAt: '2026-11-07T18:45:00Z',
  },
];
