import { useTheme } from "@/lib/ThemeContext";
import {
  darkColors,
  darkStyles,
  lightColors,
  lightStyles,
} from "@/styles/ItemListStyles";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createItem,
  getAllItems,
  getJenisItems,
  getKategoriItems,
  Item,
} from "../../database/db2";
import { createStok } from "../../service/Stok";
import { useCurrentUser } from "../../service/useCurrentUser";

// ============================================================
// TYPES
// ============================================================
type ModalType = null | "item" | "stock";

const formatRp = (num: number) => "Rp " + num.toLocaleString("id-ID");

// ============================================================
// ITEM CARD COMPONENT
// ============================================================
interface ItemCardProps {
  item: Item;
  S: any;
  onStockPress: (itemId: number, itemName: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, S, onStockPress }) => {
  const modal = item.harga_modal || 0;
  const jual = item.harga_jual || 0;
  const profit = jual - modal;
  const profitPct = modal > 0 ? Math.round((profit / modal) * 100) : 0;
  const isLowStock = item.quantity < 5;

  return (
    <View style={S.card}>
      {/* ── LEFT COLUMN ── */}
      <View style={S.cardLeft}>
        <Text style={S.cardTitle}>{item.nama}</Text>
        <Text style={S.cardSub}>{item.jenis}</Text>
        <Text style={S.cardSub}>{item.kategori}</Text>
        {item.detail && <Text style={S.cardDesc}>{item.detail}</Text>}
      </View>

      {/* ── RIGHT COLUMN ── */}
      <View style={S.cardRight}>
        {/* Price */}
        <View style={S.priceRow}>
          <Text style={S.priceText}>{formatRp(jual)}</Text>
          <View style={S.priceDot} />
        </View>

        {/* Modal */}
        <Text style={S.modalText}>modal: {formatRp(modal)}</Text>

        {/* Profit */}
        <Text style={S.profitText}>
          +{formatRp(profit)} ({profitPct}%)
        </Text>

        {/* Stock info */}
        <TouchableOpacity
          style={S.stockButton}
          activeOpacity={0.7}
          onPress={() => onStockPress(item.id, item.nama)}
        >
          {isLowStock ? (
            <Text style={S.stockButtonWarningText}>⚠ stok {item.quantity}</Text>
          ) : (
            <Text style={S.stockButtonText}>stok {item.quantity}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================================
// ADD ITEM FORM COMPONENT
// ============================================================
interface AddItemFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { userId, loading: userLoading } = useCurrentUser();
  const [nama, setNama] = useState("");
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [jenis, setJenis] = useState("");
  const [jenisCustom, setJenisCustom] = useState("");
  const [kategori, setKategori] = useState("");
  const [kategoriCustom, setKategoriCustom] = useState("");
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  // Load kategori saat jenis berubah
  useEffect(() => {
    loadJenisList();
  }, []);

  const loadJenisList = () => {
    const jenisData = getJenisItems();
    setJenisList(jenisData);
  };

  const loadKategoriList = (jenisValue: string) => {
    setJenis(jenisValue);
    if (jenisValue && jenisValue !== "__custom__") {
      const katList = getKategoriItems(jenisValue);
      setKategoriList(katList);
      setKategori("");
    } else {
      setKategoriList([]);
      setKategori("");
    }
  };

  const modalNum = parseFloat(hargaModal) || 0;
  const jualNum = parseFloat(hargaJual) || 0;
  const labaNum = jualNum - modalNum;
  const marginPct = modalNum > 0 ? Math.round((labaNum / modalNum) * 100) : 0;
  const jenisAkhir = jenis === "__custom__" ? jenisCustom.trim() : jenis;
  const kategoriAkhir =
    kategori === "__custom__" ? kategoriCustom.trim() : kategori;

  const handleSimpan = () => {
    if (userLoading) {
      return Alert.alert("Mohon tunggu", "Data user sedang dimuat");
    }
    if (userId === null) return Alert.alert("Error", "User belum login");
    if (!nama.trim()) return Alert.alert("Error", "Nama item wajib diisi");
    if (!jenisAkhir) return Alert.alert("Error", "Jenis wajib dipilih");
    if (!kategoriAkhir) return Alert.alert("Error", "Kategori wajib diisi");
    if (!hargaModal || isNaN(modalNum))
      return Alert.alert("Error", "Harga modal tidak valid");
    if (!hargaJual || isNaN(jualNum))
      return Alert.alert("Error", "Harga jual tidak valid");

    try {
      const itemId = createItem(
        nama.trim(),
        jenisAkhir,
        kategoriAkhir,
        detail.trim(),
        modalNum,
        jualNum,
        0,
        userId,
      );

      Alert.alert("Sukses", `Item "${nama}" berhasil ditambahkan`);
      console.log("Item created with ID:", itemId);
      console.log({
        nama: nama.trim(),
        jenis: jenisAkhir,
        kategori: kategoriAkhir,
        detail: detail.trim(),
        harga_modal: modalNum,
        harga_jual: jualNum,
        user_id: userId,
      });
      // Reset form
      handleCancel();
      onSuccess();
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
    setKategoriCustom("");
    setDetail("");
    setHargaModal("");
    setHargaJual("");
    onClose();
  };

  if (!visible) return null;

  return (
    // <SafeAreaView style={S.safeArea}>
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={S.headerForm}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={S.headerFormText}>Tambah Item Baru</Text>

          {/* ── INFORMASI ITEM ── */}
          <Text style={S.headerFormSubtext}>Informasi Item</Text>
          {/* Nama Item */}
          <Text style={S.fieldLabel}>Nama Item</Text>
          <TextInput
            style={S.inputBase}
            value={nama}
            onChangeText={setNama}
            placeholder="contoh: Aqua 600ml"
            placeholderTextColor={C.searchPlaceholder}
            maxLength={100}
          />

          {/* Jenis */}
          <Text style={S.fieldLabel}>Jenis</Text>
          <>
            <View style={S.chipRow}>
              {jenisList.map((j) => (
                <TouchableOpacity
                  key={j}
                  style={[
                    S.chipBase,
                    jenis === j ? S.chipActive : S.chipInactive,
                  ]}
                  onPress={() => loadKategoriList(j)}
                >
                  <Text
                    style={jenis === j ? S.chipTextActive : S.chipTextInactive}
                  >
                    {j}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  S.chipBase,
                  jenis === "__custom__" ? S.chipActive : S.chipInactive,
                ]}
                onPress={() => setJenis("__custom__")}
              >
                <Text
                  style={
                    jenis === "__custom__"
                      ? S.chipTextActive
                      : S.chipTextInactive
                  }
                >
                  + Baru
                </Text>
              </TouchableOpacity>
            </View>

            {jenis === "__custom__" && (
              <TextInput
                style={S.inputBase}
                value={jenisCustom}
                onChangeText={setJenisCustom}
                placeholder="Ketik jenis custom..."
                placeholderTextColor={C.searchPlaceholder}
                autoFocus
              />
            )}
          </>
          {/* Kategori */}
          <Text style={S.fieldLabel}>Kategori</Text>

          {jenisAkhir ? (
            <>
              <View style={S.chipRow}>
                {kategoriList.map((kat) => (
                  <TouchableOpacity
                    key={kat}
                    style={[
                      S.chipBase,
                      kategori === kat ? S.chipActive : S.chipInactive,
                    ]}
                    onPress={() => setKategori(kat)}
                  >
                    <Text
                      style={
                        kategori === kat ? S.chipTextActive : S.chipTextInactive
                      }
                    >
                      {kat}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    S.chipBase,
                    kategori === "__custom__" ? S.chipActive : S.chipInactive,
                  ]}
                  onPress={() => setKategori("__custom__")}
                >
                  <Text
                    style={
                      kategori === "__custom__"
                        ? S.chipTextActive
                        : S.chipTextInactive
                    }
                  >
                    + Baru
                  </Text>
                </TouchableOpacity>
              </View>

              {kategoriList.length === 0 && kategori !== "__custom__" && (
                <Text style={S.helperText}>
                  Belum ada kategori untuk jenis ini. Tambahkan kategori baru.
                </Text>
              )}

              {kategori === "__custom__" && (
                <TextInput
                  style={S.inputBase}
                  value={kategoriCustom}
                  onChangeText={setKategoriCustom}
                  placeholder="Ketik kategori baru..."
                  placeholderTextColor={C.searchPlaceholder}
                  autoFocus
                />
              )}
            </>
          ) : (
            <Text style={S.helperText}>
              Pilih atau buat jenis terlebih dahulu
            </Text>
          )}
          {/* Detail */}
          <Text style={S.fieldLabel}>Detail / Keterangan</Text>
          <TextInput
            style={S.inputBase}
            value={detail}
            onChangeText={setDetail}
            placeholder="ukuran, varian, warna, dll..."
            placeholderTextColor={C.searchPlaceholder}
            multiline
            numberOfLines={3}
          />

          {/* ── HARGA & STOK ── */}
          <Text style={S.fieldLabel}>Harga</Text>

          <View style={S.twoColumnRow}>
            {/* Harga Modal */}
            <View style={S.twoColumnItem}>
              <Text style={S.helperText}>Harga Modal (Rp)</Text>
              <TextInput
                style={S.inputBase}
                value={hargaModal}
                onChangeText={setHargaModal}
                placeholder="0"
                placeholderTextColor={C.searchPlaceholder}
                keyboardType="numeric"
              />
              {hargaModal && (
                <Text style={S.inputSmallHint}>{formatRp(modalNum)}</Text>
              )}
            </View>

            {/* Harga Jual */}
            <View style={S.twoColumnItem}>
              <Text style={S.helperText}>Harga Jual (Rp)</Text>
              <TextInput
                style={S.inputBase}
                value={hargaJual}
                onChangeText={setHargaJual}
                placeholder="0"
                placeholderTextColor={C.searchPlaceholder}
                keyboardType="numeric"
              />
              {hargaJual && (
                <Text style={S.inputSmallHint}>{formatRp(jualNum)}</Text>
              )}
            </View>
          </View>

          {/* ── MARGIN PREVIEW ── */}
          {hargaModal && hargaJual && (
            <View style={S.previewCard}>
              <View style={S.previewRow}>
                <Text style={S.previewLabel}>Laba / Unit</Text>
                <Text style={S.previewValue}>{formatRp(labaNum)}</Text>
              </View>
              <View style={S.previewRow}>
                <Text style={S.previewLabel}>Margin</Text>
                <Text style={S.previewValue}>{marginPct}%</Text>
              </View>
            </View>
          )}

          {/* ── BUTTONS ── */}
          <View style={S.buttonRow}>
            <TouchableOpacity
              style={[S.buttonBase, S.secondaryButton]}
              onPress={handleCancel}
            >
              <Text style={S.secondaryButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.buttonBase, S.primaryButton]}
              onPress={handleSimpan}
            >
              <Text style={S.primaryButtonText}>Simpan Item</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* </SafeAreaView> */}
    </>
  );
};

// ============================================================
// STOCK MODAL COMPONENT
// ============================================================
interface StockModalProps {
  visible: boolean;
  itemId: number | null;
  itemName: string;
  currentStock: number;
  onClose: () => void;
  onSuccess: () => void;
  allItems: Item[];
}

const StockModal: React.FC<StockModalProps> = ({
  visible,
  itemId,
  itemName,
  currentStock,
  onClose,
  onSuccess,
  allItems,
}) => {
  const { userId, loading: userLoading } = useCurrentUser();
  const [addQuantityInput, setAddQuantityInput] = useState("");
  const [hargaBeliStok, setHargaBeliStok] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  const handleAddQuantity = () => {
    if (userLoading) {
      return Alert.alert("Mohon tunggu", "Data user sedang dimuat");
    }

    if (userId === null) {
      return Alert.alert("Error", "User belum login");
    }

    if (!addQuantityInput.trim()) {
      return Alert.alert("Error", "Masukkan jumlah quantity");
    }

    const qty = parseInt(addQuantityInput);
    if (isNaN(qty) || qty <= 0) {
      return Alert.alert("Error", "Jumlah harus lebih dari 0");
    }

    if (itemId === null) return;

    try {
      createStok(
        itemId,
        qty,
        "masuk",
        "Penambahan stok via aplikasi",
        parseFloat(hargaBeliStok) || 0,
        userId,
      );

      Alert.alert(
        "Sukses",
        `Stok "${itemName}" berhasil ditambahkan ${qty} unit`,
      );

      setAddQuantityInput("");
      setHargaBeliStok("");
      onClose();
      onSuccess();
    } catch (error) {
      Alert.alert("Error", "Gagal menambahkan stok");
      console.error(error);
    }
  };

  const handleClose = () => {
    setAddQuantityInput("");
    setHargaBeliStok("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={S.modalOverlay}>
        <View style={S.modalSheet}>
          {/* Header */}
          <Text style={S.modalTitle}>Tambah Stok: {itemName}</Text>

          {/* Current Stock Display */}
          <View
            style={[
              S.infoBox,
              {
                backgroundColor: isDark ? "rgba(76, 175, 80, 0.1)" : "#f0fdf4",
                borderLeftColor: C.profitText,
              },
            ]}
          >
            <Text style={S.infoBoxLabel}>Stok Saat Ini:</Text>
            <Text style={S.infoBoxValue}>{currentStock} unit</Text>
          </View>

          {/* Quantity Input */}
          <Text style={S.stockNormalText}>Jumlah yang ditambahkan *</Text>
          <TextInput
            style={S.inputBase}
            value={addQuantityInput}
            onChangeText={setAddQuantityInput}
            placeholder="Masukkan jumlah"
            placeholderTextColor={C.searchPlaceholder}
            keyboardType="numeric"
            autoFocus
          />

          {/* Price Input */}
          <Text style={S.stockNormalText}>
            Harga Beli (opsional, untuk catatan)
          </Text>
          <TextInput
            style={S.inputBase}
            value={hargaBeliStok}
            onChangeText={setHargaBeliStok}
            placeholder="Masukkan harga beli barang"
            placeholderTextColor={C.searchPlaceholder}
            keyboardType="numeric"
          />

          {/* Buttons */}
          <View style={S.buttonRow}>
            <TouchableOpacity
              style={[S.buttonBase, S.secondaryButton]}
              onPress={handleClose}
            >
              <Text style={S.secondaryButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[S.buttonBase, S.primaryButton]}
              onPress={handleAddQuantity}
            >
              <Text style={S.primaryButtonText}>Tambah Stok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================
// MAIN SCREEN COMPONENT
// ============================================================
export default function BarangScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Modal state: null | 'item' | 'stock'
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  // ── LOAD DATA ──
  useEffect(() => {
    loadItems();
    loadJenis();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
      loadJenis();
    }, []),
  );

  // ── FILTER & SEARCH ──
  useEffect(() => {
    let filtered = items;

    // Filter by jenis
    if (selectedFilter !== "all") {
      filtered = filtered.filter((item) => item.jenis === selectedFilter);
    }

    // Search by name or category
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(query) ||
          item.kategori.toLowerCase().includes(query) ||
          item.jenis.toLowerCase().includes(query),
      );
    }

    setFilteredItems(filtered);
  }, [items, searchQuery, selectedFilter]);

  // ── HANDLERS ──
  const loadItems = () => {
    const data = getAllItems();
    setItems(data);
  };

  const loadJenis = () => {
    const jenis = getJenisItems();
    setJenisList(jenis);
  };

  const openStockModal = (itemId: number, itemName: string) => {
    setEditingItemId(itemId);
    setEditingItemName(itemName);
    setShowModal("stock");
  };

  const closeModal = () => {
    setShowModal(null);
    setEditingItemId(null);
    setEditingItemName("");
  };

  // ============================================================
  // RENDER: MAIN LIST VIEW OR ADD ITEM FORM
  // ============================================================
  if (showModal === "item") {
    return (
      <AddItemForm visible={true} onClose={closeModal} onSuccess={loadItems} />
    );
  }

  // ============================================================
  // ── STRUCTURE YANG LEBIH STABIL
  // ============================================================

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />

      <View style={S.screen}>
        {/* <SafeAreaView style={S.safeArea}> */}
        {/* ── HEADER ───────────────────────────── */}
        <View style={S.header}>
          <Text style={S.headerTitle}>Item</Text>

          <TouchableOpacity
            style={S.addButton}
            activeOpacity={0.8}
            onPress={() => setShowModal("item")}
          >
            <Text style={S.addButtonPlus}>+</Text>
            <Text style={S.addButtonText}>Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* ── SEARCH ───────────────────────────── */}
        <View style={S.searchWrapper}>
          <View style={S.searchBar}>
            <Text style={{ fontSize: 16 }}>🔍</Text>

            <TextInput
              style={S.searchInput}
              placeholder="cari nama, kategori..."
              placeholderTextColor={C.searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* ── FILTER ───────────────────────────── */}
        <View style={S.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={S.filterRow}
          >
            <TouchableOpacity
              style={[
                S.chipBase,
                selectedFilter === "all"
                  ? S.chipFilterActive
                  : S.chipFilterInactive,
              ]}
              activeOpacity={0.8}
              onPress={() => setSelectedFilter("all")}
            >
              <Text
                style={
                  selectedFilter === "all"
                    ? S.chipTextActive
                    : S.chipTextInactive
                }
              >
                Semua
              </Text>
            </TouchableOpacity>

            {jenisList.map((jenis) => (
              <TouchableOpacity
                key={jenis}
                style={[
                  S.chipBase,
                  selectedFilter === jenis
                    ? S.chipFilterActive
                    : S.chipFilterInactive,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter(jenis)}
              >
                <Text
                  style={
                    selectedFilter === jenis
                      ? S.chipTextActive
                      : S.chipTextInactive
                  }
                >
                  {jenis}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── META ───────────────────────────── */}
        <View style={S.metaWrapper}>
          <Text style={S.metaText}>
            {filteredItems.length} item
            {searchQuery ? " (hasil pencarian)" : ""}
          </Text>
        </View>

        {/* ── LIST ───────────────────────────── */}
        {filteredItems.length === 0 ? (
          <View style={S.emptyState}>
            <Text style={S.emptyTitle}>
              {searchQuery || selectedFilter !== "all"
                ? "Tidak ada item"
                : "Belum ada item"}
            </Text>

            <Text style={S.emptyDesc}>
              {searchQuery || selectedFilter !== "all"
                ? "Coba ubah pencarian atau filter"
                : "Klik tombol + Tambah untuk memulai"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ItemCard item={item} S={S} onStockPress={openStockModal} />
            )}
            style={S.list}
            contentContainerStyle={S.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
        {/* </SafeAreaView> */}
      </View>

      {/* ── MODAL ───────────────────────────── */}
      <StockModal
        visible={showModal === "stock"}
        itemId={editingItemId}
        itemName={editingItemName}
        currentStock={items.find((i) => i.id === editingItemId)?.quantity || 0}
        onClose={closeModal}
        onSuccess={loadItems}
        allItems={items}
      />
    </>
  );
}
