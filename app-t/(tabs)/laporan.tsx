import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getTransaksiHarian, getRingkasanHarian, Transaksi, RingkasanHarian } from '../../database/db';
import { syncToSupabase } from '../../database/sync';

function formatRp(n: number): string {
  return 'Rp ' + (n ?? 0).toLocaleString('id-ID');
}

function formatTanggal(tgl: string): string {
  // tgl = 'YYYY-MM-DD' — parse manual agar tidak kena timezone issue
  const [y, m, d] = tgl.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function LaporanScreen() {
  const [tanggal, setTanggal]       = useState<string>(todayString());
  const [transaksi, setTransaksi]   = useState<Transaksi[]>([]);
  const [ringkasan, setRingkasan]   = useState<RingkasanHarian>({
    total_transaksi: 0, total_omset: 0, total_laba: 0,
  });
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(() => {
    setTransaksi(getTransaksiHarian(tanggal));
    setRingkasan(getRingkasanHarian(tanggal));
  }, [tanggal]);

  useFocusEffect(load);

  const gantiHari = (delta: number) => {
    const [y, m, d] = tanggal.split('-').map(Number);
    const date = new Date(y, m - 1, d + delta);
    const newTgl = date.toISOString().slice(0, 10);
    setTanggal(newTgl);
  };

  const isHariIni = tanggal >= todayString();

  const handleSync = async () => {
    setSyncing(true);
    const result = await syncToSupabase();
    setSyncing(false);
    Alert.alert(
      result.ok ? '✓ Sinkronisasi Berhasil' : '✗ Gagal Sinkronisasi',
      result.message
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* ── Header ─────────────────────────────── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Laporan</Text>
        <TouchableOpacity
          style={[s.syncBtn, syncing && s.syncBtnDisabled]}
          onPress={handleSync}
          disabled={syncing}
        >
          {syncing
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.syncBtnText}>☁  Sync</Text>
          }
        </TouchableOpacity>
      </View>

      {/* ── Navigasi tanggal ─────────────────── */}
      <View style={s.dateNav}>
        <TouchableOpacity style={s.dateArrowBtn} onPress={() => gantiHari(-1)}>
          <Text style={s.dateArrow}>‹</Text>
        </TouchableOpacity>
        <View style={s.dateCenter}>
          <Text style={s.dateText}>{formatTanggal(tanggal)}</Text>
          {isHariIni && (
            <View style={s.hariIniTag}>
              <Text style={s.hariIniText}>Hari Ini</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={[s.dateArrowBtn, isHariIni && s.dateArrowDisabled]}
          onPress={() => gantiHari(1)}
          disabled={isHariIni}
        >
          <Text style={[s.dateArrow, isHariIni && { color: '#e2e8f0' }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── Ringkasan 3 kotak ─────────────────── */}
      <View style={s.ringkasanRow}>
        <View style={s.ringkasanCard}>
          <Text style={s.ringkasanLabel}>Transaksi</Text>
          <Text style={s.ringkasanValue}>{ringkasan.total_transaksi}</Text>
        </View>
        <View style={[s.ringkasanCard, s.ringkasanCardBlue]}>
          <Text style={s.ringkasanLabel}>Omset</Text>
          <Text style={[s.ringkasanValue, s.ringkasanValueBlue]}>
            {formatRp(ringkasan.total_omset)}
          </Text>
        </View>
        <View style={[s.ringkasanCard, s.ringkasanCardGreen]}>
          <Text style={s.ringkasanLabel}>Laba</Text>
          <Text style={[s.ringkasanValue, s.ringkasanValueGreen]}>
            {formatRp(ringkasan.total_laba)}
          </Text>
        </View>
      </View>

      {/* ── List transaksi ────────────────────── */}
      {transaksi.length === 0 ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyEmoji}>📭</Text>
          <Text style={s.emptyText}>Belum ada transaksi</Text>
          <Text style={s.emptySubtext}>Catat penjualan di tab Kasir</Text>
        </View>
      ) : (
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12, gap: 8 }}
          renderItem={({ item, index }) => (
            <View style={s.trxCard}>
              <View style={s.trxNumBox}>
                <Text style={s.trxNum}>{transaksi.length - index}</Text>
              </View>
              <View style={s.trxInfo}>
                <Text style={s.trxNama}>{item.barang_nama}</Text>
                <Text style={s.trxJenis}>{item.barang_jenis}</Text>
              </View>
              <View style={s.trxAmounts}>
                <Text style={s.trxTotal}>{formatRp(item.total)}</Text>
                <Text style={s.trxLaba}>+{formatRp(item.laba)}</Text>
              </View>
              {/* Indikator sudah di-sync */}
              <View style={[s.syncDot, item.synced === 1 ? s.syncDotOk : s.syncDotPending]} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#f8fafc' },

  header:              { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
                         justifyContent: 'space-between', padding: 16, paddingTop: 20,
                         borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  headerTitle:         { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  syncBtn:             { backgroundColor: '#2563eb', paddingHorizontal: 16,
                         paddingVertical: 8, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  syncBtnDisabled:     { opacity: 0.6 },
  syncBtnText:         { color: '#fff', fontSize: 13, fontWeight: '700' },

  dateNav:             { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
                         paddingVertical: 10, paddingHorizontal: 8,
                         borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9' },
  dateArrowBtn:        { padding: 8 },
  dateArrowDisabled:   { opacity: 0.3 },
  dateArrow:           { fontSize: 28, color: '#2563eb', fontWeight: '300', lineHeight: 32 },
  dateCenter:          { flex: 1, alignItems: 'center', gap: 4 },
  dateText:            { fontSize: 13, fontWeight: '600', color: '#0f172a', textAlign: 'center' },
  hariIniTag:          { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  hariIniText:         { fontSize: 10, color: '#1d4ed8', fontWeight: '700' },

  ringkasanRow:        { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 6 },
  ringkasanCard:       { flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12,
                         alignItems: 'center', borderWidth: 0.5, borderColor: '#e2e8f0' },
  ringkasanCardBlue:   { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  ringkasanCardGreen:  { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  ringkasanLabel:      { fontSize: 10, color: '#64748b', fontWeight: '600',
                         textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  ringkasanValue:      { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  ringkasanValueBlue:  { color: '#1d4ed8' },
  ringkasanValueGreen: { color: '#15803d' },

  trxCard:      { backgroundColor: '#fff', borderRadius: 12, padding: 14,
                  flexDirection: 'row', alignItems: 'center', gap: 12,
                  borderWidth: 0.5, borderColor: '#e2e8f0' },
  trxNumBox:    { width: 30, height: 30, borderRadius: 15, backgroundColor: '#eff6ff',
                  justifyContent: 'center', alignItems: 'center' },
  trxNum:       { fontSize: 12, fontWeight: '800', color: '#2563eb' },
  trxInfo:      { flex: 1 },
  trxNama:      { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  trxJenis:     { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  trxAmounts:   { alignItems: 'flex-end' },
  trxTotal:     { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  trxLaba:      { fontSize: 11, color: '#16a34a', fontWeight: '700', marginTop: 2 },
  syncDot:      { width: 6, height: 6, borderRadius: 3 },
  syncDotOk:    { backgroundColor: '#22c55e' },
  syncDotPending: { backgroundColor: '#f59e0b' },

  emptyBox:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji:   { fontSize: 48, marginBottom: 12 },
  emptyText:    { fontSize: 18, fontWeight: '600', color: '#64748b' },
  emptySubtext: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
});
