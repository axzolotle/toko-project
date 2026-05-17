import { getTransaksiHarian } from "@/database/db2";
import { useTheme } from "@/lib/ThemeContext";
import {
  darkColors,
  darkStyles,
  lightColors,
  lightStyles,
} from "@/styles/LaporanStyles";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================================
//  TYPES
// ============================================================

type Kategori = "Barang Fisik" | "Voucher" | "Digital" | "Transfer";

interface Transaksi {
  id: number; // nomor urut tampil di card (descending)
  nama: string;
  kategori: Kategori;
  harga: number; // harga jual
  modal: number; // harga beli / modal
  tanggal: string; // 'YYYY-MM-DD'
}

interface RingkasanJenis {
  kategori: Kategori;
  jumlah: number; // qty transaksi
  totalOmset: number;
}

interface LaporanData {
  totalTransaksi: number;
  totalOmset: number;
  totalLaba: number;
  perJenis: RingkasanJenis[];
  riwayat: Transaksi[];
}

// ============================================================
//  1. LAYER SQL / DATABASE
//     Ganti isi fungsi-fungsi ini dengan query SQLite / API
//     sesungguhnya. Kembalikan tipe data yang sama.
// ============================================================

/** Ambil semua transaksi untuk tanggal tertentu dari database SQLite */
const db_getTransaksiByTanggal = async (
  tanggal: string,
): Promise<Transaksi[]> => {
  try {
    const rows = getTransaksiHarian(tanggal);
    return rows.map((row) => ({
      id: row.id,
      nama: row.item_nama,
      kategori: row.item_jenis as Kategori,
      harga: row.harga_jual,
      modal: row.harga_modal,
      tanggal: row.tanggal,
    }));
  } catch (error) {
    console.error("Error fetching transaksi harian:", error);
    return [];
  }
};

// ============================================================
//  2. LAYER KALKULASI / TRANSFORM
//     Fungsi-fungsi murni — tidak perlu diubah
// ============================================================

const hitungRingkasan = (list: Transaksi[]): LaporanData => {
  const totalOmset = list.reduce((s, t) => s + t.harga, 0);
  const totalLaba = list.reduce((s, t) => s + (t.harga - t.modal), 0);

  // Group per kategori
  const map: Record<string, RingkasanJenis> = {};
  list.forEach((t) => {
    if (!map[t.kategori]) {
      map[t.kategori] = {
        kategori: t.kategori,
        jumlah: 0,
        totalOmset: 0,
      };
    }
    map[t.kategori].jumlah += 1;
    map[t.kategori].totalOmset += t.harga;
  });

  // Sort per-jenis descending by omset
  const perJenis = Object.values(map).sort(
    (a, b) => b.totalOmset - a.totalOmset,
  );

  return {
    totalTransaksi: list.length,
    totalOmset,
    totalLaba,
    perJenis,
    riwayat: list, // sudah urut dari DB (id DESC)
  };
};

const formatRp = (n: number) => "Rp " + n.toLocaleString("id-ID");

// Navigasi tanggal: +1 / -1 hari
const geserTanggal = (iso: string, hari: number): string => {
  const d = new Date(iso);
  d.setDate(d.getDate() + hari);
  return d.toISOString().split("T")[0];
};

const formatTanggalLabel = (iso: string): string => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isHariIni = (iso: string): boolean =>
  iso === new Date().toISOString().split("T")[0];

// ============================================================
//  3. LAYER HOOK (state + fetch dalam screen)
// ============================================================

const useLaporan = () => {
  const todayIso = new Date().toISOString().split("T")[0];

  const [tanggal, setTanggal] = useState<string>(todayIso);
  const [data, setData] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  const muat = useCallback(async (tgl: string) => {
    setLoading(true);
    setData(null);
    try {
      const rows = await db_getTransaksiByTanggal(tgl);
      setData(hitungRingkasan(rows));
    } catch (e) {
      console.error("Gagal memuat laporan:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Muat ulang setiap kali tanggal berubah
  useEffect(() => {
    muat(tanggal);
  }, [tanggal, muat]);

  const prevHari = () => setTanggal((g) => geserTanggal(g, -1));
  const nextHari = () => setTanggal((g) => geserTanggal(g, +1));

  const sync = async () => {
    setSyncing(true);
    await muat(tanggal); // ganti dengan logika sync server nyata
    setSyncing(false);
  };

  return { tanggal, data, loading, syncing, prevHari, nextHari, sync };
};

// ============================================================
//  4. LAYER KOMPONEN UI
// ============================================================

// ── Stats Row ─────────────────────────────────────────────────
const StatsRow: React.FC<{ data: LaporanData; S: any }> = ({ data, S }) => (
  <View style={S.statsRow}>
    <View style={S.statCard}>
      <Text style={S.statLabel}>Transaksi</Text>
      <Text style={S.statValueDark}>{data.totalTransaksi}</Text>
    </View>
    <View style={S.statCard}>
      <Text style={S.statLabel}>Omset</Text>
      <Text style={S.statValueGreen}>{formatRp(data.totalOmset)}</Text>
    </View>
    <View style={S.statCard}>
      <Text style={S.statLabel}>Laba</Text>
      <Text style={S.statValueGreen}>{formatRp(data.totalLaba)}</Text>
    </View>
  </View>
);

// ── Per-Jenis Section ─────────────────────────────────────────
const PerJenisSection: React.FC<{
  perJenis: RingkasanJenis[];
  S: any;
}> = ({ perJenis, S }) => (
  <>
    <Text style={S.sectionLabel}>Per Jenis</Text>
    {perJenis.map((j) => (
      <View key={j.kategori} style={S.jenisCard}>
        <Text style={S.jenisName}>{j.kategori}</Text>
        <Text style={S.jenisCount}>{j.jumlah}×</Text>
        <Text style={S.jenisPrice}>{formatRp(j.totalOmset)}</Text>
      </View>
    ))}
  </>
);

// ── Riwayat Section ───────────────────────────────────────────
const RiwayatSection: React.FC<{
  riwayat: Transaksi[];
  S: any;
}> = ({ riwayat, S }) => (
  <>
    <Text style={S.sectionLabel}>Riwayat ({riwayat.length})</Text>
    {riwayat.map((t) => {
      const laba = t.harga - t.modal;
      return (
        <View key={t.id} style={S.riwayatCard}>
          {/* Nomor urut */}
          <View style={S.riwayatNumBadge}>
            <Text style={S.riwayatNumText}>{t.id}</Text>
          </View>

          {/* Info produk */}
          <View style={S.riwayatInfo}>
            <Text style={S.riwayatName}>{t.nama}</Text>
            <Text style={S.riwayatMeta}>{t.kategori}</Text>
          </View>

          {/* Harga + laba */}
          <View style={S.riwayatRight}>
            <View style={S.riwayatPriceRow}>
              <Text style={S.riwayatPrice}>{formatRp(t.harga)}</Text>
              <View style={S.riwayatDot} />
            </View>
            <Text style={S.riwayatProfit}>+{formatRp(laba)}</Text>
          </View>
        </View>
      );
    })}
  </>
);

// ============================================================
//  5. MAIN SCREEN EXPORT
// ============================================================
const LaporanScreen: React.FC = () => {
  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  // Hook: semua state + fetch ada di sini
  const { tanggal, data, loading, syncing, prevHari, nextHari, sync } =
    useLaporan();

  const labelTanggal = formatTanggalLabel(tanggal);
  const hariIni = isHariIni(tanggal);

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.headerBg}
      />

      <View style={S.screen}>
        {/* <SafeAreaView style={S.safeArea}> */}
        {/* ── HEADER ── */}
        <View style={S.header}>
          <Text style={S.headerTitle}>Laporan</Text>
          <TouchableOpacity
            style={S.syncButton}
            onPress={sync}
            activeOpacity={0.8}
            disabled={syncing}
          >
            <View style={S.syncDot} />
            <Text style={S.syncText}>{syncing ? "Syncing..." : "Sync"}</Text>
          </TouchableOpacity>
        </View>

        {/* ── DATE NAVIGATOR ── */}
        <View style={S.dateNav}>
          <TouchableOpacity
            style={S.dateArrow}
            onPress={prevHari}
            activeOpacity={0.7}
          >
            <Text style={S.dateArrowText}>‹</Text>
          </TouchableOpacity>

          <View style={S.dateCenter}>
            <Text style={S.dateTitleText}>{labelTanggal}</Text>
            {hariIni && <Text style={S.dateSubText}>hari ini</Text>}
          </View>

          <TouchableOpacity
            style={S.dateArrow}
            onPress={nextHari}
            activeOpacity={0.7}
          >
            <Text style={S.dateArrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── CONTENT ── */}
        {loading ? (
          <View style={S.centered}>
            <ActivityIndicator color={C.statValueGreen} size="large" />
          </View>
        ) : !data || data.totalTransaksi === 0 ? (
          <View style={S.centered}>
            <Text style={S.emptyText}>
              Tidak ada transaksi{"\n"}pada tanggal ini
            </Text>
          </View>
        ) : (
          <ScrollView
            style={S.scroll}
            contentContainerStyle={S.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats */}
            <StatsRow data={data} S={S} />

            {/* Per Jenis */}
            <PerJenisSection perJenis={data.perJenis} S={S} />

            {/* Riwayat */}
            <RiwayatSection riwayat={data.riwayat} S={S} />
          </ScrollView>
        )}
        {/* </SafeAreaView> */}
      </View>
    </>
  );
};

export default LaporanScreen;
