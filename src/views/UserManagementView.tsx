import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Role } from '../types';
import { 
  UserCog, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  Activity, 
  Users, 
  Phone, 
  Check, 
  Search 
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { 
    currentUser, 
    isAdmin, 
    users, 
    addUser, 
    updateUser, 
    deleteUser, 
    cabors 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('monev');
  const [phone, setPhone] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [caborId, setCaborId] = useState(cabors[0]?.id || '');
  const [assignedCaborIds, setAssignedCaborIds] = useState<string[]>([]);

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        Halaman Manajemen Pengguna hanya dapat diakses oleh Admin Utama Bapel Puslatkab KONI Sidoarjo.
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.jabatan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openAddUser = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('koni2027');
    setName('');
    setRole('monev');
    setPhone('0812xxxxxxxx');
    setJabatan('Tim Pendamping Monev Bapel');
    setCaborId(cabors[0]?.id || '');
    setAssignedCaborIds([cabors[0]?.id || '']);
    setModalOpen(true);
  };

  const openEditUser = (u: User) => {
    setEditingUser(u);
    setUsername(u.username);
    setPassword(u.password || 'koni2027');
    setName(u.name);
    setRole(u.role);
    setPhone(u.phone);
    setJabatan(u.jabatan);
    setCaborId(u.caborId || cabors[0]?.id || '');
    setAssignedCaborIds(u.assignedCaborIds || []);
    setModalOpen(true);
  };

  const toggleAssignedCabor = (id: string) => {
    setAssignedCaborIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: Omit<User, 'id'> = {
      username: username.trim().toLowerCase(),
      password: password.trim() || 'koni2027',
      name,
      role,
      phone,
      jabatan,
      caborId: role === 'cabor' ? caborId : undefined,
      assignedCaborIds: role === 'monev' ? assignedCaborIds : undefined,
    };

    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }

    setModalOpen(false);
  };

  const caborMap = new Map(cabors.map((c) => [c.id, c.nama]));

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Manajemen Pengguna & Penugasan Tim Monev
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola hak akses: Admin Utama (Akses penuh), Tim Monev (Pendamping cabor naungan), dan Pengurus/Pelatih Cabang Olahraga.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddUser}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Search and User List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama, username, jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Total {filteredUsers.length} Akun
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-3 px-4 font-bold">Nama & Akun</th>
                <th className="py-3 px-4 font-bold">Peran (Hak Akses)</th>
                <th className="py-3 px-4 font-bold">Jabatan Resmi</th>
                <th className="py-3 px-4 font-bold">Cabor Naungan / Binaan</th>
                <th className="py-3 px-4 font-bold">Kontak</th>
                <th className="py-3 px-4 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      User: @{u.username} · Pass: <span className="font-semibold text-slate-700 bg-slate-100 px-1 rounded">{u.password}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase inline-flex items-center gap-1.5 ${
                      u.role === 'admin'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : u.role === 'monev'
                        ? 'bg-sky-100 text-sky-900 border border-sky-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {u.role === 'admin' ? (
                        <Shield className="w-3 h-3" />
                      ) : u.role === 'monev' ? (
                        <Activity className="w-3 h-3" />
                      ) : (
                        <Users className="w-3 h-3" />
                      )}
                      <span>
                        {u.role === 'admin' ? 'Admin Utama' : u.role === 'monev' ? 'Tim Monev' : 'Pengurus Cabor'}
                      </span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {u.jabatan}
                  </td>

                  <td className="py-3.5 px-4">
                    {u.role === 'cabor' && (
                      <span className="font-semibold text-slate-800">
                        {caborMap.get(u.caborId || '') || 'Cabor'}
                      </span>
                    )}

                    {u.role === 'monev' && (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.assignedCaborIds && u.assignedCaborIds.length > 0 ? (
                          u.assignedCaborIds.map((cid) => (
                            <span 
                              key={cid}
                              className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                            >
                              {caborMap.get(cid) || cid}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">Belum ditentukan</span>
                        )}
                      </div>
                    )}

                    {u.role === 'admin' && (
                      <span className="text-slate-500 text-[11px] font-medium">
                        Semua Cabang Olahraga
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                    {u.phone}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditUser(u)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 rounded-lg hover:bg-slate-100"
                        title="Edit Akun"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {u.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add/Edit User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-4 flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border border-slate-200 text-xs">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-sm font-bold">
                {editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Username Login *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: monev3, renang"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Kata Sandi / Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Peran Hak Akses *</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full border rounded-lg p-2 bg-white font-semibold"
                >
                  <option value="admin">Admin Utama Bapel</option>
                  <option value="monev">Tim Monev Bapel</option>
                  <option value="cabor">Pengurus / Pelatih Cabor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Drs. Bambang Wijaya, M.Pd"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Jabatan Resmi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Koordinator Monev Klaster Beladiri"
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor Kontak / WhatsApp</label>
                <input
                  type="text"
                  placeholder="0812xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded-lg p-2 font-mono"
                />
              </div>

              {/* Conditional role assignments */}
              {role === 'cabor' && (
                <div>
                  <label className="block font-semibold mb-1">Cabor yang Diwakili *</label>
                  <select
                    value={caborId}
                    onChange={(e) => setCaborId(e.target.value)}
                    className="w-full border rounded-lg p-2 bg-white"
                  >
                    {cabors.map((c) => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>
              )}

              {role === 'monev' && (
                <div>
                  <label className="block font-semibold mb-1">
                    Cabor Dampingan Binaan (Bisa pilih lebih dari satu)
                  </label>
                  <div className="space-y-1.5 border border-slate-200 rounded-lg p-2.5 max-h-40 overflow-y-auto">
                    {cabors.map((c) => {
                      const isChecked = assignedCaborIds.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAssignedCabor(c.id)}
                            className="w-3.5 h-3.5 text-amber-500 rounded"
                          />
                          <span className="text-slate-800 font-medium">{c.nama}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

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
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
