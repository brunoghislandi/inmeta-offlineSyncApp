import { useWorkOrderStore } from "../store/workOrderStore";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";

let syncInterval: NodeJS.Timeout;

export const useSyncService = (intervalMinutes = 5) => {
  const { syncWithServer } = useWorkOrderStore.getState();

  const syncIfOnline = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        await syncWithServer();
        console.log("Sync completed successfully");
      } catch (error) {
        console.error("Sync failed:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        syncIfOnline();
      }
    });

    syncIfOnline();

    syncInterval = setInterval(syncIfOnline, intervalMinutes * 60 * 1000);

    return () => {
      unsubscribe();
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [intervalMinutes]);
};

export const startSyncService = (intervalMinutes = 5) => {
  const { syncWithServer } = useWorkOrderStore.getState();

  const syncIfOnline = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      await syncWithServer();
    }
  };

  syncIfOnline();

  syncInterval = setInterval(syncIfOnline, intervalMinutes * 60 * 1000);
};

export const stopSyncService = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
};
