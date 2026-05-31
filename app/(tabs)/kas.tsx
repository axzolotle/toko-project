import {
  createKerugian,
  createOperasional,
  createRekapHarian,
  createRekapKas,
  db_getHistori as getHistoriFromDb,
  getPilihanKas,
  getRekapHarianByTanggal,
  getStokMasukByTanggal,
  getTotalKerugianByTanggal,
  getTotalOperasionalByTanggal,
  getTransaksiHarian,
  HistoriGroup,
} from "@/database/db2";
import { useTheme } from "@/lib/ThemeContext";
import { useCurrentUser } from "@/service/useCurrentUser";
import {
  KasDarkColors as darkColors,
  KasDarkStyles as darkStyles,
  KasLightColors as lightColors,
  KasLightStyles as lightStyles,
} from "@/styles/AppStyle";
import {
  formatCurrencyInput,
  parseCurrencyInput,
} from "@/utils/currencyInput";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================================
//  TYPES
// ============================================================

type TabKey = "rekap" | "histori";

interface RekapHarianData {
  tanggal: string;
  dikunci: boolean;
  omzet: number;
  hpp: number;
  labaKotor: number;
  operasional: number;
  kerugian: number;
  labaBersih: number;
  penjualan: PenjualanItem[];
  penambahanStok: StokItem[];
}

interface PenjualanItem {
  id: number;
  nama: string;
  hpp: number;
  harga: number;
  laba: number;
}

interface StokItem {
  id: number;
  nama: string;
  qty: number;
  hargaJual: number;
  totalBeli: number;
}

// ============================================================
//  1. LAYER SQL / DATABASE
//     → Ganti isi tiap fungsi dengan query SQLite / fetch API
// ============================================================

const db_getRekapHarian = async (tanggal: string): Promise<RekapHarianData> => {
  try {
    const lockedRekap = getRekapHarianByTanggal(tanggal) as {
      locked: number;
      omzet: number;
      hpp: number;
      laba_kotor: number;
      operasional: number;
      kerugian: number;
      laba_bersih: number;
    } | null;

    // Get all transaksi for the date
    const transaksi = getTransaksiHarian(tanggal);

    // Calculate omzet (total harga_jual)
    const omzet = transaksi.reduce((sum, t) => sum + t.total, 0);

    // Calculate hpp (total harga_modal * quantity)
    const hpp = transaksi.reduce(
      (sum, t) => sum + t.harga_modal * t.quantity,
      0,
    );

    // Calculate laba kotor
    const labaKotor = omzet - hpp;

    const operasional = getTotalOperasionalByTanggal(tanggal);
    const kerugian = getTotalKerugianByTanggal(tanggal);

    const labaBersih = labaKotor - operasional - kerugian;

    // Map transaksi to penjualan items
    const penjualan: PenjualanItem[] = transaksi.map((t) => ({
      id: t.id,
      nama: t.item_nama,
      hpp: t.harga_modal,
      harga: t.harga_jual,
      laba: t.laba,
    }));

    const penambahanStok: StokItem[] = getStokMasukByTanggal(tanggal).map(
      (s) => ({
        id: s.id,
        nama: s.item_nama ?? `Item #${s.item_id}`,
        qty: s.quantity,
        hargaJual: s.harga_jual ?? 0,
        totalBeli: s.harga_beli * s.quantity,
      }),
    );

    return {
      tanggal,
      dikunci: lockedRekap?.locked === 1,
      omzet: lockedRekap?.omzet ?? omzet,
      hpp: lockedRekap?.hpp ?? hpp,
      labaKotor: lockedRekap?.laba_kotor ?? labaKotor,
      operasional: lockedRekap?.operasional ?? operasional,
      kerugian: lockedRekap?.kerugian ?? kerugian,
      labaBersih: lockedRekap?.laba_bersih ?? labaBersih,
      penjualan,
      penambahanStok,
    };
  } catch (error) {
    console.error("Error getting rekap harian:", error);
    return {
      tanggal,
      dikunci: false,
      omzet: 0,
      hpp: 0,
      labaKotor: 0,
      operasional: 0,
      kerugian: 0,
      labaBersih: 0,
      penjualan: [],
      penambahanStok: [],
    };
  }
};

const db_getHistori = async (): Promise<HistoriGroup[]> => {
  return getHistoriFromDb();
};

// ============================================================
//  2. KALKULASI / HELPERS (fungsi murni)
// ============================================================

const fmt = (n: number) => {
  const abs = Math.abs(n);
  const str = "Rp " + abs.toLocaleString("id-ID");
  return n < 0 ? "- " + str : str;
};

const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

const geserTanggal = (iso: string, hari: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + hari);

  return formatLocalDate(d);
};

const labelTanggalPanjang = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isHariIni = (iso: string) => iso === formatLocalDate(new Date());

const filterHistori = (
  groups: HistoriGroup[],
  f: HistoriFilter,
): HistoriGroup[] => {
  if (f === "semua") return groups;

  return groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.jenis === f),
    }))
    .filter((g) => g.rekap !== null || g.items.length > 0);
};

// ============================================================
//  3. HOOKS (state + fetch)
// ============================================================

const useRekapHarian = () => {
  const now = new Date();
  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const [tanggal, setTanggal] = useState(today);
  const [data, setData] = useState<RekapHarianData | null>(null);
  const [loading, setLoading] = useState(true);

  const muat = useCallback(async (tgl: string) => {
    setLoading(true);
    setData(null);
    try {
      setData(await db_getRekapHarian(tgl));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat(tanggal);
  }, [tanggal, muat]);

  return {
    tanggal,
    data,
    loading,
    prevHari: () => setTanggal((t) => geserTanggal(t, -1)),
    nextHari: () => setTanggal((t) => geserTanggal(t, +1)),
    refresh: () => muat(tanggal),
  };
};

const useHistori = (refreshToken = 0) => {
  const [groups, setGroups] = useState<HistoriGroup[]>([]);
  const [filter, setFilter] = useState<HistoriFilter>("semua");
  const [loading, setLoading] = useState(true);

  const muat = useCallback(async () => {
    setLoading(true);
    try {
      setGroups(await db_getHistori());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat, refreshToken]);

  return {
    groups: filterHistori(groups, filter),
    filter,
    setFilter,
    loading,
    refresh: muat,
  };
};

// ============================================================
//  4. UI COMPONENTS
// ============================================================

// ── TAB: REKAP HARIAN ────────────────────────────────────────
const TabRekapHarian: React.FC<{
  S: any;
  C: typeof lightColors;
  onShowHistori: () => void;
}> = ({
  S,
  C,
  onShowHistori,
}) => {
  const [showModal, setShowModal] = useState<ModalType>(null);
  const { tanggal, data, loading, prevHari, nextHari, refresh } =
    useRekapHarian();

  const openModal = (type: ModalType) => {
    setShowModal(type);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <ScrollView
        style={S.scroll}
        contentContainerStyle={S.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Navigator */}
        <View style={S.dateNav}>
          <TouchableOpacity onPress={prevHari} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} style={S.dateArrow} />
          </TouchableOpacity>
          <View>
            <Text style={S.dateTitleText}>{labelTanggalPanjang(tanggal)}</Text>
            {isHariIni(tanggal) && <Text style={S.dateSubText}>hari ini</Text>}
          </View>
          <TouchableOpacity onPress={nextHari} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={24} style={S.dateArrow} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={S.centered}>
            <ActivityIndicator color={C.subValueGreen} size="large" />
          </View>
        ) : data ? (
          <>
            {/* Rekap Summary Card */}
            <View style={S.rekapCard}>
              <View style={S.rekapTitleRow}>
                <Text style={S.rekapTitle}>Rekap Harian</Text>
                <Text style={S.rekapBelumDikunci}>
                  {data.dikunci ? "🔒 terkunci" : "belum dikunci"}
                </Text>
              </View>

              <View style={S.rekapRow}>
                <Text style={S.rekapLabel}>Omzet</Text>
                <Text style={S.rekapValDark}>{fmt(data.omzet)}</Text>
              </View>
              <View style={S.rekapRow}>
                <Text style={S.rekapLabel}>HPP (modal)</Text>
                <Text style={S.rekapValDark}>{fmt(data.hpp)}</Text>
              </View>

              <View style={S.rekapDivider} />

              <View style={S.rekapRow}>
                <Text style={S.rekapLabel}>Laba Kotor</Text>
                <Text style={S.rekapValGreen}>{fmt(data.labaKotor)}</Text>
              </View>
              <View style={S.rekapRow}>
                <Text style={S.rekapLabel}>Operasional</Text>
                <Text style={S.rekapValRed}>- {fmt(data.operasional)}</Text>
              </View>
              <View style={S.rekapRow}>
                <Text style={S.rekapLabel}>Kerugian</Text>
                <Text style={S.rekapValRed}>
                  {data.kerugian > 0 ? "- " + fmt(data.kerugian) : "- Rp 0"}
                </Text>
              </View>

              <View style={S.rekapDivider} />

              <View style={S.rekapLabaBersihRow}>
                <Text style={S.rekapLabaBersihLabel}>Laba Bersih</Text>
                <Text style={S.rekapLabaBersihValue}>
                  {fmt(data.labaBersih)}
                </Text>
              </View>

              <Text style={S.rekapFormula}>
                RH = MK − (CS + MF + R + OP + Omz)
              </Text>
            </View>

            {/* Penjualan Hari Ini */}
            <View style={S.pjSectionHeader}>
              <Text style={S.pjSectionLabel}>Penjualan Hari Ini</Text>
              <TouchableOpacity onPress={onShowHistori} activeOpacity={0.7}>
                <Text style={S.pjLihatSemua}>lihat semua</Text>
              </TouchableOpacity>
            </View>
            <View style={S.pjCard}>
              {data.penjualan.map((p, idx) => {
                const isLast = idx === data.penjualan.length - 1;
                return (
                  <View key={p.id} style={isLast ? S.pjItemLast : S.pjItem}>
                    {/* Item Icon */}
                    <View style={S.pjItemInfo}>
                      <Text style={S.pjItemName}>{p.nama}</Text>
                      <Text style={S.pjItemDesc}>HPP {fmt(p.hpp)}</Text>
                    </View>
                    <View style={S.pjItemRight}>
                      <Text style={S.pjItemPrice}>{fmt(p.harga)}</Text>
                      <Text style={S.pjItemProfit}>+{fmt(p.laba)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Penambahan Stok */}
            <View style={S.pjSectionHeader}>
              <Text style={S.pjSectionLabel}>Penambahan Stok</Text>
              <Text style={S.pjKeluar}>
                keluar:{" "}
                {fmt(data.penambahanStok.reduce((s, i) => s + i.totalBeli, 0))}
              </Text>
            </View>
            <View style={S.pjCard}>
              {data.penambahanStok.map((p, idx) => {
                const isLast = idx === data.penambahanStok.length - 1;
                return (
                  <View key={p.id} style={isLast ? S.pjItemLast : S.pjItem}>
                    {/* Item Icon */}
                    <View style={S.pjItemInfo}>
                      <Text style={S.pjItemName}>{p.nama}</Text>
                      <Text style={S.pjItemDesc}>
                        qty {p.qty} · jual {fmt(p.hargaJual)}
                      </Text>
                    </View>
                    <View style={S.pjItemRight}>
                      <Text style={S.pjItemStokValue}>{fmt(p.totalBeli)}</Text>
                      <Text style={S.pjItemStokBeli}>beli</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              style={[S.btnKunci, data.dikunci && S.btnDisabled]}
              activeOpacity={0.85}
              disabled={data.dikunci}
              onPress={() => openModal("lock-rekap")}
            >
              <Text style={S.btnKunciText}>
                {data.dikunci
                  ? "🔒 Rekap Sudah Dikunci"
                  : "🔒 Kunci & Simpan Rekap"}
              </Text>
            </TouchableOpacity>
            <View style={S.actionGrid}>
              <TouchableOpacity
                style={S.btnKerugian}
                activeOpacity={0.8}
                onPress={() => openModal("kerugian")}
              >
                <Text style={S.btnKerugianText}>Catat Kerugian</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={S.btnOutline}
                activeOpacity={0.8}
                onPress={() => openModal("operasional")}
              >
                <Text style={S.btnOutlineText}>Catat Operasional</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
      <ModalKerugian
        visible={showModal === "kerugian"}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          refresh();
        }}
      />

      <ModalOperasional
        visible={showModal === "operasional"}
        onClose={closeModal}
        onSuccess={() => {
          closeModal();
          refresh();
        }}
      />
      {data && (
        <ModalLockRekap
          visible={showModal === "lock-rekap"}
          data={data}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            refresh();
          }}
        />
      )}
    </>
  );
};

// ── TAB: HISTORI ─────────────────────────────────────────────

type HistoriFilter = "semua" | "rekap_kas" | "operasional" | "kerugian";
type HistoriJenis = "rekap_kas" | "operasional" | "kerugian";

const HIST_FILTERS: { key: HistoriFilter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "rekap_kas", label: "Rekap Kas" },
  { key: "operasional", label: "Operasional" },
  { key: "kerugian", label: "Kerugian" },
];

const getHistoriIcon = (jenis: HistoriJenis) => {
  switch (jenis) {
    case "rekap_kas":
      return "cash-outline";
    case "operasional":
      return "remove-circle-outline";
    case "kerugian":
      return "alert-circle-outline";
    default:
      return "ellipse-outline";
  }
};

const TabHistori: React.FC<{
  S: any;
  C: typeof lightColors;
  refreshToken: number;
}> = ({ S, C, refreshToken }) => {
  const { groups, filter, setFilter, loading } = useHistori(refreshToken);

  if (loading) {
    return (
      <View style={S.centered}>
        <ActivityIndicator color={C.subValueGreen} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={S.scroll}
      contentContainerStyle={S.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Filter chips */}
      <View style={S.histFilterRow}>
        {HIST_FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={isActive ? S.histChipActive : S.histChip}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={isActive ? S.histChipActiveText : S.histChipText}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Empty state */}
      {groups.length === 0 ? (
        <View style={S.emptyState}>
          <Text style={S.emptyTitle}>Belum ada histori</Text>
          <Text style={S.emptyDesc}>
            Kerugian, operasional, rekap kas, dan rekap harian akan muncul di
            sini.
          </Text>
        </View>
      ) : (
        groups.map((group) => {
          const visibleItems = filterHistori([group], filter)[0]?.items ?? [];

          return (
            <View key={group.tanggal} style={S.histDayCard}>
              {/* Header */}
              <View style={S.histDayHeader}>
                <View>
                  <Text style={S.histGroupLabel}>{group.labelTanggal}</Text>
                  <Text style={S.histDaySubText}>
                    {group.terkunci ? "Rekap terkunci" : "Rekap belum dikunci"}
                  </Text>
                </View>

                <View
                  style={group.terkunci ? S.histLockedBadge : S.histOpenBadge}
                >
                  <Text
                    style={
                      group.terkunci
                        ? S.histLockedBadgeText
                        : S.histOpenBadgeText
                    }
                  >
                    {group.terkunci ? "LOCKED" : "OPEN"}
                  </Text>
                </View>
              </View>

              {/* Rekap snapshot */}
              {group.rekap && (
                <View style={S.histRekapCard}>
                  <View style={S.histRekapRow}>
                    <Text style={S.histRekapLabel}>Omzet</Text>
                    <Text style={S.histRekapValue}>
                      Rp {group.rekap.omzet.toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <View style={S.histRekapRow}>
                    <Text style={S.histRekapLabel}>HPP</Text>
                    <Text style={S.histRekapValue}>
                      Rp {group.rekap.hpp.toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <View style={S.histRekapRow}>
                    <Text style={S.histRekapLabel}>Laba Bersih</Text>
                    <Text style={S.histRekapValueGreen}>
                      Rp {group.rekap.laba_bersih.toLocaleString("id-ID")}
                    </Text>
                  </View>
                </View>
              )}

              {/* Activity list */}
              <View style={S.histCard}>
                {visibleItems.length === 0 ? (
                  <View style={S.histEmptyInside}>
                    <Text style={S.histEmptyInsideText}>
                      Tidak ada item untuk filter ini
                    </Text>
                  </View>
                ) : (
                  visibleItems.map((item, idx) => {
                    const isLast = idx === visibleItems.length - 1;
                    const isPositive = item.nilai >= 0;

                    return (
                      <View
                        key={`${item.jenis}-${item.id}`}
                        style={isLast ? S.histItemLast : S.histItem}
                      >
                        <View style={S.histItemIconBox}>
                          <Ionicons
                            name={getHistoriIcon(item.jenis)}
                            size={18}
                            color={
                              item.jenis === "rekap_kas"
                                ? C.pjStokValue
                                : item.jenis === "operasional"
                                  ? C.pjItemProfit
                                  : C.histValueRed
                            }
                          />
                        </View>

                        <View style={S.histItemInfo}>
                          <Text style={S.histItemName}>{item.nama}</Text>
                          <Text style={S.histItemDesc}>{item.deskripsi}</Text>
                        </View>

                        <View style={S.histItemRight}>
                          <Text
                            style={
                              isPositive ? S.histItemValGreen : S.histItemValRed
                            }
                          >
                            {item.nilai >= 0
                              ? `+ Rp ${item.nilai.toLocaleString("id-ID")}`
                              : `- Rp ${Math.abs(item.nilai).toLocaleString(
                                  "id-ID",
                                )}`}
                          </Text>
                          <Text style={S.histItemTime}>{item.waktu}</Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

// ============================================================
//  5. MAIN SCREEN EXPORT
// ============================================================

const INTERNAL_TABS: { key: TabKey; label: string }[] = [
  { key: "rekap", label: "Rekap Harian" },
  { key: "histori", label: "Histori" },
];

interface CatatRekapKasProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CatatRekapKas: React.FC<CatatRekapKasProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { userId, loading: userLoading } = useCurrentUser();
  const [kasOptions, setKasOptions] = useState<
    Array<{ id: number; nama: string; jenis: string }>
  >([]);
  const [selectedKas, setSelectedKas] = useState<{
    id: number;
    nama: string;
    jenis: string;
  } | null>(null);
  const [jumlah, setJumlah] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;

    const options = getPilihanKas();
    setKasOptions(options);
    setSelectedKas((current) => current ?? options[0] ?? null);
  }, [visible]);

  const handleSimpan = () => {
    if (userLoading) {
      alert("Data user sedang dimuat");
      return;
    }
    if (userId === null) {
      alert("User belum login");
      return;
    }
    if (!selectedKas) {
      alert("Pilih kas terlebih dahulu");
      return;
    }
    const jumlahValue = parseCurrencyInput(jumlah);

    if (!jumlah.trim() || Number.isNaN(jumlahValue)) {
      alert("Jumlah harus berupa angka");
      return;
    }

    try {
      createRekapKas(selectedKas.nama, selectedKas.id, jumlahValue, userId);
      alert("Rekap kas berhasil dicatat");
      handleCancel();
      onSuccess();
    } catch (error) {
      alert("Gagal mencatat rekap kas");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setSelectedKas(null);
    setJumlah("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[S.modalSheet, { paddingBottom: Math.max(30, insets.bottom + 30) }]}
        >
          <Text style={S.modalTitle}>Catat Rekap Kas</Text>

          <Text style={S.modalLabel}>Pilih Kas</Text>
          <View style={S.bankOptionRow}>
            {kasOptions.map((kas) => {
              const isActive = selectedKas?.id === kas.id;
              return (
                <TouchableOpacity
                  key={kas.id}
                  style={[S.bankOption, isActive && S.bankOptionActive]}
                  onPress={() => setSelectedKas(kas)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      S.bankOptionText,
                      isActive && S.bankOptionActiveText,
                    ]}
                  >
                    {kas.nama}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {kasOptions.length === 0 ? (
              <Text style={S.histEmptyInsideText}>
                Belum ada kas. Tambahkan lewat Akun &gt; Kelola Kas.
              </Text>
            ) : null}
          </View>

          {/* Jumlah */}
          <Text style={S.modalLabel}>Jumlah (Rp) *</Text>
          <TextInput
            style={S.modalInput}
            value={jumlah}
            onChangeText={(value) => setJumlah(formatCurrencyInput(value))}
            placeholder="Rp 0"
            placeholderTextColor={C.subDesc}
            keyboardType="numeric"
          />

          {/* Buttons */}
          <View style={S.modalButtonRow}>
            <TouchableOpacity
              style={S.modalCancelButton}
              onPress={handleCancel}
            >
              <Text style={S.modalCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={S.modalSubmitButton}
              onPress={handleSimpan}
            >
              <Text style={S.modalSubmitText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface LockRekapModalProps extends BaseModalProps {
  data: RekapHarianData;
}

// ============================================================
// MODAL: KERUGIAN
// ============================================================

export const ModalKerugian: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { userId, loading: userLoading } = useCurrentUser();

  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const reset = () => {
    setKeterangan("");
    setJumlah("");
  };

  const handleSubmit = () => {
    if (userLoading) {
      alert("Data user sedang dimuat");
      return;
    }
    if (userId === null) {
      alert("User belum login");
      return;
    }
    if (!jumlah.trim()) {
      alert("Jumlah wajib diisi");
      return;
    }

    try {
      createKerugian(keterangan.trim(), parseCurrencyInput(jumlah), userId);

      alert("Kerugian berhasil dicatat");

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mencatat kerugian");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[S.modalSheet, { paddingBottom: Math.max(30, insets.bottom + 30) }]}
        >
          <Text style={S.modalTitle}>Catat Kerugian</Text>

          <Text style={S.modalLabel}>Keterangan</Text>

          <TextInput
            style={S.modalInput}
            value={keterangan}
            onChangeText={setKeterangan}
            placeholder="contoh: barang rusak"
            placeholderTextColor={C.subDesc}
          />

          <Text style={S.modalLabel}>Jumlah</Text>

          <TextInput
            style={S.modalInput}
            value={jumlah}
            onChangeText={(value) => setJumlah(formatCurrencyInput(value))}
            keyboardType="numeric"
            placeholder="Rp 0"
            placeholderTextColor={C.subDesc}
          />

          <View style={S.modalButtonRow}>
            <TouchableOpacity style={S.modalCancelButton} onPress={onClose}>
              <Text style={S.modalCancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={S.modalSubmitButton}
              onPress={handleSubmit}
            >
              <Text style={S.modalSubmitText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================
// MODAL: OPERASIONAL
// ============================================================

export const ModalOperasional: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { userId, loading: userLoading } = useCurrentUser();

  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;
  const insets = useSafeAreaInsets();

  const reset = () => {
    setKeterangan("");
    setJumlah("");
  };

  const handleSubmit = () => {
    if (userLoading) {
      alert("Data user sedang dimuat");
      return;
    }
    if (userId === null) {
      alert("User belum login");
      return;
    }
    if (!jumlah.trim()) {
      alert("Jumlah wajib diisi");
      return;
    }

    try {
      createOperasional(keterangan.trim(), parseCurrencyInput(jumlah), userId);

      alert("Operasional berhasil dicatat");

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mencatat operasional");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[S.modalSheet, { paddingBottom: Math.max(30, insets.bottom + 30) }]}
        >
          <Text style={S.modalTitle}>Catat Operasional</Text>

          <Text style={S.modalLabel}>Keterangan</Text>

          <TextInput
            style={S.modalInput}
            value={keterangan}
            onChangeText={setKeterangan}
            placeholder="contoh: beli gas"
            placeholderTextColor={C.subDesc}
          />

          <Text style={S.modalLabel}>Jumlah</Text>

          <TextInput
            style={S.modalInput}
            value={jumlah}
            onChangeText={(value) => setJumlah(formatCurrencyInput(value))}
            keyboardType="numeric"
            placeholder="Rp 0"
            placeholderTextColor={C.subDesc}
          />

          <View style={S.modalButtonRow}>
            <TouchableOpacity style={S.modalCancelButton} onPress={onClose}>
              <Text style={S.modalCancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={S.modalSubmitButton}
              onPress={handleSubmit}
            >
              <Text style={S.modalSubmitText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================
// MODAL: LOCK REKAP
// ============================================================

export const ModalLockRekap: React.FC<LockRekapModalProps> = ({
  visible,
  data,
  onClose,
  onSuccess,
}) => {
  const { userId, loading: userLoading } = useCurrentUser();

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const insets = useSafeAreaInsets();

  const handleLock = () => {
    if (data.dikunci) {
      alert("Rekap harian ini sudah dikunci");
      return;
    }

    if (userLoading) {
      alert("Data user sedang dimuat");
      return;
    }
    if (userId === null) {
      alert("User belum login");
      return;
    }

    try {
      createRekapHarian({
        tanggal: data.tanggal,
        omzet: data.omzet,
        hpp: data.hpp,
        labaKotor: data.labaKotor,
        operasional: data.operasional,
        kerugian: data.kerugian,
        labaBersih: data.labaBersih,
        createdBy: userId,
      });

      alert("Rekap berhasil dikunci");

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mengunci rekap");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={S.modalOverlay}>
        <View
          style={[S.modalSheet, { paddingBottom: Math.max(30, insets.bottom + 30) }]}
        >
          <Text style={S.modalTitle}>Kunci Rekap Harian</Text>

          <Text style={S.lockDescription}>
            Setelah dikunci, data rekap tidak dapat diubah lagi.
          </Text>

          <View style={S.lockSummaryCard}>
            <View style={S.lockSummaryRow}>
              <Text style={S.lockSummaryLabel}>Omzet</Text>

              <Text style={S.lockSummaryValue}>
                Rp {data.omzet.toLocaleString("id-ID")}
              </Text>
            </View>

            <View style={S.lockSummaryRow}>
              <Text style={S.lockSummaryLabel}>Laba Bersih</Text>

              <Text style={S.lockSummaryValue}>
                Rp {data.labaBersih.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          <View style={S.modalButtonRow}>
            <TouchableOpacity style={S.modalCancelButton} onPress={onClose}>
              <Text style={S.modalCancelText}>Batal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[S.btnKunci, data.dikunci && S.btnDisabled]}
              onPress={handleLock}
              disabled={data.dikunci}
            >
              <Text style={S.btnKunciText}>🔒 Kunci Rekap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

type ModalType =
  | null
  | "rekap-kas"
  | "kerugian"
  | "operasional"
  | "lock-rekap";

const KeuanganScreen: React.FC = () => {
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [historiRefreshToken, setHistoriRefreshToken] = useState(0);

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  const [activeTab, setActiveTab] = useState<TabKey>("rekap");

  const openModal = (type: ModalType) => {
    setShowModal(type);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  const handleRekapSuccess = () => {
    setShowModal(null);
    setHistoriRefreshToken((token) => token + 1);
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
          <Text style={S.headerTitle}>Keuangan</Text>
          <TouchableOpacity
            style={S.catatButton}
            activeOpacity={0.85}
            onPress={() => openModal("rekap-kas")}
          >
            <Text style={S.catatButtonText}>+ Rekap Kas</Text>
          </TouchableOpacity>
        </View>

        {/* ── INTERNAL TAB BAR ── */}
        <View style={S.internalTabBar}>
          {INTERNAL_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[S.internalTabItem, isActive && S.internalTabItemActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    S.internalTabText,
                    isActive && S.internalTabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── TAB CONTENT ── */}
        {activeTab === "rekap" && (
          <TabRekapHarian
            S={S}
            C={C}
            onShowHistori={() => setActiveTab("histori")}
          />
        )}
        {activeTab === "histori" && (
          <TabHistori S={S} C={C} refreshToken={historiRefreshToken} />
        )}
        {/* </SafeAreaView> */}
      </View>
      <CatatRekapKas
        visible={showModal === "rekap-kas"}
        onClose={closeModal}
        onSuccess={handleRekapSuccess}
      />
    </>
  );
};

export default KeuanganScreen;
