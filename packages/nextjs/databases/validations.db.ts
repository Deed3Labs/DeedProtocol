import { DbBase } from "./db-utils.db";
import { DeedDb } from "./deeds.db";
import { FileValidationModel } from "~~/models/file.model";

export class ValidationDb extends DbBase {
  private static collection = this.deedDB.collection("Validations");

  static async saveValidation(validation: FileValidationModel) {
    const entry = {
      ...validation,
      lastModified: new Date(),
      chainId: DeedDb.getChainId(),
    } as any;
    if (validation._id === undefined) {
      entry.createdOn = new Date();
    } else {
      delete entry._id;
    }
    const id =
      (
        await this.collection.updateOne(
          {
            key: validation.key,
            id: validation.registrationId,
            chainId: DeedDb.getChainId(),
          },
          { $set: entry },
          {
            upsert: true, // Create if not exists
          },
        )
      ).upsertedId
        ?.toString()
        .replaceAll('"', "") ?? validation._id;

    return id;
  }

  static async getValidation(
    registrationId: string,
    key: string,
  ): Promise<FileValidationModel | null> {
    const result = await this.collection.findOne({
      registrationId,
      key,
      chainId: DeedDb.getChainId(),
    });
    return (
      (result as unknown as FileValidationModel) ?? {
        key,
        state: "Not started",
      }
    );
  }

  static async getAllValidations(): Promise<FileValidationModel[]> {
    const result = await this.collection
      .find({
        chainId: DeedDb.getChainId(),
      })
      .toArray();
    return result as unknown as FileValidationModel[];
  }
}
