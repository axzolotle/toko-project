import { createKas } from "@/database/db2";
import { useCurrentUser } from "@/service/useCurrentUser";
import {
  formatCurrencyInput,
  parseCurrencyInput,
} from "@/utils/currencyInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TestScreen() {
  const router = useRouter();
  const { userId, loading: userLoading } = useCurrentUser();
  // Kas form state
  const [kasNama, setKasNama] = useState("");
  const [kasJenis, setKasJenis] = useState("");
  const [kasKeterangan, setKasKeterangan] = useState("");
  const [kasJumlah, setKasJumlah] = useState("");

  const handleOpenLoginPage = () => {
    router.push("/login");
  };

  const handleCreateKas = () => {
    if (userLoading) {
      Alert.alert("Mohon tunggu", "Data user sedang dimuat");
      return;
    }

    if (userId === null) {
      Alert.alert("Error", "User belum login");
      return;
    }

    if (!kasNama || !kasJenis || !kasJumlah) {
      Alert.alert("Error", "Nama, Jenis, dan Jumlah harus diisi!");
      return;
    }

    try {
      const jumlah = parseCurrencyInput(kasJumlah);
      if (isNaN(jumlah)) {
        Alert.alert("Error", "Jumlah harus berupa angka!");
        return;
      }

      createKas(kasNama, kasJenis, kasKeterangan, jumlah, userId);
      Alert.alert("Sukses", `Kas "${kasNama}" berhasil dibuat!`);
      console.log(
        `✅ Kas dibuat: ${kasNama} (${kasJenis}) - Jumlah: ${jumlah}`,
      );

      // Reset form
      setKasNama("");
      setKasJenis("");
      setKasKeterangan("");
      setKasJumlah("");
    } catch (error) {
      console.error("Error creating kas:", error);
      Alert.alert("Error", "Gagal membuat kas. Cek console untuk detail.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>🧪 TEST SCREEN - CREATE USER & KAS</Text>
      </View>

      {/* LOGIN BUTTON */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>👤 Manajemen User</Text>
        <Text style={styles.formDescription}>
          Akses halaman login untuk membuat user baru atau masuk ke akun yang
          sudah ada.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleOpenLoginPage}
        >
          <Text style={styles.loginButtonText}>Buka Halaman Login</Text>
        </TouchableOpacity>
      </View>

      {/* KAS FORM */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>💰 Buat Kas Baru</Text>

        <Text style={styles.label}>Nama Kas</Text>
        <TextInput
          style={styles.input}
          placeholder="Misal: Kas Toko, Kas Kecil"
          value={kasNama}
          onChangeText={setKasNama}
        />

        <Text style={styles.label}>Jenis</Text>
        <TextInput
          style={styles.input}
          placeholder="Misal: Tunai, Transfer, Cek"
          value={kasJenis}
          onChangeText={setKasJenis}
        />

        <Text style={styles.label}>Keterangan</Text>
        <TextInput
          style={styles.input}
          placeholder="Optional - Keterangan tambahan"
          value={kasKeterangan}
          onChangeText={setKasKeterangan}
          multiline
        />

        <Text style={styles.label}>Jumlah</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan jumlah uang"
          value={kasJumlah}
          onChangeText={(value) => setKasJumlah(formatCurrencyInput(value))}
          keyboardType="decimal-pad"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleCreateKas}>
          <Text style={styles.submitButtonText}>Buat Kas</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  formDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
  },
  loginButton: {
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  roleButtonTextActive: {
    color: "white",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  spacing: {
    height: 50,
  },
});
