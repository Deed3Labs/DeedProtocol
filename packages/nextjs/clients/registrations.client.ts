import useHttpClient, { HttpClient } from "./base.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { fetchFileInfos } from "~~/services/file.service";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

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
    if (isRestricted && !this.authorizationToken) {
      notification.error("Please connect");
      return { status: 401, error: "Unauthorized", value: undefined, ok: false };
    }
    const result = await this.get<DeedInfoModel>(
      `/api/registrations?id=${id}&isRestricted=${isRestricted}`,
    );
    if (result.value === undefined || !result.ok) {
      logger.error({ message: "Error getting registration with id " + id, status: result.status });
    } else {
      result.value = await fetchFileInfos(result.value, this.authorizationToken);
    }

    return result;
  }
}

const useRegistrationClient = () => useHttpClient(new RegistrationClient());
export default useRegistrationClient;
