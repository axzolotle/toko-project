import { StyleSheet } from "react-native";

/**
 * ============================================
 * KASIR APP - DESIGN SYSTEM & STYLING
 * ============================================
 *
 * Color Palette, Typography, dan Spacing
 * Based on gambar yang diberikan
 */

// ============================================
// COLOR PALETTE
// ============================================
const colors = {
  // Primary - Green theme (sesuai gambar)
  primary: "#22c55e", // Bright green (main action)
  primaryDark: "#16a34a", // Darker green
  primaryLight: "#dcfce7", // Light green background
  primaryVeryLight: "#f0fdf4", // Almost white green

  // Secondary
  secondary: "#64748b", // Slate gray
  secondaryLight: "#cbd5e1", // Light slate

  // Background
  background: "#f8fafc", // Off-white (page background)
  backgroundLight: "#ffffff", // White (cards)

  // Text
  textDark: "#0f172a", // Almost black
  textMedium: "#475569", // Medium gray
  textLight: "#94a3b8", // Light gray
  textLighter: "#cbd5e1", // Very light gray

  // Borders
  border: "#e2e8f0", // Light border
  borderLight: "#f1f5f9", // Very light border

  // Status
  success: "#22c55e", // Green
  danger: "#ef4444", // Red
  warning: "#f59e0b", // Amber

  // Utility
  white: "#ffffff",
  black: "#000000",
  disabled: "#d1d5db",
};

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================
const typography = {
  h1: 28, // Page title - "Kasir"
  h2: 24, // Not used
  h3: 20, // Profit value
  body: 16, // Product name
  bodySmall: 14, // Filter button, button text
  caption: 12, // Subtitle, helper text
  micro: 11, // Very small text
};

// ============================================
// SPACING SYSTEM
// ============================================
const spacing = {
  xs: 4, // Extra small gaps
  sm: 8, // Small gaps
  md: 12, // Medium (default)
  lg: 16, // Large
  xl: 20, // Extra large
  xxl: 24, // Double extra
  xxxl: 32, // Triple extra
};

// ============================================
// MAIN STYLES OBJECT
// ============================================
export const KasirStyles = StyleSheet.create({
  // ========== CONTAINER & LAYOUT ==========
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ========== HEADER ==========
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: typography.h1,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: typography.caption,
    color: colors.textMedium,
    fontWeight: "400",
    letterSpacing: 0.2,
  },

  // ========== STEP PROGRESS ==========
  stepProgressContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryVeryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepText: {
    fontSize: typography.caption,
    color: colors.textMedium,
    fontWeight: "500",
    textAlign: "center",
  },
  stepTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  stepConnector: {
    flex: 1,
    height: 1.5,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  stepConnectorActive: {
    backgroundColor: colors.primary,
  },
  checkmarkText: {
    color: colors.backgroundLight,
    fontSize: 20,
    fontWeight: "700",
  },

  // ========== CONTENT AREA ==========
  contentContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: spacing.xl,
  },

  // ========== STEP 1: TRANSACTION TYPE ==========
  transactionGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  transactionCard: {
    width: "48%",
    backgroundColor: colors.backgroundLight,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
  transactionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryVeryLight,
    borderWidth: 2,
  },
  transactionIcon: {
    fontSize: 36,
    marginBottom: spacing.md,
  },
  transactionLabel: {
    fontSize: typography.bodySmall,
    fontWeight: "600",
    color: colors.textDark,
    textAlign: "center",
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  transactionCount: {
    fontSize: typography.caption,
    color: colors.textLight,
    fontWeight: "400",
  },

  // ========== STEP 2: FILTER BUTTONS ==========
  filterBarContainer: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterButton: {
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm + 2,
    marginRight: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.caption,
    color: colors.textMedium,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  filterButtonTextActive: {
    color: colors.backgroundLight,
    fontWeight: "600",
  },

  // ========== STEP 2: PRODUCT CARD ==========
  productCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 68,
  },
  productCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryVeryLight,
    borderWidth: 1.5,
  },
  productIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
    opacity: 0.6,
  },
  productInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  productName: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  productDescription: {
    fontSize: typography.caption,
    color: colors.textLight,
    fontWeight: "400",
  },
  productPrice: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.primary,
    minWidth: 90,
    textAlign: "right",
    letterSpacing: -0.5,
  },
  productCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.md,
  },

  // ========== STEP 3: CONFIRMATION ==========
  confirmationCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  confirmationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  confirmationIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  confirmationItemName: {
    flex: 1,
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textDark,
    letterSpacing: -0.3,
  },
  confirmationBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: 12,
    marginLeft: spacing.md,
  },
  confirmationBadgeText: {
    fontSize: typography.caption,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  confirmationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  confirmationLabel: {
    fontSize: typography.bodySmall,
    color: colors.textMedium,
    fontWeight: "400",
  },
  confirmationValue: {
    fontSize: typography.bodySmall,
    fontWeight: "600",
    color: colors.textDark,
    letterSpacing: -0.3,
  },
  profitSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  profitValue: {
    fontSize: typography.h3,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: -0.5,
  },

  // ========== FOOTER BUTTONS ==========
  footerContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    gap: spacing.md,
  },
  buttonBack: {
    flex: 1,
    paddingVertical: spacing.md + 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonBackText: {
    fontSize: typography.bodySmall,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: -0.3,
  },
  buttonNext: {
    flex: 2,
    paddingVertical: spacing.md + 4,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonNextText: {
    fontSize: typography.bodySmall,
    fontWeight: "600",
    color: colors.backgroundLight,
    letterSpacing: -0.3,
  },
  buttonNextDisabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonNextDisabledText: {
    color: colors.backgroundLight,
  },

  // ========== EMPTY STATE ==========
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography.bodySmall,
    color: colors.textMedium,
    textAlign: "center",
  },
});

export default KasirStyles;
