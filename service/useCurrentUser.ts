import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getUserById } from "@/database/db2";
import type { User } from "@/database/db2";

const CURRENT_USER_KEY = "@toko_current_user_id";

/**
 * Custom hook untuk akses current user id dari storage
 * Bisa digunakan di mana saja untuk mendapatkan user_id untuk logging transaksi
 */
export function useCurrentUser() {
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const storedId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (storedId) {
        const id = parseInt(storedId, 10);
        setUserId(id);
        // Load user details from database
        const userData = getUserById(id);
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error loading current user:", error);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentUser = async (id: number) => {
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, id.toString());
      setUserId(id);
      const userData = getUserById(id);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUserId(null);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return {
    userId: userId || 3, // Default ke 3 jika belum set
    user,
    loading,
    setCurrentUser,
    logout,
  };
}
