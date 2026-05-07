import {
    authenticateUser,
    checkUsernameExists,
    createUser,
} from "@/database/db2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

const CURRENT_USER_KEY = "@toko_current_user_id";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Authenticate user from local database
      const user = authenticateUser(username, password);

      if (!user) {
        setError("Username atau password salah");
        setLoading(false);
        return { success: false, user: null };
      }

      // Save user id to storage
      await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());

      setLoading(false);
      return { success: true, user };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login gagal";
      setError(errorMsg);
      setLoading(false);
      return { success: false, user: null };
    }
  }, []);

  const register = useCallback(
    async (nama: string, username: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        // Check if username already exists
        if (checkUsernameExists(username)) {
          setError("Username sudah terdaftar");
          setLoading(false);
          return { success: false };
        }

        // Validate input
        if (!nama || !username || !password) {
          setError("Semua field harus diisi");
          setLoading(false);
          return { success: false };
        }

        if (username.length < 3) {
          setError("Username minimal 3 karakter");
          setLoading(false);
          return { success: false };
        }

        if (password.length < 6) {
          setError("Password minimal 6 karakter");
          setLoading(false);
          return { success: false };
        }

        // Create new user
        const userId = createUser(nama, username, password, "operator");

        // Auto login after registration
        await AsyncStorage.setItem(CURRENT_USER_KEY, userId.toString());

        setLoading(false);
        return { success: true, userId };
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Registrasi gagal";
        setError(errorMsg);
        setLoading(false);
        return { success: false };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Logout gagal";
      setError(errorMsg);
      return { success: false };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
