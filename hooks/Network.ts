import { syncAllTables } from "@/database/sync";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check initial state
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? false;
      setIsOnline(online);

      if (online) {
        console.log("📶 Device Online - Trigger Sync!");
      } else {
        console.log("📴 Device Offline");
      }
    });

    return () => unsubscribe();
  }, []);

  return { isOnline };
}

export function useSyncManager() {
  const { isOnline } = useNetworkStatus();
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSyncRef = useRef<number>(0);

  useEffect(() => {
    if (!isOnline) return;

    // Debounce untuk mencegah sync terlalu sering
    const SYNC_INTERVAL = 30000; // 30 detik
    const now = Date.now();

    if (now - lastSyncRef.current < SYNC_INTERVAL) {
      // Jadwalkan sync setelah interval
      syncTimeoutRef.current = setTimeout(() => {
        syncAllTables();
        lastSyncRef.current = Date.now();
      }, SYNC_INTERVAL);
    } else {
      // Sync langsung
      syncAllTables();
      lastSyncRef.current = Date.now();
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
    };
  }, [isOnline]);
}
