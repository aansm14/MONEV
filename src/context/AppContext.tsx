import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Cabor, 
  NomorPertandingan, 
  Pelatih, 
  Atlet, 
  ParameterFisik, 
  SesiTesFisik, 
  LaporanMonev, 
  ConditionStatus,
  KopSuratConfig
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_CABORS, 
  INITIAL_NOMOR_PERTANDINGAN, 
  INITIAL_PELATIH, 
  INITIAL_PARAMETERS, 
  INITIAL_ATLETS, 
  INITIAL_SESI_TES, 
  INITIAL_LAPORAN_MONEV 
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  cabors: Cabor[];
  nomorPertandingan: NomorPertandingan[];
  pelatihList: Pelatih[];
  parameters: ParameterFisik[];
  atlets: Atlet[];
  sesiTesList: SesiTesFisik[];
  laporanMonevList: LaporanMonev[];
  
  // Auth methods
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  
  // Role helpers
  isAdmin: boolean;
  isMonev: boolean;
  isCabor: boolean;
  userCabor: Cabor | null;
  accessibleCabors: Cabor[];
  
  // Crud actions
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  addCabor: (cabor: Omit<Cabor, 'id'>) => Cabor;
  updateCabor: (id: string, cabor: Partial<Cabor>) => void;
  deleteCabor: (id: string) => void;
  
  addNomorPertandingan: (nomor: Omit<NomorPertandingan, 'id'>) => void;
  updateNomorPertandingan: (id: string, nomor: Partial<NomorPertandingan>) => void;
  deleteNomorPertandingan: (id: string) => void;

  addPelatih: (pelatih: Omit<Pelatih, 'id'>) => void;
  updatePelatih: (id: string, pelatih: Partial<Pelatih>) => void;
  deletePelatih: (id: string) => void;
  
  addAtlet: (atlet: Omit<Atlet, 'id'>) => void;
  updateAtlet: (id: string, atlet: Partial<Atlet>) => void;
  deleteAtlet: (id: string) => void;
  updateAtletCondition: (id: string, status: ConditionStatus, catatan: string, rujukanMedis?: string) => void;

  addParameter: (param: Omit<ParameterFisik, 'id'>) => void;
  updateParameter: (id: string, param: Partial<ParameterFisik>) => void;
  deleteParameter: (id: string) => void;

  addSesiTes: (sesi: Omit<SesiTesFisik, 'id'>) => void;
  updateSesiTes: (id: string, sesi: Partial<SesiTesFisik>) => void;
  deleteSesiTes: (id: string) => void;

  addLaporanMonev: (laporan: Omit<LaporanMonev, 'id' | 'createdAt'>) => void;
  updateLaporanMonev: (id: string, laporan: Partial<LaporanMonev>) => void;

  // Kop Surat & Logo Configuration
  kopConfig: KopSuratConfig;
  updateKopConfig: (newConfig: Partial<KopSuratConfig>) => void;
  resetKopConfig: () => void;

  // Medical Alert queries
  criticalAthletes: Atlet[];
  medicalAlertCount: number;

  // Reset database helper
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'koni_sidoarjo_current_user',
  USERS: 'koni_sidoarjo_users_v1',
  CABORS: 'koni_sidoarjo_cabors_v1',
  NOMOR: 'koni_sidoarjo_nomor_v1',
  PELATIH: 'koni_sidoarjo_pelatih_v1',
  PARAMETERS: 'koni_sidoarjo_parameters_v1',
  ATLETS: 'koni_sidoarjo_atlets_v1',
  SESI_TES: 'koni_sidoarjo_sesi_tes_v1',
  LAPORAN: 'koni_sidoarjo_laporan_monev_v1',
  KOP_CONFIG: 'koni_sidoarjo_kop_config_v1',
};

export const DEFAULT_KOP_CONFIG: KopSuratConfig = {
  logoKoniUrl: '',
  logoBapelUrl: '',
  instansiInduk: 'KOMITE OLAHRAGA NASIONAL INDONESIA (KONI)',
  kabupatenKota: 'KABUPATEN SIDOARJO',
  namaBadan: 'BADAN PELAKSANA (BAPEL) PUSLATKAB PORPROV JATIM IX 2027',
  alamat: 'Sekretariat: Kompleks GOR Gelora Delta Sidoarjo, Jl. Pahlawan No. 1, Sidoarjo 61212',
  kontak: 'Email: bapel.puslatkab2027@konisidoarjo.or.id · Website: puslatkab.konisidoarjo.or.id',
  namaKetuaBapel: 'Drs. H. M. Taufiqurrahman, M.Si',
  jabatanKetuaBapel: 'Ketua Badan Pelaksana (BAPEL) Puslatkab KONI Sidoarjo',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or fallback to initial data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        return parsed.map((u) => {
          if (!u.password) {
            const init = INITIAL_USERS.find((initU) => initU.username === u.username);
            return { ...u, password: init ? init.password : 'koni2027' };
          }
          return u;
        });
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null; // Initial state is logged out, will prompt login
  });

  const [cabors, setCabors] = useState<Cabor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CABORS);
    return saved ? JSON.parse(saved) : INITIAL_CABORS;
  });

  const [nomorPertandingan, setNomorPertandingan] = useState<NomorPertandingan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOMOR);
    return saved ? JSON.parse(saved) : INITIAL_NOMOR_PERTANDINGAN;
  });

  const [pelatihList, setPelatihList] = useState<Pelatih[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PELATIH);
    return saved ? JSON.parse(saved) : INITIAL_PELATIH;
  });

  const [parameters, setParameters] = useState<ParameterFisik[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARAMETERS);
    return saved ? JSON.parse(saved) : INITIAL_PARAMETERS;
  });

  const [atlets, setAtlets] = useState<Atlet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATLETS);
    return saved ? JSON.parse(saved) : INITIAL_ATLETS;
  });

  const [sesiTesList, setSesiTesList] = useState<SesiTesFisik[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESI_TES);
    return saved ? JSON.parse(saved) : INITIAL_SESI_TES;
  });

  const [laporanMonevList, setLaporanMonevList] = useState<LaporanMonev[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAPORAN);
    return saved ? JSON.parse(saved) : INITIAL_LAPORAN_MONEV;
  });

  const [kopConfig, setKopConfig] = useState<KopSuratConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KOP_CONFIG);
    if (saved) {
      try {
        return { ...DEFAULT_KOP_CONFIG, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_KOP_CONFIG;
      }
    }
    return DEFAULT_KOP_CONFIG;
  });

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KOP_CONFIG, JSON.stringify(kopConfig));
  }, [kopConfig]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CABORS, JSON.stringify(cabors));
  }, [cabors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOMOR, JSON.stringify(nomorPertandingan));
  }, [nomorPertandingan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PELATIH, JSON.stringify(pelatihList));
  }, [pelatihList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARAMETERS, JSON.stringify(parameters));
  }, [parameters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATLETS, JSON.stringify(atlets));
  }, [atlets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESI_TES, JSON.stringify(sesiTesList));
  }, [sesiTesList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify(laporanMonevList));
  }, [laporanMonevList]);

  // Auth methods
  const login = (username: string, password: string): { success: boolean; message?: string } => {
    const trimmedUsername = username.trim().toLowerCase();
    const found = users.find((u) => u.username.toLowerCase() === trimmedUsername);
    if (!found) {
      return { success: false, message: `Username "${username}" tidak terdaftar dalam sistem Puslatkab.` };
    }
    if (found.password !== password) {
      return { success: false, message: 'Password / Kata sandi tidak cocok. Silakan coba lagi.' };
    }
    setCurrentUser(found);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isMonev = currentUser?.role === 'monev';
  const isCabor = currentUser?.role === 'cabor';

  const userCabor = currentUser?.caborId 
    ? cabors.find((c) => c.id === currentUser.caborId) || null 
    : null;

  // Filter accessible cabors based on role
  const accessibleCabors = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return cabors;
    if (currentUser.role === 'monev') {
      const assigned = currentUser.assignedCaborIds || [];
      return cabors.filter((c) => assigned.includes(c.id));
    }
    if (currentUser.role === 'cabor' && currentUser.caborId) {
      return cabors.filter((c) => c.id === currentUser.caborId);
    }
    return [];
  }, [currentUser, cabors]);

  // CRUD Actions
  const addUser = (newUser: Omit<User, 'id'>) => {
    const id = `usr-${Date.now()}`;
    setUsers((prev) => [...prev, { ...newUser, id }]);
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (currentUser?.id === id) {
      logout();
    }
  };

  const addCabor = (newCabor: Omit<Cabor, 'id'>): Cabor => {
    const id = `cabor-${Date.now()}`;
    const created: Cabor = { ...newCabor, id };
    setCabors((prev) => [...prev, created]);

    // If current logged in user is a Monev team member, automatically attach this new cabor to their scope
    if (currentUser?.role === 'monev') {
      const assigned = currentUser.assignedCaborIds || [];
      if (!assigned.includes(id)) {
        const updatedAssigned = [...assigned, id];
        updateUser(currentUser.id, { assignedCaborIds: updatedAssigned });
      }
    }

    return created;
  };

  const updateCabor = (id: string, updated: Partial<Cabor>) => {
    setCabors((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCabor = (id: string) => {
    setCabors((prev) => prev.filter((c) => c.id !== id));
    setNomorPertandingan((prev) => prev.filter((n) => n.caborId !== id));
    setPelatihList((prev) => prev.filter((p) => p.caborId !== id));
    setAtlets((prev) => prev.filter((a) => a.caborId !== id));
    setParameters((prev) => prev.filter((p) => p.caborId !== id));
    setSesiTesList((prev) => prev.filter((s) => s.caborId !== id));
    setLaporanMonevList((prev) => prev.filter((l) => l.caborId !== id));
  };

  const addNomorPertandingan = (nomor: Omit<NomorPertandingan, 'id'>) => {
    const id = `nomor-${Date.now()}`;
    setNomorPertandingan((prev) => [...prev, { ...nomor, id }]);
  };

  const updateNomorPertandingan = (id: string, updated: Partial<NomorPertandingan>) => {
    setNomorPertandingan((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n)));
  };

  const deleteNomorPertandingan = (id: string) => {
    setNomorPertandingan((prev) => prev.filter((n) => n.id !== id));
  };

  const addPelatih = (pelatih: Omit<Pelatih, 'id'>) => {
    const id = `plt-${Date.now()}`;
    setPelatihList((prev) => [...prev, { ...pelatih, id }]);
  };

  const updatePelatih = (id: string, updated: Partial<Pelatih>) => {
    setPelatihList((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deletePelatih = (id: string) => {
    setPelatihList((prev) => prev.filter((p) => p.id !== id));
  };

  const addAtlet = (atlet: Omit<Atlet, 'id'>) => {
    const id = `atl-${Date.now()}`;
    setAtlets((prev) => [...prev, { ...atlet, id }]);
  };

  const updateAtlet = (id: string, updated: Partial<Atlet>) => {
    setAtlets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteAtlet = (id: string) => {
    setAtlets((prev) => prev.filter((a) => a.id !== id));
    setSesiTesList((prev) => prev.filter((s) => s.atletId !== id));
  };

  const updateAtletCondition = (
    id: string, 
    status: ConditionStatus, 
    catatan: string, 
    rujukanMedis?: string
  ) => {
    setAtlets((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nowStr = new Date().toISOString().split('T')[0];
        let riwayat = a.riwayatCedera ? [...a.riwayatCedera] : [];
        if (status === 'Perhatian Medis Segera' && rujukanMedis) {
          riwayat.unshift({
            tanggal: nowStr,
            diagnosa: catatan,
            status: 'Aktif Perlu Rujukan',
            tindakanMedis: rujukanMedis,
          });
        }
        return {
          ...a,
          statusKondisi: status,
          catatanKondisi: catatan,
          riwayatCedera: riwayat,
        };
      })
    );
  };

  const addParameter = (param: Omit<ParameterFisik, 'id'>) => {
    const id = `param-${Date.now()}`;
    setParameters((prev) => [...prev, { ...param, id }]);
  };

  const updateParameter = (id: string, updated: Partial<ParameterFisik>) => {
    setParameters((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteParameter = (id: string) => {
    setParameters((prev) => prev.filter((p) => p.id !== id));
  };

  const addSesiTes = (sesi: Omit<SesiTesFisik, 'id'>) => {
    const id = `sesi-${Date.now()}`;
    setSesiTesList((prev) => [...prev, { ...sesi, id }]);
  };

  const updateSesiTes = (id: string, updated: Partial<SesiTesFisik>) => {
    setSesiTesList((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteSesiTes = (id: string) => {
    setSesiTesList((prev) => prev.filter((s) => s.id !== id));
  };

  const addLaporanMonev = (laporan: Omit<LaporanMonev, 'id' | 'createdAt'>) => {
    const id = `lap-monev-${Date.now()}`;
    const createdAt = new Date().toISOString();
    setLaporanMonevList((prev) => [{ ...laporan, id, createdAt }, ...prev]);
  };

  const updateLaporanMonev = (id: string, updated: Partial<LaporanMonev>) => {
    setLaporanMonevList((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  // Critical athletes query
  const criticalAthletes = React.useMemo(() => {
    if (!currentUser) return [];
    const baseList = atlets.filter((a) => a.statusKondisi === 'Perhatian Medis Segera');
    if (currentUser.role === 'admin') return baseList;
    if (currentUser.role === 'monev') {
      const allowed = currentUser.assignedCaborIds || [];
      return baseList.filter((a) => allowed.includes(a.caborId));
    }
    if (currentUser.role === 'cabor') {
      return baseList.filter((a) => a.caborId === currentUser.caborId);
    }
    return [];
  }, [currentUser, atlets]);

  const medicalAlertCount = criticalAthletes.length;

  const updateKopConfig = (newConfig: Partial<KopSuratConfig>) => {
    setKopConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetKopConfig = () => {
    setKopConfig(DEFAULT_KOP_CONFIG);
  };

  const resetToDefaultData = () => {
    setUsers(INITIAL_USERS);
    setCabors(INITIAL_CABORS);
    setNomorPertandingan(INITIAL_NOMOR_PERTANDINGAN);
    setPelatihList(INITIAL_PELATIH);
    setParameters(INITIAL_PARAMETERS);
    setAtlets(INITIAL_ATLETS);
    setSesiTesList(INITIAL_SESI_TES);
    setLaporanMonevList(INITIAL_LAPORAN_MONEV);
    setKopConfig(DEFAULT_KOP_CONFIG);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        cabors,
        nomorPertandingan,
        pelatihList,
        parameters,
        atlets,
        sesiTesList,
        laporanMonevList,
        login,
        logout,
        isAdmin,
        isMonev,
        isCabor,
        userCabor,
        accessibleCabors,
        addUser,
        updateUser,
        deleteUser,
        addCabor,
        updateCabor,
        deleteCabor,
        addNomorPertandingan,
        updateNomorPertandingan,
        deleteNomorPertandingan,
        addPelatih,
        updatePelatih,
        deletePelatih,
        addAtlet,
        updateAtlet,
        deleteAtlet,
        updateAtletCondition,
        addParameter,
        updateParameter,
        deleteParameter,
        addSesiTes,
        updateSesiTes,
        deleteSesiTes,
        addLaporanMonev,
        updateLaporanMonev,
        kopConfig,
        updateKopConfig,
        resetKopConfig,
        criticalAthletes,
        medicalAlertCount,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
