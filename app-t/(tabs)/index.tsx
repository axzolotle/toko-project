import * as Haptics from "expo-haptics";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  Barang,
  catatTransaksi,
  getBarangByJenis,
  getJenisBarang,
} from "../../database/db";

type Step = "jenis" | "item" | "konfirmasi";

// Warna per kategori jenis barang
const WARNA_JENIS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Makanan: { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  Minuman: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  Snack: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  Rokok: { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  Sembako: { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  Lainnya: { bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

function getWarna(jenis: string) {
  return WARNA_JENIS[jenis] ?? WARNA_JENIS["Lainnya"];
}

function formatRp(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function KasirScreen() {
  const [step, setStep] = useState<Step>("jenis");
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [selectedJenis, setSelectedJenis] = useState<string>("");
  const [itemList, setItemList] = useState<Barang[]>([]);
  const [selectedItem, setSelectedItem] = useState<Barang | null>(null);
  const [lastCatat, setLastCatat] = useState<string>("");
  const [lastCatatTimer, setLastCatatTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Refresh jenis saat tab difokus
  useFocusEffect(
    useCallback(() => {
      setJenisList(getJenisBarang());
    }, []),
  );

  const pilihJenis = (jenis: string) => {
    const items = getBarangByJenis(jenis);
    setSelectedJenis(jenis);
    setItemList(items);
    setStep("item");
  };

  const pilihItem = (item: Barang) => {
    setSelectedItem(item);
    setStep("konfirmasi");
  };

  const catat = async () => {
    if (!selectedItem) return;

    catatTransaksi(selectedItem, 1);

    // FIX: pakai expo-haptics, bukan Vibration yang deprecated
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Tampilkan notif sukses selama 2.5 detik
    if (lastCatatTimer) clearTimeout(lastCatatTimer);
    setLastCatat(
      `✓ ${selectedItem.nama}  ${formatRp(selectedItem.harga_jual)}`,
    );
    const timer = setTimeout(() => setLastCatat(""), 2500);
    setLastCatatTimer(timer);

    // Kembali ke pilih jenis
    setSelectedItem(null);
    setStep("jenis");
  };

  const kembaliKeJenis = () => {
    setStep("jenis");
    setSelectedItem(null);
    setSelectedJenis("");
  };

  const kembaliKeItem = () => {
    setStep("item");
    setSelectedItem(null);
  };

  return (
    <SafeAreaView style={s.container}>
      {/* ── Header ─────────────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Kasir</Text>
          <Text style={s.headerSub}>Catat penjualan dalam 3 klik</Text>
        </View>
        //?{/* Step indicator */}
        <View style={s.stepRow}>
          {(["jenis", "item", "konfirmasi"] as Step[]).map((st, idx) => (
            <View key={st} style={s.stepItem}>
              <View
                style={[
                  s.stepDot,
                  step === st && s.stepDotActive,
                  (step === "item" && idx === 0) ||
                  (step === "konfirmasi" && idx <= 1)
                    ? s.stepDotDone
                    : null,
                ]}
              />
              {idx < 2 && (
                <View
                  style={[
                    s.stepLine,
                    (step === "item" && idx === 0) || step === "konfirmasi"
                      ? s.stepLineDone
                      : null,
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* ── Banner sukses ───────────────────────────── */}
      {lastCatat !== "" && (
        <View style={s.successBanner}>
          <Text style={s.successText}>{lastCatat}</Text>
        </View>
      )}

      {/* ── Step 1: Pilih Jenis ─────────────────────── */}
      {step === "jenis" && (
        <ScrollView contentContainerStyle={s.jenisGrid}>
          {jenisList.length === 0 ? (
            <View style={s.emptyBox}>
              <Text style={s.emptyEmoji}>📦</Text>
              <Text style={s.emptyText}>Belum ada barang</Text>
              <Text style={s.emptySubtext}>
                Pergi ke tab Barang untuk menambahkan produk
              </Text>
            </View>
          ) : (
            jenisList.map((jenis) => {
              const w = getWarna(jenis);
              return (
                <TouchableOpacity
                  key={jenis}
                  style={[
                    s.jenisCard,
                    { backgroundColor: w.bg, borderColor: w.border },
                  ]}
                  onPress={() => pilihJenis(jenis)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.jenisInisial, { color: w.text }]}>
                    {jenis.slice(0, 2).toUpperCase()}
                  </Text>
                  <Text style={[s.jenisLabel, { color: w.text }]}>{jenis}</Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* ── Step 2: Pilih Item ──────────────────────── */}
      {step === "item" && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={s.backBtn} onPress={kembaliKeJenis}>
            <Text style={s.backBtnText}>← {selectedJenis}</Text>
          </TouchableOpacity>

          {/* FIX: pakai margin horizontal bukan gap di columnWrapperStyle */}
          <FlatList
            data={itemList}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={s.itemList}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  s.itemCard,
                  index % 2 === 0 ? { marginRight: 5 } : { marginLeft: 5 },
                ]}
                onPress={() => pilihItem(item)}
                activeOpacity={0.75}
              >
                <Text style={s.itemNama} numberOfLines={2}>
                  {item.nama}
                </Text>
                <Text style={s.itemHarga}>{formatRp(item.harga_jual)}</Text>
                {item.detail ? (
                  <Text style={s.itemDetail} numberOfLines={1}>
                    {item.detail}
                  </Text>
                ) : null}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text
                style={{ color: "#94a3b8", textAlign: "center", marginTop: 40 }}
              >
                Tidak ada barang di kategori ini
              </Text>
            }
          />
        </View>
      )}

      {/* ── Step 3: Konfirmasi & Catat ──────────────── */}
      {step === "konfirmasi" && selectedItem && (
        <View style={s.konfBox}>
          <TouchableOpacity style={s.backBtn} onPress={kembaliKeItem}>
            <Text style={s.backBtnText}>← {selectedItem.nama}</Text>
          </TouchableOpacity>

          <View style={s.konfCard}>
            <View
              style={[
                s.konfJenisBadge,
                { backgroundColor: getWarna(selectedItem.jenis).bg },
              ]}
            >
              <Text
                style={[
                  s.konfJenisText,
                  { color: getWarna(selectedItem.jenis).text },
                ]}
              >
                {selectedItem.jenis}
              </Text>
            </View>
            <Text style={s.konfNama}>{selectedItem.nama}</Text>
            {selectedItem.detail ? (
              <Text style={s.konfDetail}>{selectedItem.detail}</Text>
            ) : null}

            <View style={s.konfDivider} />

            <View style={s.konfRow}>
              <Text style={s.konfRowLabel}>Harga Jual</Text>
              <Text style={s.konfHarga}>
                {formatRp(selectedItem.harga_jual)}
              </Text>
            </View>
            <View style={s.konfRow}>
              <Text style={s.konfRowLabel}>Modal</Text>
              <Text style={s.konfModal}>
                {formatRp(selectedItem.harga_modal)}
              </Text>
            </View>
            <View style={s.konfRow}>
              <Text style={s.konfRowLabel}>Laba</Text>
              <Text style={s.konfLaba}>
                +{formatRp(selectedItem.harga_jual - selectedItem.harga_modal)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={s.catatBtn}
            onPress={catat}
            activeOpacity={0.85}
          >
            <Text style={s.catatBtnText}>✓ CATAT PENJUALAN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.batalBtn} onPress={kembaliKeJenis}>
            <Text style={s.batalBtnText}>Batal</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },

  // Header
  header: {
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#0f172a" },
  headerSub: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  // Step indicator
  stepRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  stepItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#e2e8f0",
  },
  stepDotActive: {
    backgroundColor: "#2563eb",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepDotDone: { backgroundColor: "#93c5fd" },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 4,
  },
  stepLineDone: { backgroundColor: "#93c5fd" },

  // Banner
  successBanner: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbf7d0",
  },
  successText: { color: "#15803d", fontSize: 13, fontWeight: "600" },

  // Grid jenis
  jenisGrid: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10 },
  jenisCard: {
    width: "47%",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 18,
    alignItems: "center",
    gap: 8,
  },
  jenisInisial: { fontSize: 28, fontWeight: "800" },
  jenisLabel: { fontSize: 14, fontWeight: "700" },

  // Back button
  backBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  backBtnText: { fontSize: 14, color: "#2563eb", fontWeight: "600" },

  // Item list
  itemList: { padding: 12, paddingTop: 0 },
  itemCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  itemNama: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 6,
  },
  itemHarga: { fontSize: 17, fontWeight: "700", color: "#2563eb" },
  itemDetail: { fontSize: 11, color: "#94a3b8", marginTop: 4 },

  // Konfirmasi
  konfBox: { flex: 1, padding: 16 },
  konfCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  konfJenisBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  konfJenisText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  konfNama: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  konfDetail: { fontSize: 14, color: "#94a3b8", marginTop: 4 },
  konfDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 18 },
  konfRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  konfRowLabel: { fontSize: 14, color: "#64748b" },
  konfHarga: { fontSize: 26, fontWeight: "800", color: "#0f172a" },
  konfModal: { fontSize: 16, fontWeight: "600", color: "#94a3b8" },
  konfLaba: { fontSize: 18, fontWeight: "700", color: "#16a34a" },

  // CTA
  catatBtn: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  catatBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  batalBtn: { padding: 12, alignItems: "center" },
  batalBtnText: { color: "#94a3b8", fontSize: 14, fontWeight: "500" },

  // Empty state
  emptyBox: {
    width: "100%",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#64748b" },
  emptySubtext: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 20,
  },
});
