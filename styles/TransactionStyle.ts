// TransactionStyles.ts
import { StyleSheet } from "react-native";

// ============================================================
// DESIGN TOKENS
// ============================================================

export const lightColors = {
  red: "#ff0000",
  blue: "#0000ff",

  pageBg: "#eef3e5",
  headerBg: "#eef3e5",

  titleText: "#111b0f",
  subtitleText: "#7a8c6e",

  buttonBg: "#2e5c27",
  buttonText: "#ffffff",

  cardBg: "#ffffff",
  cardBorder: "#e2ead8",

  chipBg: "#ffffff",
  chipBorder: "#dce5d2",
  chipActiveBg: "#dcebd4",
  chipActiveBorder: "#2e5c27",
  chipText: "#496144",
  chipActiveText: "#2e5c27",

  sectionText: "#7f9677",

  itemTitle: "#182116",
  itemMeta: "#83927b",
  itemPrice: "#2f5d29",

  dot: "#d8e6d1",

  divider: "#e4ebdc",

  shadow: "#162114",
};

export const darkColors: typeof lightColors = {
  pageBg: "#0c1a0b",
  headerBg: "#0c1a0b",

  titleText: "#e7f1e2",
  subtitleText: "#5c7756",

  buttonBg: "#3ecb38",
  buttonText: "#0c1a0b",

  cardBg: "#162014",
  cardBorder: "#243622",

  chipBg: "#162014",
  chipBorder: "#243622",
  chipActiveBg: "#1f351d",
  chipActiveBorder: "#3ecb38",
  chipText: "#84a17d",
  chipActiveText: "#3ecb38",

  sectionText: "#64825d",

  itemTitle: "#e7f1e2",
  itemMeta: "#698463",
  itemPrice: "#6ee266",

  dot: "#294425",

  divider: "#243622",

  shadow: "#000000",
};

// ============================================================
// STYLE FACTORY
// ============================================================

export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.pageBg,
    },

    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 40,
    },

    // HEADER
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },

    title: {
      fontSize: 28,
      fontWeight: "700",
      color: c.titleText,
      letterSpacing: -0.5,
    },

    subtitle: {
      marginTop: 2,
      fontSize: 14,
      color: c.subtitleText,
      fontWeight: "400",
    },

    themeButton: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.cardBorder,
      justifyContent: "center",
      alignItems: "center",
    },

    themeButtonIcon: {
      fontSize: 18,
    },

    // STEP
    stepWrapper: {
      marginTop: 20,
      marginBottom: 8,
    },

    stepRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    // SECTION
    sectionHeader: {
      marginTop: 16,
      marginBottom: 16,
    },

    sectionHeaderText: {
      fontSize: 12,
      letterSpacing: 1.2,
      fontWeight: "700",
      color: c.sectionText,
      textTransform: "uppercase",
    },

    stepActive: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.buttonBg,
      justifyContent: "center",
      alignItems: "center",
    },

    stepActiveText: {
      color: c.buttonText,
      fontWeight: "700",
      fontSize: 15,
    },

    stepInactive: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.cardBorder,
      justifyContent: "center",
      alignItems: "center",
    },

    stepInactiveText: {
      color: c.subtitleText,
      fontWeight: "600",
      fontSize: 15,
    },

    stepLine: {
      flex: 1,
      height: 1,
      backgroundColor: c.cardBorder,
      marginHorizontal: 8,
    },

    stepLabel: {
      marginLeft: 8,
      fontSize: 12,
      color: c.subtitleText,
      fontWeight: "600",
    },

    stepWrapper: {
      marginTop: 20,
      marginBottom: 8,
    },

    // GRID
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 14,
    },

    categoryCard: {
      width: "47%",
      backgroundColor: c.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 16,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },

    categoryIconWrapper: {
      width: 52,
      height: 52,
      borderRadius: 14,
      backgroundColor: c.pageBg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },

    categoryIcon: {
      fontSize: 22,
    },

    categoryTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: c.itemTitle,
      lineHeight: 20,
    },

    categoryMeta: {
      marginTop: 6,
      fontSize: 12,
      color: c.itemMeta,
      fontWeight: "600",
    },

    // BACK
    backRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 12,
      marginBottom: 12,
      paddingHorizontal: 18,
    },

    backArrow: {
      fontWeight: "700",
      color: c.itemPrice,
    },

    backText: {
      fontSize: 20,
      fontWeight: "700",
      color: c.itemPrice,
    },

    // FILTER
    filterRow: {
      height: 50,
      gap: 8,
      paddingHorizontal: 18,
      paddingVertical: 8,
      flexGrow: 1,
      alignItems: "center",
    },

    filterActive: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: c.chipActiveBg,
      borderWidth: 1.5,
      borderColor: c.chipActiveBorder,
    },

    filterActiveText: {
      fontSize: 13,
      fontWeight: "600",
      color: c.chipActiveText,
    },

    filterChip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: c.chipBg,
      borderWidth: 1,
      borderColor: c.chipBorder,
    },

    filterChipText: {
      fontSize: 13,
      color: c.chipText,
      fontWeight: "500",
    },

    // PRODUCT CARD
    productCard: {
      backgroundColor: c.cardBg,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
    },

    productDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: c.dot,
      marginRight: 14,
    },

    productContent: {
      flex: 1,
    },

    productTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: c.itemTitle,
      letterSpacing: -0.2,
    },

    productMeta: {
      marginTop: 3,
      fontSize: 12,
      color: c.itemMeta,
      fontWeight: "500",
    },

    productPrice: {
      fontSize: 16,
      fontWeight: "700",
      color: c.itemPrice,
      letterSpacing: -0.2,
    },

    // CONFIRM CARD
    confirmCard: {
      marginHorizontal: 18,
      marginTop: 16,
      backgroundColor: c.cardBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.cardBorder,
      padding: 18,
    },

    confirmBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    confirmEmoji: {
      fontSize: 20,
    },

    badgePrimary: {
      backgroundColor: c.chipActiveBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    badgePrimaryText: {
      color: c.itemPrice,
      fontWeight: "600",
      fontSize: 12,
    },

    badgeSecondary: {
      backgroundColor: c.pageBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },

    badgeSecondaryText: {
      color: c.itemMeta,
      fontWeight: "600",
      fontSize: 12,
    },

    confirmTitle: {
      marginTop: 16,
      fontSize: 24,
      fontWeight: "700",
      color: c.itemTitle,
      letterSpacing: -0.5,
    },

    confirmDesc: {
      marginTop: 4,
      fontSize: 14,
      color: c.itemMeta,
      fontWeight: "500",
    },

    confirmDivider: {
      height: 1,
      backgroundColor: c.divider,
      marginVertical: 16,
    },

    confirmBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    confirmLeft: {
      gap: 10,
    },

    confirmRight: {
      alignItems: "flex-end",
      gap: 8,
    },

    confirmLabel: {
      fontSize: 13,
      color: c.itemMeta,
      fontWeight: "500",
    },

    confirmPrice: {
      fontSize: 28,
      fontWeight: "700",
      color: c.itemTitle,
      letterSpacing: -0.8,
    },

    confirmModal: {
      fontSize: 14,
      fontWeight: "600",
      color: c.itemMeta,
    },

    confirmProfit: {
      fontSize: 14,
      fontWeight: "700",
      color: c.itemPrice,
    },

    // BUTTONS
    primaryButton: {
      marginTop: 16,
      height: 48,
      borderRadius: 14,
      backgroundColor: c.buttonBg,
      justifyContent: "center",
      alignItems: "center",
    },

    primaryButtonText: {
      color: c.buttonText,
      fontSize: 15,
      fontWeight: "700",
    },

    secondaryButton: {
      height: 48,
      borderRadius: 14,
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.cardBorder,
      justifyContent: "center",
      alignItems: "center",
    },

    secondaryButtonText: {
      color: c.itemMeta,
      fontSize: 15,
      fontWeight: "600",
    },
  });

export const lightStyles = createStyles(lightColors);
export const darkStyles = createStyles(darkColors);
