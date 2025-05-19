import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useWorkOrderStore } from "../store/workOrderStore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const statusOptions = ["Pending", "In Progress", "Completed"];

export const WorkOrderFormScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id } = route.params as { id?: string };
  const { workOrders, addWorkOrder, updateWorkOrder } = useWorkOrderStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending" as "Pending" | "In Progress" | "Completed",
    assignedTo: "",
    completed: false,
  });

  useEffect(() => {
    if (id) {
      const existingOrder = workOrders.find((wo) => wo.id === id);
      if (existingOrder) {
        setFormData({
          title: existingOrder.title,
          description: existingOrder.description,
          status: existingOrder.status,
          assignedTo: existingOrder.assignedTo,
          completed: existingOrder.completed,
        });
      }
    }
  }, [id, workOrders]);

  const handleSubmit = async () => {
    if (id) {
      await updateWorkOrder(id, formData);
    } else {
      await addWorkOrder(formData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={formData.title}
        onChangeText={(text) => setFormData({ ...formData, title: text })}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.input}>
        {statusOptions.map((status) => (
          <TouchableOpacity
            key={status}
            style={{
              padding: 10,
              backgroundColor:
                formData.status === status ? "#007bff" : "#f0f0f0",
              borderRadius: 4,
              marginBottom: 4,
            }}
            onPress={() =>
              setFormData({
                ...formData,
                status: status as typeof formData.status,
              })
            }
          >
            <Text
              style={{ color: formData.status === status ? "white" : "black" }}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Assigned To</Text>
      <TextInput
        style={styles.input}
        value={formData.assignedTo}
        onChangeText={(text) => setFormData({ ...formData, assignedTo: text })}
      />

      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Completed</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() =>
            setFormData({ ...formData, completed: !formData.completed })
          }
        >
          {formData.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {id ? "Update Work Order" : "Create Work Order"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 16,
    color: "green",
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
