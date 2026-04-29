import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert, TextInput,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAllBarang, deleteBarang, Barang } from '../../database/db';

function formatRp(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}

const WARNA_JENIS: Record<string, { bg: string; text: string }> = {
  Makanan:  { bg: '#fff7ed', text: '#c2410c' },
  Minuman:  { bg: '#eff6ff', text: '#1d4ed8' },
  Snack:    { bg: '#f0fdf4', text: '#15803d' },
  Rokok:    { bg: '#fef2f2', text: '#b91c1c' },
  Sembako:  { bg: '#faf5ff', text: '#7e22ce' },
  Lainnya:  { bg: '#f8fafc', text: '#475569' },
};

function getWarna(jenis: string) {
  return WARNA_JENIS[jenis] ?? { bg: '#f1f5f9', text: '#475569' };
}

export default function BarangScreen() {
  const router = useRouter();
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      setBarangList(getAllBarang());
    }, [])
  );

  const filtered = barangList.filter((b) =>
    b.nama.toLowerCase().includes(query.toLowerCase()) ||
    b.jenis.toLowerCase().includes(query.toLowerCase()) ||
    b.detail.toLowerCase().includes(query.toLowerCase())
  );

  const handleDelete = (b: Barang) => {
    Alert.alert(
      'Hapus Barang',
      `Hapus "${b.nama}"? Riwayat transaksi tetap tersimpan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            deleteBarang(b.id);
            setBarangList(getAllBarang());
          },
        },
      ]
    ); 
  };

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Barang</Text>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push('/barang/new')}
        >
          <Text style={s.addBtnText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Pencarian */}
      <TextInput
        style={s.search}
        placeholder="Cari nama, jenis, atau keterangan..."
        value={query}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
      />

      {/* Jumlah barang */}
      <Text style={s.countLabel}>
        {filtered.length} barang {query ? `untuk "${query}"` : 'terdaftar'}
      </Text>

      {/* Daftar barang */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, paddingTop: 0, gap: 8 }}
        renderItem={({ item }) => {
          const w = getWarna(item.jenis);
          const laba = item.harga_jual - item.harga_modal;
          const marginPct = item.harga_modal > 0
            ? Math.round((laba / item.harga_modal) * 100)
            : 0;

          return (
            <TouchableOpacity
              style={s.card}
              onPress={() => router.push(`/barang/${item.id}`)}
              onLongPress={() => handleDelete(item)}
              activeOpacity={0.8}
            >
              {/* Kiri: info */}
              <View style={s.cardLeft}>
                <View style={[s.jenisBadge, { backgroundColor: w.bg }]}>
                  <Text style={[s.jenisBadgeText, { color: w.text }]}>{item.jenis}</Text>
                </View>
                <Text style={s.cardNama}>{item.nama}</Text>
                {item.detail ? (
                  <Text style={s.cardDetail} numberOfLines={1}>{item.detail}</Text>
                ) : null}
              </View>

              {/* Kanan: harga */}
              <View style={s.cardRight}>
                <Text style={s.cardJual}>{formatRp(item.harga_jual)}</Text>
                <Text style={s.cardModal}>modal: {formatRp(item.harga_modal)}</Text>
                <Text style={s.cardLaba}>
                  +{formatRp(laba)} ({marginPct}%)
                </Text>
              </View>

              {/* Indikator sync */}
              <View style={[s.syncDot, item.synced === 1 ? s.syncOk : s.syncPending]} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={s.emptyBox}>
            <Text style={s.emptyEmoji}>🗂️</Text>
            <Text style={s.emptyText}>
              {query ? 'Barang tidak ditemukan' : 'Belum ada barang'}
            </Text>
            {!query && (
              <Text style={s.emptySubtext}>Tekan "+ Tambah" untuk menambahkan barang baru</Text>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#f8fafc' },

  header:        { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
                   justifyContent: 'space-between', padding: 16, paddingTop: 20,
                   borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0' },
  headerTitle:   { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  addBtn:        { backgroundColor: '#2563eb', paddingHorizontal: 16,
                   paddingVertical: 8, borderRadius: 20 },
  addBtnText:    { color: '#fff', fontSize: 13, fontWeight: '700' },

  search:        { margin: 12, marginBottom: 6, padding: 11, backgroundColor: '#fff',
                   borderRadius: 10, borderWidth: 0.5, borderColor: '#e2e8f0', fontSize: 14 },
  countLabel:    { fontSize: 11, color: '#94a3b8', paddingHorizontal: 14,
                   paddingBottom: 8, fontWeight: '500' },

  card:          { backgroundColor: '#fff', borderRadius: 14, padding: 14,
                   flexDirection: 'row', borderWidth: 0.5, borderColor: '#e2e8f0',
                   alignItems: 'center', gap: 10 },
  cardLeft:      { flex: 1, gap: 4 },
  jenisBadge:    { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
                   borderRadius: 8 },
  jenisBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  cardNama:      { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  cardDetail:    { fontSize: 12, color: '#94a3b8' },
  cardRight:     { alignItems: 'flex-end', gap: 3 },
  cardJual:      { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  cardModal:     { fontSize: 11, color: '#94a3b8' },
  cardLaba:      { fontSize: 11, color: '#16a34a', fontWeight: '700' },

  syncDot:       { width: 6, height: 6, borderRadius: 3, position: 'absolute', top: 10, right: 10 },
  syncOk:        { backgroundColor: '#22c55e' },
  syncPending:   { backgroundColor: '#f59e0b' },

  emptyBox:      { alignItems: 'center', paddingTop: 60 },
  emptyEmoji:    { fontSize: 48, marginBottom: 12 },
  emptyText:     { fontSize: 17, fontWeight: '600', color: '#64748b' },
  emptySubtext:  { fontSize: 13, color: '#94a3b8', marginTop: 6, textAlign: 'center' },
});
