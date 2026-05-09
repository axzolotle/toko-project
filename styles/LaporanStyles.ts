import { StyleSheet } from 'react-native';

// ============================================================
// DESIGN TOKENS — LAPORAN SCREEN (LIGHT & DARK)
// ============================================================

export const lightColors = {
  pageBg:          '#edf2e6',
  headerBg:        '#edf2e6',
  titleText:       '#111b0f',

  // Sync button
  syncBtnBg:       '#ffffff',
  syncBtnBorder:   '#d4dece',
  syncDot:         '#4caf50',
  syncText:        '#111b0f',

  // Date navigator
  dateArrowBg:     '#ffffff',
  dateArrowBorder: '#d4dece',
  dateArrowText:   '#3d5436',
  dateTitleText:   '#111b0f',
  dateSubText:     '#4caf50',
  dateBorder:      '#e0e8d6',

  // Stats cards
  statCardBg:      '#ffffff',
  statCardBorder:  '#e6ede0',
  statLabel:       '#8aaa7e',
  statValueDark:   '#111b0f',
  statValueGreen:  '#2e7d32',

  // Section label
  sectionLabel:    '#7a9a6e',

  // Per-jenis rows
  jenisBg:         '#ffffff',
  jenisBorder:     '#e6ede0',
  jenisName:       '#111b0f',
  jenisCount:      '#8aaa7e',
  jenisPrice:      '#111b0f',

  // Riwayat cards
  riwayatBg:       '#ffffff',
  riwayatBorder:   '#e6ede0',
  riwayatNumBg:    '#edf2e6',
  riwayatNum:      '#3d5436',
  riwayatName:     '#111b0f',
  riwayatMeta:     '#8aaa7e',
  riwayatPrice:    '#111b0f',
  riwayatProfit:   '#2e7d32',

  // Category colored left accent bars
  barFisik:        '#c07830',
  barTransfer:     '#7060d0',
  barDigital:      '#3a9a3a',
  barVoucher:      '#d04030',

  // Price dots
  dotGreen:        '#4caf50',
  dotOrange:       '#f59e0b',

  // Bottom tab bar
  tabBg:           '#ffffff',
  tabBorder:       '#e6ede0',
  tabActive:       '#2e5c27',
  tabInactive:     '#9aaa8c',
};

export const darkColors: typeof lightColors = {
  pageBg:          '#0d1a0c',
  headerBg:        '#0d1a0c',
  titleText:       '#e0eeda',

  syncBtnBg:       '#162014',
  syncBtnBorder:   '#1e3020',
  syncDot:         '#4caf50',
  syncText:        '#e0eeda',

  dateArrowBg:     '#162014',
  dateArrowBorder: '#1e3020',
  dateArrowText:   '#8aaa7e',
  dateTitleText:   '#e0eeda',
  dateSubText:     '#4caf50',
  dateBorder:      '#162014',

  statCardBg:      '#162014',
  statCardBorder:  '#1e2e1c',
  statLabel:       '#4a6444',
  statValueDark:   '#e0eeda',
  statValueGreen:  '#4caf50',

  sectionLabel:    '#3e5c3a',

  jenisBg:         '#162014',
  jenisBorder:     '#1e2e1c',
  jenisName:       '#e0eeda',
  jenisCount:      '#4a6444',
  jenisPrice:      '#e0eeda',

  riwayatBg:       '#162014',
  riwayatBorder:   '#1e2e1c',
  riwayatNumBg:    '#1a2e18',
  riwayatNum:      '#8aaa7e',
  riwayatName:     '#e0eeda',
  riwayatMeta:     '#4a6444',
  riwayatPrice:    '#e0eeda',
  riwayatProfit:   '#4caf50',

  barFisik:        '#c07830',
  barTransfer:     '#7060d0',
  barDigital:      '#3ecb38',
  barVoucher:      '#e04030',

  dotGreen:        '#4caf50',
  dotOrange:       '#f59e0b',

  tabBg:           '#0d1a0c',
  tabBorder:       '#1e2e1c',
  tabActive:       '#4caf50',
  tabInactive:     '#3e5c3a',
};

// ============================================================
// STYLE FACTORY
// ============================================================
export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({

    screen:  { flex: 1, backgroundColor: c.pageBg },
    safeArea:{ flex: 1 },

    // ── HEADER ──────────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 14,
      backgroundColor: c.headerBg,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: '700',
      color: c.titleText,
      letterSpacing: -0.5,
    },
    syncButton: {
      flexDirection: 'row',
      alignItems: 'center',
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
      fontWeight: '600',
      color: c.syncText,
    },

    // ── DATE NAVIGATOR ──────────────────────────────────
    dateNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.dateBorder,
      backgroundColor: c.headerBg,
    },
    dateArrow: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.dateArrowBg,
      borderWidth: 1,
      borderColor: c.dateArrowBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateArrowText: {
      fontSize: 16,
      color: c.dateArrowText,
      fontWeight: '500',
    },
    dateCenter: { alignItems: 'center' },
    dateTitleText: {
      fontSize: 15,
      fontWeight: '600',
      color: c.dateTitleText,
      letterSpacing: -0.2,
    },
    dateSubText: {
      fontSize: 12,
      fontWeight: '400',
      color: c.dateSubText,
      marginTop: 2,
    },

    // ── STATS ROW ───────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 18,
      paddingVertical: 14,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.statCardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.statCardBorder,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    statLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: c.statLabel,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    statValueDark: {
      fontSize: 22,
      fontWeight: '700',
      color: c.statValueDark,
      letterSpacing: -0.5,
    },
    statValueGreen: {
      fontSize: 18,
      fontWeight: '700',
      color: c.statValueGreen,
      letterSpacing: -0.4,
    },

    // ── SCROLL ──────────────────────────────────────────
    scroll:        { flex: 1 },
    scrollContent: { paddingHorizontal: 18, paddingBottom: 100 },

    // ── SECTION LABEL ───────────────────────────────────
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color: c.sectionLabel,
      textTransform: 'uppercase',
      marginBottom: 10,
      marginTop: 6,
    },

    // ── PER-JENIS ROW ───────────────────────────────────
    jenisCard: {
      backgroundColor: c.jenisBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.jenisBorder,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 8,
    },
    jenisBar: {
      width: 3,
      height: 28,
      borderRadius: 2,
      marginRight: 12,
    },
    jenisEmoji: { fontSize: 18, marginRight: 10 },
    jenisName: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: c.jenisName,
      letterSpacing: -0.2,
    },
    jenisCount: {
      fontSize: 13,
      color: c.jenisCount,
      fontWeight: '400',
      marginRight: 14,
    },
    jenisPrice: {
      fontSize: 15,
      fontWeight: '700',
      color: c.jenisPrice,
      letterSpacing: -0.3,
    },

    // ── RIWAYAT CARD ────────────────────────────────────
    riwayatCard: {
      backgroundColor: c.riwayatBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.riwayatBorder,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 13,
      marginBottom: 8,
    },
    riwayatNumBadge: {
      width: 30,
      height: 30,
      borderRadius: 8,
      backgroundColor: c.riwayatNumBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    riwayatNumText: {
      fontSize: 13,
      fontWeight: '700',
      color: c.riwayatNum,
    },
    riwayatInfo: { flex: 1 },
    riwayatName: {
      fontSize: 15,
      fontWeight: '600',
      color: c.riwayatName,
      letterSpacing: -0.2,
      marginBottom: 3,
    },
    riwayatMeta: {
      fontSize: 12,
      color: c.riwayatMeta,
      fontWeight: '400',
    },
    riwayatRight: { alignItems: 'flex-end', gap: 3 },
    riwayatPriceRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 3,
    },
    riwayatPrice: {
      fontSize: 15,
      fontWeight: '700',
      color: c.riwayatPrice,
      letterSpacing: -0.3,
    },
    riwayatDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginTop: 4,
    },
    riwayatProfit: {
      fontSize: 12,
      fontWeight: '600',
      color: c.riwayatProfit,
    },

    // ── BOTTOM TAB BAR ───────────────────────────────────
    tabBar: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      flexDirection: 'row',
      backgroundColor: c.tabBg,
      borderTopWidth: 1,
      borderTopColor: c.tabBorder,
      paddingBottom: 22,
      paddingTop: 10,
    },
    tabItem: { flex: 1, alignItems: 'center', gap: 4 },
    tabEmoji: { fontSize: 20 },
    tabLabelActive: {
      fontSize: 10,
      fontWeight: '700',
      color: c.tabActive,
    },
    tabLabelInactive: {
      fontSize: 10,
      fontWeight: '400',
      color: c.tabInactive,
    },

    // Loading / empty
    centered: {
      flex: 1, justifyContent: 'center',
      alignItems: 'center', paddingVertical: 40,
    },
    emptyText: {
      fontSize: 14,
      color: c.sectionLabel,
      textAlign: 'center',
    },
  });

export const lightStyles = createStyles(lightColors);
export const darkStyles  = createStyles(darkColors);
