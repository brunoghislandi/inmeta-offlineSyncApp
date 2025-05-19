import React, { useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useWorkOrderStore } from "../store/workOrderStore";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WorkOrder } from "../models/WorkOrder";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const WorkOrderListScreen = () => {
  const { workOrders, loading, error, fetchWorkOrders, syncWithServer } =
    useWorkOrderStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    fetchWorkOrders();
    syncWithServer();
  }, []);

  const renderItem = ({ item }: { item: WorkOrder }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("WorkOrderDetail", { id: item.id })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Assigned to: {item.assignedTo}</Text>
    </TouchableOpacity>
  );

  if (loading && workOrders.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No work orders found</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate({ name: "WorkOrderForm", params: {} })
        }
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    lineHeight: 36,
  },
});
