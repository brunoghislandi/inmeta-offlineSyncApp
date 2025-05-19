import { api } from "./client";
import { WorkOrder } from "../models/WorkOrder";

export const fetchWorkOrders = async () => {
  const response = await api.get("/work-orders");
  return response.data;
};

export const fetchWorkOrder = async (id: string) => {
  const response = await api.get(`/work-orders/${id}`);
  return response.data;
};

export const createWorkOrder = async (workOrder: Partial<WorkOrder>) => {
  const response = await api.post("/work-orders", workOrder);
  return response.data;
};

export const updateWorkOrder = async (
  id: string,
  workOrder: Partial<WorkOrder>
) => {
  const response = await api.put(`/work-orders/${id}`, workOrder);
  return response.data;
};

export const deleteWorkOrder = async (id: string) => {
  const response = await api.delete(`/work-orders/${id}`);
  return response.data;
};

export const syncWorkOrders = async (since: string) => {
  const response = await api.get("/work-orders/sync", {
    params: { since },
  });
  return response.data;
};
