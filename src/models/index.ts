import Realm from "realm";
import { WorkOrder } from "./WorkOrder";

export const realmConfig: Realm.Configuration = {
  schema: [WorkOrder],
  schemaVersion: 1,
  path: "fieldsync.realm",
};

let realmInstance: Realm | null = null;

export const getRealm = async (): Promise<Realm> => {
  if (!realmInstance) {
    realmInstance = await Realm.open(realmConfig);
  }
  return realmInstance;
};
