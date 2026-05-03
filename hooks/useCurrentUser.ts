import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const CURRENT_USER_KEY = "@toko_current_user_id";

/**
 * Custom hook untuk akses current user id dari storage
 * Bisa digunakan di mana saja untuk mendapatkan user_id untuk logging transaksi
 */
export function useCurrentUser() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const storedId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (storedId) {
        setUserId(parseInt(storedId, 10));
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
    } catch (error) {
      console.error("Error setting current user:", error);
    }
  };

  return {
    userId: userId || 3, // Default ke 3 jika belum set
    loading,
    setCurrentUser,
  };
}
