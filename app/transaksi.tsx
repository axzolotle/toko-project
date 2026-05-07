import {
  catatTransaksi,
  getItemByjenisandKategori,
  getJenisItems,
  getKategoriItems,
  Item,
} from "@/database/db2";
import { createStok } from "@/service/Stok";
import { useCurrentUser } from "@/service/useCurrentUser";
import { KasirStyles as s } from "@/styles/Style";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Step = 1 | 2 | 3;

const Transaksi2: React.FC = () => {
  const { userId } = useCurrentUser();

  // State untuk data dari database
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [itemList, setItemList] = useState<Item[]>([]);

  // State untuk selection
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedJenis, setSelectedJenis] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState("1");

  // Load jenis items saat pertama kali
  useEffect(() => {
    const jenis = getJenisItems();
    setJenisList(jenis);
  }, []);

  // Refresh jenis setiap kali screen di-focus
  useFocusEffect(
    useCallback(() => {
      const jenis = getJenisItems();
      setJenisList(jenis);
    }, []),
  );

  // Load kategori ketika jenis berubah
  useEffect(() => {
    if (selectedJenis) {
      const kategori = getKategoriItems(selectedJenis);
      setKategoriList(kategori);
      setSelectedKategori("");
      setItemList([]);
      setSelectedItem(null);
    }
  }, [selectedJenis]);

  // Load items ketika kategori berubah
  useEffect(() => {
    if (selectedJenis && selectedKategori) {
      const items = getItemByjenisandKategori(selectedJenis, selectedKategori);
      setItemList(items);
      setSelectedItem(null);
    }
  }, [selectedKategori]);

  // Handlers untuk Step 1 - Langsung ke Step 2
  const handleSelectJenis = (jenis: string) => {
    setSelectedJenis(jenis);
    setCurrentStep(2);
  };

  // Handlers untuk Step 2 - Langsung ke Step 3
  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setCurrentStep(3);
    setQuantity("1");
  };

  const handleBackFromStep2 = () => {
    setCurrentStep(1);
    setSelectedItem(null);
  };

  // Handlers untuk Step 3
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
              // Reset untuk transaksi baru
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

  // Render Step Progress
  const renderStepProgress = () => {
    return (
      <View style={s.stepProgressContainer}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={[
                s.stepCircle,
                currentStep === step && s.stepCircleActive,
                step < currentStep && s.stepCircleCompleted,
              ]}
            >
              {step < currentStep ? (
                <Text style={s.checkmarkText}>✓</Text>
              ) : (
                <Text
                  style={[s.stepText, currentStep === step && s.stepTextActive]}
                >
                  {step}
                </Text>
              )}
            </View>
            <Text
              style={[s.stepText, currentStep === step && s.stepTextActive]}
            >
              {step === 1 ? "Jenis" : step === 2 ? "Item" : "Catat"}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Render Step 1: Choose Jenis
  const renderStep1 = () => {
    return (
      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollViewContent}
      >
        <View style={s.transactionGridContainer}>
          {jenisList.map((jenis, index) => (
            <TouchableOpacity
              key={jenis}
              style={[
                s.transactionCard,
                selectedJenis === jenis && s.transactionCardActive,
              ]}
              onPress={() => handleSelectJenis(jenis)}
              activeOpacity={0.7}
            >
              <Ionicons
                name="layers"
                size={32}
                color={selectedJenis === jenis ? "white" : "#16a34a"}
                style={{ marginBottom: 12 }}
              />
              <Text style={s.transactionLabel}>{jenis}</Text>
              <Text style={s.transactionCount}>{index + 1} kategori</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Render Step 2: Choose Item
  const renderStep2 = () => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={handleBackFromStep2}>
          <Text style={[s.buttonBackText]}>
            <Ionicons name="arrow-back" size={16} color="#16a34a" />
            {selectedJenis}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {/* Filter Kategori */}
          <View style={s.filterBarContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              {kategoriList.map((kategori) => (
                <TouchableOpacity
                  key={kategori}
                  style={[
                    s.filterButton,
                    selectedKategori === kategori && s.filterButtonActive,
                  ]}
                  onPress={() => setSelectedKategori(kategori)}
                >
                  <Text
                    style={[
                      s.filterButtonText,
                      selectedKategori === kategori && s.filterButtonTextActive,
                    ]}
                  >
                    {kategori}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Item List */}
          <ScrollView
            style={s.scrollView}
            contentContainerStyle={s.scrollViewContent}
          >
            {itemList.length > 0 ? (
              itemList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    s.productCard,
                    selectedItem?.id === item.id && s.productCardActive,
                  ]}
                  onPress={() => handleSelectItem(item)}
                  activeOpacity={0.7}
                >
                  <View style={s.productInfo}>
                    <Text style={s.productName}>{item.nama}</Text>
                    <Text style={s.productDescription}>{item.detail}</Text>
                  </View>
                  <Text style={s.productPrice}>
                    Rp {item.harga_jual.toLocaleString("id-ID")}
                  </Text>
                  {selectedItem?.id === item.id && (
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color="#16a34a"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={s.emptyContainer}>
                <Text style={s.emptyIcon}>🔍</Text>
                <Text style={s.emptyText}>Tidak ada item ditemukan</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Render Step 3: Confirmation
  const renderStep3 = () => {
    if (!selectedItem) return null;

    const profit = selectedItem.harga_jual - (selectedItem.harga_modal || 0);
    const totalHarga = selectedItem.harga_jual * (parseInt(quantity, 10) || 0);
    const totalLaba = profit * (parseInt(quantity, 10) || 0);

    return (
      <ScrollView
        style={s.scrollView}
        contentContainerStyle={s.scrollViewContent}
      >
        <View style={s.confirmationCard}>
          <View style={s.confirmationHeader}>
            <Ionicons
              name="cube"
              size={40}
              color="#16a34a"
              style={{ marginBottom: 12 }}
            />
            <Text style={s.confirmationItemName}>{selectedItem.nama}</Text>
            <View style={s.confirmationBadge}>
              <Text style={s.confirmationBadgeText}>{selectedKategori}</Text>
            </View>
          </View>

          <View style={s.confirmationRow}>
            <Text style={s.confirmationLabel}>Harga Jual (satuan)</Text>
            <Text style={s.confirmationValue}>
              Rp {selectedItem.harga_jual.toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={s.confirmationRow}>
            <Text style={s.confirmationLabel}>Harga Modal (satuan)</Text>
            <Text style={s.confirmationValue}>
              Rp {(selectedItem.harga_modal || 0).toLocaleString("id-ID")}
            </Text>
          </View>

          <View style={s.confirmationRow}>
            <Text style={s.confirmationLabel}>Keuntungan (satuan)</Text>
            <Text style={s.profitValue}>
              + Rp {profit.toLocaleString("id-ID")}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: "#e2e8f0",
              marginVertical: 12,
            }}
          />

          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#475569",
              marginBottom: 8,
            }}
          >
            Jumlah
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              marginBottom: 16,
            }}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Masukkan jumlah"
            keyboardType="numeric"
            maxLength={4}
          />

          <View
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: "#475569" }}>
                Total Harga
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#16a34a" }}
              >
                Rp {totalHarga.toLocaleString("id-ID")}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 12, color: "#16a34a" }}>
                Total Keuntungan
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#16a34a" }}
              >
                + Rp {totalLaba.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
            Stok Tersedia: {selectedItem.quantity}
          </Text>
        </View>
      </ScrollView>
    );
  };

  // Render Header
  const renderHeader = () => {
    const titles = ["Transaksi", "Transaksi", "Transaksi"];
    const subtitles = [
      "Pilih jenis barang",
      "Pilih item",
      "Konfirmasi & catat",
    ];

    return (
      <View style={s.header}>
        <Text style={s.headerTitle}>{titles[currentStep - 1]}</Text>
        <Text style={s.headerSubtitle}>{subtitles[currentStep - 1]}</Text>
      </View>
    );
  };

  // Render Footer Buttons - Hanya untuk Step 3
  const renderFooterButtons = () => {
    if (currentStep !== 3) return null;

    return (
      <View style={s.footerContainer}>
        <TouchableOpacity style={s.buttonBack} onPress={handleBackFromStep3}>
          <Ionicons name="arrow-back" size={20} color="#16a34a" />
          <Text style={s.buttonBackText}>Kembali</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.buttonNext}
          onPress={handleConfirmTransaction}
          activeOpacity={0.7}
        >
          <Ionicons name="checkmark-done" size={20} color="white" />
          <Text style={s.buttonNextText}>Catat Transaksi</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {renderHeader()}
      {renderStepProgress()}

      <View style={s.contentContainer}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </View>

      {renderFooterButtons()}
    </SafeAreaView>
  );
};

export default Transaksi2;
