import { StyleSheet } from 'react-native';

// ============================================================
// DESIGN TOKENS — AKUN SCREEN (LIGHT & DARK)
// ============================================================

export const lightColors = {
  pageBg:       '#f0f5ea',
  headerBg:     '#f0f5ea',
  titleText:    '#111b0f',

  // Profile card
  profileCardBg:     '#ffffff',
  profileCardBorder: '#e2ead8',
  avatarBg:          '#2e5c27',
  avatarText:        '#ffffff',
  profileName:       '#111b0f',
  profileUsername:   '#7a9a6e',
  roleBadgeBg:       '#f0f5ea',
  roleBadgeBorder:   '#d0dcc8',
  roleBadgeText:     '#3d5436',

  // Section label
  sectionLabel: '#8aaa7e',

  // Settings group card
  groupCardBg:     '#ffffff',
  groupCardBorder: '#e2ead8',
  divider:         '#eef3e8',

  // Row item
  rowIconBg:      '#f0f5ea',
  rowTitle:       '#111b0f',
  rowDesc:        '#8aaa7e',
  rowArrow:       '#c0cobb',
  rowArrowText:   '#aabca0',

  // Status dot — online
  dotOnline:  '#4caf50',
  dotOffline: '#9aaa8c',

  // "siap" badge (green)
  siapBg:     '#d8f0d0',
  siapText:   '#1a6020',

  // "soon" badge (amber/orange)
  soonBg:     '#fff3d0',
  soonBorder: '#f0d080',
  soonText:   '#a06000',

  // Toggle
  toggleOnBg:   '#4caf50',
  toggleOffBg:  '#d0d8c8',
  toggleThumb:  '#ffffff',

  // Keluar row
  keluarCardBg:     '#ffffff',
  keluarCardBorder: '#f5dada',
  keluarTitle:      '#c0302a',
  keluarDesc:       '#9a7070',

  // Footer
  footerText: '#9aaa8c',

  // Bottom nav
  navBg:      '#ffffff',
  navBorder:  '#e2ead8',
  navActive:  '#2e5c27',
  navInactive:'#9aaa8c',
};

export const darkColors: typeof lightColors = {
  pageBg:       '#0d1a0c',
  headerBg:     '#0d1a0c',
  titleText:    '#e0eeda',

  profileCardBg:     '#162014',
  profileCardBorder: '#1e2e1c',
  avatarBg:          '#2a5224',
  avatarText:        '#a0e090',
  profileName:       '#e0eeda',
  profileUsername:   '#4a6a44',
  roleBadgeBg:       '#1a2e18',
  roleBadgeBorder:   '#243e22',
  roleBadgeText:     '#8aaa7e',

  sectionLabel: '#3e5c3a',

  groupCardBg:     '#162014',
  groupCardBorder: '#1e2e1c',
  divider:         '#1a2a18',

  rowIconBg:    '#1a2e18',
  rowTitle:     '#e0eeda',
  rowDesc:      '#4a6a44',
  rowArrow:     '#2a4028',
  rowArrowText: '#3a5838',

  dotOnline:  '#4caf50',
  dotOffline: '#3a5838',

  siapBg:     '#1a3818',
  siapText:   '#4caf50',

  soonBg:     '#2a2010',
  soonBorder: '#504020',
  soonText:   '#c09040',

  toggleOnBg:   '#4caf50',
  toggleOffBg:  '#1e3020',
  toggleThumb:  '#ffffff',

  keluarCardBg:     '#2a1414',
  keluarCardBorder: '#4a2020',
  keluarTitle:      '#f08080',
  keluarDesc:       '#7a5050',

  footerText: '#3e5c3a',

  navBg:      '#0d1a0c',
  navBorder:  '#1a2e18',
  navActive:  '#4caf50',
  navInactive:'#3e5c3a',
};

// ============================================================
// STYLE FACTORY
// ============================================================
export const createStyles = (c: typeof lightColors) =>
  StyleSheet.create({

    screen:   { flex: 1, backgroundColor: c.pageBg },
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
      fontWeight: '700',
      color: c.titleText,
      letterSpacing: -0.5,
    },

    // ── SCROLL ─────────────────────────────────────────────
    scroll:        { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 },

    // ── PROFILE CARD ───────────────────────────────────────
    profileCard: {
      backgroundColor: c.profileCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.profileCardBorder,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 20,
      gap: 14,
    },
    avatarCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.avatarBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 22,
      fontWeight: '700',
      color: c.avatarText,
    },
    profileInfo: { flex: 1 },
    profileName: {
      fontSize: 17,
      fontWeight: '700',
      color: c.profileName,
      letterSpacing: -0.3,
      marginBottom: 2,
    },
    profileUsername: {
      fontSize: 13,
      color: c.profileUsername,
      fontWeight: '400',
    },
    roleBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: c.roleBadgeBg,
      borderWidth: 1,
      borderColor: c.roleBadgeBorder,
    },
    roleBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: c.roleBadgeText,
    },

    // ── SECTION LABEL ──────────────────────────────────────
    sectionLabel: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1.2,
      color: c.sectionLabel,
      textTransform: 'uppercase',
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
      overflow: 'hidden',
    },

    // ── ROW ITEM ───────────────────────────────────────────
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    rowLast: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 13,
    },
    rowIconBox: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: c.rowIconBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    rowIconEmoji: { fontSize: 18 },
    rowTextBlock: { flex: 1 },
    rowTitle: {
      fontSize: 15,
      fontWeight: '600',
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
      fontWeight: '600',
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
      fontWeight: '600',
      color: c.soonText,
    },

    // ── TOGGLE ─────────────────────────────────────────────
    toggleTrack: {
      width: 44,
      height: 26,
      borderRadius: 13,
      justifyContent: 'center',
      paddingHorizontal: 3,
      marginLeft: 8,
    },
    toggleTrackOn:  { backgroundColor: c.toggleOnBg },
    toggleTrackOff: { backgroundColor: c.toggleOffBg },
    toggleThumb: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: c.toggleThumb,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    toggleThumbOn:  { alignSelf: 'flex-end' },
    toggleThumbOff: { alignSelf: 'flex-start' },

    // ── KELUAR CARD ────────────────────────────────────────
    keluarCard: {
      backgroundColor: c.keluarCardBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.keluarCardBorder,
      flexDirection: 'row',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    keluarTitle: {
      fontSize: 15,
      fontWeight: '700',
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
      textAlign: 'center',
      fontSize: 12,
      color: c.footerText,
      marginBottom: 12,
      marginTop: 4,
    },

    // ── BOTTOM NAV ─────────────────────────────────────────
    bottomNav: {
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      flexDirection: 'row',
      backgroundColor: c.navBg,
      borderTopWidth: 1,
      borderTopColor: c.navBorder,
      paddingBottom: 22,
      paddingTop: 10,
    },
    navItem:   { flex: 1, alignItems: 'center', gap: 3 },
    navEmoji:  { fontSize: 20 },
    navLabelActive:   { fontSize: 10, fontWeight: '700', color: c.navActive },
    navLabelInactive: { fontSize: 10, fontWeight: '400', color: c.navInactive },
  });

export const lightStyles = createStyles(lightColors);
export const darkStyles  = createStyles(darkColors);
