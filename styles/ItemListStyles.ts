import { StyleSheet } from "react-native";

// DESIGN TOKENS — ITEM LIST SCREEN

export const lightColors = {
  // Page / header bg
  pageBg: "#eef3e5",
  headerBg: "#eef3e5",

  // Title
  titleText: "#111b0f",

  // "+ Tambah" pill button
  addBtnBg: "#2e5c27",
  addBtnText: "#ffffff",

  // Search bar
  searchBg: "#ffffff",
  searchBorder: "#e0e8d6",
  searchIcon: "#9aaa8c",
  searchPlaceholder: "#9aaa8c",
  searchText: "#111b0f",

  // Filter chips
  chipActiveBg: "#ffffff",
  chipActiveBorder: "#2e5c27",
  chipActiveText: "#2e5c27",
  chipDefaultBg: "#ffffff",
  chipDefaultBorder: "#dce5d2",
  chipDefaultText: "#6b7c61",

  // Meta count "12 item terdaftar"
  metaText: "#7a8c6e",

  // Card surface
  cardBg: "#ffffff",
  cardBorder: "#edf3e6",
  cardShadowColor: "#1a2a16",

  // Card typography
  cardTitleText: "#111b0f",
  cardSubText: "#9aaa8c",
  cardDescText: "#9aaa8c",

  // Price column
  priceText: "#111b0f",
  priceDot: "#4caf50",
  modalText: "#9aaa8c",
  profitText: "#2e7d32",

  // Stock
  stockWarningText: "#c62828",
  stockNormalText: "#6b7c61",
  stockBtnBorder: "#c8d4be",
  stockBtnText: "#6b7c61",
  stockBtnBg: "#ffffff",

  // Category badge tints
  badgeFisikBg: "#fde8d4",
  badgeFisikText: "#c04800",
  badgeVoucherBg: "#fdf5dc",
  badgeVoucherText: "#a06800",
  badgeDigitalBg: "#e4ede0",
  badgeDigitalText: "#2d6224",
  badgeTransferBg: "#ece8fc",
  badgeTransferText: "#5236b4",
};

export const darkColors = {
  pageBg: "#0c1a0b",
  headerBg: "#0c1a0b",

  titleText: "#e0eeda",

  addBtnBg: "#3ecb38",
  addBtnText: "#0c1a0b",

  searchBg: "#162014",
  searchBorder: "#1e3020",
  searchIcon: "#3e5c3a",
  searchPlaceholder: "#3e5c3a",
  searchText: "#c8dec2",

  chipActiveBg: "#1a2e18",
  chipActiveBorder: "#3ecb38",
  chipActiveText: "#3ecb38",
  chipDefaultBg: "#162014",
  chipDefaultBorder: "#1e3020",
  chipDefaultText: "#8aaa82",

  metaText: "#3e5c3a",

  cardBg: "#162014",
  cardBorder: "#1e2e1c",
  cardShadowColor: "#000000",

  cardTitleText: "#e0eeda",
  cardSubText: "#4a6044",
  cardDescText: "#4a6044",

  priceText: "#e0eeda",
  priceDot: "#4caf50",
  modalText: "#4a6044",
  profitText: "#4caf50",

  stockWarningText: "#f44336",
  stockNormalText: "#8aaa82",
  stockBtnBorder: "#243622",
  stockBtnText: "#8aaa82",
  stockBtnBg: "#1a2a18",

  badgeFisikBg: "#3a1808",
  badgeFisikText: "#f4956a",
  badgeVoucherBg: "#3a2c08",
  badgeVoucherText: "#f0c040",
  badgeDigitalBg: "#122a10",
  badgeDigitalText: "#5ecf56",
  badgeTransferBg: "#1c1440",
  badgeTransferText: "#a48ef4",
};

// ======================================================
// STYLE FACTORY
// ============================================================
export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    //? ITEM LIST ── SCREEN ───────────────────────────────────────────
    screen: {
      flex: 1,
      backgroundColor: c.pageBg,
      // backgroundColor: c.badgeTransferText,
    },
    safeArea: {
      flex: 1,
    },

    //? ITEM LIST ── HEADER ROW ───────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 12,
      backgroundColor: c.headerBg,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "700",
      color: c.titleText,
      letterSpacing: -0.5,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.addBtnBg,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 20,
      gap: 4,
    },
    addButtonPlus: {
      fontSize: 15,
      fontWeight: "400",
      color: c.addBtnText,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.addBtnText,
      letterSpacing: 0.1,
    },

    //? ADD ITEM FORM ── HEADER ───────────────────────────────────────
    headerForm: {
      flex: 1,
      backgroundColor: c.pageBg,
      paddingHorizontal: 18,
      paddingTop: 16,
    },
    headerFormText: {
      fontSize: 24,
      fontWeight: "700",
      color: c.titleText,
      marginBottom: 20,
    },
    headerFormSubtext: {
      fontSize: 14,
      fontWeight: "bold",
      color: c.titleText,
      marginBottom: 12,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: c.titleText,
      marginBottom: 12,
      marginTop: 20,
    },

    //? REUSABLE ── LABEL / INPUT ───────────────────────────────────────
    fieldLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: c.cardTitleText,
      marginBottom: 6,
    },
    inputBase: {
      borderWidth: 1,
      borderColor: c.searchBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      marginBottom: 12,
      backgroundColor: c.searchBg,
      color: c.searchText,
    },
    inputMultiline: {
      height: 80,
      textAlignVertical: "top",
    },
    inputSmallHint: {
      fontSize: 11,
      color: c.profitText,
      marginTop: 4,
      fontWeight: "500",
    },
    helperText: {
      fontSize: 12,
      color: c.cardDescText,
      marginBottom: 12,
      fontStyle: "italic",
    },

    //? REUSABLE ── CHIP / TAG ───────────────────────────────────────
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },
    chipBase: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      borderWidth: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    chipActive: {
      borderColor: c.chipActiveBorder,
      backgroundColor: c.chipActiveBg,
    },
    chipInactive: {
      borderColor: c.chipDefaultBorder,
      backgroundColor: c.chipDefaultBg,
    },
    chipTextActive: {
      fontSize: 12,
      fontWeight: "600",
      color: c.chipActiveText,
    },
    chipTextInactive: {
      fontSize: 12,
      fontWeight: "600",
      color: c.chipDefaultText,
    },

    // dipakai untuk filter bar
    chipFilterActive: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.chipActiveBg,
      borderWidth: 1.5,
      borderColor: c.chipActiveBorder,
    },
    chipFilterInactive: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.chipDefaultBg,
      borderWidth: 1.5,
      borderColor: c.chipDefaultBorder,
    },

    // dipakai kalau nanti kamu mau icon chip
    chipIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.chipDefaultBg,
      borderWidth: 1,
      borderColor: c.chipDefaultBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    chipIconEmoji: {
      fontSize: 16,
    },

    //? REUSABLE -- BUTTON ───────────────────────────────────────
    buttonRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 20,
      marginBottom: 30,
    },
    buttonBase: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    secondaryButton: {
      backgroundColor: c.chipDefaultBg,
      borderWidth: 1,
      borderColor: c.searchBorder,
    },
    primaryButton: {
      backgroundColor: c.addBtnBg,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.cardSubText,
    },
    primaryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.addBtnText,
    },

    //? ADD ITEM FORM ── TWO COLUMN ───────────────────────────────────────
    twoColumnRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },
    twoColumnItem: {
      flex: 1,
    },

    //? ADD ITEM FORM ── MARGIN PREVIEW ───────────────────────────────────────
    previewCard: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderLeftWidth: 4,
    },
    previewRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    previewLabel: {
      fontSize: 12,
      color: c.cardDescText,
    },
    previewValue: {
      fontSize: 12,
      fontWeight: "bold",
      color: c.profitText,
    },

    //? ADD ITEM FORM ── CATEGORY REVIEW ───────────────────────────────────────
    categoryInfoText: {
      fontSize: 12,
      color: c.cardDescText,
      marginBottom: 12,
      fontStyle: "italic",
    },

    //? STOCK MODAL -- SHEET ───────────────────────────────────────
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: c.cardBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 20,
      paddingBottom: 30,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: c.cardTitleText,
      marginBottom: 16,
    },

    //? STOCK MODAL — INFO BOX

    infoBox: {
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderLeftWidth: 4,
    },
    infoBoxLabel: {
      fontSize: 12,
      color: c.cardDescText,
    },
    infoBoxValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: c.profitText,
    },

    //? ITEM CARD — LIST ITEM
    card: {
      flexDirection: "row",
      justifyContent: "space-between",

      backgroundColor: c.cardBg,
      borderRadius: 16,

      borderWidth: 1,
      borderColor: c.cardBorder,

      paddingHorizontal: 16,
      paddingVertical: 14,

      marginBottom: 12,

      shadowColor: c.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },

    cardLeft: {
      flex: 1,
      paddingRight: 12,
    },

    cardRight: {
      width: 130,
      alignItems: "flex-end",
      justifyContent: "flex-start",
    },

    cardTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: c.cardTitleText,
      marginBottom: 4,
    },

    cardSub: {
      fontSize: 12,
      color: c.cardSubText,
      marginBottom: 2,
    },

    cardDesc: {
      fontSize: 12,
      color: c.cardDescText,
      marginTop: 2,
    },

    priceRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    priceText: {
      fontSize: 18,
      fontWeight: "700",
      color: c.priceText,
    },

    priceDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: c.priceDot,
      marginLeft: 5,
    },

    modalText: {
      fontSize: 12,
      color: c.modalText,
      marginTop: 4,
    },

    profitText: {
      fontSize: 12,
      fontWeight: "700",
      color: c.profitText,
      marginTop: 2,
    },

    stockNormalText: {
      fontSize: 12,
      color: c.stockNormalText,
      marginTop: 8,
    },

    stockButton: {
      marginTop: 10,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.stockBtnBorder,
      backgroundColor: c.stockBtnBg,
    },

    stockWarningText: {
      fontSize: 12,
      fontWeight: "700",
      color: c.stockWarningText,
    },

    stockButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.stockBtnText,
    },

    //? ITEM LIST — SEARCH / FILTER / META / EMPTY

    searchWrapper: {
      paddingHorizontal: 18,
      paddingBottom: 10,
      backgroundColor: c.headerBg,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.searchBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.searchBorder,
      paddingHorizontal: 13,
      height: 46,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: c.searchText,
      padding: 0,
    },
    filterContainer: {
      paddingHorizontal: 18,
      paddingBottom: 14,
      backgroundColor: c.headerBg,
    },
    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      height: 36,
    },
    metaWrapper: {
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    metaText: {
      fontSize: 13,
      fontWeight: "400",
      color: c.metaText,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: 18,
      paddingTop: 4,
      paddingBottom: 24,
    },
    emptyTitle: {
      fontSize: 16,
      color: c.cardSubText,
      fontWeight: "600",
    },
    emptyDesc: {
      fontSize: 12,
      color: c.cardDescText,
      marginTop: 4,
    },

    // EMPTY
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 30,
    },

    // Category badge color pairs (bg + text combined per category)
    badgeFisik: { backgroundColor: c.badgeFisikBg },
    badgeFisikLabel: { color: c.badgeFisikText },
    badgeVoucher: { backgroundColor: c.badgeVoucherBg },
    badgeVoucherLabel: { color: c.badgeVoucherText },
    badgeDigital: { backgroundColor: c.badgeDigitalBg },
    badgeDigitalLabel: { color: c.badgeDigitalText },
    badgeTransfer: { backgroundColor: c.badgeTransferBg },
    badgeTransferLabel: { color: c.badgeTransferText },
  });

export const lightStyles = createStyles(lightColors);
export const darkStyles = createStyles(darkColors);
