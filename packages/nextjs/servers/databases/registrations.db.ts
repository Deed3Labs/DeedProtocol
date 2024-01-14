import { deedDB } from "./db-utils.db";
import { DeedInfoModel } from "~~/models/deed-info.model";

const collection = deedDB.collection("Registrations");

export const createRegistration = async (registration: DeedInfoModel) => {
  return (await collection.insertOne(registration)).insertedId.id;
};

export const getRegistration = async (id: number): Promise<DeedInfoModel | null> => {
  const result = await collection.findOne({
    id: id,
  });
  console.log(result);
  return result as unknown as DeedInfoModel;
};

export const getAllRegistrations = async (): Promise<DeedInfoModel[]> => {
  const result = await collection.find().toArray();
  console.log(result);
  return result as unknown as DeedInfoModel[];
};
