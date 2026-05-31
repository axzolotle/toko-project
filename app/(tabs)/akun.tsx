import {
  checkUsernameExists,
  createAkunKas,
  createUser,
  deactivateUser,
  getAllUsers,
  getDaftarKas,
  getRiwayatStok,
  getUserById,
  kas,
  Stok,
  User,
} from "@/database/db2";
import { syncAllTables } from "@/database/sync";
import { useTheme } from "@/lib/ThemeContext";
import { CURRENT_USER_KEY, useCurrentUser } from "@/service/useCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================
//  TYPES
// ============================================================

type UserRole = "operator" | "admin";

interface UserProfile {
  id: number;
  nama: string;
  username: string; // '@rina'
  role: UserRole;
  avatarInisial: string;
}

interface AppSettings {
  modeMalam: boolean;
  terhubungInternet: boolean;
  statusSync: "siap" | "syncing" | "error";
  terakhirSync: string; // '09:30'
}

type StokHistoryRow = Stok & {
  item_nama: string | null;
};

type KasJenis = "cash" | "bank" | "ewallet";

type InfoItem = {
  title: string;
  desc: string;
};

// ============================================================
//  1. LAYER SQL / DATABASE
//     → Ganti dengan query SQLite / fetch API / AsyncStorage
// ============================================================

// ✅ PERBAIKAN: Terima userId sebagai parameter, jangan gunakan hook di sini
const db_getUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    // Ambil data user dari database
    const users = getUserById(userId);

    if (!users) {
      throw new Error("User not found");
    }

    return {
      id: users.id,
      nama: users.nama,
      username: users.username,
      role: users.role === "admin" ? "admin" : "operator",
      avatarInisial: users.nama?.charAt(0).toUpperCase() || "U",
    };
  } catch (error) {
    console.error("Error loading user profile:", error);
    throw error;
  }
};

// ✅ PERBAIKAN: Ambil dari AsyncStorage dan cek internet connection
const db_getAppSettings = async (): Promise<AppSettings> => {
  try {
    // Ambil dari AsyncStorage
    const stored = await AsyncStorage.getItem("app_settings");
    const settings = stored ? JSON.parse(stored) : null;

    // Cek koneksi internet (placeholder - perlu import NetInfo)
    const terhubungInternet = true; // TODO: gunakan NetInfo.fetch()

    return {
      modeMalam: settings?.modeMalam ?? false,
      terhubungInternet: terhubungInternet,
      statusSync: settings?.statusSync ?? "siap",
      terakhirSync: settings?.terakhirSync ?? "Belum pernah",
    };
  } catch (error) {
    console.error("Error loading app settings:", error);
    // Return default settings jika error
    return {
      modeMalam: false,
      terhubungInternet: true,
      statusSync: "siap",
      terakhirSync: "Belum pernah",
    };
  }
};

// ✅ PERBAIKAN: Sudah dipindah ke ThemeProvider - gunakan useTheme().toggleTheme()
// const db_saveModeMalam = async (value: boolean): Promise<void> => { ... }

// ✅ PERBAIKAN: Tambah error handling dan logging
const db_syncSekarang = async (): Promise<void> => {
  try {
    await syncAllTables();

    // Update last sync time
    const current = await AsyncStorage.getItem("app_settings");
    const settings = current ? JSON.parse(current) : {};
    const now = new Date();
    settings.terakhirSync = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    await AsyncStorage.setItem("app_settings", JSON.stringify(settings));
    console.log("Sync selesai");
  } catch (error) {
    console.error("Error during sync:", error);
    throw error;
  }
};

// ✅ PERBAIKAN: Clear auth data sebelum logout
const db_keluar = async (): Promise<void> => {
  try {
    // Clear semua session data
    await AsyncStorage.multiRemove([
      CURRENT_USER_KEY,
    ]);

    console.log("Session cleared, navigating to login");
    router.replace("/login"); // gunakan replace() bukan push()
  } catch (error) {
    console.error("Error during logout:", error);
    // Tetap navigate meski ada error
    router.replace("/login");
  }
};

// ============================================================
//  2. KALKULASI / HELPERS
// ============================================================

const getInisial = (nama: string): string =>
  nama.trim().charAt(0).toUpperCase();

const getLabelRole = (role: UserRole): string =>
  role === "admin" ? "admin" : "operator";

const getLabelFooter = (role: UserRole): string =>
  role === "admin" ? "Administrator" : "Operator";

// ============================================================
//  3. HOOK
// ============================================================

const useAkun = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // ✅ PERBAIKAN: Gunakan hook di sini, bukan di db layer
  const currentUser = useCurrentUser();

  // ✅ PERBAIKAN: Gunakan useTheme untuk global theme management
  const { toggleTheme } = useTheme();

  const muat = useCallback(async () => {
    if (currentUser.loading) {
      return;
    }

    if (currentUser.userId === null) {
      setUser(null);
      setSettings(await db_getAppSettings());
      setLoading(false);
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      // Sekarang pass userId ke db function
      const [u, s] = await Promise.all([
        db_getUserProfile(currentUser.userId),
        db_getAppSettings(),
      ]);
      setUser(u);
      setSettings(s);
    } catch (e) {
      console.error("Error loading akun data:", e);
    } finally {
      setLoading(false);
    }
  }, [currentUser.loading, currentUser.userId]);

  useEffect(() => {
    muat();
  }, [muat]);

  // Toggle mode malam — update lokal dulu, simpan via context
  const toggleModeMalam = useCallback(
    async (val: boolean) => {
      setSettings((prev) => (prev ? { ...prev, modeMalam: val } : prev));
      await toggleTheme(val); // Update global theme
    },
    [toggleTheme],
  );

  // Sync manual
  const syncSekarang = useCallback(async () => {
    if (syncing) return;
    setSyncing(true);
    setSettings((prev) => (prev ? { ...prev, statusSync: "syncing" } : prev));
    try {
      await db_syncSekarang();
      const now = new Date();
      const jam = now.getHours().toString().padStart(2, "0");
      const mnt = now.getMinutes().toString().padStart(2, "0");
      setSettings((prev) =>
        prev
          ? { ...prev, statusSync: "siap", terakhirSync: `${jam}:${mnt}` }
          : prev,
      );
    } catch {
      setSettings((prev) => (prev ? { ...prev, statusSync: "error" } : prev));
    } finally {
      setSyncing(false);
    }
  }, [syncing]);

  // Keluar
  const keluar = useCallback(async () => {
    await db_keluar();
    // TODO: navigasi ke LoginScreen
  }, []);

  return {
    user,
    settings,
    loading,
    syncing,
    toggleModeMalam,
    syncSekarang,
    keluar,
  };
};

// ============================================================
//  4. UI COMPONENTS
// ============================================================

// ── Reusable: Toggle ─────────────────────────────────────────
const AppToggle: React.FC<{
  value: boolean;
  onToggle: (v: boolean) => void;
  S: any;
}> = ({ value, onToggle, S }) => (
  <TouchableOpacity
    style={[S.toggleTrack, value ? S.toggleTrackOn : S.toggleTrackOff]}
    onPress={() => onToggle(!value)}
    activeOpacity={0.9}
  >
    <View style={[S.toggleThumb, value ? S.toggleThumbOn : S.toggleThumbOff]} />
  </TouchableOpacity>
);

// ── Reusable: Badge ──────────────────────────────────────────
const SiapBadge: React.FC<{ S: any }> = ({ S }) => (
  <View style={S.siapBadge}>
    <Text style={S.siapText}>siap</Text>
  </View>
);

const SoonBadge: React.FC<{ S: any }> = ({ S }) => (
  <View style={S.soonBadge}>
    <Text style={S.soonText}>soon</Text>
  </View>
);

// ── Reusable: Row Item ────────────────────────────────────────
interface RowProps {
  emoji: string;
  title: string;
  desc?: string;
  isLast?: boolean;
  right?: React.ReactNode;
  onPress?: () => void;
  S: any;
}

const SettingRow: React.FC<RowProps> = ({
  emoji,
  title,
  desc,
  isLast = false,
  right,
  onPress,
  S,
}) => (
  <TouchableOpacity
    style={isLast ? S.rowLast : S.row}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={S.rowIconBox}>
      <Text style={S.rowIconEmoji}>{emoji}</Text>
    </View>
    <View style={S.rowTextBlock}>
      <Text style={S.rowTitle}>{title}</Text>
      {desc ? <Text style={S.rowDesc}>{desc}</Text> : null}
    </View>
    {right ?? null}
  </TouchableOpacity>
);

const formatTanggalPendek = (iso: string) => {
  const normalized = iso.includes("T") ? iso : iso.replace(" ", "T");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const kasJenisOptions: Array<{ key: KasJenis; label: string }> = [
  { key: "cash", label: "Cash" },
  { key: "bank", label: "Bank" },
  { key: "ewallet", label: "E-Wallet" },
];

const userRoleOptions: Array<{ key: UserRole; label: string }> = [
  { key: "operator", label: "Operator" },
  { key: "admin", label: "Admin" },
];

const tentangAplikasiItems: InfoItem[] = [
  {
    title: "Konter v1.0.0",
    desc: "Aplikasi kasir offline-first untuk mencatat transaksi, stok, kas, dan rekap harian toko.",
  },
  {
    title: "Alur kerja utama",
    desc: "Transaksi mengurangi stok, penambahan stok tercatat sebagai riwayat, dan rekap harian bisa dikunci sebagai catatan final.",
  },
  {
    title: "Kas toko",
    desc: "Kas dipakai sebagai akun tujuan seperti Cash, rekening bank, atau e-wallet saat mencatat rekap kas.",
  },
  {
    title: "Sinkronisasi",
    desc: "Data tersimpan di device lebih dulu. Tombol sinkronisasi mengirim data lokal yang belum tersinkron.",
  },
];

const privasiItems: InfoItem[] = [
  {
    title: "Data lokal",
    desc: "Data transaksi, item, stok, kas, dan pengguna disimpan di database lokal pada device ini.",
  },
  {
    title: "Sync manual",
    desc: "Data hanya dikirim saat fitur sinkronisasi dijalankan. Pastikan jaringan stabil sebelum sync.",
  },
  {
    title: "Akun dan peran",
    desc: "Admin bisa mengelola pengguna dan pengaturan penting. Operator fokus ke transaksi dan pencatatan operasional.",
  },
  {
    title: "Keamanan device",
    desc: "Gunakan kunci layar HP, logout jika device dipakai bersama, dan batasi akun admin hanya untuk orang yang dipercaya.",
  },
];

const getKasJenisLabel = (jenis: string) => {
  switch (jenis.toLowerCase()) {
    case "cash":
    case "tunai":
      return "Cash";
    case "bank":
    case "rekening":
      return "Bank";
    case "ewallet":
    case "e-wallet":
      return "E-Wallet";
    default:
      return jenis;
  }
};

const HistoryModal: React.FC<{
  visible: boolean;
  title: string;
  emptyText: string;
  onClose: () => void;
  S: any;
  children: React.ReactNode;
}> = ({ visible, title, emptyText, onClose, S, children }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[
            S.modalSheet,
            { paddingBottom: Math.max(28, insets.bottom + 28) },
          ]}
        >
          <Text style={S.modalTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {children || <Text style={S.modalEmptyText}>{emptyText}</Text>}
          </ScrollView>
          <TouchableOpacity style={S.modalCloseButton} onPress={onClose}>
            <Text style={S.modalCloseText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const StokHistoryList: React.FC<{ rows: StokHistoryRow[]; S: any }> = ({
  rows,
  S,
}) => (
  <>
    {rows.map((row, index) => {
      const isLast = index === rows.length - 1;
      return (
        <View key={row.id} style={isLast ? S.modalItemLast : S.modalItem}>
          <View style={S.modalItemInfo}>
            <Text style={S.modalItemTitle}>
              {row.item_nama ?? `Item #${row.item_id}`}
            </Text>
            <Text style={S.modalItemMeta}>
              {row.jenis} · qty {row.quantity} · {formatTanggalPendek(row.tanggal)}
            </Text>
            {row.keterangan ? (
              <Text style={S.modalItemMeta}>{row.keterangan}</Text>
            ) : null}
          </View>
          <Text style={S.modalItemValue}>
            {row.jenis === "masuk" ? "+" : "-"}
            {row.quantity}
          </Text>
        </View>
      );
    })}
  </>
);

const KasList: React.FC<{ rows: kas[]; S: any }> = ({ rows, S }) => (
  <>
    {rows.map((row, index) => {
      const isLast = index === rows.length - 1;
      return (
        <View key={row.id} style={isLast ? S.modalItemLast : S.modalItem}>
          <View style={S.modalItemInfo}>
            <Text style={S.modalItemTitle}>{row.nama}</Text>
            <Text style={S.modalItemMeta}>
              {getKasJenisLabel(row.jenis)} · dibuat{" "}
              {formatTanggalPendek(row.created_at ?? row.tanggal)}
            </Text>
            {row.keterangan ? (
              <Text style={S.modalItemMeta}>{row.keterangan}</Text>
            ) : null}
          </View>
          <Text style={S.modalItemValue}>{getKasJenisLabel(row.jenis)}</Text>
        </View>
      );
    })}
  </>
);

const InfoList: React.FC<{ rows: InfoItem[]; S: any }> = ({ rows, S }) => (
  <>
    {rows.map((row, index) => {
      const isLast = index === rows.length - 1;
      return (
        <View key={row.title} style={isLast ? S.modalItemLast : S.modalItem}>
          <View style={S.modalItemInfo}>
            <Text style={S.modalItemTitle}>{row.title}</Text>
            <Text style={S.modalItemMeta}>{row.desc}</Text>
          </View>
        </View>
      );
    })}
  </>
);

const UserList: React.FC<{
  rows: User[];
  currentUserId: number;
  onDelete: (row: User) => void;
  S: any;
}> = ({ rows, currentUserId, onDelete, S }) => (
  <>
    {rows.map((row, index) => {
      const isLast = index === rows.length - 1;
      const isCurrent = row.id === currentUserId;
      return (
        <View key={row.id} style={isLast ? S.modalItemLast : S.modalItem}>
          <View style={S.modalItemInfo}>
            <Text style={S.modalItemTitle}>
              {row.nama} {isCurrent ? "(Anda)" : ""}
            </Text>
            <Text style={S.modalItemMeta}>
              {row.username} · {getLabelRole(row.role)}
            </Text>
          </View>
          {!isCurrent ? (
            <TouchableOpacity
              style={S.modalDangerButton}
              onPress={() => onDelete(row)}
              activeOpacity={0.8}
            >
              <Text style={S.modalDangerText}>Hapus</Text>
            </TouchableOpacity>
          ) : (
            <Text style={S.modalItemValue}>{getLabelRole(row.role)}</Text>
          )}
        </View>
      );
    })}
  </>
);

const TambahKasModal: React.FC<{
  visible: boolean;
  nama: string;
  jenis: KasJenis;
  keterangan: string;
  onChangeNama: (value: string) => void;
  onChangeJenis: (value: KasJenis) => void;
  onChangeKeterangan: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  S: any;
  C: any;
}> = ({
  visible,
  nama,
  jenis,
  keterangan,
  onChangeNama,
  onChangeJenis,
  onChangeKeterangan,
  onClose,
  onSubmit,
  S,
  C,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[
            S.modalSheet,
            { paddingBottom: Math.max(28, insets.bottom + 28) },
          ]}
        >
          <Text style={S.modalTitle}>Tambah Kas</Text>

          <Text style={S.modalLabel}>Jenis Kas</Text>
          <View style={S.kasTypeRow}>
            {kasJenisOptions.map((option) => {
              const active = jenis === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[S.kasTypeOption, active && S.kasTypeOptionActive]}
                  onPress={() => onChangeJenis(option.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      S.kasTypeOptionText,
                      active && S.kasTypeOptionActiveText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={S.modalLabel}>Nama Kas</Text>
          <TextInput
            style={S.modalInput}
            value={nama}
            onChangeText={onChangeNama}
            placeholder="contoh: BCA, DANA, Cash Toko"
            placeholderTextColor={C.rowDesc}
          />

          <Text style={S.modalLabel}>Keterangan</Text>
          <TextInput
            style={[S.modalInput, S.modalTextArea]}
            value={keterangan}
            onChangeText={onChangeKeterangan}
            placeholder="opsional"
            placeholderTextColor={C.rowDesc}
            multiline
          />

          <View style={S.modalActionRow}>
            <TouchableOpacity style={S.modalCancelButton} onPress={onClose}>
              <Text style={S.modalCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.modalSubmitButton} onPress={onSubmit}>
              <Text style={S.modalSubmitText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TambahPenggunaModal: React.FC<{
  visible: boolean;
  nama: string;
  username: string;
  password: string;
  role: UserRole;
  onChangeNama: (value: string) => void;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeRole: (value: UserRole) => void;
  onClose: () => void;
  onSubmit: () => void;
  S: any;
  C: any;
}> = ({
  visible,
  nama,
  username,
  password,
  role,
  onChangeNama,
  onChangeUsername,
  onChangePassword,
  onChangeRole,
  onClose,
  onSubmit,
  S,
  C,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[
            S.modalSheet,
            { paddingBottom: Math.max(28, insets.bottom + 28) },
          ]}
        >
          <Text style={S.modalTitle}>Tambah Pengguna</Text>

          <Text style={S.modalLabel}>Peran</Text>
          <View style={S.kasTypeRow}>
            {userRoleOptions.map((option) => {
              const active = role === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[S.kasTypeOption, active && S.kasTypeOptionActive]}
                  onPress={() => onChangeRole(option.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      S.kasTypeOptionText,
                      active && S.kasTypeOptionActiveText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={S.modalLabel}>Nama</Text>
          <TextInput
            style={S.modalInput}
            value={nama}
            onChangeText={onChangeNama}
            placeholder="contoh: Rina"
            placeholderTextColor={C.rowDesc}
          />

          <Text style={S.modalLabel}>Username</Text>
          <TextInput
            style={S.modalInput}
            value={username}
            onChangeText={onChangeUsername}
            placeholder="contoh: rina"
            placeholderTextColor={C.rowDesc}
            autoCapitalize="none"
          />

          <Text style={S.modalLabel}>Password</Text>
          <TextInput
            style={S.modalInput}
            value={password}
            onChangeText={onChangePassword}
            placeholder="minimal 4 karakter"
            placeholderTextColor={C.rowDesc}
            secureTextEntry
          />

          <View style={S.modalActionRow}>
            <TouchableOpacity style={S.modalCancelButton} onPress={onClose}>
              <Text style={S.modalCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.modalSubmitButton} onPress={onSubmit}>
              <Text style={S.modalSubmitText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================
//  5. MAIN SCREEN
// ============================================================

const AkunScreen: React.FC = () => {
  const { isDark, colors: C, styles: S } = useTheme();
  const [activeModal, setActiveModal] = useState<
    | null
    | "stok"
    | "kelola-kas"
    | "tambah-kas"
    | "kelola-pengguna"
    | "tambah-pengguna"
    | "tentang"
    | "privasi"
  >(null);
  const [stokHistory, setStokHistory] = useState<StokHistoryRow[]>([]);
  const [daftarKas, setDaftarKas] = useState<kas[]>([]);
  const [daftarPengguna, setDaftarPengguna] = useState<User[]>([]);
  const [kasNama, setKasNama] = useState("");
  const [kasJenis, setKasJenis] = useState<KasJenis>("cash");
  const [kasKeterangan, setKasKeterangan] = useState("");
  const [penggunaNama, setPenggunaNama] = useState("");
  const [penggunaUsername, setPenggunaUsername] = useState("");
  const [penggunaPassword, setPenggunaPassword] = useState("");
  const [penggunaRole, setPenggunaRole] = useState<UserRole>("operator");

  const {
    user,
    settings,
    loading,
    syncing,
    toggleModeMalam,
    syncSekarang,
    keluar,
  } = useAkun();

  if (loading || !user || !settings) {
    return (
      <View
        style={[S.screen, { justifyContent: "center", alignItems: "center" }]}
      >
        <Text style={{ color: C.sectionLabel, fontSize: 14 }}>Memuat...</Text>
      </View>
    );
  }

  const isAdmin = user.role === "admin";

  const openStokHistory = () => {
    setStokHistory(getRiwayatStok());
    setActiveModal("stok");
  };

  const refreshDaftarKas = () => {
    setDaftarKas(getDaftarKas());
  };

  const refreshDaftarPengguna = () => {
    setDaftarPengguna(getAllUsers());
  };

  const openKelolaKas = () => {
    refreshDaftarKas();
    setActiveModal("kelola-kas");
  };

  const openTambahKas = () => {
    setKasNama("");
    setKasJenis("cash");
    setKasKeterangan("");
    setActiveModal("tambah-kas");
  };

  const closeTambahKas = () => {
    setKasNama("");
    setKasJenis("cash");
    setKasKeterangan("");
    setActiveModal("kelola-kas");
  };

  const simpanKas = () => {
    if (!kasNama.trim()) {
      alert("Nama kas wajib diisi");
      return;
    }

    try {
      createAkunKas(kasNama, kasJenis, kasKeterangan, user.id);
      refreshDaftarKas();
      closeTambahKas();
      alert("Kas berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gagal menambahkan kas",
      );
    }
  };

  const openKelolaPengguna = () => {
    refreshDaftarPengguna();
    setActiveModal("kelola-pengguna");
  };

  const openTambahPengguna = () => {
    setPenggunaNama("");
    setPenggunaUsername("");
    setPenggunaPassword("");
    setPenggunaRole("operator");
    setActiveModal("tambah-pengguna");
  };

  const closeTambahPengguna = () => {
    setPenggunaNama("");
    setPenggunaUsername("");
    setPenggunaPassword("");
    setPenggunaRole("operator");
    setActiveModal("kelola-pengguna");
  };

  const simpanPengguna = () => {
    const nama = penggunaNama.trim();
    const username = penggunaUsername.trim();
    const password = penggunaPassword.trim();

    if (!nama) {
      alert("Nama pengguna wajib diisi");
      return;
    }

    if (!username) {
      alert("Username wajib diisi");
      return;
    }

    if (password.length < 4) {
      alert("Password minimal 4 karakter");
      return;
    }

    if (checkUsernameExists(username)) {
      alert("Username sudah dipakai");
      return;
    }

    try {
      createUser(nama, username, password, penggunaRole);
      refreshDaftarPengguna();
      closeTambahPengguna();
      alert("Pengguna berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan pengguna");
    }
  };

  const hapusPengguna = (target: User) => {
    if (target.id === user.id) {
      alert("Akun yang sedang dipakai tidak bisa dihapus");
      return;
    }

    const adminCount = daftarPengguna.filter((row) => row.role === "admin").length;
    if (target.role === "admin" && adminCount <= 1) {
      alert("Admin terakhir tidak bisa dihapus");
      return;
    }

    Alert.alert(
      "Hapus Pengguna",
      `Hapus akun "${target.nama}" dari daftar pengguna aktif?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            try {
              deactivateUser(target.id);
              refreshDaftarPengguna();
            } catch (error) {
              console.error(error);
              alert("Gagal menghapus pengguna");
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />
      <View style={S.screen}>
        {/* <SafeAreaView style={S.safeArea}> */}
        {/* ── HEADER ── */}
        <View style={S.header}>
          <Text style={S.headerTitle}>Akun</Text>
        </View>

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── PROFILE CARD ── */}
          <View style={S.profileCard}>
            <View style={S.avatarCircle}>
              <Text style={S.avatarText}>{user.avatarInisial}</Text>
            </View>
            <View style={S.profileInfo}>
              <Text style={S.profileName}>{user.nama}</Text>
              <Text style={S.profileUsername}>{user.username}</Text>
            </View>
            <View style={S.roleBadge}>
              <Text style={S.roleBadgeText}>{getLabelRole(user.role)}</Text>
            </View>
          </View>

          {/* ── SECTION: TAMPILAN ── */}
          <Text style={S.sectionLabel}>Tampilan</Text>
          <View style={S.groupCard}>
            <SettingRow
              emoji="🌙"
              title="Mode Malam"
              desc="tampilan gelap"
              isLast
              S={S}
              right={
                <AppToggle
                  value={settings.modeMalam}
                  onToggle={toggleModeMalam}
                  S={S}
                />
              }
            />
          </View>

          {/* ── SECTION: DATA & SINKRONISASI ── */}
          <Text style={S.sectionLabel}>Data &amp; Sinkronisasi</Text>
          <View style={S.groupCard}>
            {/* Terhubung ke internet */}
            <View style={S.row}>
              <View
                style={[
                  S.statusDot,
                  {
                    backgroundColor: settings.terhubungInternet
                      ? C.dotOnline
                      : C.dotOffline,
                  },
                ]}
              />
              <View style={S.rowTextBlock}>
                <Text style={S.rowTitle}>
                  {settings.terhubungInternet
                    ? "Terhubung ke internet"
                    : "Tidak ada koneksi"}
                </Text>
                <Text style={S.rowDesc}>
                  {settings.terhubungInternet
                    ? "data siap disinkronkan"
                    : "periksa jaringan"}
                </Text>
              </View>
            </View>

            {/* Sinkronisasi Sekarang */}
            <SettingRow
              emoji="☁️"
              title="Sinkronisasi Sekarang"
              desc={
                syncing
                  ? "sedang upload..."
                  : settings.statusSync === "siap"
                    ? `Terakhir sync: ${settings.terakhirSync}`
                    : "upload data offline"
              }
              isLast
              S={S}
              onPress={syncSekarang}
              right={
                settings.statusSync !== "error" ? <SiapBadge S={S} /> : null
              }
            />
          </View>

          {/* ── SECTION: RIWAYAT & LAPORAN ── */}
          <Text style={S.sectionLabel}>Riwayat &amp; Laporan</Text>
          <View style={S.groupCard}>
            <SettingRow
              emoji="📋"
              title="Riwayat Stok"
              desc="masuk dan keluar stok"
              S={S}
              onPress={openStokHistory}
              right={<Text style={S.rowArrow}>›</Text>}
            />
            <SettingRow
              emoji="💰"
              title="Kelola Kas"
              desc="cash, bank, dan e-wallet"
              S={S}
              onPress={openKelolaKas}
              right={<Text style={S.rowArrow}>›</Text>}
            />
            <SettingRow
              emoji="📈"
              title="Laporan Mingguan"
              desc="rekap 7 hari terakhir"
              S={S}
              right={<SoonBadge S={S} />}
            />
            <SettingRow
              emoji="💾"
              title="Export Data"
              desc="ekspor ke CSV"
              isLast
              S={S}
              right={<SoonBadge S={S} />}
            />
          </View>

          {/* ── SECTION: MANAJEMEN (admin only) ── */}
          {isAdmin && (
            <>
              <Text style={S.sectionLabel}>Manajemen</Text>
              <View style={S.groupCard}>
                <SettingRow
                  emoji="👥"
                  title="Kelola Pengguna"
                  desc="tambah dan hapus pengguna"
                  S={S}
                  onPress={openKelolaPengguna}
                  right={<Text style={S.rowArrow}>›</Text>}
                />
                <SettingRow
                  emoji="⚙️"
                  title="Pengaturan Toko"
                  desc="nama toko, alamat"
                  isLast
                  S={S}
                  right={<SoonBadge S={S} />}
                />
              </View>
            </>
          )}

          {/* ── SECTION: TENTANG ── */}
          <Text style={S.sectionLabel}>Tentang</Text>
          <View style={S.groupCard}>
            <SettingRow
              emoji="ℹ️"
              title="Tentang Aplikasi"
              desc="Konter v1.0.0"
              S={S}
              onPress={() => setActiveModal("tentang")}
              right={<Text style={S.rowArrow}>›</Text>}
            />
            <SettingRow
              emoji="🔒"
              title="Privasi &amp; Keamanan"
              desc="data tersimpan lokal"
              isLast
              S={S}
              onPress={() => setActiveModal("privasi")}
              right={<Text style={S.rowArrow}>›</Text>}
            />
          </View>

          {/* ── KELUAR ── */}
          <TouchableOpacity
            style={S.keluarCard}
            onPress={keluar}
            activeOpacity={0.8}
          >
            <View style={S.keluarIconBox}>
              <Text style={{ fontSize: 18 }}>📕</Text>
            </View>
            <View>
              <Text style={S.keluarTitle}>Keluar</Text>
              <Text style={S.keluarDesc}>keluar dari akun {user.username}</Text>
            </View>
          </TouchableOpacity>

          {/* ── FOOTER ── */}
          <Text style={S.footerText}>
            Konter v1.0.0 · {getLabelFooter(user.role)}
          </Text>
        </ScrollView>
        {/* </SafeAreaView> */}
      </View>
      <HistoryModal
        visible={activeModal === "stok"}
        title="Riwayat Stok"
        emptyText="Belum ada riwayat stok"
        onClose={() => setActiveModal(null)}
        S={S}
      >
        {stokHistory.length > 0 ? (
          <StokHistoryList rows={stokHistory} S={S} />
        ) : null}
      </HistoryModal>
      <HistoryModal
        visible={activeModal === "kelola-kas"}
        title="Kelola Kas"
        emptyText="Belum ada kas"
        onClose={() => setActiveModal(null)}
        S={S}
      >
        {daftarKas.length > 0 ? (
          <KasList rows={daftarKas} S={S} />
        ) : (
          <Text style={S.modalEmptyText}>Belum ada kas</Text>
        )}
        <TouchableOpacity
          style={S.modalAddButton}
          onPress={openTambahKas}
          activeOpacity={0.85}
        >
          <Text style={S.modalAddButtonText}>+ Tambah Kas</Text>
        </TouchableOpacity>
      </HistoryModal>
      <TambahKasModal
        visible={activeModal === "tambah-kas"}
        nama={kasNama}
        jenis={kasJenis}
        keterangan={kasKeterangan}
        onChangeNama={setKasNama}
        onChangeJenis={setKasJenis}
        onChangeKeterangan={setKasKeterangan}
        onClose={closeTambahKas}
        onSubmit={simpanKas}
        S={S}
        C={C}
      />
      <HistoryModal
        visible={activeModal === "kelola-pengguna"}
        title="Kelola Pengguna"
        emptyText="Belum ada pengguna"
        onClose={() => setActiveModal(null)}
        S={S}
      >
        {daftarPengguna.length > 0 ? (
          <UserList
            rows={daftarPengguna}
            currentUserId={user.id}
            onDelete={hapusPengguna}
            S={S}
          />
        ) : (
          <Text style={S.modalEmptyText}>Belum ada pengguna</Text>
        )}
        <TouchableOpacity
          style={S.modalAddButton}
          onPress={openTambahPengguna}
          activeOpacity={0.85}
        >
          <Text style={S.modalAddButtonText}>+ Tambah Pengguna</Text>
        </TouchableOpacity>
      </HistoryModal>
      <TambahPenggunaModal
        visible={activeModal === "tambah-pengguna"}
        nama={penggunaNama}
        username={penggunaUsername}
        password={penggunaPassword}
        role={penggunaRole}
        onChangeNama={setPenggunaNama}
        onChangeUsername={setPenggunaUsername}
        onChangePassword={setPenggunaPassword}
        onChangeRole={setPenggunaRole}
        onClose={closeTambahPengguna}
        onSubmit={simpanPengguna}
        S={S}
        C={C}
      />
      <HistoryModal
        visible={activeModal === "tentang"}
        title="Tentang Aplikasi"
        emptyText=""
        onClose={() => setActiveModal(null)}
        S={S}
      >
        <InfoList rows={tentangAplikasiItems} S={S} />
      </HistoryModal>
      <HistoryModal
        visible={activeModal === "privasi"}
        title="Privasi & Keamanan"
        emptyText=""
        onClose={() => setActiveModal(null)}
        S={S}
      >
        <InfoList rows={privasiItems} S={S} />
      </HistoryModal>
    </>
  );
};

export default AkunScreen;
