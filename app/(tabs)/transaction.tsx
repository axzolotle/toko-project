import {
  catatTransaksi,
  getItemByjenisandKategori,
  getJenisItems,
  getKategoriItems,
  Item,
} from "@/database/db2";
import { createStok } from "@/service/Stok";
import { useCurrentUser } from "@/service/useCurrentUser";
import {
  createStyles,
  darkColors,
  lightColors,
} from "@/styles/TransactionStyle";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Step = 1 | 2 | 3;

export default function TransactionScreen() {
  const { userId } = useCurrentUser();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? darkColors : lightColors;
  const s = isDark ? createStyles(darkColors) : createStyles(lightColors);

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

  const handleCancel = () => {
    setCurrentStep(1);
    setSelectedJenis("");
    setSelectedKategori("");
    setItemList([]);
    setSelectedItem(null);
    setQuantity("1");
  };

  // ── RENDER STEP 1: CHOOSE JENIS ──
  const renderStep1 = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* SECTION */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionHeaderText}>PILIH JENIS TRANSAKSI</Text>
        </View>

        {/* GRID */}
        <View style={s.grid}>
          {jenisList.map((jenis, index) => (
            <TouchableOpacity
              key={jenis}
              style={s.categoryCard}
              onPress={() => handleSelectJenis(jenis)}
              activeOpacity={0.7}
            >
              <View style={s.categoryIconWrapper}>
                <Text style={s.categoryIcon}>
                  {index === 0
                    ? "📦"
                    : index === 1
                      ? "📱"
                      : index === 2
                        ? "💳"
                        : "🏦"}
                </Text>
              </View>
              <Text style={s.categoryTitle}>{jenis}</Text>
              <Text style={s.categoryMeta}>
                {kategoriList.length || index + 1} item
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // ── RENDER STEP 2: CHOOSE ITEM ──
  const renderStep2 = () => {
    return (
      <View style={{ flex: 1 }}>
        {/* BACK ROW */}
        <View style={s.backRow}>
          <TouchableOpacity
            onPress={handleBackFromStep2}
            style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <Text style={s.backArrow}>
              <Ionicons name="arrow-back" size={18} />
            </Text>
            <Text style={s.backText}>{selectedJenis}</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            ...s.filterRow,
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          {kategoriList.map((kategori) => (
            <TouchableOpacity
              key={kategori}
              style={[
                selectedKategori === kategori ? s.filterActive : s.filterChip,
              ]}
              onPress={() => setSelectedKategori(kategori)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  selectedKategori === kategori
                    ? s.filterActiveText
                    : s.filterChipText,
                ]}
              >
                {kategori}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PRODUCT LIST */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {itemList.length > 0 ? (
            itemList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={s.productCard}
                onPress={() => handleSelectItem(item)}
                activeOpacity={0.7}
              >
                <View style={s.productDot} />
                <View style={s.productContent}>
                  <Text style={s.productTitle}>{item.nama}</Text>
                  <Text style={s.productMeta}>
                    {item.kategori} • {item.detail}
                  </Text>
                </View>
                <Text style={s.productPrice}>
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
                paddingVertical: 40,
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>🔍</Text>
              <Text
                style={{
                  fontSize: 16,
                  color: C.itemMeta,
                  fontWeight: "600",
                }}
              >
                Tidak ada item
              </Text>
              <Text style={{ fontSize: 12, color: C.itemMeta, marginTop: 4 }}>
                Pilih kategori untuk melihat item
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  // ── RENDER STEP 3: CONFIRMATION ──
  const renderStep3 = () => {
    if (!selectedItem) return null;

    const profit = selectedItem.harga_jual - (selectedItem.harga_modal || 0);
    const totalHarga = selectedItem.harga_jual * (parseInt(quantity, 10) || 0);
    const totalLaba = profit * (parseInt(quantity, 10) || 0);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {/* CONFIRM CARD */}
        <View style={s.confirmCard}>
          <View style={s.confirmBadgeRow}>
            <Text style={s.confirmEmoji}>📦</Text>

            <View style={s.badgePrimary}>
              <Text style={s.badgePrimaryText}>{selectedJenis}</Text>
            </View>

            <View style={s.badgeSecondary}>
              <Text style={s.badgeSecondaryText}>{selectedKategori}</Text>
            </View>
          </View>

          <Text style={s.confirmTitle}>{selectedItem.nama}</Text>
          <Text style={s.confirmDesc}>{selectedItem.detail}</Text>

          <View style={s.confirmDivider} />

          <View style={s.confirmBottom}>
            <View style={s.confirmLeft}>
              <Text style={s.confirmLabel}>harga jual</Text>
              <Text style={s.confirmLabel}>modal</Text>
              <Text style={s.confirmLabel}>laba</Text>
            </View>

            <View style={s.confirmRight}>
              <Text style={s.confirmPrice}>
                Rp {selectedItem.harga_jual.toLocaleString("id-ID")}
              </Text>
              <Text style={s.confirmModal}>
                Rp {(selectedItem.harga_modal || 0).toLocaleString("id-ID")}
              </Text>
              <Text style={s.confirmProfit}>
                + Rp {profit.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        </View>

        {/* QUANTITY INPUT */}
        <View
          style={{ paddingHorizontal: 18, marginTop: 16, marginBottom: 20 }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.itemTitle,
              marginBottom: 8,
            }}
          >
            Jumlah
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: C.cardBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              color: C.itemTitle,
              backgroundColor: C.cardBg,
            }}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Masukkan jumlah"
            placeholderTextColor={C.itemMeta}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* TOTAL SUMMARY */}
        <View style={{ paddingHorizontal: 18, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: C.pageBg,
              borderRadius: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: C.cardBorder,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: C.itemMeta }}>
                Total Harga
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: C.itemPrice }}
              >
                Rp {totalHarga.toLocaleString("id-ID")}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 12, color: C.itemPrice }}>
                Total Keuntungan
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: C.itemPrice }}
              >
                + Rp {totalLaba.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 12, color: C.itemMeta, marginTop: 12 }}>
            Stok Tersedia: {selectedItem.quantity} unit
          </Text>
        </View>
      </ScrollView>
    );
  };

  // ── RENDER HEADER ──
  const renderHeader = () => {
    const titles = ["Kasir", "Kasir", "Kasir"];
    const subtitles = [
      "pilih jenis transaksi",
      "pilih item",
      "konfirmasi & catat",
    ];

    return (
      <View style={s.header}>
        <View>
          <Text style={s.title}>{titles[currentStep - 1]}</Text>
          <Text style={s.subtitle}>{subtitles[currentStep - 1]}</Text>
        </View>

        <TouchableOpacity style={s.themeButton}>
          <Text style={s.themeButtonIcon}>☀</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── RENDER STEP INDICATOR ──
  const renderStepIndicator = () => {
    return (
      <View style={s.stepWrapper}>
        <View style={s.stepRow}>
          <View style={[s.stepActive, currentStep !== 1 && s.stepInactive]}>
            <Text
              style={[
                s.stepActiveText,
                currentStep !== 1 && s.stepInactiveText,
              ]}
            >
              {currentStep > 1 ? "✓" : "1"}
            </Text>
          </View>

          <View style={s.stepLine} />

          <View style={[s.stepActive, currentStep !== 2 && s.stepInactive]}>
            <Text
              style={[
                s.stepActiveText,
                currentStep !== 2 && s.stepInactiveText,
              ]}
            >
              {currentStep > 2 ? "✓" : "2"}
            </Text>
          </View>

          <View style={s.stepLine} />

          <View style={[s.stepActive, currentStep !== 3 && s.stepInactive]}>
            <Text
              style={[
                s.stepActiveText,
                currentStep !== 3 && s.stepInactiveText,
              ]}
            >
              3
            </Text>
          </View>

          <Text style={s.stepLabel}>
            {currentStep === 1 ? "jenis" : currentStep === 2 ? "item" : "catat"}
          </Text>
        </View>
      </View>
    );
  };

  // ── RENDER FOOTER BUTTONS ──
  const renderFooterButtons = () => {
    if (currentStep === 1) return null;

    if (currentStep === 3) {
      return (
        <View style={{ paddingHorizontal: 18, paddingBottom: 20, gap: 12 }}>
          <TouchableOpacity
            style={s.primaryButton}
            onPress={handleConfirmTransaction}
            activeOpacity={0.7}
          >
            <Text style={s.primaryButtonText}>Catat penjualan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.secondaryButton}
            onPress={handleBackFromStep3}
            activeOpacity={0.7}
          >
            <Text style={s.secondaryButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  // ── MAIN RENDER ──
  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />
      <SafeAreaView style={s.screen}>
        <View
          style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 12 }}
        >
          {renderHeader()}
          {renderStepIndicator()}
        </View>

        <View style={{ flex: 1 }}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </View>

        {renderFooterButtons()}
      </SafeAreaView>
    </>
  );
}
