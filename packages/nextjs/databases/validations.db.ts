import { DbBase } from "./db-utils.db";
import { FileValidationModel } from "~~/models/file.model";

export class ValidationDb extends DbBase {
  private static collection = this.deedDB.collection("Validations");
  private static offlineCollection: FileValidationModel[] = [];

  static async saveValidation(validation: FileValidationModel) {
    let result;
    if (process.env.NEXT_PUBLIC_OFFLINE) {
      result = { insertedId: "65ede5e3444b57d53e2f412d" };
      const entry = this.offlineCollection.find(x => x.key === validation.key);
      if (entry) {
        entry.state = validation.state;
      } else {
        this.offlineCollection.push(validation);
      }
    } else {
      if (validation.key !== undefined) {
        await this.collection.deleteOne({ key: validation.key });
      }
      result = await this.collection.insertOne({ ...validation, timestamp: new Date() });
    }
    return result.insertedId.toString().replaceAll('"', "");
  }

  static async getValidation(key: string): Promise<FileValidationModel | null> {
    let result;
    if (process.env.NEXT_PUBLIC_OFFLINE) {
      result =
        this.offlineCollection.find(x => x.key === key) ??
        ({
          _id: "65ede5e3444b57d53e2f412d",
          key,
          state: "Not started",
        } as FileValidationModel);
    } else {
      result = await this.collection.findOne({ key: key });
    }
    return result as unknown as FileValidationModel;
  }

  static async getAllValidations(): Promise<FileValidationModel[]> {
    let result;
    if (process.env.NEXT_PUBLIC_OFFLINE) {
      result = this.offlineCollection;
    } else {
      result = await this.collection.find().toArray();
    }
    return result as unknown as FileValidationModel[];
  }
}
