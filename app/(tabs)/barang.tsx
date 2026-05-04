import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createItem,
  createKasForItem,
  getAllItems,
  getJenisItems,
  Item,
} from "../../database/db2";
import { createStok } from "../../service/Stok";
import { useCurrentUser } from "../../service/useCurrentUser";

const JENIS_PRESET = ["Makanan", "Minuman", "Snack", "Rokok", "Sembako"];

export default function BarangScreen() {
  const { userId } = useCurrentUser();
  const [items, setItems] = useState<Item[]>([]);
  const [jenisList, setJenisList] = useState<string[]>([]);

  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [jenisCustom, setJenisCustom] = useState("");
  const [kategori, setKategori] = useState("");
  const [detail, setDetail] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [quantity, setQuantity] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [hargaBeliStok, setHargaBeliStok] = useState("");
  const [addQuantityInput, setAddQuantityInput] = useState("");

  useEffect(() => {
    loadJenis();
  }, []);

  // Refresh items setiap kali screen di-focus
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, []),
  );

  const loadItems = () => {
    const data = getAllItems();
    setItems(data);
  };

  const loadJenis = () => {
    const jenis = getJenisItems();
    setJenisList(jenis);
  };

  const jenisAkhir = jenis === "__custom__" ? jenisCustom.trim() : jenis;
  const modalNum = parseFloat(hargaModal) || 0;
  const jualNum = parseFloat(hargaJual) || 0;
  const labaNum = jualNum - modalNum;
  const marginPct = modalNum > 0 ? Math.round((labaNum / modalNum) * 100) : 0;

  const formatRp = (str: string) => {
    const num = parseFloat(str);
    if (isNaN(num)) return "";
    return "Rp " + num.toLocaleString("id-ID");
  };

  const handleSimpan = () => {
    if (!nama.trim()) return Alert.alert("Error", "Nama item wajib diisi");
    if (!jenisAkhir) return Alert.alert("Error", "Jenis wajib dipilih");
    if (!kategori.trim()) return Alert.alert("Error", "Kategori wajib diisi");
    if (!hargaModal || isNaN(modalNum))
      return Alert.alert("Error", "Harga modal tidak valid");
    if (!hargaJual || isNaN(jualNum))
      return Alert.alert("Error", "Harga jual tidak valid");

    const qty = 0;

    try {
      const itemId = createItem(
        nama.trim(),
        jenisAkhir,
        kategori.trim(),
        detail.trim(),
        modalNum,
        jualNum,
        qty,
        userId,
      );

      // Create kas entry for this item with quantity 0
      createKasForItem(itemId, nama.trim(), userId);

      Alert.alert(
        "Sukses",
        `Item "${nama}" berhasil ditambahkan. ID User: ${userId}`,
      );

      setNama("");
      setJenis("");
      setJenisCustom("");
      setKategori("");
      setDetail("");
      setHargaModal("");
      setHargaJual("");
      setQuantity("");
      setShowForm(false);

      loadItems();
      loadJenis();
    } catch (error) {
      Alert.alert("Error", "Gagal menambahkan item");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setNama("");
    setJenis("");
    setJenisCustom("");
    setKategori("");
    setDetail("");
    setHargaModal("");
    setHargaJual("");
    setQuantity("");
    setShowForm(false);
  };

  const openStockModal = (itemId: number, itemName: string) => {
    setEditingItemId(itemId);
    setEditingItemName(itemName);
    setAddQuantityInput("");
    setStockModalVisible(true);
  };

  const handleAddQuantity = () => {
    if (!addQuantityInput.trim()) {
      return Alert.alert("Error", "Masukkan jumlah quantity");
    }

    const qty = parseInt(addQuantityInput);
    if (isNaN(qty) || qty <= 0) {
      return Alert.alert("Error", "Jumlah harus lebih dari 0");
    }

    if (editingItemId === null) return;

    try {
      createStok(
        editingItemId,
        qty,
        "masuk",
        "Penambahan stok via aplikasi",
        parseFloat(hargaBeliStok) || 0, // harga_beli bisa diisi jika ingin catat harga pembelian stok
        userId,
      );

      Alert.alert(
        "Sukses",
        `Stok "${editingItemName}" berhasil ditambahkan ${qty} unit`,
      );

      setAddQuantityInput("");
      setStockModalVisible(false);
      setEditingItemId(null);
      setEditingItemName("");

      loadItems();
    } catch (error) {
      Alert.alert("Error", "Gagal menambahkan stok");
      console.error(error);
    }
  };

  const handleCloseStockModal = () => {
    setStockModalVisible(false);
    setEditingItemId(null);
    setEditingItemName("");
    setAddQuantityInput("");
  };

  return (
    <View style={s.container}>
      {!showForm ? (
        <>
          {/* HEADER */}
          <View style={s.header}>
            <Text style={s.title}>Daftar Item</Text>
            <TouchableOpacity
              style={s.addBtn}
              onPress={() => setShowForm(true)}
            >
              <Text style={s.addBtnText}>+ Tambah Item</Text>
            </TouchableOpacity>
          </View>

          {/* LIST ITEMS */}
          {items.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyText}>Belum ada item</Text>
              <Text style={s.emptySubtext}>
                Klik tombol + Tambah Item untuk memulai
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={s.itemRow}>
                  <View style={s.itemInfo}>
                    <Text style={s.itemNama}>{item.nama}</Text>
                    <Text style={s.itemJenis}>
                      {item.jenis} • {item.kategori}
                    </Text>
                    <Text style={s.itemDetail}>{item.detail}</Text>
                  </View>
                  <View style={s.itemRight}>
                    <View style={s.priceBox}>
                      <Text style={s.priceLabel}>Jual</Text>
                      <Text style={s.priceValue}>
                        Rp {item.harga_jual.toLocaleString("id-ID")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[s.priceBox, s.priceBoxStok]}
                      onPress={() => openStockModal(item.id, item.nama)}
                    >
                      <Text style={s.priceLabel}>Stok</Text>
                      <Text style={s.priceValue}>{item.quantity}</Text>
                      <Text style={s.tapHint}>Tekan untuk tambah</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              scrollEnabled={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </>
      ) : (
        // FORM INPUT
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={s.formContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.formTitle}>Tambah Item Baru</Text>

            {/* INFORMASI ITEM */}
            <Text style={s.sectionLabel}>Informasi Item</Text>

            <Text style={s.label}>Nama Item *</Text>
            <TextInput
              style={s.input}
              value={nama}
              onChangeText={setNama}
              placeholder="contoh: Aqua 600ml"
              maxLength={100}
              returnKeyType="next"
            />

            <Text style={s.label}>Jenis *</Text>
            <View style={s.jenisPicker}>
              {JENIS_PRESET.map((j) => (
                <TouchableOpacity
                  key={j}
                  style={[s.jenisBtn, jenis === j && s.jenisBtnActive]}
                  onPress={() => setJenis(j)}
                >
                  <Text
                    style={[
                      s.jenisBtnText,
                      jenis === j && s.jenisBtnTextActive,
                    ]}
                  >
                    {j}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[s.jenisBtn, jenis === "__custom__" && s.jenisBtnActive]}
                onPress={() => setJenis("__custom__")}
              >
                <Text
                  style={[
                    s.jenisBtnText,
                    jenis === "__custom__" && s.jenisBtnTextActive,
                  ]}
                >
                  + Lainnya
                </Text>
              </TouchableOpacity>
            </View>

            {jenis === "__custom__" && (
              <TextInput
                style={[s.input, { marginTop: 8 }]}
                value={jenisCustom}
                onChangeText={setJenisCustom}
                placeholder="Ketik jenis custom..."
                autoFocus
              />
            )}

            <Text style={s.label}>Kategori *</Text>
            <TextInput
              style={s.input}
              value={kategori}
              onChangeText={setKategori}
              placeholder="contoh: Elektronik, Apparel, dll"
              returnKeyType="next"
            />

            <Text style={s.label}>Detail / Keterangan</Text>
            <TextInput
              style={[s.input, s.inputMultiline]}
              value={detail}
              onChangeText={setDetail}
              placeholder="ukuran, varian, warna, dll..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* HARGA & STOK */}
            <Text style={[s.sectionLabel, { marginTop: 20 }]}>
              Harga & Stok
            </Text>

            <View style={s.twoColumn}>
              <View style={s.colLeft}>
                <Text style={s.label}>Harga Modal (Rp) *</Text>
                <TextInput
                  style={s.input}
                  value={hargaModal}
                  onChangeText={setHargaModal}
                  placeholder="0"
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                {hargaModal && (
                  <Text style={s.hint}>{formatRp(hargaModal)}</Text>
                )}
              </View>

              <View style={s.colRight}>
                <Text style={s.label}>Harga Jual (Rp) *</Text>
                <TextInput
                  style={s.input}
                  value={hargaJual}
                  onChangeText={setHargaJual}
                  placeholder="0"
                  keyboardType="numeric"
                  returnKeyType="next"
                />
                {hargaJual && <Text style={s.hint}>{formatRp(hargaJual)}</Text>}
              </View>
            </View>

            {/* MARGIN PREVIEW */}
            {hargaModal && hargaJual && (
              <View style={s.marginBox}>
                <View style={s.marginRow}>
                  <Text style={s.marginLabel}>Laba / Unit</Text>
                  <Text style={s.marginValue}>
                    Rp {labaNum.toLocaleString("id-ID")}
                  </Text>
                </View>
                <View style={s.marginRow}>
                  <Text style={s.marginLabel}>Margin</Text>
                  <Text style={s.marginValue}>{marginPct}%</Text>
                </View>
              </View>
            )}

            {/* BUTTONS */}
            <View style={s.buttonContainer}>
              <TouchableOpacity
                style={[s.btn, s.btnCancel]}
                onPress={handleCancel}
              >
                <Text style={s.btnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btn, s.btnSimpan]}
                onPress={handleSimpan}
              >
                <Text style={s.btnSimpanText}>Simpan Item</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* STOCK MODAL */}
      <Modal
        visible={stockModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseStockModal}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Tambah Stok: {editingItemName}</Text>

            <View style={s.modalStockInfo}>
              <Text style={s.modalStockLabel}>Stok Saat Ini:</Text>
              <Text style={s.modalStockValue}>
                {items.find((i) => i.id === editingItemId)?.quantity || 0} unit
              </Text>
            </View>

            <Text style={s.label}>Jumlah yang ditambahkan *</Text>
            <TextInput
              style={s.input}
              value={addQuantityInput}
              onChangeText={setAddQuantityInput}
              placeholder="Masukkan jumlah"
              keyboardType="numeric"
              autoFocus
            />

            <Text style={s.hint}>Harga Beli : (opsional, untuk catatan)</Text>
            <TextInput
              style={s.input}
              value={hargaBeliStok}
              onChangeText={setHargaBeliStok}
              placeholder="Masukkan harga beli barang"
              keyboardType="numeric"
            />

            <View style={s.buttonContainer}>
              <TouchableOpacity
                style={[s.btn, s.btnCancel]}
                onPress={handleCloseStockModal}
              >
                <Text style={s.btnCancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.btn, s.btnSimpan]}
                onPress={handleAddQuantity}
              >
                <Text style={s.btnSimpanText}>Tambah Stok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  // HEADER & LIST
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  addBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#999",
  },

  itemRow: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemInfo: {
    flex: 1,
  },
  itemNama: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  itemJenis: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  itemDetail: {
    fontSize: 11,
    color: "#999",
  },

  itemRight: {
    flexDirection: "row",
    gap: 8,
  },
  priceBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 70,
  },
  priceBoxStok: {
    backgroundColor: "#e0f2fe",
  },
  priceLabel: {
    fontSize: 10,
    color: "#666",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  tapHint: {
    fontSize: 8,
    color: "#0ea5e9",
    marginTop: 2,
    fontWeight: "500",
  },

  // FORM
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    marginTop: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },

  hint: {
    fontSize: 11,
    color: "#10b981",
    marginTop: -10,
    marginBottom: 8,
    fontWeight: "500",
  },

  jenisPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  jenisBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  jenisBtnActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  jenisBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  jenisBtnTextActive: {
    color: "#fff",
  },

  twoColumn: {
    flexDirection: "row",
    gap: 12,
  },
  colLeft: {
    flex: 1,
  },
  colRight: {
    flex: 1,
  },

  marginBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  marginRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  marginLabel: {
    fontSize: 12,
    color: "#666",
  },
  marginValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#10b981",
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  btnCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  btnSimpan: {
    backgroundColor: "#10b981",
  },
  btnSimpanText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // MODAL STYLES
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
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  modalStockInfo: {
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  modalStockLabel: {
    fontSize: 12,
    color: "#666",
  },
  modalStockValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
});
