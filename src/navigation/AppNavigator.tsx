import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WorkOrderListScreen } from "../screens/WorkOrderListScreen";
import { WorkOrderDetailScreen } from "../screens/WorkOrderDetailScreen";
import { WorkOrderFormScreen } from "../screens/WorkOrderFormScreen";

export type RootStackParamList = {
  WorkOrderList: undefined;
  WorkOrderDetail: { id: string };
  WorkOrderForm: { id?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="WorkOrderList">
      <Stack.Screen
        name="WorkOrderList"
        component={WorkOrderListScreen}
        options={{ title: "Work Orders" }}
      />
      <Stack.Screen
        name="WorkOrderDetail"
        component={WorkOrderDetailScreen}
        options={{ title: "Work Order Details" }}
      />
      <Stack.Screen
        name="WorkOrderForm"
        component={WorkOrderFormScreen}
        options={({ route }) => ({
          title: route.params?.id ? "Edit Work Order" : "Create Work Order",
        })}
      />
    </Stack.Navigator>
  );
};
