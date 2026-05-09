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
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  createItem,
  createKasForItem,
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
type CategoryType = "makanan" | "minuman" | "snack" | "rokok" | "sembako";

// ============================================================
// CONSTANTS
// ============================================================
const JENIS_PRESET = ["Makanan", "Minuman", "Snack", "Rokok", "Sembako"];

const jenisToCategory = (jenis: string): CategoryType => {
  const lower = jenis.toLowerCase();
  if (lower.includes("makanan")) return "makanan";
  if (lower.includes("minuman")) return "minuman";
  if (lower.includes("snack")) return "snack";
  if (lower.includes("rokok")) return "rokok";
  if (lower.includes("sembako")) return "sembako";
  return "makanan";
};

const categoryEmojis: Record<CategoryType, string> = {
  makanan: "🍜",
  minuman: "🥤",
  snack: "🍪",
  rokok: "🚬",
  sembako: "🛒",
};

const categoryLabels: Record<CategoryType, string> = {
  makanan: "Makanan",
  minuman: "Minuman",
  snack: "Snack",
  rokok: "Rokok",
  sembako: "Sembako",
};

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
  const categoryType = jenisToCategory(item.jenis);
  const emoji = categoryEmojis[categoryType];
  const label = categoryLabels[categoryType];

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
        {isLowStock ? (
          <View style={S.stockWarningRow}>
            <Text style={S.stockWarningText}>⚠ stok {item.quantity}</Text>
          </View>
        ) : (
          <Text style={S.stockNormalText}>stok {item.quantity}</Text>
        )}

        <TouchableOpacity
          style={S.stockButton}
          activeOpacity={0.7}
          onPress={() => onStockPress(item.id, item.nama)}
        >
          <Text style={S.stockButtonText}>Stok</Text>
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
  const { userId } = useCurrentUser();
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [jenisCustom, setJenisCustom] = useState("");
  const [kategori, setKategori] = useState("");
  const [detail, setDetail] = useState("");
  const [hargaModal, setHargaModal] = useState("");
  const [hargaJual, setHargaJual] = useState("");

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  const modalNum = parseFloat(hargaModal) || 0;
  const jualNum = parseFloat(hargaJual) || 0;
  const labaNum = jualNum - modalNum;
  const marginPct = modalNum > 0 ? Math.round((labaNum / modalNum) * 100) : 0;
  const jenisAkhir = jenis === "__custom__" ? jenisCustom.trim() : jenis;

  const handleSimpan = () => {
    if (!nama.trim()) return Alert.alert("Error", "Nama item wajib diisi");
    if (!jenisAkhir) return Alert.alert("Error", "Jenis wajib dipilih");
    if (!kategori.trim()) return Alert.alert("Error", "Kategori wajib diisi");
    if (!hargaModal || isNaN(modalNum))
      return Alert.alert("Error", "Harga modal tidak valid");
    if (!hargaJual || isNaN(jualNum))
      return Alert.alert("Error", "Harga jual tidak valid");

    try {
      const itemId = createItem(
        nama.trim(),
        jenisAkhir,
        kategori.trim(),
        detail.trim(),
        modalNum,
        jualNum,
        0,
        userId,
      );

      createKasForItem(itemId, nama.trim(), userId);

      Alert.alert("Sukses", `Item "${nama}" berhasil ditambahkan`);

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
    setDetail("");
    setHargaModal("");
    setHargaJual("");
    onClose();
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: C.pageBg,
            paddingHorizontal: 18,
            paddingTop: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: C.titleText,
              marginBottom: 20,
            }}
          >
            Tambah Item Baru
          </Text>

          {/* ── INFORMASI ITEM ── */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: C.titleText,
              marginBottom: 12,
              marginTop: 8,
            }}
          >
            Informasi Item
          </Text>

          {/* Nama Item */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.cardTitleText,
              marginBottom: 6,
            }}
          >
            Nama Item *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: C.searchBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              marginBottom: 12,
              backgroundColor: C.searchBg,
              color: C.searchText,
            }}
            value={nama}
            onChangeText={setNama}
            placeholder="contoh: Aqua 600ml"
            placeholderTextColor={C.searchPlaceholder}
            maxLength={100}
          />

          {/* Jenis */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.cardTitleText,
              marginBottom: 6,
            }}
          >
            Jenis *
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {JENIS_PRESET.map((j) => (
              <TouchableOpacity
                key={j}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor:
                    jenis === j ? C.chipActiveBorder : C.chipDefaultBorder,
                  backgroundColor:
                    jenis === j ? C.chipActiveBg : C.chipDefaultBg,
                }}
                onPress={() => setJenis(j)}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: jenis === j ? C.chipActiveText : C.cardSubText,
                  }}
                >
                  {j}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor:
                  jenis === "__custom__"
                    ? C.chipActiveBorder
                    : C.chipDefaultBorder,
                backgroundColor:
                  jenis === "__custom__" ? C.chipActiveBg : C.chipDefaultBg,
              }}
              onPress={() => setJenis("__custom__")}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color:
                    jenis === "__custom__" ? C.chipActiveText : C.cardSubText,
                }}
              >
                + Lainnya
              </Text>
            </TouchableOpacity>
          </View>

          {jenis === "__custom__" && (
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: C.searchBorder,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                marginBottom: 12,
                backgroundColor: C.searchBg,
                color: C.searchText,
              }}
              value={jenisCustom}
              onChangeText={setJenisCustom}
              placeholder="Ketik jenis custom..."
              placeholderTextColor={C.searchPlaceholder}
              autoFocus
            />
          )}

          {/* Kategori */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.cardTitleText,
              marginBottom: 6,
            }}
          >
            Kategori *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: C.searchBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              marginBottom: 12,
              backgroundColor: C.searchBg,
              color: C.searchText,
            }}
            value={kategori}
            onChangeText={setKategori}
            placeholder="contoh: Elektronik, Apparel, dll"
            placeholderTextColor={C.searchPlaceholder}
          />

          {/* Detail */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.cardTitleText,
              marginBottom: 6,
            }}
          >
            Detail / Keterangan
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: C.searchBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              marginBottom: 12,
              backgroundColor: C.searchBg,
              color: C.searchText,
              height: 80,
              textAlignVertical: "top",
            }}
            value={detail}
            onChangeText={setDetail}
            placeholder="ukuran, varian, warna, dll..."
            placeholderTextColor={C.searchPlaceholder}
            multiline
            numberOfLines={3}
          />

          {/* ── HARGA & STOK ── */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: C.titleText,
              marginBottom: 12,
              marginTop: 20,
            }}
          >
            Harga & Stok
          </Text>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            {/* Harga Modal */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: C.cardTitleText,
                  marginBottom: 6,
                }}
              >
                Harga Modal (Rp) *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: C.searchBorder,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  backgroundColor: C.searchBg,
                  color: C.searchText,
                }}
                value={hargaModal}
                onChangeText={setHargaModal}
                placeholder="0"
                placeholderTextColor={C.searchPlaceholder}
                keyboardType="numeric"
              />
              {hargaModal && (
                <Text
                  style={{
                    fontSize: 11,
                    color: C.profitText,
                    marginTop: 4,
                    fontWeight: "500",
                  }}
                >
                  {formatRp(modalNum)}
                </Text>
              )}
            </View>

            {/* Harga Jual */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: C.cardTitleText,
                  marginBottom: 6,
                }}
              >
                Harga Jual (Rp) *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: C.searchBorder,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  backgroundColor: C.searchBg,
                  color: C.searchText,
                }}
                value={hargaJual}
                onChangeText={setHargaJual}
                placeholder="0"
                placeholderTextColor={C.searchPlaceholder}
                keyboardType="numeric"
              />
              {hargaJual && (
                <Text
                  style={{
                    fontSize: 11,
                    color: C.profitText,
                    marginTop: 4,
                    fontWeight: "500",
                  }}
                >
                  {formatRp(jualNum)}
                </Text>
              )}
            </View>
          </View>

          {/* ── MARGIN PREVIEW ── */}
          {hargaModal && hargaJual && (
            <View
              style={{
                backgroundColor: isDark ? "rgba(76, 175, 80, 0.1)" : "#f0fdf4",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                borderLeftWidth: 4,
                borderLeftColor: C.profitText,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 12, color: C.cardDescText }}>
                  Laba / Unit
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: C.profitText,
                  }}
                >
                  {formatRp(labaNum)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 12, color: C.cardDescText }}>
                  Margin
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: C.profitText,
                  }}
                >
                  {marginPct}%
                </Text>
              </View>
            </View>
          )}

          {/* ── BUTTONS ── */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 20,
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: C.chipDefaultBg,
                borderWidth: 1,
                borderColor: C.searchBorder,
              }}
              onPress={handleCancel}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: C.cardSubText,
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: C.addBtnBg,
              }}
              onPress={handleSimpan}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: C.addBtnText,
                }}
              >
                Simpan Item
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  const { userId } = useCurrentUser();
  const [addQuantityInput, setAddQuantityInput] = useState("");
  const [hargaBeliStok, setHargaBeliStok] = useState("");

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const C = isDark ? darkColors : lightColors;

  const handleAddQuantity = () => {
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
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: C.cardBg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
            paddingBottom: 30,
          }}
        >
          {/* Header */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: C.cardTitleText,
              marginBottom: 16,
            }}
          >
            Tambah Stok: {itemName}
          </Text>

          {/* Current Stock Display */}
          <View
            style={{
              backgroundColor: isDark ? "rgba(76, 175, 80, 0.1)" : "#f0fdf4",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderLeftWidth: 4,
              borderLeftColor: C.profitText,
            }}
          >
            <Text style={{ fontSize: 12, color: C.cardDescText }}>
              Stok Saat Ini:
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: C.profitText,
              }}
            >
              {currentStock} unit
            </Text>
          </View>

          {/* Quantity Input */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: C.cardTitleText,
              marginBottom: 6,
            }}
          >
            Jumlah yang ditambahkan *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: C.searchBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              marginBottom: 12,
              backgroundColor: C.searchBg,
              color: C.searchText,
            }}
            value={addQuantityInput}
            onChangeText={setAddQuantityInput}
            placeholder="Masukkan jumlah"
            placeholderTextColor={C.searchPlaceholder}
            keyboardType="numeric"
            autoFocus
          />

          {/* Price Input */}
          <Text
            style={{
              fontSize: 12,
              color: C.cardDescText,
              marginBottom: 6,
            }}
          >
            Harga Beli (opsional, untuk catatan)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: C.searchBorder,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              marginBottom: 16,
              backgroundColor: C.searchBg,
              color: C.searchText,
            }}
            value={hargaBeliStok}
            onChangeText={setHargaBeliStok}
            placeholder="Masukkan harga beli barang"
            placeholderTextColor={C.searchPlaceholder}
            keyboardType="numeric"
          />

          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: C.chipDefaultBg,
                borderWidth: 1,
                borderColor: C.searchBorder,
              }}
              onPress={handleClose}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: C.cardSubText,
                }}
              >
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                alignItems: "center",
                backgroundColor: C.addBtnBg,
              }}
              onPress={handleAddQuantity}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: C.addBtnText,
                }}
              >
                Tambah Stok
              </Text>
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
  const { userId } = useCurrentUser();
  const [items, setItems] = useState<Item[]>([]);
  const [jenisList, setJenisList] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Modal state: null | 'item' | 'stock'
  const [showModal, setShowModal] = useState<ModalType>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
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

          {/* ── SEARCH ── */}
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

          {/* ── FILTER CHIPS ── */}
          <View style={S.filterWrapper}>
            <View style={S.filterRow}>
              {/* "Semua" chip */}
              <TouchableOpacity
                style={S.chipActive}
                activeOpacity={0.8}
                onPress={() => setSelectedFilter("all")}
              >
                <Text
                  style={
                    selectedFilter === "all"
                      ? S.chipActiveText
                      : {
                          color: C.cardSubText,
                          fontSize: 13,
                          fontWeight: "600",
                        }
                  }
                >
                  Semua
                </Text>
              </TouchableOpacity>

              {/* Jenis chips */}
              {jenisList.map((jenis) => (
                <TouchableOpacity
                  key={jenis}
                  style={
                    selectedFilter === jenis
                      ? S.chipActive
                      : {
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 6,
                          borderWidth: 1.5,
                          borderColor: C.chipDefaultBorder,
                          backgroundColor: C.chipDefaultBg,
                        }
                  }
                  activeOpacity={0.7}
                  onPress={() => setSelectedFilter(jenis)}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color:
                        selectedFilter === jenis
                          ? C.chipActiveText
                          : C.cardSubText,
                    }}
                  >
                    {jenis}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── META COUNT ── */}
          <View style={S.metaWrapper}>
            <Text style={S.metaText}>
              {filteredItems.length} item
              {searchQuery && ` (hasil pencarian)`}
            </Text>
          </View>

          {/* ── LIST ── */}
          {filteredItems.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: C.cardSubText,
                  fontWeight: "600",
                }}
              >
                {searchQuery || selectedFilter !== "all"
                  ? "Tidak ada item"
                  : "Belum ada item"}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: C.cardDescText,
                  marginTop: 4,
                }}
              >
                {searchQuery || selectedFilter !== "all"
                  ? "Coba ubah pencarian atau filter"
                  : "Klik tombol + Tambah untuk memulai"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={S.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <ItemCard item={item} S={S} onStockPress={openStockModal} />
              )}
            />
          )}
        </SafeAreaView>
      </View>

      {/* ── STOCK MODAL ── */}
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
