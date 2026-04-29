import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  catatTransaksi,
  getItemByjenisandKategori,
  getJenisItems,
  getKategoriItems,
  Item,
} from "../../database/db2";

const OPERATOR_ID = 1; // Ganti dengan operator_id dari session

export default function Transaksi() {
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [itemList, setItemList] = useState<Item[]>([]);

  const [selectedJenis, setSelectedJenis] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState("1");

  const [showModal, setShowModal] = useState(false);

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

  const handleCatatTransaksi = () => {
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
      catatTransaksi(selectedItem, qty, OPERATOR_ID);
      Alert.alert("Sukses", `${selectedItem.nama} x${qty} berhasil dicatat`);
      setShowModal(false);
      setSelectedItem(null);
      setQuantity("1");
    } catch (error) {
      Alert.alert("Error", "Gagal mencatat transaksi");
      console.error(error);
    }
  };

  const handleReset = () => {
    setSelectedJenis("");
    setSelectedKategori("");
    setItemList([]);
    setSelectedItem(null);
    setQuantity("1");
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* SECTION: PILIH JENIS */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>1. Pilih Jenis</Text>
        <View style={s.gridContainer}>
          {jenisList.map((jenis) => (
            <TouchableOpacity
              key={jenis}
              style={[s.gridItem, selectedJenis === jenis && s.gridItemActive]}
              onPress={() => setSelectedJenis(jenis)}
            >
              <Text
                style={[
                  s.gridText,
                  selectedJenis === jenis && s.gridTextActive,
                ]}
              >
                {jenis}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SECTION: PILIH KATEGORI */}
      {selectedJenis && kategoriList.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>2. Pilih Kategori</Text>
          <View style={s.gridContainer}>
            {kategoriList.map((kategori) => (
              <TouchableOpacity
                key={kategori}
                style={[
                  s.gridItem,
                  selectedKategori === kategori && s.gridItemActive,
                ]}
                onPress={() => setSelectedKategori(kategori)}
              >
                <Text
                  style={[
                    s.gridText,
                    selectedKategori === kategori && s.gridTextActive,
                  ]}
                >
                  {kategori}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* SECTION: PILIH ITEM */}
      {selectedKategori && itemList.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>3. Pilih Item</Text>
          <View style={s.itemListContainer}>
            {itemList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={s.itemCard}
                onPress={() => {
                  setSelectedItem(item);
                  setShowModal(true);
                  setQuantity("1");
                }}
              >
                <View style={s.itemHeader}>
                  <Text style={s.itemNama}>{item.nama}</Text>
                  <Text style={s.itemStok}>Stok: {item.quantity}</Text>
                </View>
                <Text style={s.itemDetail}>{item.detail}</Text>
                <View style={s.itemPricing}>
                  <Text style={s.itemPrice}>
                    Rp {item.harga_jual.toLocaleString("id-ID")}
                  </Text>
                  {item.quantity > 0 ? (
                    <Text style={s.itemAvailable}>Tersedia</Text>
                  ) : (
                    <Text style={s.itemOutStock}>Habis</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* TOMBOL RESET */}
      {selectedJenis && (
        <View style={s.section}>
          <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
            <Text style={s.resetBtnText}>Reset Pilihan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MODAL INPUT QUANTITY */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Catat Transaksi</Text>

            {selectedItem && (
              <>
                <View style={s.itemSummary}>
                  <Text style={s.modalLabel}>Item</Text>
                  <Text style={s.modalItemName}>{selectedItem.nama}</Text>
                  <Text style={s.modalItemDetail}>{selectedItem.detail}</Text>

                  <View style={s.summaryRow}>
                    <Text style={s.modalLabel}>Harga Jual</Text>
                    <Text style={s.summaryValue}>
                      Rp {selectedItem.harga_jual.toLocaleString("id-ID")}
                    </Text>
                  </View>

                  <View style={s.summaryRow}>
                    <Text style={s.modalLabel}>Stok Tersedia</Text>
                    <Text style={s.summaryValue}>{selectedItem.quantity}</Text>
                  </View>
                </View>

                <Text style={s.modalLabel}>Jumlah *</Text>
                <TextInput
                  style={s.modalInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Masukkan jumlah"
                  keyboardType="numeric"
                  autoFocus
                />

                <View style={s.totalSection}>
                  <Text style={s.totalLabel}>Total Harga</Text>
                  <Text style={s.totalValue}>
                    Rp{" "}
                    {(
                      selectedItem.harga_jual * (parseInt(quantity, 10) || 0)
                    ).toLocaleString("id-ID")}
                  </Text>
                  <Text style={s.labaLabel}>
                    Keuntungan: Rp{" "}
                    {(
                      (selectedItem.harga_jual - selectedItem.harga_modal) *
                      (parseInt(quantity, 10) || 0)
                    ).toLocaleString("id-ID")}
                  </Text>
                </View>

                <View style={s.modalButtonContainer}>
                  <TouchableOpacity
                    style={s.cancelBtn}
                    onPress={() => setShowModal(false)}
                  >
                    <Text style={s.cancelBtnText}>Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={s.submitBtn}
                    onPress={handleCatatTransaksi}
                  >
                    <Text style={s.submitBtnText}>Catat Transaksi</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingBottom: 20,
  },

  // SECTION
  section: {
    paddingHorizontal: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },

  // GRID
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    flex: 1,
    minWidth: "31%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  gridItemActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  gridText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  gridTextActive: {
    color: "#fff",
  },

  // ITEM LIST
  itemListContainer: {
    gap: 8,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemNama: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  itemStok: {
    fontSize: 12,
    color: "#666",
  },
  itemDetail: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  itemPricing: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  itemAvailable: {
    fontSize: 11,
    color: "#10b981",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  itemOutStock: {
    fontSize: 11,
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },

  // RESET BUTTON
  resetBtn: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  resetBtnText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },

  itemSummary: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  modalItemDetail: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },

  totalSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 8,
  },
  labaLabel: {
    fontSize: 12,
    color: "#10b981",
  },

  modalButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
