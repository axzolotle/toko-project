import { getUserById } from "@/database/db2";
import { syncAllTables } from "@/database/sync";
import { useTheme } from "@/lib/ThemeContext";
import { useCurrentUser } from "@/service/useCurrentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      role: users.role === null ? "operator" : "admin", // Convert dari DB boolean
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
      "auth_token",
      "current_user_id",
      "app_settings",
      "user_data",
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
  }, [currentUser.userId]);

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

// ============================================================
//  5. MAIN SCREEN
// ============================================================

const AkunScreen: React.FC = () => {
  const { isDark, colors: C, styles: S } = useTheme();

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

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />
      <View style={S.screen}>
        <SafeAreaView style={S.safeArea}>
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
                onPress={() => console.log("Riwayat Stok")}
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
                    desc="tambah, edit, hapus operator"
                    S={S}
                    onPress={() => console.log("Kelola Pengguna")}
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
                onPress={() => console.log("Tentang Aplikasi")}
                right={<Text style={S.rowArrow}>›</Text>}
              />
              <SettingRow
                emoji="🔒"
                title="Privasi &amp; Keamanan"
                desc="data tersimpan lokal"
                isLast
                S={S}
                onPress={() => console.log("Privasi")}
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
                <Text style={S.keluarDesc}>
                  keluar dari akun {user.username}
                </Text>
              </View>
            </TouchableOpacity>

            {/* ── FOOTER ── */}
            <Text style={S.footerText}>
              Konter v1.0.0 · {getLabelFooter(user.role)}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
};

export default AkunScreen;
