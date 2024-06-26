import useHttpClient, { HttpClient } from "./base.client";
import { FileValidationModel } from "~~/models/file.model";
import logger from "~~/services/logger.service";

// LINK ../pages/api/validations.api.ts

export class ValidationClient extends HttpClient {
  public async getValidation(
    registrationId: string,
    key: string,
  ): Promise<FileValidationModel | undefined> {
    const result = await this.get<FileValidationModel>("/api/validations", {
      key,
      registrationId,
    });
    if (!result.ok) {
      logger.error({
        error: result.error,
        message: `Failed to retrieve validation with registrationId: ${registrationId} and key: ${key}`,
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

  public async saveValidation(validation: FileValidationModel): Promise<boolean> {
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
      return false;
    }

    return result.ok;
  }
}

const useValidationClient = () => useHttpClient(new ValidationClient());
export default useValidationClient;
