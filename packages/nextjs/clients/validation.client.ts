import useHttpClient, { HttpClient } from "./base.client";
import { FileValidationModel } from "~~/models/file.model";
import logger from "~~/services/logger.service";

// LINK ../pages/api/validations.api.ts

export class ValidationClient extends HttpClient {
  public async getValidation(key: string): Promise<FileValidationModel | undefined> {
    const result = await this.get<FileValidationModel>("/api/validations", { key });
    if (!result.ok) {
      logger.error({
        error: result.error,
        message: `Failed to retrieve validation with key: ${key}`,
      });
      return undefined;
    }

    return result.value;
  }

  public async getAllValidation(): Promise<FileValidationModel[] | undefined> {
    const result = await this.get<FileValidationModel[]>("/api/validations");
    if (!result.ok) {
      logger.error({
        error: result.error,
        message: `Failed to retrieve all validations`,
      });
      return undefined;
    }

    return result.value;
  }

  public async saveValidation(validation: FileValidationModel): Promise<string | undefined> {
    const result = await this.post<string>(
      "/api/validations",
      undefined,
      JSON.stringify(validation),
    );
    if (!result.ok) {
      logger.error({
        error: result.error,
        message: `Failed to retrieve all validations`,
      });
      return undefined;
    }

    return result.value;
  }
}

const useValidationClient = () => useHttpClient(new ValidationClient());
export default useValidationClient;
