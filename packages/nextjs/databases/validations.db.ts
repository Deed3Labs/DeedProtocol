import { DbBase } from "./db-utils.db";
import { FileValidationModel } from "~~/models/file.model";

export class ValidationDb extends DbBase {
  private static collection = this.deedDB.collection("Validations");
  private static offlineCollection: FileValidationModel[] = [];

  static async saveValidation(validation: FileValidationModel) {
    if (validation.key !== undefined) {
      await this.collection.deleteOne({ key: validation.key });
    }
    const result = await this.collection.insertOne({ ...validation, timestamp: new Date() });
    return result.insertedId.toString().replaceAll('"', "");
  }

  static async getValidation(key: string): Promise<FileValidationModel | null> {
    const result = await this.collection.findOne({ key: key });
    return (
      (result as unknown as FileValidationModel) ?? {
        key,
        state: "Not started",
      }
    );
  }

  static async getAllValidations(): Promise<FileValidationModel[]> {
    const result = await this.collection.find().toArray();
    return result as unknown as FileValidationModel[];
  }
}
