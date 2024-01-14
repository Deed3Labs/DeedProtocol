import { HttpClient } from "./base.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";

export class RegistrationClient extends HttpClient {
  async createRegistration(registration: DeedInfoModel) {
    const result = await this.post<number>("/api/deed-info", registration);
    logger.error({ message: "Error creating registration", status: result.status });
    return result;
  }

  async getRegistration(id: number, isDraft: boolean = false) {
    const result = await this.get<DeedInfoModel>(
      `/api/deed-info/${id}?chainId=${this.chainId}&isDraft=${isDraft}`,
    );
    logger.error({ message: "Error getting registration with id " + id, status: result.status });
    return result;
  }
}
