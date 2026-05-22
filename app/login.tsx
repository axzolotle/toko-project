import { useAuth } from "@/service/useAuth";
import {
  darkColors,
  darkStyles,
  lightColors,
  lightStyles,
} from "@/styles/LoginStyles";
import { useTheme } from "@/lib/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, loading, error, clearError } = useAuth();

  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [showRegister, setShowRegister] = useState(false);
  const [registerNama, setRegisterNama] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");

  const { isDark } = useTheme();
  const S = isDark ? darkStyles : lightStyles;
  const C = isDark ? darkColors : lightColors;

  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      Alert.alert("Error", "Username dan password harus diisi");
      return;
    }

    const result = await login(loginUsername, loginPassword);

    if (result.success) {
      Alert.alert("Sukses", `Selamat datang ${result.user?.nama}!`);
      // Reset form
      setLoginUsername("");
      setLoginPassword("");
      // Navigate to home
      router.replace("/(tabs)/akun");
    } else {
      Alert.alert("Login Gagal", error || "Username atau password salah");
      clearError();
    }
  };

  const handleRegister = async () => {
    if (!registerNama || !registerUsername || !registerPassword) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    if (registerPassword !== registerPasswordConfirm) {
      Alert.alert("Error", "Password tidak cocok");
      return;
    }

    const result = await register(
      registerNama,
      registerUsername,
      registerPassword,
    );

    if (result.success) {
      Alert.alert("Sukses", "Akun berhasil dibuat! Anda sudah login.");
      // Reset form dan kembali ke login view
      setRegisterNama("");
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterPasswordConfirm("");
      setShowRegister(false);
      // Navigate to home
      router.replace("/(tabs)/akun");
    } else {
      Alert.alert("Registrasi Gagal", error || "Gagal membuat akun");
      console.log("Error during registration:", error);
    }
  };

  const handleSwitchMode = () => {
    setShowRegister(!showRegister);
    clearError();
    // Reset forms
    setLoginUsername("");
    setLoginPassword("");
    setRegisterNama("");
    setRegisterUsername("");
    setRegisterPassword("");
    setRegisterPasswordConfirm("");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={C.pageBg}
      />
      <View style={S.screen}>
        <SafeAreaView style={S.safeArea}>
          <ScrollView
            style={S.scrollContent}
            contentContainerStyle={S.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={S.brandSection}>
              <View style={S.iconWrapper}>
                <Ionicons name="home" size={32} color={C.iconColor} />
              </View>
              {/* App Name */}
              <Text style={S.appName}>Konter</Text>
              {/* Tagline */}
              <Text style={S.appSubtitle}>sistem pencatatan penjualan</Text>
            </View>

            {error && (
              <View style={S.errorContainer}>
                <Text style={S.errorText}>{error}</Text>
              </View>
            )}

            {!showRegister ? (
              // LOGIN FORM
              <View style={S.card}>
                <View style={S.fieldWrapper}>
                  <Text style={S.label}>Username</Text>
                  <TextInput
                    style={S.input}
                    placeholder="Masukkan username"
                    placeholderTextColor={C.inputPlaceholder}
                    value={loginUsername}
                    onChangeText={setLoginUsername}
                    editable={!loading}
                    autoCapitalize="none"
                  />
                </View>

                <View style={S.fieldWrapperLast}>
                  <Text style={S.label}>Password</Text>
                  <TextInput
                    style={S.input}
                    placeholder="Masukkan password"
                    placeholderTextColor={C.inputPlaceholder}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    editable={!loading}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    S.button,
                    loading ? S.disabledButton : null,
                    { marginBottom: 24 },
                  ]}
                  activeOpacity={0.85}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <Text style={S.buttonText}>
                    {loading ? "Sedang Masuk..." : "Masuk"}
                  </Text>
                </TouchableOpacity>

                <View style={S.fieldWrapperLast}>
                  <Text style={S.label}>Belum punya akun? </Text>
                  <TouchableOpacity
                    onPress={handleSwitchMode}
                    disabled={loading}
                  >
                    <Text style={S.buttonOption}>Daftar di sini</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              // REGISTER FORM
              <View style={S.card}>
                <View style={S.fieldWrapperLast}>
                  <Text style={S.label}>Nama Lengkap</Text>
                  <TextInput
                    style={S.input}
                    placeholder="Masukkan nama lengkap"
                    placeholderTextColor={C.inputPlaceholder}
                    value={registerNama}
                    onChangeText={setRegisterNama}
                    editable={!loading}
                  />

                  <Text style={S.label}>Username</Text>
                  <TextInput
                    style={S.input}
                    placeholder="Pilih username (min. 3 karakter)"
                    placeholderTextColor={C.inputPlaceholder}
                    value={registerUsername}
                    onChangeText={setRegisterUsername}
                    editable={!loading}
                    autoCapitalize="none"
                  />

                  <Text style={S.label}>Password</Text>
                  <TextInput
                    style={S.input}
                    placeholder="Buat password (min. 6 karakter)"
                    placeholderTextColor={C.inputPlaceholder}
                    value={registerPassword}
                    onChangeText={setRegisterPassword}
                    secureTextEntry
                    editable={!loading}
                    autoCapitalize="none"
                  />

                  <Text style={S.label}>Konfirmasi Password</Text>
                  <TextInput
                    style={[S.input, { marginBottom: 24 }]}
                    placeholder="Ulangi password"
                    placeholderTextColor={C.inputPlaceholder}
                    value={registerPasswordConfirm}
                    onChangeText={setRegisterPasswordConfirm}
                    secureTextEntry
                    editable={!loading}
                    autoCapitalize="none"
                  />

                  <TouchableOpacity
                    style={[S.button, loading && S.disabledButton]}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    <Text style={S.buttonText}>
                      {loading ? "Sedang Mendaftar..." : "Daftar"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={S.fieldWrapperLast}>
                  <Text style={S.label}>Sudah punya akun? </Text>
                  <TouchableOpacity
                    onPress={handleSwitchMode}
                    disabled={loading}
                  >
                    <Text style={S.buttonOption}>Masuk di sini</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Demo Account Info
            <View style={S.demoInfoContainer}>
              <Text style={S.label}>📝 Akun Demo (untuk testing)</Text>
              <Text style={S.label}>Username: fadiel</Text>
              <Text style={S.label}>Password: default123</Text>
            </View> */}
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}
