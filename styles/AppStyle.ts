import { StyleSheet } from "react-native";

// reusable style
export const ReusableColors = {
  light: {
    pageBg: "#eef3e5",
    headerBg: "#eef3e5",
    surface: "#ffffff",
    surfaceAlt: "#f0f5ea",
    border: "#e2ead8",
    divider: "#e8ede2",
    title: "#111b0f",
    text: "#111b0f",
    muted: "#8aaa7e",
    primary: "#2e5c27",
    primaryText: "#ffffff",
    success: "#1a7a30",
    danger: "#c0302a",
    warning: "#f59e0b",
    inputBg: "#ffffff",
    inputPlaceholder: "#9aaa8c",
    modalBackdrop: "rgba(0,0,0,0.35)",
  },
  dark: {
    pageBg: "#0d1a0c",
    headerBg: "#0d1a0c",
    surface: "#162014",
    surfaceAlt: "#1a2e18",
    border: "#1e2e1c",
    divider: "#1a2a18",
    title: "#e0eeda",
    text: "#e0eeda",
    muted: "#4a6444",
    primary: "#3ecb38",
    primaryText: "#0d1a0c",
    success: "#4caf50",
    danger: "#f08080",
    warning: "#f59e0b",
    inputBg: "#162014",
    inputPlaceholder: "#4a6044",
    modalBackdrop: "rgba(0,0,0,0.35)",
  },
};

// reusable style
export const ReusableShape = {
  cardRadius: 14,
  inputRadius: 10,
  buttonRadius: 12,
  chipRadius: 20,
  modalRadius: 18,
};

// reusable style
export const ReusableSpacing = {
  screenX: 18,
  headerTop: 16,
  headerBottom: 12,
  sectionGap: 16,
  cardPadding: 16,
  rowGap: 10,
};

// reusable style
export const createReusableStyles = (
  colors: (typeof ReusableColors)["light"],
) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.pageBg },
    safeArea: { flex: 1 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: ReusableSpacing.screenX,
      paddingTop: ReusableSpacing.headerTop,
      paddingBottom: ReusableSpacing.headerBottom,
      backgroundColor: colors.headerBg,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: "700",
      color: colors.title,
    },
    scroll: { flex: 1 },
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: ReusableShape.cardRadius,
      borderWidth: 1,
      padding: ReusableSpacing.cardPadding,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    input: {
      backgroundColor: colors.inputBg,
      borderColor: colors.border,
      borderRadius: ReusableShape.inputRadius,
      borderWidth: 1,
      color: colors.text,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    primaryButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderRadius: ReusableShape.buttonRadius,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    primaryButtonText: {
      color: colors.primaryText,
      fontSize: 14,
      fontWeight: "700",
    },
    outlineButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: ReusableShape.buttonRadius,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: colors.modalBackdrop,
    },
    modalSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: ReusableShape.modalRadius,
      borderTopRightRadius: ReusableShape.modalRadius,
      padding: 18,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.title,
      marginBottom: 16,
    },
    chip: {
      borderRadius: ReusableShape.chipRadius,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  });

// reusable style
export const ReusableStyle = {
  colors: ReusableColors,
  shape: ReusableShape,
  spacing: ReusableSpacing,
  lightStyles: createReusableStyles(ReusableColors.light),
  darkStyles: createReusableStyles(ReusableColors.dark),
  createStyles: createReusableStyles,
};

// ============================================================
// LOGIN SCREEN STYLE
// ============================================================

// ============================================
// DESIGN TOKENS
// ============================================

export const LoginLightColors = {
  // Page
  pageBg: "#edf2e6", // Warm off-white green background

  // App icon
  iconBg: "#2e5c27", // Deep forest green icon background
  iconColor: "#ffffff", // White icon

  // Typography
  appName: "#1c2b1a", // Almost black dark green title
  appSubtitle: "#4e7c41", // Muted medium green

  // Card
  cardBg: "#ffffff", // Pure white card
  cardBorder: "transparent",

  // Inputs
  inputBg: "#f2f6ec", // Very light warm input bg
  inputBorder: "#dde5d4", // Soft green-gray border
  inputText: "#2a3d26", // Dark input text
  inputPlaceholder: "#9aaa8c", // Muted green placeholder
  inputLabel: "#1c2b1a", // Dark label text

  // Button
  buttonBg: "#2e5c27", // Dark forest green
  buttonText: "#ffffff", // White text
  buttonOption: "#1c2b1a", // Same as button bg for options

  // Footer
  helperText: "#7a8c6e", // Muted medium
  versionText: "#9aaa8c", // Light muted
  versionLine: "#c8d5bc", // Very light separator line
};

export const LoginDarkColors = {
  // Page
  pageBg: "#0d1a0c", // Very dark forest green

  // App icon
  iconBg: "#2a4225", // Muted dark green icon bg
  iconColor: "#5fcf5a", // Bright green icon

  // Typography
  appName: "#e8f0e4", // Almost white
  appSubtitle: "#7ab870", // Muted bright green

  // Card
  cardBg: "#162014", // Very dark card
  cardBorder: "transparent",

  // Inputs
  inputBg: "#1e2e1c", // Slightly lighter dark input
  inputBorder: "#2a3d28", // Subtle dark border
  inputText: "#d0e0cb", // Light green-tinted text
  inputPlaceholder: "#4a6044", // Muted dark placeholder
  inputLabel: "#a8c0a0", // Muted light label

  // Button
  buttonBg: "#3ecb38", // Bright vivid green
  buttonText: "#0d1a0c", // Near-black text on bright button
  buttonOption: "#a8c0a0", // Bright green for option text

  // Footer
  helperText: "#5a7854", // Muted dark
  versionText: "#4a6044", // Darker muted
  versionLine: "#1e3020", // Very dark separator
};

// ============================================
// SPACING & SHAPE TOKENS
// ============================================

const shape = {
  iconSize: 72,
  iconRadius: 20,
  cardRadius: 16,
  inputRadius: 10,
  buttonRadius: 12,
  inputHeight: 52,
  buttonHeight: 54,
};

const font = {
  appName: 36,
  subtitle: 15,
  label: 14,
  input: 15,
  button: 17,
  helper: 13,
  version: 12,
};

// ============================================
// STYLE FACTORY — returns styles for the given color scheme
// ============================================

export const LoginCreateStyles = (c: typeof LoginLightColors) =>
  StyleSheet.create({
    // ── SCREEN & SAFE AREA ──────────────────
    screen: {
      flex: 1,
      backgroundColor: c.pageBg,
    },
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 28,
    },
    scrollContentContainer: {
      justifyContent: "space-between",
      paddingBottom: 28,
    },

    // ── HEADER / BRANDING ───────────────────
    brandSection: {
      alignItems: "center",
      paddingTop: 60,
      marginBottom: 32,
    },
    iconWrapper: {
      width: shape.iconSize,
      height: shape.iconSize,
      borderRadius: shape.iconRadius,
      backgroundColor: c.iconBg,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    appName: {
      fontSize: font.appName,
      fontWeight: "700",
      color: c.appName,
      letterSpacing: -0.5,
      marginBottom: 6,
    },
    appSubtitle: {
      fontSize: font.subtitle,
      fontWeight: "400",
      color: c.appSubtitle,
      letterSpacing: 0.1,
    },

    // ── CARD ────────────────────────────────
    card: {
      backgroundColor: c.cardBg,
      borderRadius: shape.cardRadius,
      paddingHorizontal: 24,
      paddingVertical: 28,
      borderWidth: 1,
      borderColor: c.cardBorder,
    },

    // ── FORM FIELDS ─────────────────────────
    fieldWrapper: {
      marginBottom: 20,
    },
    fieldWrapperLast: {
      marginBottom: 24,
    },
    label: {
      fontSize: font.label,
      fontWeight: "500",
      color: c.inputLabel,
      marginBottom: 8,
      letterSpacing: 0.1,
    },
    input: {
      height: shape.inputHeight,
      backgroundColor: c.inputBg,
      borderRadius: shape.inputRadius,
      borderWidth: 1,
      borderColor: c.inputBorder,
      paddingHorizontal: 16,
      marginBottom: 4,
      fontSize: font.input,
      color: c.inputText,
    },

    // ── BUTTON ──────────────────────────────
    button: {
      height: shape.buttonHeight,
      backgroundColor: c.buttonBg,
      borderRadius: shape.buttonRadius,
      justifyContent: "center",
      alignItems: "center",
    },

    disabledButton: {
      backgroundColor: c.buttonBg + "80", // 50% opacity
    },
    buttonText: {
      fontSize: font.button,
      fontWeight: "700",
      color: c.buttonText,
      letterSpacing: 0.3,
    },

    // ── HELPER TEXT ─────────────────────────
    helperText: {
      marginTop: 16,
      textAlign: "center",
      fontSize: font.helper,
      fontWeight: "400",
      color: c.helperText,
    },

    // ── FOOTER ──────────────────────────────
    footer: {
      paddingBottom: 32,
      alignItems: "center",
    },
    versionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    versionLine: {
      flex: 1,
      height: 1,
      backgroundColor: c.versionLine,
      maxWidth: 60,
    },
    versionText: {
      fontSize: font.version,
      fontWeight: "400",
      color: c.versionText,
      letterSpacing: 0.3,
    },

    buttonOption: {
      fontSize: font.button,
      fontWeight: "700",
      color: c.buttonOption,
      letterSpacing: 0.3,
    },

    // ── ERROR MESSAGE ───────────────────────
    errorContainer: {
      backgroundColor: "#fee2e2",
      borderLeftWidth: 4,
      borderLeftColor: "#ef4444",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    errorText: {
      color: "#dc2626",
      fontSize: font.helper,
      fontWeight: "500",
    },

    demoInfoContainer: {
      backgroundColor: "#e0f2fe",
      borderLeftWidth: 4,
      borderLeftColor: "#38bdf8",
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
  });

// ── PRE-BUILT EXPORTS ────────────────────────
export const LoginLightStyles = LoginCreateStyles(LoginLightColors);
export const LoginDarkStyles = LoginCreateStyles(LoginDarkColors);


// ============================================================
// AKUN SCREEN STYLE
// ============================================================

// ============================================================
// DESIGN TOKENS — AKUN SCREEN (LIGHT & DARK)
// ============================================================

export const AkunLightColors = {
  pageBg: "#f0f5ea",
  headerBg: "#f0f5ea",
  titleText: "#111b0f",

  // Profile card
  profileCardBg: "#ffffff",
  profileCardBorder: "#e2ead8",
  avatarBg: "#2e5c27",
  avatarText: "#ffffff",
  profileName: "#111b0f",
  profileUsername: "#7a9a6e",
  roleBadgeBg: "#f0f5ea",
  roleBadgeBorder: "#d0dcc8",
  roleBadgeText: "#3d5436",

  // Section label
  sectionLabel: "#8aaa7e",

  // Settings group card
  groupCardBg: "#ffffff",
  groupCardBorder: "#e2ead8",
  divider: "#eef3e8",

  // Row item
  rowIconBg: "#f0f5ea",
  rowTitle: "#111b0f",
  rowDesc: "#8aaa7e",
  rowArrow: "#c0cobb",
  rowArrowText: "#aabca0",

  // Status dot — online
  dotOnline: "#4caf50",
  dotOffline: "#9aaa8c",

  // "siap" badge (green)
  siapBg: "#d8f0d0",
  siapText: "#1a6020",

  // "soon" badge (amber/orange)
  soonBg: "#fff3d0",
  soonBorder: "#f0d080",
  soonText: "#a06000",

  // Toggle
  toggleOnBg: "#4caf50",
  toggleOffBg: "#d0d8c8",
  toggleThumb: "#ffffff",

  // Keluar row
  keluarCardBg: "#ffffff",
  keluarCardBorder: "#f5dada",
  keluarTitle: "#c0302a",
  keluarDesc: "#9a7070",

  // Footer
  footerText: "#9aaa8c",

  // Bottom nav
  navBg: "#ffffff",
  navBorder: "#e2ead8",
  navActive: "#2e5c27",
  navInactive: "#9aaa8c",
};

export const AkunDarkColors: typeof AkunLightColors = {
  pageBg: "#0d1a0c",
  headerBg: "#0d1a0c",
  titleText: "#e0eeda",

  profileCardBg: "#162014",
  profileCardBorder: "#1e2e1c",
  avatarBg: "#2a5224",
  avatarText: "#a0e090",
  profileName: "#e0eeda",
  profileUsername: "#4a6a44",
  roleBadgeBg: "#1a2e18",
  roleBadgeBorder: "#243e22",
  roleBadgeText: "#8aaa7e",

  sectionLabel: "#3e5c3a",

  groupCardBg: "#162014",
  groupCardBorder: "#1e2e1c",
  divider: "#1a2a18",

  rowIconBg: "#1a2e18",
  rowTitle: "#e0eeda",
  rowDesc: "#4a6a44",
  rowArrow: "#2a4028",
  rowArrowText: "#3a5838",

  dotOnline: "#4caf50",
  dotOffline: "#3a5838",

  siapBg: "#1a3818",
  siapText: "#4caf50",

  soonBg: "#2a2010",
  soonBorder: "#504020",
  soonText: "#c09040",

  toggleOnBg: "#4caf50",
  toggleOffBg: "#1e3020",
  toggleThumb: "#ffffff",

  keluarCardBg: "#2a1414",
  keluarCardBorder: "#4a2020",
  keluarTitle: "#f08080",
  keluarDesc: "#7a5050",

  footerText: "#3e5c3a",

  navBg: "#0d1a0c",
  navBorder: "#1a2e18",
  navActive: "#4caf50",
  navInactive: "#3e5c3a",
};

// ============================================================
// STYLE FACTORY
// ============================================================
export const AkunCreateStyles = (c: typeof AkunLightColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.pageBg },
    // screen: { flex: 1, backgroundColor: c.keluarCardBorder },
    safeArea: { flex: 1 },

    // ── HEADER ─────────────────────────────────────────────
    header: {
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

    // ── SCROLL ─────────────────────────────────────────────
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 },

    // ── PROFILE CARD ───────────────────────────────────────
    profileCard: {
      backgroundColor: c.profileCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.profileCardBorder,
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 20,
      gap: 14,
    },
    avatarCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.avatarBg,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: 22,
      fontWeight: "700",
      color: c.avatarText,
    },
    profileInfo: { flex: 1 },
    profileName: {
      fontSize: 17,
      fontWeight: "700",
      color: c.profileName,
      letterSpacing: -0.3,
      marginBottom: 2,
    },
    profileUsername: {
      fontSize: 13,
      color: c.profileUsername,
      fontWeight: "400",
    },
    roleBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.roleBadgeBg,
      borderWidth: 1,
      borderColor: c.roleBadgeBorder,
    },
    roleBadgeText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.roleBadgeText,
    },

    // ── SECTION LABEL ──────────────────────────────────────
    sectionLabel: {
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 1.2,
      color: c.sectionLabel,
      textTransform: "uppercase",
      marginBottom: 8,
      marginTop: 4,
      paddingHorizontal: 2,
    },

    // ── GROUP CARD ─────────────────────────────────────────
    groupCard: {
      backgroundColor: c.groupCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.groupCardBorder,
      marginBottom: 16,
      overflow: "hidden",
    },

    // ── ROW ITEM ───────────────────────────────────────────
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    rowLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 13,
    },
    rowIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.rowIconBg,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    rowIconEmoji: { fontSize: 18 },
    rowTextBlock: { flex: 1 },
    rowTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: c.rowTitle,
      letterSpacing: -0.2,
    },
    rowDesc: {
      fontSize: 12,
      color: c.rowDesc,
      marginTop: 2,
    },
    rowArrow: {
      fontSize: 17,
      color: c.rowArrowText,
      marginLeft: 8,
    },

    // ── STATUS DOT ─────────────────────────────────────────
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 12,
    },

    // ── BADGE: siap ────────────────────────────────────────
    siapBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.siapBg,
      marginLeft: 8,
    },
    siapText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.siapText,
    },

    // ── BADGE: soon ────────────────────────────────────────
    soonBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.soonBg,
      borderWidth: 1,
      borderColor: c.soonBorder,
      marginLeft: 8,
    },
    soonText: {
      fontSize: 12,
      fontWeight: "600",
      color: c.soonText,
    },

    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    modalSheet: {
      maxHeight: "82%",
      backgroundColor: c.groupCardBg,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 28,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: c.titleText,
      marginBottom: 12,
    },
    modalEmptyText: {
      fontSize: 14,
      color: c.rowDesc,
      textAlign: "center",
      paddingVertical: 26,
    },
    modalItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
      gap: 12,
    },
    modalItemLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      gap: 12,
    },
    modalItemInfo: {
      flex: 1,
    },
    modalItemTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: c.rowTitle,
    },
    modalItemMeta: {
      fontSize: 12,
      color: c.rowDesc,
      marginTop: 3,
    },
    modalItemValue: {
      fontSize: 13,
      fontWeight: "700",
      color: c.navActive,
    },
    modalDangerButton: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: "rgba(220, 38, 38, 0.12)",
    },
    modalDangerText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#dc2626",
    },
    modalCloseButton: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 16,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: c.rowIconBg,
    },
    modalCloseText: {
      fontSize: 14,
      fontWeight: "700",
      color: c.rowTitle,
    },
    modalLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: c.rowTitle,
      marginBottom: 6,
    },
    modalInput: {
      borderWidth: 1,
      borderColor: c.divider,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      fontSize: 14,
      color: c.rowTitle,
      backgroundColor: c.rowIconBg,
    },
    modalTextArea: {
      minHeight: 76,
      textAlignVertical: "top",
    },
    kasTypeRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 14,
    },
    kasTypeOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.divider,
      backgroundColor: c.groupCardBg,
    },
    kasTypeOptionActive: {
      borderColor: c.navActive,
      backgroundColor: c.rowIconBg,
    },
    kasTypeOptionText: {
      fontSize: 13,
      fontWeight: "700",
      color: c.rowDesc,
    },
    kasTypeOptionActiveText: {
      color: c.navActive,
    },
    modalActionRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 8,
    },
    modalCancelButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: c.rowIconBg,
    },
    modalCancelText: {
      fontSize: 14,
      fontWeight: "700",
      color: c.rowTitle,
    },
    modalSubmitButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: c.navActive,
    },
    modalSubmitText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    modalAddButton: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 14,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: c.navActive,
    },
    modalAddButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },

    // ── TOGGLE ─────────────────────────────────────────────
    toggleTrack: {
      width: 44,
      height: 26,
      borderRadius: 13,
      justifyContent: "center",
      paddingHorizontal: 3,
      marginLeft: 8,
    },
    toggleTrackOn: { backgroundColor: c.toggleOnBg },
    toggleTrackOff: { backgroundColor: c.toggleOffBg },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: c.toggleThumb,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleThumbOn: { alignSelf: "flex-end" },
    toggleThumbOff: { alignSelf: "flex-start" },

    // ── KELUAR CARD ────────────────────────────────────────
    keluarCard: {
      backgroundColor: c.keluarCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.keluarCardBorder,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginBottom: 16,
      gap: 12,
    },
    keluarIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.keluarCardBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    keluarTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: c.keluarTitle,
      letterSpacing: -0.2,
    },
    keluarDesc: {
      fontSize: 12,
      color: c.keluarDesc,
      marginTop: 2,
    },

    // ── FOOTER TEXT ────────────────────────────────────────
    footerText: {
      textAlign: "center",
      fontSize: 12,
      color: c.footerText,
      marginBottom: 12,
      marginTop: 4,
    },

    // ── BOTTOM NAV ─────────────────────────────────────────
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
    navLabelActive: { fontSize: 10, fontWeight: "700", color: c.navActive },
    navLabelInactive: { fontSize: 10, fontWeight: "400", color: c.navInactive },
  });

export const AkunLightStyles = AkunCreateStyles(AkunLightColors);
export const AkunDarkStyles = AkunCreateStyles(AkunDarkColors);


// ============================================================
// ITEM SCREEN STYLE
// ============================================================

// DESIGN TOKENS — ITEM LIST SCREEN

export const ItemLightColors = {
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

export const ItemDarkColors = {
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
export const ItemCreateStyles = (c: typeof ItemLightColors) =>
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

export const ItemLightStyles = ItemCreateStyles(ItemLightColors);
export const ItemDarkStyles = ItemCreateStyles(ItemDarkColors);


// ============================================================
// KASIR SCREEN STYLE
// ============================================================

// ============================================================
// DESIGN TOKENS — KASIR SCREEN (LIGHT & DARK)
// ============================================================

export const KasirLightColors = {
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

export const KasirDarkColors = {
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
export const KasirCreateStyles = (c: typeof KasirLightColors) =>
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
export const KasirLightStyles = KasirCreateStyles(KasirLightColors);
export const KasirDarkStyles = KasirCreateStyles(KasirDarkColors);


// ============================================================
// KAS SCREEN STYLE
// ============================================================

// ============================================================
// DESIGN TOKENS — KEUANGAN SCREEN (LIGHT & DARK)
// ============================================================

export const KasLightColors = {
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

export const KasDarkColors: typeof KasLightColors = {
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
export const KasCreateStyles = (c: typeof KasLightColors) =>
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
    bankOptionRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 12,
    },
    bankOption: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.subCardBorder,
      backgroundColor: c.subCardBg,
    },
    bankOptionActive: {
      borderColor: c.catatBtnBg,
      backgroundColor: c.histFilterActiveBg,
    },
    bankOptionText: {
      fontSize: 13,
      fontWeight: "600",
      color: c.tabInactive,
    },
    bankOptionActiveText: {
      color: c.catatBtnBg,
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

export const KasLightStyles = KasCreateStyles(KasLightColors);
export const KasDarkStyles = KasCreateStyles(KasDarkColors);


// ============================================================
// LAPORAN SCREEN STYLE
// ============================================================

// ============================================================
// DESIGN TOKENS — LAPORAN SCREEN (LIGHT & DARK)
// ============================================================

export const LaporanLightColors = {
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

export const LaporanDarkColors: typeof LaporanLightColors = {
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
export const LaporanCreateStyles = (c: typeof LaporanLightColors) =>
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

export const LaporanLightStyles = LaporanCreateStyles(LaporanLightColors);
export const LaporanDarkStyles = LaporanCreateStyles(LaporanDarkColors);


export const ScreenStyle = {
  akun: {
    lightColors: AkunLightColors,
    darkColors: AkunDarkColors,
    createStyles: AkunCreateStyles,
    lightStyles: AkunLightStyles,
    darkStyles: AkunDarkStyles,
  },
  item: {
    lightColors: ItemLightColors,
    darkColors: ItemDarkColors,
    createStyles: ItemCreateStyles,
    lightStyles: ItemLightStyles,
    darkStyles: ItemDarkStyles,
  },
  kas: {
    lightColors: KasLightColors,
    darkColors: KasDarkColors,
    createStyles: KasCreateStyles,
    lightStyles: KasLightStyles,
    darkStyles: KasDarkStyles,
  },
  kasir: {
    lightColors: KasirLightColors,
    darkColors: KasirDarkColors,
    createStyles: KasirCreateStyles,
    lightStyles: KasirLightStyles,
    darkStyles: KasirDarkStyles,
  },
  laporan: {
    lightColors: LaporanLightColors,
    darkColors: LaporanDarkColors,
    createStyles: LaporanCreateStyles,
    lightStyles: LaporanLightStyles,
    darkStyles: LaporanDarkStyles,
  },
  login: {
    lightColors: LoginLightColors,
    darkColors: LoginDarkColors,
    createStyles: LoginCreateStyles,
    lightStyles: LoginLightStyles,
    darkStyles: LoginDarkStyles,
  },
};
