import { StyleSheet } from "react-native";

// ============================================================
// DESIGN TOKENS — KEUANGAN SCREEN (LIGHT & DARK)
// ============================================================

export const lightColors = {
  pageBg: "#eef3e5",
  headerBg: "#eef3e5",
  titleText: "#111b0f",

  // "+ Catat" button
  catatBtnBg: "#2e5c27",
  catatBtnText: "#ffffff",

  // Internal tab bar (Master Kas / Rekap Harian / Histori)
  tabBarBg: "#eef3e5",
  tabBarBorder: "#e2ead8",
  tabActiveText: "#111b0f",
  tabActiveLine: "#2e5c27",
  tabInactive: "#9aaa8c",

  // ── MASTER KAS HERO CARD ──
  mkCardBg: "#2a5425", // dark forest green
  mkCardBg2: "#1e4019", // darker shade for gradient feel
  mkLabel: "#8ec87e",
  mkAmount: "#ffffff",
  mkSubtitle: "#a0cc90",
  mkDateBadgeBg: "#1a3a16",
  mkDateText: "#c0e0b0",
  mkSelisihBg: "#f5c842",
  mkSelisihText: "#5a3a00",

  // ── SUB SALDO CARDS (Cash / E-wallet / Bank / Total CS) ──
  subCardBg: "#ffffff",
  subCardBorder: "#e2ead8",
  subLabel: "#6a8c5e",
  subValueGreen: "#1a7a30",
  subValueBlue: "#1a5ab8",
  subDesc: "#8aaa7e",

  // ── SELISIH ALERT CARD ──
  selisihCardBg: "#fff5f5",
  selisihCardBorder: "#f5c0c0",
  selisihTitle: "#c0302a",
  selisihAmount: "#c0302a",
  selisihDesc: "#7a4040",

  // ── MODAL FISIK SECTION ──
  mfSectionLabel: "#7a9a6e",
  mfItemName: "#111b0f",
  mfItemDesc: "#8aaa7e",
  mfItemValue: "#c05820", // orange-brown
  mfTotal: "#c05820",
  mfTotalLabel: "#8aaa7e",
  mfDivider: "#e8ede2",

  // ── ACTION BUTTONS ──
  btnSaldoBg: "#2e5c27",
  btnSaldoText: "#ffffff",
  btnKerugianBg: "#fff0f0",
  btnKerugianBorder: "#f0b0b0",
  btnKerugianText: "#c0302a",
  btnOutlineBg: "#ffffff",
  btnOutlineBorder: "#d4dece",
  btnOutlineText: "#3d5436",

  // ── REKAP HARIAN ──
  rekapCardBg: "#ffffff",
  rekapCardBorder: "#e2ead8",
  rekapBelumDikunci: "#f59e0b",
  rekapLabel: "#6a8c5e",
  rekapValueDark: "#111b0f",
  rekapValueGreen: "#1a7a30",
  rekapValueRed: "#c0302a",
  rekapFormula: "#9aaa8c",
  rekapDivider: "#e8ede2",

  // ── PENJUALAN / STOK ITEMS ──
  pjItemBg: "#ffffff",
  pjItemBorder: "#e2ead8",
  pjItemName: "#111b0f",
  pjItemDesc: "#8aaa7e",
  pjItemPrice: "#111b0f",
  pjItemProfit: "#1a7a30",
  pjStokValue: "#c05820",
  pjSectionLabel: "#7a9a6e",
  pjLihatSemua: "#2e7d32",
  pjKeluar: "#c05820",

  // ── REKAP BIG BUTTON ──
  btnKunciLockBg: "#2e5c27",
  btnKunciLockText: "#ffffff",

  // ── HISTORI FILTERS ──
  histFilterActiveBg: "#ffffff",
  histFilterActiveBorder: "#2e5c27",
  histFilterActiveText: "#1a3e14",
  histFilterDefaultBg: "#ffffff",
  histFilterDefaultBorder: "#d4dece",
  histFilterDefaultText: "#3d5436",
  histFilterRedBg: "#fff0f0",
  histFilterRedBorder: "#f5c0c0",
  histFilterRedText: "#c0302a",

  // ── HISTORI GROUP ──
  histGroupLabel: "#7a9a6e",
  histGroupTerkunci: "#4caf50",
  histItemBg: "#ffffff",
  histItemBorder: "#e2ead8",
  histItemName: "#111b0f",
  histItemDesc: "#8aaa7e",
  histItemTime: "#8aaa7e",
  histValueGreen: "#1a7a30",
  histValueRed: "#c0302a",

  // ── INTERPRETASI SELISIH CARD ──
  interpCardBg: "#fff5f0",
  interpCardBorder: "#f5c0a0",
  interpTitle: "#c05820",
  interpBody: "#7a4030",

  // Bottom nav
  navBg: "#ffffff",
  navBorder: "#e2ead8",
  navActive: "#2e5c27",
  navInactive: "#9aaa8c",
};

export const darkColors: typeof lightColors = {
  pageBg: "#0d1a0c",
  headerBg: "#0d1a0c",
  titleText: "#e0eeda",

  catatBtnBg: "#3ecb38",
  catatBtnText: "#0d1a0c",

  tabBarBg: "#0d1a0c",
  tabBarBorder: "#1a2e18",
  tabActiveText: "#e0eeda",
  tabActiveLine: "#4caf50",
  tabInactive: "#3e5c3a",

  mkCardBg: "#1a3018",
  mkCardBg2: "#122610",
  mkLabel: "#5a8a50",
  mkAmount: "#e0eeda",
  mkSubtitle: "#6aaa5e",
  mkDateBadgeBg: "#0e2010",
  mkDateText: "#8aaa7e",
  mkSelisihBg: "#c09020",
  mkSelisihText: "#0d1a0c",

  subCardBg: "#162014",
  subCardBorder: "#1e2e1c",
  subLabel: "#4a6444",
  subValueGreen: "#4caf50",
  subValueBlue: "#6090d8",
  subDesc: "#4a6444",

  selisihCardBg: "#2a1010",
  selisihCardBorder: "#5a2020",
  selisihTitle: "#f08080",
  selisihAmount: "#f08080",
  selisihDesc: "#a06060",

  mfSectionLabel: "#3e5c3a",
  mfItemName: "#e0eeda",
  mfItemDesc: "#4a6444",
  mfItemValue: "#e09040",
  mfTotal: "#e09040",
  mfTotalLabel: "#4a6444",
  mfDivider: "#1a2e18",

  btnSaldoBg: "#3ecb38",
  btnSaldoText: "#0d1a0c",
  btnKerugianBg: "#2a1010",
  btnKerugianBorder: "#5a2020",
  btnKerugianText: "#f08080",
  btnOutlineBg: "#162014",
  btnOutlineBorder: "#1e3020",
  btnOutlineText: "#8aaa7e",

  rekapCardBg: "#162014",
  rekapCardBorder: "#1e2e1c",
  rekapBelumDikunci: "#f59e0b",
  rekapLabel: "#4a6444",
  rekapValueDark: "#e0eeda",
  rekapValueGreen: "#4caf50",
  rekapValueRed: "#f08080",
  rekapFormula: "#3e5c3a",
  rekapDivider: "#1a2e18",

  pjItemBg: "#162014",
  pjItemBorder: "#1e2e1c",
  pjItemName: "#e0eeda",
  pjItemDesc: "#4a6444",
  pjItemPrice: "#e0eeda",
  pjItemProfit: "#4caf50",
  pjStokValue: "#e09040",
  pjSectionLabel: "#3e5c3a",
  pjLihatSemua: "#4caf50",
  pjKeluar: "#e09040",

  btnKunciLockBg: "#3ecb38",
  btnKunciLockText: "#0d1a0c",

  histFilterActiveBg: "#1a3018",
  histFilterActiveBorder: "#4caf50",
  histFilterActiveText: "#4caf50",
  histFilterDefaultBg: "#162014",
  histFilterDefaultBorder: "#1e3020",
  histFilterDefaultText: "#8aaa7e",
  histFilterRedBg: "#2a1010",
  histFilterRedBorder: "#5a2020",
  histFilterRedText: "#f08080",

  histGroupLabel: "#3e5c3a",
  histGroupTerkunci: "#4caf50",
  histItemBg: "#162014",
  histItemBorder: "#1e2e1c",
  histItemName: "#e0eeda",
  histItemDesc: "#4a6444",
  histItemTime: "#3e5c3a",
  histValueGreen: "#4caf50",
  histValueRed: "#f08080",

  interpCardBg: "#2a1808",
  interpCardBorder: "#5a3018",
  interpTitle: "#e09040",
  interpBody: "#a07060",

  navBg: "#0d1a0c",
  navBorder: "#1a2e18",
  navActive: "#4caf50",
  navInactive: "#3e5c3a",
};

// ============================================================
// STYLE FACTORY
// ============================================================
export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.pageBg },
    safeArea: { flex: 1 },

    // ── HEADER ────────────────────────────────────────────
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 10,
      backgroundColor: c.headerBg,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "700",
      color: c.titleText,
      letterSpacing: -0.5,
    },
    catatButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: c.catatBtnBg,
    },
    catatButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.catatBtnText,
    },

    // ── INTERNAL TAB BAR ──────────────────────────────────
    internalTabBar: {
      flexDirection: "row",
      backgroundColor: c.tabBarBg,
      borderBottomWidth: 1,
      borderBottomColor: c.tabBarBorder,
      paddingHorizontal: 18,
    },
    internalTabItem: {
      paddingVertical: 12,
      marginRight: 24,
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    internalTabItemActive: {
      borderBottomColor: c.tabActiveLine,
    },
    internalTabText: {
      fontSize: 14,
      fontWeight: "500",
      color: c.tabInactive,
    },
    internalTabTextActive: {
      color: c.tabActiveText,
      fontWeight: "600",
    },

    // ── SCROLL ────────────────────────────────────────────
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 100,
      paddingTop: 14,
    },

    // ── MASTER KAS HERO CARD ──────────────────────────────
    mkCard: {
      backgroundColor: c.mkCardBg,
      borderRadius: 16,
      padding: 18,
      marginBottom: 14,
      overflow: "hidden",
    },
    mkLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1,
      color: c.mkLabel,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    mkAmount: {
      fontSize: 34,
      fontWeight: "700",
      color: c.mkAmount,
      letterSpacing: -1,
      marginBottom: 4,
    },
    mkSubtitle: {
      fontSize: 13,
      color: c.mkSubtitle,
      marginBottom: 14,
    },
    mkBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    mkDateBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.mkDateBadgeBg,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
      gap: 5,
    },
    mkDateText: {
      fontSize: 12,
      fontWeight: "500",
      color: c.mkDateText,
    },
    mkSelisihBadge: {
      backgroundColor: c.mkSelisihBg,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    mkSelisihText: {
      fontSize: 12,
      fontWeight: "700",
      color: c.mkSelisihText,
    },

    // ── SUB SALDO CARDS (2×2 grid) ────────────────────────
    subCardGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 14,
    },
    subCard: {
      width: "47.5%",
      backgroundColor: c.subCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.subCardBorder,
      padding: 14,
    },
    subCardLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: c.subLabel,
      marginBottom: 8,
    },
    subCardValueGreen: {
      fontSize: 20,
      fontWeight: "700",
      color: c.subValueGreen,
      letterSpacing: -0.4,
      marginBottom: 3,
    },
    subCardValueBlue: {
      fontSize: 20,
      fontWeight: "700",
      color: c.subValueBlue,
      letterSpacing: -0.4,
      marginBottom: 3,
    },
    subCardDesc: {
      fontSize: 12,
      color: c.subDesc,
    },

    // ── SELISIH ALERT ─────────────────────────────────────
    selisihCard: {
      backgroundColor: c.selisihCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.selisihCardBorder,
      padding: 14,
      marginBottom: 14,
    },
    selisihTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 6,
    },
    selisihTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: c.selisihTitle,
    },
    selisihAmount: {
      fontSize: 18,
      fontWeight: "700",
      color: c.selisihAmount,
    },
    selisihDesc: {
      fontSize: 12,
      color: c.selisihDesc,
      lineHeight: 18,
    },

    // ── MODAL FISIK SECTION ───────────────────────────────
    mfSection: {
      backgroundColor: c.subCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.subCardBorder,
      marginBottom: 14,
      overflow: "hidden",
    },
    mfHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 10,
    },
    mfHeaderLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1,
      color: c.mfSectionLabel,
      textTransform: "uppercase",
    },
    mfTambahBtn: {
      fontSize: 13,
      fontWeight: "600",
      color: c.subValueGreen,
    },
    mfItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderTopWidth: 1,
      borderTopColor: c.mfDivider,
    },
    mfItemEmoji: { fontSize: 20, marginRight: 12 },
    mfItemInfo: { flex: 1 },
    mfItemName: {
      fontSize: 14,
      fontWeight: "600",
      color: c.mfItemName,
      marginBottom: 2,
    },
    mfItemDesc: { fontSize: 12, color: c.mfItemDesc },
    mfItemValue: {
      fontSize: 14,
      fontWeight: "700",
      color: c.mfItemValue,
    },
    mfTotalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderTopWidth: 1,
      borderTopColor: c.mfDivider,
    },
    mfTotalLabel: { fontSize: 13, color: c.mfTotalLabel },
    mfTotalValue: {
      fontSize: 13,
      fontWeight: "700",
      color: c.mfTotal,
    },

    // ── ACTION BUTTONS (2×2) ──────────────────────────────
    actionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    btnSaldo: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      backgroundColor: c.btnSaldoBg,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    btnSaldoText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.btnSaldoText,
    },
    btnKerugian: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      backgroundColor: c.btnKerugianBg,
      borderWidth: 1,
      borderColor: c.btnKerugianBorder,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    btnKerugianText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.btnKerugianText,
    },
    btnOutline: {
      flex: 1,
      height: 48,
      borderRadius: 10,
      backgroundColor: c.btnOutlineBg,
      borderWidth: 1,
      borderColor: c.btnOutlineBorder,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    btnOutlineText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.btnOutlineText,
    },

    // ── REKAP HARIAN ──────────────────────────────────────
    dateNav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: c.rekapCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.rekapCardBorder,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 12,
    },
    dateArrow: { fontSize: 18, color: c.rekapLabel, paddingHorizontal: 4 },
    dateTitleText: {
      fontSize: 15,
      fontWeight: "600",
      color: c.rekapValueDark,
      letterSpacing: -0.2,
    },
    dateSubText: {
      fontSize: 12,
      color: c.rekapValueGreen,
      textAlign: "center",
      marginTop: 2,
    },
    rekapCard: {
      backgroundColor: c.rekapCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.rekapCardBorder,
      padding: 16,
      marginBottom: 12,
    },
    rekapTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    rekapTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: c.rekapValueDark,
    },
    rekapBelumDikunci: {
      fontSize: 12,
      fontWeight: "500",
      color: c.rekapBelumDikunci,
    },
    rekapRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    rekapLabel: {
      fontSize: 14,
      color: c.rekapLabel,
    },
    rekapValDark: {
      fontSize: 14,
      fontWeight: "600",
      color: c.rekapValueDark,
    },
    rekapValGreen: {
      fontSize: 14,
      fontWeight: "600",
      color: c.rekapValueGreen,
    },
    rekapValRed: {
      fontSize: 14,
      fontWeight: "600",
      color: c.rekapValueRed,
    },
    rekapDivider: {
      height: 1,
      backgroundColor: c.rekapDivider,
      marginVertical: 10,
    },
    rekapLabaBersihRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },
    rekapLabaBersihLabel: {
      fontSize: 16,
      fontWeight: "700",
      color: c.rekapValueDark,
    },
    rekapLabaBersihValue: {
      fontSize: 20,
      fontWeight: "700",
      color: c.rekapValueGreen,
      letterSpacing: -0.4,
    },
    rekapFormula: {
      fontSize: 11,
      color: c.rekapFormula,
      marginTop: 10,
    },
    pjSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    pjSectionLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1,
      color: c.pjSectionLabel,
      textTransform: "uppercase",
    },
    pjLihatSemua: {
      fontSize: 12,
      fontWeight: "600",
      color: c.pjLihatSemua,
    },
    pjKeluar: {
      fontSize: 12,
      fontWeight: "600",
      color: c.pjKeluar,
    },
    pjCard: {
      backgroundColor: c.pjItemBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.pjItemBorder,
      padding: 14,
      marginBottom: 12,
    },
    pjItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.rekapDivider,
    },
    pjItemLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    pjItemEmoji: { fontSize: 18, marginRight: 12 },
    pjItemInfo: { flex: 1 },
    pjItemName: {
      fontSize: 14,
      fontWeight: "600",
      color: c.pjItemName,
      marginBottom: 2,
    },
    pjItemDesc: { fontSize: 12, color: c.pjItemDesc },
    pjItemRight: { alignItems: "flex-end" },
    pjItemPrice: {
      fontSize: 14,
      fontWeight: "700",
      color: c.pjItemPrice,
    },
    pjItemProfit: {
      fontSize: 12,
      fontWeight: "600",
      color: c.pjItemProfit,
    },
    pjItemStokValue: {
      fontSize: 14,
      fontWeight: "700",
      color: c.pjStokValue,
    },
    pjItemStokBeli: {
      fontSize: 12,
      fontWeight: "500",
      color: c.pjSectionLabel,
    },

    // ── HISTORI FILTERS ───────────────────────────────────
    histFilterRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 16,
      flexWrap: "wrap",
    },
    histChipActive: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.histFilterActiveBg,
      borderWidth: 1.5,
      borderColor: c.histFilterActiveBorder,
    },
    histChipActiveText: {
      fontSize: 13,
      fontWeight: "600",
      color: c.histFilterActiveText,
    },
    histChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.histFilterDefaultBg,
      borderWidth: 1,
      borderColor: c.histFilterDefaultBorder,
    },
    histChipText: {
      fontSize: 13,
      fontWeight: "500",
      color: c.histFilterDefaultText,
    },
    histChipRed: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.histFilterRedBg,
      borderWidth: 1,
      borderColor: c.histFilterRedBorder,
    },
    histChipRedText: {
      fontSize: 13,
      fontWeight: "600",
      color: c.histFilterRedText,
    },

    // ── HISTORI GROUP ─────────────────────────────────────
    histGroupHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      marginTop: 6,
    },
    histGroupLabel: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1,
      color: c.histGroupLabel,
      textTransform: "uppercase",
    },
    histGroupTerkunci: {
      fontSize: 12,
      fontWeight: "600",
      color: c.histGroupTerkunci,
    },
    histCard: {
      backgroundColor: c.histItemBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.histItemBorder,
      marginBottom: 12,
      overflow: "hidden",
    },
    histItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.rekapDivider,
    },
    histItemLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    histItemIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.rekapCardBg,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    histItemIconText: { fontSize: 18 },
    histItemInfo: { flex: 1 },
    histItemName: {
      fontSize: 14,
      fontWeight: "600",
      color: c.histItemName,
      marginBottom: 2,
    },
    histItemDesc: { fontSize: 12, color: c.histItemDesc },
    histItemRight: { alignItems: "flex-end" },
    histItemValGreen: {
      fontSize: 14,
      fontWeight: "700",
      color: c.histValueGreen,
      marginBottom: 2,
    },
    histItemValRed: {
      fontSize: 14,
      fontWeight: "700",
      color: c.histValueRed,
      marginBottom: 2,
    },
    histItemTime: { fontSize: 11, color: c.histItemTime },

    // ── INTERPRETASI SELISIH CARD ─────────────────────────
    interpCard: {
      backgroundColor: c.interpCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.interpCardBorder,
      padding: 14,
      marginBottom: 14,
    },
    interpTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: c.interpTitle,
      marginBottom: 8,
    },
    interpBody: {
      fontSize: 13,
      color: c.interpBody,
      lineHeight: 20,
    },

    // ── BOTTOM NAV ────────────────────────────────────────
    bottomNav: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      backgroundColor: c.navBg,
      borderTopWidth: 1,
      borderTopColor: c.navBorder,
      paddingBottom: 22,
      paddingTop: 10,
    },
    navItem: { flex: 1, alignItems: "center", gap: 3 },
    navEmoji: { fontSize: 20 },
    navLabelActive: {
      fontSize: 10,
      fontWeight: "700",
      color: c.navActive,
    },
    navLabelInactive: {
      fontSize: 10,
      fontWeight: "400",
      color: c.navInactive,
    },

    //? MODAL ── INFO BOX ───────────────────────────────────────────────
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
      color: c.rekapLabel,
    },
    infoBoxValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: c.tabActiveLine,
    },

    //? MODAL ── INPUT ───────────────────────────────────────────────
    inputBase: {
      borderWidth: 1,
      borderColor: c.subCardBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      marginBottom: 12,
      backgroundColor: c.subCardBg,
      color: c.titleText,
    },

    //? MODAL ── BUTTONS ───────────────────────────────────────────────
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
      backgroundColor: c.subCardBg,
      borderWidth: 1,
      borderColor: c.subCardBorder,
    },
    primaryButton: {
      backgroundColor: c.catatBtnBg,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.tabInactive,
    },
    primaryButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.catatBtnText,
    },

    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },

    // ======================================================
    // MODAL — SHARED BASE
    // ======================================================
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: c.subCardBg,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 30,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: c.titleText,
      marginBottom: 16,
    },
    modalLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: c.rekapLabel,
      marginBottom: 6,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: c.subCardBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      marginBottom: 12,
      backgroundColor: c.subCardBg,
      color: c.titleText,
    },
    modalButtonRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 20,
    },
    modalCancelButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      backgroundColor: c.subCardBg,
      borderWidth: 1,
      borderColor: c.subCardBorder,
    },
    modalCancelText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.tabInactive,
    },
    modalSubmitButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      backgroundColor: c.catatBtnBg,
    },
    modalSubmitText: {
      fontSize: 14,
      fontWeight: "600",
      color: c.catatBtnText,
    },

    // ======================================================
    // MODAL — LOCK REKAP
    // ======================================================
    lockContainer: {
      flex: 1,
      backgroundColor: c.pageBg,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    lockDescription: {
      fontSize: 13,
      lineHeight: 20,
      color: c.subDesc,
      marginBottom: 14,
    },
    lockSummaryCard: {
      backgroundColor: c.subCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.subCardBorder,
      padding: 14,
      marginBottom: 16,
    },
    lockSummaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    lockSummaryLabel: {
      fontSize: 13,
      color: c.rekapLabel,
    },
    lockSummaryValue: {
      fontSize: 14,
      fontWeight: "700",
      color: c.titleText,
    },

    // button khusus lock rekap
    btnKunci: {
      flex: 1,
      paddingVertical: 12,
      marginBottom: 10,
      borderRadius: 8,
      alignItems: "center",
      backgroundColor: c.btnKunciLockBg,
    },
    btnDisabled: {
      opacity: 0.55,
    },
    btnKunciText: {
      fontSize: 14,
      fontWeight: "700",
      color: c.btnKunciLockText,
    },

    // kalau butuh container kosong untuk modal full page
    modalPage: {
      flex: 1,
      backgroundColor: c.pageBg,
    },

    histDayCard: {
      backgroundColor: c.subCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.subCardBorder,
      padding: 14,
      marginBottom: 12,
    },

    histDayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },

    histDaySubText: {
      fontSize: 12,
      color: c.subDesc,
      marginTop: 2,
    },

    histLockedBadge: {
      backgroundColor: c.histFilterActiveBg,
      borderWidth: 1,
      borderColor: c.histFilterActiveBorder,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    histOpenBadge: {
      backgroundColor: c.histFilterDefaultBg,
      borderWidth: 1,
      borderColor: c.histFilterDefaultBorder,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },

    histLockedBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: c.histFilterActiveText,
    },

    histOpenBadgeText: {
      fontSize: 11,
      fontWeight: "700",
      color: c.histFilterDefaultText,
    },

    histRekapCard: {
      backgroundColor: c.rekapCardBg,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.rekapCardBorder,
      padding: 12,
      marginBottom: 12,
    },

    histRekapRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },

    histRekapLabel: {
      fontSize: 13,
      color: c.rekapLabel,
    },

    histRekapValue: {
      fontSize: 13,
      fontWeight: "600",
      color: c.rekapValueDark,
    },

    histRekapValueGreen: {
      fontSize: 13,
      fontWeight: "700",
      color: c.rekapValueGreen,
    },

    histEmptyInside: {
      paddingVertical: 14,
      alignItems: "center",
    },

    histEmptyInsideText: {
      fontSize: 12,
      color: c.subDesc,
    },
  });

export const lightStyles = createStyles(lightColors);
export const darkStyles = createStyles(darkColors);
