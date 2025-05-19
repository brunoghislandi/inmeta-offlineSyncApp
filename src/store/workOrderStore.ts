import { create } from "zustand";
import { WorkOrder } from "../models/WorkOrder";
import { realmConfig } from "../models";
import Realm from "realm";
import { api } from "../api/client";
import { syncWorkOrders } from "../api/workOrders";

interface WorkOrderState {
  workOrders: WorkOrder[];
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  isOnline: boolean;
  fetchWorkOrders: () => Promise<void>;
  addWorkOrder: (workOrder: Partial<WorkOrder>) => Promise<void>;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => Promise<void>;
  deleteWorkOrder: (id: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
  setNetworkStatus: (isOnline: boolean) => void;
}

export const useWorkOrderStore = create<WorkOrderState>((set, get) => ({
  workOrders: [],
  loading: false,
  error: null,
  lastSync: null,
  isOnline: false,

  fetchWorkOrders: async () => {
    set({ loading: true, error: null });
    try {
      const realm = await Realm.open(realmConfig);
      const workOrders = realm
        .objects<WorkOrder>("WorkOrder")
        .filtered("deleted == false");
      set({ workOrders: Array.from(workOrders), loading: false });
    } catch (error) {
      set({ error: "Failed to fetch work orders", loading: false });
    }
  },

  addWorkOrder: async (workOrder) => {
    set({ loading: true, error: null });
    try {
      const realm = await Realm.open(realmConfig);
      realm.write(() => {
        const now = new Date();
        realm.create("WorkOrder", {
          ...workOrder,
          id: workOrder.id || new Realm.BSON.ObjectId().toHexString(),
          createdAt: now,
          updatedAt: now,
          isLocal: true,
          needsSync: true,
        });
      });
      await get().fetchWorkOrders();
    } catch (error) {
      set({ error: "Failed to add work order", loading: false });
    }
  },

  updateWorkOrder: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const realm = await Realm.open(realmConfig);
      const workOrder = realm.objectForPrimaryKey<WorkOrder>("WorkOrder", id);
      if (workOrder) {
        realm.write(() => {
          Object.assign(workOrder, {
            ...updates,
            updatedAt: new Date(),
            needsSync: true,
          });
        });
      }
      await get().fetchWorkOrders();
    } catch (error) {
      set({ error: "Failed to update work order", loading: false });
    }
  },

  deleteWorkOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      const realm = await Realm.open(realmConfig);
      const workOrder = realm.objectForPrimaryKey<WorkOrder>("WorkOrder", id);
      if (workOrder) {
        realm.write(() => {
          workOrder.deleted = true;
          workOrder.deletedAt = new Date();
          workOrder.needsSync = true;
        });
      }
      await get().fetchWorkOrders();
    } catch (error) {
      set({ error: "Failed to delete work order", loading: false });
    }
  },

  syncWithServer: async () => {
    set({ loading: true, error: null });
    try {
      const { lastSync } = get();
      const syncDate = lastSync || new Date(0);

      const serverChanges = await syncWorkOrders(syncDate.toISOString());

      const realm = await Realm.open(realmConfig);

      realm.write(() => {
        serverChanges.created.forEach((wo: WorkOrder) => {
          const existing = realm.objectForPrimaryKey<WorkOrder>(
            "WorkOrder",
            wo.id
          );
          if (!existing) {
            realm.create("WorkOrder", {
              ...wo,
              createdAt: new Date(wo.createdAt),
              updatedAt: new Date(wo.updatedAt),
              deletedAt: wo.deletedAt ? new Date(wo.deletedAt) : undefined,
              isLocal: false,
              needsSync: false,
            });
          }
        });

        serverChanges.updated.forEach((wo: WorkOrder) => {
          const existing = realm.objectForPrimaryKey<WorkOrder>(
            "WorkOrder",
            wo.id
          );
          if (existing) {
            Object.assign(existing, {
              ...wo,
              updatedAt: new Date(wo.updatedAt),
              needsSync: false,
            });
          }
        });

        serverChanges.deleted.forEach((id: string) => {
          const existing = realm.objectForPrimaryKey<WorkOrder>(
            "WorkOrder",
            id
          );
          if (existing) {
            existing.deleted = true;
            existing.deletedAt = new Date();
            existing.needsSync = false;
          }
        });
      });

      const localChanges = realm
        .objects<WorkOrder>("WorkOrder")
        .filtered("needsSync == true");

      for (const wo of localChanges) {
        try {
          if (wo.deleted) {
            await api.delete(`/work-orders/${wo.id}`);
          } else if (wo.isLocal) {
            await api.post("/work-orders", {
              ...wo,
              id: undefined,
            });
          } else {
            await api.put(`/work-orders/${wo.id}`, wo);
          }

          realm.write(() => {
            wo.needsSync = false;
            wo.isLocal = false;
          });
        } catch (error) {
          console.error(`Failed to sync work order ${wo.id}:`, error);
        }
      }

      set({ lastSync: new Date() });
      await get().fetchWorkOrders();
    } catch (error) {
      set({ error: "Sync failed", loading: false });
    }
  },

  setNetworkStatus: (isOnline) => set({ isOnline }),
}));
