import useHttpClient, { HttpClient } from "./base.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

// LINK ../pages/api/registrations.api.ts

export class RegistrationClient extends HttpClient {
  async saveRegistration(registration: DeedInfoModel) {
    const result = await this.post<string>(
      "/api/registrations",
      undefined,
      JSON.stringify(registration),
    );
    if (!result.ok) {
      logger.error({ message: "Error creating registration", status: result.status });
    }
    return result;
  }

  async getRegistration(id: string, isRestricted: boolean = false) {
    if (isRestricted && !this.authorizationToken) {
      notification.error("Please connect");
      return { status: 401, error: "Unauthorized", value: undefined, ok: false };
    }
    const result = await this.get<DeedInfoModel>(
      `/api/registrations?id=${id}&isRestricted=${isRestricted}`,
    );

    return result;
  }

  async savePaymentReceipt(id: string, receipt: string) {
    const result = await this.post<number>(`/api/registrations?id=${id}&paymentReceipt=${receipt}`);
    if (!result.ok) {
      logger.error({ message: "Error saving payment", status: result.status });
    }
    return result;
  }
}

const useRegistrationClient = () => useHttpClient(new RegistrationClient());
export default useRegistrationClient;
