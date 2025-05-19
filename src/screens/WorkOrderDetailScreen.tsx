import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useWorkOrderStore } from "../store/workOrderStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const WorkOrderDetailScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id } = route.params as { id: string };
  const { workOrders, deleteWorkOrder } = useWorkOrderStore();

  const workOrder = workOrders.find((wo) => wo.id === id);

  if (!workOrder) {
    return (
      <View style={styles.container}>
        <Text>Work order not found</Text>
      </View>
    );
  }

  const handleEdit = () => {
    navigation.navigate("WorkOrderForm", { id });
  };

  const handleDelete = async () => {
    await deleteWorkOrder(id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workOrder.title}</Text>
      <Text style={styles.description}>{workOrder.description}</Text>
      <Text>Status: {workOrder.status}</Text>
      <Text>Assigned to: {workOrder.assignedTo}</Text>
      <Text>Created: {workOrder.createdAt.toLocaleString()}</Text>
      <Text>Last updated: {workOrder.updatedAt.toLocaleString()}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
});
