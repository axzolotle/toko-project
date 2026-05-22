import { StyleSheet } from "react-native";

// ============================================================
// DESIGN TOKENS — KASIR SCREEN (LIGHT & DARK)
// ============================================================

export const lightColors = {
  // Page & header
  pageBg: "#edf2e6",
  headerBg: "#edf2e6",

  // Header text
  titleText: "#111b0f",
  subtitleText: "#5c7a50",

  // sync
  syncBtnBg: "#ffffff",
  syncBtnBorder: "#d4dece",
  syncDot: "#4caf50",
  syncText: "#111b0f",

  // FAB asterisk button
  fabBg: "#e0e8d8",
  fabText: "#3d5c35",

  // ── STEP INDICATOR ──────────────────────────────────────
  stepActiveBg: "#2e5c27",
  stepActiveText: "#ffffff",
  stepCompletedBg: "#2e5c27",
  stepCompletedMark: "#ffffff",
  stepInactiveBg: "#e0e8d8",
  stepInactiveBorder: "#c4d4b8",
  stepInactiveText: "#8aaa7e",
  stepLineActive: "#2e5c27",
  stepLineInactive: "#c4d4b8",
  stepLabelText: "#8aaa7e",

  // ── SECTION LABEL ───────────────────────────────────────
  sectionLabel: "#6a8c5e",

  // ── BACK NAV ────────────────────────────────────────────
  backNav: "#2e5c27",

  // ── STEP 1: TYPE CARDS ──────────────────────────────────
  typeCardBg: "#ffffff",
  typeCardBorder: "#e6ede0",
  typeIconBg: "#f0f4eb",
  typeTitle: "#111b0f",
  typeCount: "#4a7c3e",

  // ── STEP 2: FILTER CHIPS ────────────────────────────────
  chipActiveBg: "#dde9d4",
  chipActiveBorder: "#2e5c27",
  chipActiveText: "#1a3e14",
  chipDefaultBg: "#ffffff",
  chipDefaultBorder: "#d4dece",
  chipDefaultText: "#3d5436",

  // ── STEP 2: PRODUCT ROWS ────────────────────────────────
  productCardBg: "#ffffff",
  productCardBorder: "#e6ede0",
  productDot: "#7aaa6a",
  productName: "#111b0f",
  productDesc: "#8aaa7e",
  productPrice: "#2e5c27",

  // ── STEP 3: CONFIRM CARD ────────────────────────────────
  confirmCardBg: "#ffffff",
  confirmCardBorder: "#e6ede0",
  confirmDivider: "#edf2e6",
  badgeGreenBg: "#dde9d4",
  badgeGreenText: "#1a3e14",
  badgeNeutralBg: "#edf2e6",
  badgeNeutralText: "#5c7a50",
  confirmName: "#111b0f",
  confirmDesc: "#8aaa7e",
  confirmLabel: "#8aaa7e",
  confirmHarga: "#111b0f",
  confirmModal: "#3d5436",
  confirmLaba: "#2e5c27",

  // ── BOTTOM BUTTONS ───────────────────────────────────────
  btnPrimaryBg: "#2e5c27",
  btnPrimaryText: "#ffffff",
  btnSecondaryBorder: "#c4d4b8",
  btnSecondaryText: "#5c7a50",
};

export const darkColors = {
  // Page & header — very dark forest green
  pageBg: "#0c1a0b",
  headerBg: "#0c1a0b",

  // Header text
  titleText: "#e0eeda",
  subtitleText: "#5a8a50",

  //sync
  syncBtnBg: "#162014",
  syncBtnBorder: "#1e3020",
  syncDot: "#4caf50",
  syncText: "#e0eeda",

  // FAB asterisk button
  fabBg: "#1a2e18",
  fabText: "#5ecb56",

  // ── STEP INDICATOR ──────────────────────────────────────
  stepActiveBg: "#3ecb38", // bright green active in dark
  stepActiveText: "#0c1a0b", // dark text on bright bg
  stepCompletedBg: "#3ecb38",
  stepCompletedMark: "#0c1a0b",
  stepInactiveBg: "#162014",
  stepInactiveBorder: "#243622",
  stepInactiveText: "#4a6444",
  stepLineActive: "#3ecb38",
  stepLineInactive: "#1e3020",
  stepLabelText: "#4a6444",

  // ── SECTION LABEL ───────────────────────────────────────
  sectionLabel: "#4e6c48",

  // ── BACK NAV ────────────────────────────────────────────
  backNav: "#5ecb56",

  // ── STEP 1: TYPE CARDS ──────────────────────────────────
  typeCardBg: "#162014",
  typeCardBorder: "#1e2e1c",
  typeIconBg: "#1a2e18",
  typeTitle: "#e0eeda",
  typeCount: "#4caf50",

  // ── STEP 2: FILTER CHIPS ────────────────────────────────
  chipActiveBg: "#1a3018",
  chipActiveBorder: "#3ecb38",
  chipActiveText: "#3ecb38",
  chipDefaultBg: "#162014",
  chipDefaultBorder: "#1e3020",
  chipDefaultText: "#7aaa6e",

  // ── STEP 2: PRODUCT ROWS ────────────────────────────────
  productCardBg: "#162014",
  productCardBorder: "#1e2e1c",
  productDot: "#4caf50",
  productName: "#e0eeda",
  productDesc: "#4a6444",
  productPrice: "#4caf50",

  // ── STEP 3: CONFIRM CARD ────────────────────────────────
  confirmCardBg: "#162014",
  confirmCardBorder: "#1e2e1c",
  confirmDivider: "#1a2e18",
  badgeGreenBg: "#1a3018",
  badgeGreenText: "#3ecb38",
  badgeNeutralBg: "#1a2a18",
  badgeNeutralText: "#6aaa5e",
  confirmName: "#e0eeda",
  confirmDesc: "#4a6444",
  confirmLabel: "#4a6444",
  confirmHarga: "#e0eeda",
  confirmModal: "#8aaa7e",
  confirmLaba: "#4caf50",

  // ── BOTTOM BUTTONS ───────────────────────────────────────
  btnPrimaryBg: "#3ecb38",
  btnPrimaryText: "#0c1a0b", // dark text on bright green
  btnSecondaryBorder: "#243622",
  btnSecondaryText: "#6aaa5e",
};

// ============================================================
// STYLE FACTORY
// ============================================================
export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    // ── SCREEN ──────────────────────────────────────────
    screen: {
      flex: 1,
      backgroundColor: c.pageBg,
    },
    safeArea: {
      flex: 1,
    },

    // ── HEADER ──────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 8,
      backgroundColor: c.headerBg,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: c.titleText,
      letterSpacing: -0.5,
      lineHeight: 38,
    },
    headerSubtitle: {
      fontSize: 14,
      fontWeight: "400",
      color: c.subtitleText,
      marginTop: 2,
    },

    syncButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.syncBtnBg,
      borderWidth: 1,
      borderColor: c.syncBtnBorder,
    },
    syncDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.syncDot,
    },
    syncText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.syncText,
    },
    fabButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: c.fabBg,
      justifyContent: "center",
      alignItems: "center",
    },
    fabText: {
      fontSize: 20,
      color: c.fabText,
      fontWeight: "300",
    },

    // ── STEP INDICATOR ──────────────────────────────────
    stepRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: c.headerBg,
    },
    circleActive: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.stepActiveBg,
      justifyContent: "center",
      alignItems: "center",
    },
    circleCompleted: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.stepCompletedBg,
      justifyContent: "center",
      alignItems: "center",
    },
    circleInactive: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.stepInactiveBg,
      borderWidth: 1,
      borderColor: c.stepInactiveBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    stepNumActive: {
      fontSize: 15,
      fontWeight: "700",
      color: c.stepActiveText,
    },
    stepNumInactive: {
      fontSize: 15,
      fontWeight: "500",
      color: c.stepInactiveText,
    },
    stepCheck: {
      fontSize: 15,
      fontWeight: "700",
      color: c.stepCompletedMark,
    },
    lineActive: {
      flex: 1,
      height: 2,
      backgroundColor: c.stepLineActive,
      marginHorizontal: 5,
    },
    lineInactive: {
      flex: 1,
      height: 1.5,
      backgroundColor: c.stepLineInactive,
      marginHorizontal: 5,
    },
    stepLabel: {
      fontSize: 12,
      fontWeight: "400",
      color: c.stepLabelText,
      marginLeft: 5,
    },

    // ── SCROLL ──────────────────────────────────────────
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 32,
    },

    // ── SECTION LABEL (Step 1) ───────────────────────────
    sectionLabel: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.2,
      color: c.sectionLabel,
      textTransform: "uppercase",
      marginBottom: 16,
      marginTop: 6,
    },

    // ── STEP 1: TYPE GRID ───────────────────────────────
    typeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      justifyContent: "space-between",
    },
    typeCard: {
      width: "47.5%",
      backgroundColor: c.typeCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.typeCardBorder,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
    typeIconBox: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: c.typeIconBg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 14,
    },
    typeIconEmoji: {
      fontSize: 26,
    },
    typeTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: c.typeTitle,
      marginBottom: 5,
      letterSpacing: -0.2,
    },
    typeCount: {
      fontSize: 13,
      fontWeight: "400",
      color: c.typeCount,
    },

    // ── BACK NAV ────────────────────────────────────────
    backNav: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 16,
      marginTop: 4,
    },
    backArrow: {
      fontSize: 17,
      color: c.backNav,
    },
    backText: {
      fontSize: 15,
      fontWeight: "500",
      color: c.backNav,
    },

    // ── STEP 2: FILTER CHIPS ────────────────────────────
    filterRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
    },
    chipActive: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.chipActiveBg,
      borderWidth: 1.5,
      borderColor: c.chipActiveBorder,
    },
    chipActiveText: {
      fontSize: 13,
      fontWeight: "600",
      color: c.chipActiveText,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: c.chipDefaultBg,
      borderWidth: 1,
      borderColor: c.chipDefaultBorder,
    },
    chipText: {
      fontSize: 13,
      fontWeight: "500",
      color: c.chipDefaultText,
    },

    // ── STEP 2: PRODUCT ROWS ────────────────────────────
    productCard: {
      backgroundColor: c.productCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.productCardBorder,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    productDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: c.productDot,
      marginRight: 14,
      flexShrink: 0,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 15,
      fontWeight: "600",
      color: c.productName,
      letterSpacing: -0.2,
      marginBottom: 3,
    },
    productDesc: {
      fontSize: 12,
      fontWeight: "400",
      color: c.productDesc,
    },
    productPrice: {
      fontSize: 15,
      fontWeight: "700",
      color: c.productPrice,
      letterSpacing: -0.3,
      marginLeft: 10,
    },

    // ── STEP 3: CONFIRM CARD ────────────────────────────
    confirmCard: {
      backgroundColor: c.confirmCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.confirmCardBorder,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
    confirmTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    confirmEmoji: {
      fontSize: 22,
    },
    badgeGreen: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.badgeGreenBg,
    },
    badgeGreenText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.badgeGreenText,
    },
    badgeNeutral: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.badgeNeutralBg,
    },
    badgeNeutralText: {
      fontSize: 12,
      fontWeight: "500",
      color: c.badgeNeutralText,
    },
    confirmName: {
      fontSize: 28,
      fontWeight: "700",
      color: c.confirmName,
      letterSpacing: -0.6,
      marginBottom: 4,
    },
    confirmDesc: {
      fontSize: 14,
      fontWeight: "400",
      color: c.confirmDesc,
      marginBottom: 18,
    },
    confirmDivider: {
      height: 1,
      backgroundColor: c.confirmDivider,
      marginBottom: 16,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    priceLabel: {
      fontSize: 14,
      fontWeight: "400",
      color: c.confirmLabel,
    },
    hargaValue: {
      fontSize: 28,
      fontWeight: "700",
      color: c.confirmHarga,
      letterSpacing: -0.6,
    },
    modalValue: {
      fontSize: 14,
      fontWeight: "500",
      color: c.confirmModal,
    },
    labaValue: {
      fontSize: 14,
      fontWeight: "600",
      color: c.confirmLaba,
    },

    // ── BOTTOM BUTTONS (Step 3) ─────────────────────────
    bottomArea: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 16,
      gap: 10,
      backgroundColor: c.pageBg,
    },
    btnPrimary: {
      height: 52,
      borderRadius: 12,
      backgroundColor: c.btnPrimaryBg,
      justifyContent: "center",
      alignItems: "center",
    },
    btnPrimaryText: {
      fontSize: 15,
      fontWeight: "700",
      color: c.btnPrimaryText,
      letterSpacing: 0.2,
    },
    btnSecondary: {
      height: 52,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.btnSecondaryBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    btnSecondaryText: {
      fontSize: 15,
      fontWeight: "600",
      color: c.btnSecondaryText,
    },

    // ── EMPTY STATE ─────────────────────────────────────
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyStateIcon: {
      fontSize: 32,
      marginBottom: 12,
    },
    emptyStateTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: c.productDesc,
    },
    emptyStateDesc: {
      fontSize: 12,
      color: c.productDesc,
      marginTop: 6,
    },

    // ── INFO BOX (Step 3) ───────────────────────────────
    infoBox: {
      borderLeftWidth: 4,
      borderRadius: 8,
      padding: 14,
      marginBottom: 16,
    },
    infoBoxLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: c.productDesc,
      marginBottom: 4,
    },
    infoBoxValue: {
      fontSize: 18,
      fontWeight: "700",
      color: c.productName,
    },

    // ── QUANTITY INPUT (Step 3) ────────────────────────
    quantityInputWrapper: {
      paddingHorizontal: 20,
      marginTop: 20,
      marginBottom: 16,
    },
    quantityLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: c.confirmLabel,
      marginBottom: 8,
    },
    quantityInput: {
      borderWidth: 1,
      borderColor: c.typeCardBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: c.confirmName,
      backgroundColor: c.typeCardBg,
    },

    // ── TOTAL SUMMARY BOX (Step 3) ──────────────────────
    totalSummaryWrapper: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    totalSummaryBox: {
      backgroundColor: c.typeCardBg,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: c.typeCardBorder,
      padding: 14,
    },
    totalSummaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    totalSummaryRowLast: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    totalSummaryLabel: {
      fontSize: 12,
      color: c.productDesc,
    },
    totalSummaryValue: {
      fontSize: 16,
      fontWeight: "700",
      color: c.confirmLaba,
    },
    totalSummaryProfit: {
      fontSize: 12,
      color: c.confirmLaba,
    },
    totalSummaryProfitValue: {
      fontSize: 14,
      fontWeight: "700",
      color: c.confirmLaba,
    },
    stockAvailableText: {
      fontSize: 12,
      color: c.productDesc,
      marginTop: 12,
    },
  });

// Pre-built exports
export const lightStyles = createStyles(lightColors);
export const darkStyles = createStyles(darkColors);
