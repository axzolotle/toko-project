import {
    catatTransaksi,
    getItemByjenisandKategori,
    getJenisItems,
    getKategoriItems,
    Item,
} from "@/database/db2";
import { createStok } from "@/service/Stok";
import { useCurrentUser } from "@/service/useCurrentUser";
import { useTheme } from "@/lib/ThemeContext";
import { createStyles, darkColors, lightColors } from "@/styles/KasirStyles";
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
import { SafeAreaView } from "react-native-safe-area-context";

type Step = 1 | 2 | 3;

// ============================================================
// HELPER SUB-COMPONENTS
// ============================================================

interface HeaderProps {
  subtitle: string;
  S: any;
}

const KasirHeader: React.FC<HeaderProps> = ({ subtitle, S }) => (
  <View style={S.header}>
    <View>
      <Text style={S.headerTitle}>Kasir</Text>
      <Text style={S.headerSubtitle}>{subtitle}</Text>
    </View>
    <TouchableOpacity style={S.fabButton} activeOpacity={0.8}>
      <Text style={S.fabText}>☀</Text>
    </TouchableOpacity>
  </View>
);

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
  const { userId } = useCurrentUser();
  const { isDark, colors: C } = useTheme();
  const S = isDark ? createStyles(darkColors) : createStyles(lightColors);

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
      setKategoriList(kategori);
      setSelectedKategori("");
      setItemList([]);
      setSelectedItem(null);
    }
  }, [selectedJenis]);

  useEffect(() => {
    if (selectedJenis && selectedKategori) {
      const items = getItemByjenisandKategori(selectedJenis, selectedKategori);
      setItemList(items);
      setSelectedItem(null);
    }
  }, [selectedKategori]);

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
              const emojis = ["📦", "📱", "💳", "🏦"];
              return (
                <TouchableOpacity
                  key={jenis}
                  style={S.typeCard}
                  onPress={() => handleSelectJenis(jenis)}
                  activeOpacity={0.75}
                >
                  <View style={S.typeIconBox}>
                    <Text style={S.typeIconEmoji}>{emojis[index] || "📦"}</Text>
                  </View>
                  <Text style={S.typeTitle}>{jenis}</Text>
                  <Text style={S.typeCount}>
                    {kategoriList.length || index + 1} item
                  </Text>
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
            {kategoriList.map((kategori, i) =>
              i === 0 || selectedKategori === kategori ? (
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
              ),
            )}
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 60,
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: 12 }}>🔍</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: C.productDesc,
                }}
              >
                Tidak ada item
              </Text>
              <Text
                style={{ fontSize: 12, color: C.productDesc, marginTop: 6 }}
              >
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
          <View
            style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 16 }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: C.confirmLabel,
                marginBottom: 8,
              }}
            >
              Jumlah
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: C.typeCardBorder,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                color: C.confirmName,
                backgroundColor: C.typeCardBg,
              }}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Masukkan jumlah"
              placeholderTextColor={C.productDesc}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          {/* Total summary */}
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: C.typeCardBg,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: C.typeCardBorder,
                padding: 14,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: C.productDesc }}>
                  Total Harga
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: C.confirmLaba,
                  }}
                >
                  Rp {totalHarga.toLocaleString("id-ID")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 12, color: C.confirmLaba }}>
                  Total Keuntungan
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: C.confirmLaba,
                  }}
                >
                  + Rp {totalLaba.toLocaleString("id-ID")}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 12, color: C.productDesc, marginTop: 12 }}>
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
        <SafeAreaView style={S.safeArea}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </SafeAreaView>
      </View>
    </>
  );
}
