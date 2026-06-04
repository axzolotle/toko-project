import {
  catatTransaksi,
  getItemByjenisandKategori,
  getJenisItems,
  getKategoriItems,
  Item,
} from "@/database/db2";
import { useTheme } from "@/lib/ThemeContext";
import { createStok } from "@/service/Stok";
import { useCurrentUser } from "@/service/useCurrentUser";
import {
  KasirCreateStyles as createStyles,
  KasirDarkColors as darkColors,
  KasirLightColors as lightColors,
} from "@/styles/AppStyle";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Step = 1 | 2 | 3;
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const getJenisIcon = (jenis: string): IoniconName => {
  const normalized = jenis.trim().toLowerCase();

  if (normalized.includes("pulsa")) return "phone-portrait-outline";
  if (normalized.includes("lampu")) return "bulb-outline";
  if (normalized.includes("kabel")) return "git-network-outline";
  if (normalized.includes("headset")) return "headset-outline";
  if (normalized.includes("top up") || normalized.includes("game")) {
    return "game-controller-outline";
  }
  if (normalized.includes("token")) return "receipt-outline";
  if (normalized.includes("transfer")) return "swap-horizontal-outline";
  if (normalized.includes("voucher")) return "card-outline";
  if (normalized.includes("digital")) return "cloud-outline";
  if (normalized.includes("barang")) return "cube-outline";

  return "pricetag-outline";
};

// ============================================================
// HELPER SUB-COMPONENTS
// ============================================================

interface HeaderProps {
  subtitle: string;
  S: any;
}

const KasirHeader: React.FC<HeaderProps> = ({ subtitle, S }) => {
  return (
    <View style={S.header}>
      <View>
        <Text style={S.headerTitle}>Kasir</Text>
      </View>
    </View>
  );
};

interface StepIndicatorProps {
  step: 1 | 2 | 3;
  S: any;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, S }) => {
  const labels: Record<number, string> = { 1: "jenis", 2: "item", 3: "catat" };

  const Circle = ({ n }: { n: 1 | 2 | 3 }) => {
    if (n < step)
      return (
        <View style={S.circleCompleted}>
          <Text style={S.stepCheck}>✓</Text>
        </View>
      );
    if (n === step)
      return (
        <View style={S.circleActive}>
          <Text style={S.stepNumActive}>{n}</Text>
        </View>
      );
    return (
      <View style={S.circleInactive}>
        <Text style={S.stepNumInactive}>{n}</Text>
      </View>
    );
  };

  const Line = ({ pos }: { pos: number }) =>
    pos < step ? (
      <View style={S.lineActive} />
    ) : (
      <View style={S.lineInactive} />
    );

  return (
    <View style={S.stepRow}>
      <Circle n={1} />
      <Line pos={1} />
      <Circle n={2} />
      <Line pos={2} />
      <Circle n={3} />
      <Text style={S.stepLabel}>{labels[step]}</Text>
    </View>
  );
};

// ============================================================
// MAIN SCREEN
// ============================================================

export default function TransactionScreen() {
  const { userId, loading: userLoading } = useCurrentUser();
  const { isDark, colors: C } = useTheme();
  const S = isDark ? createStyles(darkColors) : createStyles(lightColors);
  const jenisIconColor = isDark ? darkColors.typeTitle : lightColors.typeTitle;

  // ── STATE MANAGEMENT ──
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [itemList, setItemList] = useState<Item[]>([]);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedJenis, setSelectedJenis] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState("1");

  // ── DATA LOADING ──
  useEffect(() => {
    const jenis = getJenisItems();
    setJenisList(jenis);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const jenis = getJenisItems();
      setJenisList(jenis);
    }, []),
  );

  useEffect(() => {
    if (selectedJenis) {
      const kategori = getKategoriItems(selectedJenis);
      const kategoriPertama = kategori[0] ?? "";

      setKategoriList(kategori);
      setSelectedKategori(kategoriPertama);
      setItemList(
        kategoriPertama
          ? getItemByjenisandKategori(selectedJenis, kategoriPertama)
          : [],
      );
      setSelectedItem(null);
    }
  }, [selectedJenis]);

  useEffect(() => {
    if (selectedJenis && selectedKategori) {
      const items = getItemByjenisandKategori(selectedJenis, selectedKategori);
      setItemList(items);
      setSelectedItem(null);
    }
  }, [selectedJenis, selectedKategori]);

  // ── HANDLERS ──
  const handleSelectJenis = (jenis: string) => {
    setSelectedJenis(jenis);
    setCurrentStep(2);
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setCurrentStep(3);
    setQuantity("1");
  };

  const handleBackFromStep2 = () => {
    setCurrentStep(1);
    setSelectedItem(null);
  };

  const handleBackFromStep3 = () => {
    setCurrentStep(2);
  };

  const handleConfirmTransaction = () => {
    if (userLoading) {
      Alert.alert("Mohon tunggu", "Data user sedang dimuat");
      return;
    }

    if (userId === null) {
      Alert.alert("Error", "User belum login");
      return;
    }

    if (!selectedItem) {
      Alert.alert("Error", "Pilih item terlebih dahulu");
      return;
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert("Error", "Jumlah tidak valid");
      return;
    }

    if (qty > selectedItem.quantity) {
      Alert.alert(
        "Error",
        `Stok tidak cukup. Stok tersedia: ${selectedItem.quantity}`,
      );
      return;
    }

    try {
      catatTransaksi(selectedItem, qty, userId);
      createStok(
        selectedItem.id,
        qty,
        "keluar",
        `Penjualan ${qty} ${selectedItem.nama}`,
        selectedItem.harga_modal,
        userId,
      );
      Alert.alert(
        "Sukses",
        `${selectedItem.nama} x${qty} Rp ${(
          selectedItem.harga_jual * qty
        ).toLocaleString("id-ID")} berhasil dicatat`,
        [
          {
            text: "OK",
            onPress: () => {
              setCurrentStep(1);
              setSelectedJenis("");
              setSelectedKategori("");
              setItemList([]);
              setSelectedItem(null);
              setQuantity("1");
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Gagal mencatat transaksi");
      console.error(error);
    }
  };

  // ── RENDER STEP 1: PILIH JENIS ──
  const renderStep1 = () => {
    return (
      <>
        <KasirHeader subtitle="pilih jenis transaksi" S={S} />
        <StepIndicator step={1} S={S} />

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={S.sectionLabel}>Pilih Jenis</Text>

          <View style={S.typeGrid}>
            {jenisList.map((jenis, index) => {
              return (
                <TouchableOpacity
                  key={jenis}
                  style={S.typeCard}
                  onPress={() => handleSelectJenis(jenis)}
                  activeOpacity={0.75}
                >
                  <View style={S.typeTitleRow}>
                    <Ionicons
                      name={getJenisIcon(jenis)}
                      size={18}
                      color={jenisIconColor}
                    />
                    <Text style={[S.typeTitle, S.typeTitleInline]}>
                      {jenis}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </>
    );
  };

  // ── RENDER STEP 2: PILIH ITEM ──
  const renderStep2 = () => {
    return (
      <>
        <KasirHeader subtitle="pilih item" S={S} />
        <StepIndicator step={2} S={S} />

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back nav */}
          <TouchableOpacity
            style={S.backNav}
            onPress={handleBackFromStep2}
            activeOpacity={0.7}
          >
            <Text style={S.backArrow}>←</Text>
            <Text style={S.backText}>{selectedJenis}</Text>
          </TouchableOpacity>

          {/* Filter chips */}
          <View style={S.filterRow}>
            {kategoriList.map((kategori) => {
              const isActive = selectedKategori === kategori;
              return isActive ? (
                <TouchableOpacity
                  key={kategori}
                  style={S.chipActive}
                  onPress={() => setSelectedKategori(kategori)}
                  activeOpacity={0.8}
                >
                  <Text style={S.chipActiveText}>{kategori}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={kategori}
                  style={S.chip}
                  onPress={() => setSelectedKategori(kategori)}
                  activeOpacity={0.8}
                >
                  <Text style={S.chipText}>{kategori}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Product rows */}
          {itemList.length > 0 ? (
            itemList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={S.productCard}
                onPress={() => handleSelectItem(item)}
                activeOpacity={0.75}
              >
                <View style={S.productDot} />
                <View style={S.productInfo}>
                  <Text style={S.productName}>{item.nama}</Text>
                  <Text style={S.productDesc}>
                    {item.kategori} • {item.detail}
                  </Text>
                </View>
                <Text style={S.productPrice}>
                  Rp {item.harga_jual.toLocaleString("id-ID")}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={S.emptyStateContainer}>
              <Text style={S.emptyStateIcon}>🔍</Text>
              <Text style={S.emptyStateTitle}>Tidak ada item</Text>
              <Text style={S.emptyStateDesc}>
                Pilih kategori untuk melihat item
              </Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  };

  // ── RENDER STEP 3: KONFIRMASI ──
  const renderStep3 = () => {
    if (!selectedItem) return null;

    const profit = selectedItem.harga_jual - (selectedItem.harga_modal || 0);
    const totalHarga = selectedItem.harga_jual * (parseInt(quantity, 10) || 0);
    const totalLaba = profit * (parseInt(quantity, 10) || 0);

    return (
      <>
        <KasirHeader subtitle="konfirmasi & catat" S={S} />
        <StepIndicator step={3} S={S} />

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back nav */}
          <TouchableOpacity
            style={S.backNav}
            onPress={handleBackFromStep3}
            activeOpacity={0.7}
          >
            <Text style={S.backArrow}>←</Text>
            <Text style={S.backText}>Pilih item lain</Text>
          </TouchableOpacity>

          {/* Confirmation card */}
          <View style={S.confirmCard}>
            {/* Emoji + badges */}
            <View style={S.confirmTopRow}>
              <Text style={S.confirmEmoji}>📦</Text>
              <View style={S.badgeGreen}>
                <Text style={S.badgeGreenText}>{selectedJenis}</Text>
              </View>
              <View style={S.badgeNeutral}>
                <Text style={S.badgeNeutralText}>{selectedKategori}</Text>
              </View>
            </View>

            {/* Product name */}
            <Text style={S.confirmName}>{selectedItem.nama}</Text>
            <Text style={S.confirmDesc}>{selectedItem.detail}</Text>

            {/* Divider */}
            <View style={S.confirmDivider} />

            {/* Price rows */}
            <View style={S.priceRow}>
              <Text style={S.priceLabel}>harga jual</Text>
              <Text style={S.hargaValue}>
                Rp {selectedItem.harga_jual.toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={S.priceRow}>
              <Text style={S.priceLabel}>modal</Text>
              <Text style={S.modalValue}>
                Rp {(selectedItem.harga_modal || 0).toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={S.priceRow}>
              <Text style={S.priceLabel}>laba</Text>
              <Text style={S.labaValue}>
                + Rp {profit.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Quantity input */}
          <View style={S.quantityInputWrapper}>
            <Text style={S.quantityLabel}>Jumlah</Text>
            <TextInput
              style={S.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Masukkan jumlah"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          {/* Total summary */}
          <View style={S.totalSummaryWrapper}>
            <View style={S.totalSummaryBox}>
              <View style={S.totalSummaryRow}>
                <Text style={S.totalSummaryLabel}>Total Harga</Text>
                <Text style={S.totalSummaryValue}>
                  Rp {totalHarga.toLocaleString("id-ID")}
                </Text>
              </View>
              <View style={S.totalSummaryRowLast}>
                <Text style={S.totalSummaryProfit}>Total Keuntungan</Text>
                <Text style={S.totalSummaryProfitValue}>
                  + Rp {totalLaba.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>
            <Text style={S.stockAvailableText}>
              Stok Tersedia: {selectedItem.quantity} unit
            </Text>
          </View>
        </ScrollView>

        {/* Fixed bottom buttons */}
        <View style={S.bottomArea}>
          <TouchableOpacity
            style={S.btnPrimary}
            onPress={handleConfirmTransaction}
            activeOpacity={0.85}
          >
            <Text style={S.btnPrimaryText}>Catat penjualan</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={S.btnSecondary}
            onPress={handleBackFromStep3}
            activeOpacity={0.8}
          >
            <Text style={S.btnSecondaryText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  // ── MAIN RENDER ──
  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />
      <View style={S.screen}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </View>
    </>
  );
}
