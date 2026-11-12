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
  ConditionStatus 
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
  login: (username: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  
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
  
  addCabor: (cabor: Omit<Cabor, 'id'>) => void;
  updateCabor: (id: string, cabor: Partial<Cabor>) => void;
  
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
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or fallback to initial data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
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

  // Sync state to LocalStorage
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
  const login = (username: string): boolean => {
    const found = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
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

  const addCabor = (newCabor: Omit<Cabor, 'id'>) => {
    const id = `cabor-${Date.now()}`;
    setCabors((prev) => [...prev, { ...newCabor, id }]);
  };

  const updateCabor = (id: string, updated: Partial<Cabor>) => {
    setCabors((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
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

  const resetToDefaultData = () => {
    if (window.confirm('Reset database ke data awal standar Bapel Puslatkab KONI Sidoarjo?')) {
      setUsers(INITIAL_USERS);
      setCabors(INITIAL_CABORS);
      setNomorPertandingan(INITIAL_NOMOR_PERTANDINGAN);
      setPelatihList(INITIAL_PELATIH);
      setParameters(INITIAL_PARAMETERS);
      setAtlets(INITIAL_ATLETS);
      setSesiTesList(INITIAL_SESI_TES);
      setLaporanMonevList(INITIAL_LAPORAN_MONEV);
      localStorage.clear();
      window.location.reload();
    }
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
        switchUser,
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
