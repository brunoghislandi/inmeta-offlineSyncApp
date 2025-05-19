import { StatusBar } from "expo-status-bar";
import { AppProvider, UserProvider, RealmProvider } from "@realm/react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider } from "react-native-toast-notifications";
import { useSyncService } from "./src/sync/syncService";
import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useWorkOrderStore } from "./src/store/workOrderStore";
import { realmConfig } from "./src/models";

export default function App() {
  const { setNetworkStatus, fetchWorkOrders } = useWorkOrderStore();

  useSyncService(5);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected ?? false;
      setNetworkStatus(isConnected);

      if (isConnected) {
        fetchWorkOrders();
      }
    });

    NetInfo.fetch().then((state) => {
      setNetworkStatus(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, [setNetworkStatus, fetchWorkOrders]);

  return (
    <AppProvider id="fieldsync-app">
      <UserProvider fallback={null}>
        <RealmProvider {...realmConfig}>
          <SafeAreaProvider>
            <ToastProvider
              placement="top"
              duration={2000}
              animationType="slide-in"
              animationDuration={250}
              successColor="green"
              dangerColor="red"
              warningColor="orange"
              normalColor="gray"
              offset={50}
            >
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
              <StatusBar style="dark" />
            </ToastProvider>
          </SafeAreaProvider>
        </RealmProvider>
      </UserProvider>
    </AppProvider>
  );
}
