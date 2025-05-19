import { BSON } from "realm";

export class WorkOrder extends Realm.Object<WorkOrder> {
  _id!: BSON.ObjectId;
  id!: string;
  title!: string;
  description!: string;
  status!: "Pending" | "In Progress" | "Completed";
  assignedTo!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;
  completed!: boolean;
  deleted!: boolean;
  isLocal!: boolean;
  needsSync!: boolean;

  static schema: Realm.ObjectSchema = {
    name: "WorkOrder",
    primaryKey: "_id",
    properties: {
      _id: { type: "objectId", default: () => new BSON.ObjectId() },
      id: "string",
      title: "string",
      description: "string",
      status: "string",
      assignedTo: "string",
      createdAt: "date",
      updatedAt: "date",
      deletedAt: "date?",
      completed: { type: "bool", default: false },
      deleted: { type: "bool", default: false },
      isLocal: { type: "bool", default: false },
      needsSync: { type: "bool", default: false },
    },
  };
}
