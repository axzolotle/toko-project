import { StyleSheet } from "react-native";

// ============================================
// DESIGN TOKENS
// ============================================

export const lightColors = {
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

export const darkColors = {
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

export const createStyles = (c: typeof lightColors) =>
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
export const lightStyles = createStyles(lightColors);
export const darkStyles = createStyles(darkColors);
