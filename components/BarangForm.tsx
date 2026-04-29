import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createBarang, updateBarang, Barang } from '../database/db';

const JENIS_PRESET = ['Makanan', 'Minuman', 'Snack', 'Rokok', 'Sembako', 'Lainnya'];

type Props = {
  barang?: Barang;
};

function formatRp(n: string): string {
  const num = parseFloat(n);
  if (isNaN(num)) return '';
  return 'Rp ' + num.toLocaleString('id-ID');
}

export default function BarangForm({ barang }: Props) {
  const router = useRouter();

  const [nama,   setNama]   = useState(barang?.nama ?? '');
  const [detail, setDetail] = useState(barang?.detail ?? '');
  const [jenis,  setJenis]  = useState(
    // Kalau jenis sudah ada dan bukan preset, set ke '__custom__'
    barang?.jenis && !JENIS_PRESET.includes(barang.jenis)
      ? '__custom__'
      : (barang?.jenis ?? '')
  );
  const [jenisCustom, setJenisCustom] = useState(
    barang?.jenis && !JENIS_PRESET.includes(barang.jenis) ? barang.jenis : ''
  );
  const [modal, setModal] = useState(barang?.harga_modal?.toString() ?? '');
  const [jual,  setJual]  = useState(barang?.harga_jual?.toString() ?? '');

  const jenisAkhir = jenis === '__custom__' ? jenisCustom.trim() : jenis;

  const labaNum = parseFloat(jual) - parseFloat(modal);
  const modalNum = parseFloat(modal);
  const marginPct = modalNum > 0 ? Math.round((labaNum / modalNum) * 100) : 0;

  const handleSimpan = () => {
    if (!nama.trim())         return Alert.alert('Nama barang wajib diisi');
    if (!jenisAkhir)          return Alert.alert('Pilih atau isi jenis barang');
    if (!modal || isNaN(parseFloat(modal))) return Alert.alert('Harga modal tidak valid');
    if (!jual  || isNaN(parseFloat(jual)))  return Alert.alert('Harga jual tidak valid');

    const hModal = parseFloat(modal);
    const hJual  = parseFloat(jual);

    if (barang) {
      updateBarang(barang.id, nama.trim(), detail.trim(), jenisAkhir, hModal, hJual);
    } else {
      createBarang(nama.trim(), detail.trim(), jenisAkhir, hModal, hJual);
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
    >
      <ScrollView
        style={s.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Informasi Barang ─────────────────── */}
        <Text style={s.sectionLabel}>Informasi Barang</Text>

        <Text style={s.label}>Nama Barang *</Text>
        <TextInput
          style={s.input}
          value={nama}
          onChangeText={setNama}
          placeholder="contoh: Aqua 600ml"
          maxLength={100}
          returnKeyType="next"
        />

        <Text style={s.label}>Keterangan / Detail</Text>
        <TextInput
          style={[s.input, s.inputMultiline]}
          value={detail}
          onChangeText={setDetail}
          placeholder="ukuran, varian, warna, dll..."
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        <Text style={s.label}>Jenis / Kategori *</Text>
        <View style={s.jenisPicker}>
          {JENIS_PRESET.map((j) => (
            <TouchableOpacity
              key={j}
              style={[s.jenisBtn, jenis === j && s.jenisBtnActive]}
              onPress={() => setJenis(j)}
            >
              <Text style={[s.jenisBtnText, jenis === j && s.jenisBtnTextActive]}>
                {j}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[s.jenisBtn, jenis === '__custom__' && s.jenisBtnActive]}
            onPress={() => setJenis('__custom__')}
          >
            <Text style={[s.jenisBtnText, jenis === '__custom__' && s.jenisBtnTextActive]}>
              + Lainnya
            </Text>
          </TouchableOpacity>
        </View>

        {jenis === '__custom__' && (
          <TextInput
            style={[s.input, { marginTop: 8 }]}
            value={jenisCustom}
            onChangeText={setJenisCustom}
            placeholder="Ketik jenis barang kustom..."
            autoFocus
          />
        )}

        {/* ── Harga ─────────────────────────────── */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>Harga</Text>

        <Text style={s.label}>Harga Modal (Rp) *</Text>
        <TextInput
          style={s.input}
          value={modal}
          onChangeText={setModal}
          placeholder="0"
          keyboardType="numeric"
          returnKeyType="next"
        />
        {modal !== '' && <Text style={s.hint}>{formatRp(modal)}</Text>}

        <Text style={[s.label, { marginTop: 12 }]}>Harga Jual (Rp) *</Text>
        <TextInput
          style={s.input}
          value={jual}
          onChangeText={setJual}
          placeholder="0"
          keyboardType="numeric"
          returnKeyType="done"
        />
        {jual !== '' && <Text style={s.hint}>{formatRp(jual)}</Text>}

        {/* Preview laba */}
        {modal !== '' && jual !== '' && !isNaN(labaNum) && (
          <View style={[s.labaBox, labaNum < 0 && s.labaBoxRugi]}>
            <View>
              <Text style={s.labaLabel}>Estimasi Laba / Pcs</Text>
              <Text style={s.labaMargin}>Margin {marginPct}%</Text>
            </View>
            <Text style={[s.labaValue, labaNum < 0 && s.labaValueRugi]}>
              {labaNum >= 0 ? '+' : ''}{formatRp(labaNum.toString())}
            </Text>
          </View>
        )}

        {/* Tombol simpan */}
        <TouchableOpacity style={s.simpanBtn} onPress={handleSimpan} activeOpacity={0.85}>
          <Text style={s.simpanBtnText}>
            {barang ? '✓  Simpan Perubahan' : '✓  Tambah Barang'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#fff', padding: 16 },

  sectionLabel:     { fontSize: 11, fontWeight: '700', color: '#94a3b8',
                      textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  label:            { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },

  input:            { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10,
                      padding: 12, fontSize: 15, color: '#0f172a',
                      backgroundColor: '#fafafa' },
  inputMultiline:   { height: 80, textAlignVertical: 'top', marginBottom: 4 },

  hint:             { fontSize: 12, color: '#94a3b8', marginTop: 4, marginBottom: 4 },

  jenisPicker:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  jenisBtn:         { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                      borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  jenisBtnActive:   { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  jenisBtnText:     { fontSize: 13, color: '#64748b', fontWeight: '500' },
  jenisBtnTextActive: { color: '#fff', fontWeight: '700' },

  labaBox:          { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16,
                      flexDirection: 'row', justifyContent: 'space-between',
                      alignItems: 'center', marginTop: 16 },
  labaBoxRugi:      { backgroundColor: '#fef2f2' },
  labaLabel:        { fontSize: 13, color: '#166534', fontWeight: '600' },
  labaMargin:       { fontSize: 11, color: '#86efac', marginTop: 2 },
  labaValue:        { fontSize: 20, fontWeight: '800', color: '#16a34a' },
  labaValueRugi:    { color: '#ef4444' },

  simpanBtn:        { backgroundColor: '#2563eb', padding: 17, borderRadius: 14,
                      alignItems: 'center', marginTop: 20 },
  simpanBtnText:    { color: '#fff', fontSize: 16, fontWeight: '800' },
});
