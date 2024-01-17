import useHttpClient, { HttpClient } from "./base.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";

// LINK ../pages/api/registrations.api.ts

export class RegistrationClient extends HttpClient {
  async saveRegistration(registration: DeedInfoModel) {
    const result = await this.post<number>("/api/registrations", JSON.stringify(registration));
    if (!result.ok) {
      logger.error({ message: "Error creating registration", status: result.status });
    }
    return result;
  }

  async getRegistration(id: number | string, isRestricted: boolean = false) {
    const result = await this.get<DeedInfoModel>(
      `/api/registrations?id=${id}&isRestricted=${isRestricted}`,
    );
    if (!result.ok) {
      logger.error({ message: "Error getting registration with id " + id, status: result.status });
    }
    return result;
  }
}

const useRegistrationClient = () => useHttpClient(new RegistrationClient());
export default useRegistrationClient;
