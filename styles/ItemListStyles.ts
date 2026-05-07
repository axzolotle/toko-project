import { StyleSheet } from 'react-native';

// ============================================================
// DESIGN TOKENS — ITEM LIST SCREEN
// ============================================================

export const lightColors = {
  // Page / header bg
  pageBg: '#eef3e5',
  headerBg: '#eef3e5',

  // Title
  titleText: '#111b0f',

  // "+ Tambah" pill button
  addBtnBg: '#2e5c27',
  addBtnText: '#ffffff',

  // Search bar
  searchBg: '#ffffff',
  searchBorder: '#e0e8d6',
  searchIcon: '#9aaa8c',
  searchPlaceholder: '#9aaa8c',
  searchText: '#111b0f',

  // Filter chips
  chipActiveBg: '#ffffff',
  chipActiveBorder: '#2e5c27',
  chipActiveText: '#2e5c27',
  chipDefaultBg: '#ffffff',
  chipDefaultBorder: '#dce5d2',

  // Meta count "12 item terdaftar"
  metaText: '#7a8c6e',

  // Card surface
  cardBg: '#ffffff',
  cardBorder: '#edf3e6',
  cardShadowColor: '#1a2a16',

  // Card typography
  cardTitleText: '#111b0f',
  cardSubText: '#9aaa8c',
  cardDescText: '#9aaa8c',

  // Price column
  priceText: '#111b0f',
  priceDot: '#4caf50',
  modalText: '#9aaa8c',
  profitText: '#2e7d32',

  // Stock
  stockWarningText: '#c62828',
  stockNormalText: '#6b7c61',
  stockBtnBorder: '#c8d4be',
  stockBtnText: '#6b7c61',
  stockBtnBg: '#ffffff',

  // Category badge tints
  badgeFisikBg: '#fde8d4',     badgeFisikText: '#c04800',
  badgeVoucherBg: '#fdf5dc',   badgeVoucherText: '#a06800',
  badgeDigitalBg: '#e4ede0',   badgeDigitalText: '#2d6224',
  badgeTransferBg: '#ece8fc',  badgeTransferText: '#5236b4',
};

export const darkColors: typeof lightColors = {
  pageBg: '#0c1a0b',
  headerBg: '#0c1a0b',

  titleText: '#e0eeda',

  addBtnBg: '#3ecb38',
  addBtnText: '#0c1a0b',

  searchBg: '#162014',
  searchBorder: '#1e3020',
  searchIcon: '#3e5c3a',
  searchPlaceholder: '#3e5c3a',
  searchText: '#c8dec2',

  chipActiveBg: '#1a2e18',
  chipActiveBorder: '#3ecb38',
  chipActiveText: '#3ecb38',
  chipDefaultBg: '#162014',
  chipDefaultBorder: '#1e3020',

  metaText: '#3e5c3a',

  cardBg: '#162014',
  cardBorder: '#1e2e1c',
  cardShadowColor: '#000000',

  cardTitleText: '#e0eeda',
  cardSubText: '#4a6044',
  cardDescText: '#4a6044',

  priceText: '#e0eeda',
  priceDot: '#4caf50',
  modalText: '#4a6044',
  profitText: '#4caf50',

  stockWarningText: '#f44336',
  stockNormalText: '#8aaa82',
  stockBtnBorder: '#243622',
  stockBtnText: '#8aaa82',
  stockBtnBg: '#1a2a18',

  badgeFisikBg: '#3a1808',     badgeFisikText: '#f4956a',
  badgeVoucherBg: '#3a2c08',   badgeVoucherText: '#f0c040',
  badgeDigitalBg: '#122a10',   badgeDigitalText: '#5ecf56',
  badgeTransferBg: '#1c1440',  badgeTransferText: '#a48ef4',
};

// ============================================================
// STYLE FACTORY
// ============================================================
export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({

    // ── SCREEN ───────────────────────────────────────────
    screen: {
      flex: 1,
      backgroundColor: c.pageBg,
    },
    safeArea: {
      flex: 1,
    },

    // ── HEADER ROW ───────────────────────────────────────
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 12,
      backgroundColor: c.headerBg,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: '700',
      color: c.titleText,
      letterSpacing: -0.5,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.addBtnBg,
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 20,
      gap: 4,
    },
    addButtonPlus: {
      fontSize: 15,
      fontWeight: '400',
      color: c.addBtnText,
    },
    addButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.addBtnText,
      letterSpacing: 0.1,
    },

    // ── SEARCH BAR ───────────────────────────────────────
    searchWrapper: {
      paddingHorizontal: 18,
      paddingBottom: 10,
      backgroundColor: c.headerBg,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
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

    // ── FILTER CHIPS ─────────────────────────────────────
    filterWrapper: {
      paddingHorizontal: 18,
      paddingBottom: 6,
      backgroundColor: c.headerBg,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    chipActive: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 20,
      backgroundColor: c.chipActiveBg,
      borderWidth: 1.5,
      borderColor: c.chipActiveBorder,
    },
    chipActiveText: {
      fontSize: 13,
      fontWeight: '600',
      color: c.chipActiveText,
    },
    chipIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.chipDefaultBg,
      borderWidth: 1,
      borderColor: c.chipDefaultBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    chipIconEmoji: {
      fontSize: 16,
    },

    // ── META TEXT ────────────────────────────────────────
    metaWrapper: {
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 10,
      backgroundColor: c.headerBg,
    },
    metaText: {
      fontSize: 13,
      fontWeight: '400',
      color: c.metaText,
    },

    // ── SCROLLABLE LIST ──────────────────────────────────
    listContent: {
      paddingHorizontal: 18,
      paddingTop: 2,
      paddingBottom: 32,
      gap: 10,
    },

    // ── ITEM CARD ────────────────────────────────────────
    card: {
      backgroundColor: c.cardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      shadowColor: c.cardShadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },

    // Left column
    cardLeft: {
      flex: 1,
      marginRight: 10,
      gap: 2,
    },
    categoryBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
      marginBottom: 5,
    },
    categoryEmoji: {
      fontSize: 12,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
    },
    cardSub: {
      fontSize: 12,
      color: c.cardSubText,
      fontWeight: '400',
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: c.cardTitleText,
      letterSpacing: -0.3,
      marginTop: 2,
    },
    cardDesc: {
      fontSize: 12,
      color: c.cardDescText,
      fontWeight: '400',
      marginTop: 1,
    },

    // Right column
    cardRight: {
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      gap: 3,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    priceText: {
      fontSize: 18,
      fontWeight: '700',
      color: c.priceText,
      letterSpacing: -0.3,
    },
    priceDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: c.priceDot,
      marginLeft: 3,
      marginTop: 4,
    },
    modalText: {
      fontSize: 12,
      color: c.modalText,
      fontWeight: '400',
    },
    profitText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.profitText,
    },
    stockWarningRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      marginTop: 2,
    },
    stockWarningText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.stockWarningText,
    },
    stockNormalText: {
      fontSize: 12,
      fontWeight: '500',
      color: c.stockNormalText,
      marginTop: 2,
    },
    stockButton: {
      marginTop: 5,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.stockBtnBorder,
      backgroundColor: c.stockBtnBg,
    },
    stockButtonText: {
      fontSize: 11,
      fontWeight: '500',
      color: c.stockBtnText,
    },

    // Category badge color pairs (bg + text combined per category)
    badgeFisik:        { backgroundColor: c.badgeFisikBg },
    badgeFisikLabel:   { color: c.badgeFisikText },
    badgeVoucher:      { backgroundColor: c.badgeVoucherBg },
    badgeVoucherLabel: { color: c.badgeVoucherText },
    badgeDigital:      { backgroundColor: c.badgeDigitalBg },
    badgeDigitalLabel: { color: c.badgeDigitalText },
    badgeTransfer:     { backgroundColor: c.badgeTransferBg },
    badgeTransferLabel:{ color: c.badgeTransferText },
  });

export const lightStyles = createStyles(lightColors);
export const darkStyles  = createStyles(darkColors);
