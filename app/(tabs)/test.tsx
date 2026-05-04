import { createKas, createUser } from "@/database/db2";
import { useCurrentUser } from "@/service/useCurrentUser";
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
  const { userId } = useCurrentUser();
  // User form state
  const [userName, setUserName] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState<"admin" | "operator">("operator");

  // Kas form state
  const [kasNama, setKasNama] = useState("");
  const [kasJenis, setKasJenis] = useState("");
  const [kasKeterangan, setKasKeterangan] = useState("");
  const [kasJumlah, setKasJumlah] = useState("");

  const handleCreateUser = () => {
    if (!userName || !userUsername || !userPassword) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }

    try {
      createUser(userName, userUsername, userPassword, userRole);
      Alert.alert("Sukses", `User "${userName}" berhasil dibuat!`);
      console.log(
        `✅ User dibuat: ${userName} (${userUsername}) - Role: ${userRole}`,
      );

      // Reset form
      setUserName("");
      setUserUsername("");
      setUserPassword("");
      setUserRole("operator");
    } catch (error) {
      console.error("Error creating user:", error);
      Alert.alert("Error", "Gagal membuat user. Cek console untuk detail.");
    }
  };

  const handleCreateKas = () => {
    if (!kasNama || !kasJenis || !kasJumlah) {
      Alert.alert("Error", "Nama, Jenis, dan Jumlah harus diisi!");
      return;
    }

    try {
      const jumlah = parseFloat(kasJumlah);
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

      {/* USER FORM */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>👤 Buat User Baru</Text>

        <Text style={styles.label}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan nama user"
          value={userName}
          onChangeText={setUserName}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan username"
          value={userUsername}
          onChangeText={setUserUsername}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Masukkan password"
          value={userPassword}
          onChangeText={setUserPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              userRole === "admin" && styles.roleButtonActive,
            ]}
            onPress={() => setUserRole("admin")}
          >
            <Text
              style={[
                styles.roleButtonText,
                userRole === "admin" && styles.roleButtonTextActive,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              userRole === "operator" && styles.roleButtonActive,
            ]}
            onPress={() => setUserRole("operator")}
          >
            <Text
              style={[
                styles.roleButtonText,
                userRole === "operator" && styles.roleButtonTextActive,
              ]}
            >
              Operator
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateUser}
        >
          <Text style={styles.submitButtonText}>Buat User</Text>
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
          onChangeText={setKasJumlah}
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
