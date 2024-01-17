import { DbBase } from "./db-utils.db";
import { ObjectId } from "mongodb";
import { DeedInfoModel } from "~~/models/deed-info.model";

export class RegistrationDb extends DbBase {
  private static collection = this.deedDB.collection("Registrations");

  static async saveRegistration(registration: DeedInfoModel) {
    if (registration.id !== undefined) {
      await this.collection.deleteOne({ _id: new ObjectId(registration.id) });
      // @ts-ignore
      registration._id = new ObjectId(registration.id);
    }
    const result = await this.collection.insertOne({ ...registration, timestamp: new Date() });
    return result.insertedId.toString().replaceAll('"', "");
  }

  static async getRegistration(id: string): Promise<DeedInfoModel | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    if (result) {
      result.id = result._id.toString().replaceAll('"', "");
    }
    return result as unknown as DeedInfoModel;
  }

  static async getAllRegistrations(): Promise<DeedInfoModel[]> {
    const result = await this.collection.find().toArray();
    return result.map(x => {
      x.id = x._id.toString().replaceAll('"', "");
      return x;
    }) as unknown as DeedInfoModel[];
  }
}
