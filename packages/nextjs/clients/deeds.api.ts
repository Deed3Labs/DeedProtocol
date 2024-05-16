import useHttpClient, { HttpClient } from "./base.client";
import { DeedInfoModel } from "~~/models/deed-info.model";
import logger from "~~/services/logger.service";

// LINK ../pages/api/deed.api.ts

export class DeedClient extends HttpClient {
  async saveDeed(deed: DeedInfoModel) {
    const result = await this.post<string>("/api/deeds", undefined, JSON.stringify(deed));
    if (!result.ok) {
      logger.error({ message: "Error creating deed", status: result.status });
    }
    return result;
  }

  async getDeed(id: string, isRestricted: boolean = false) {
    const result = await this.get<DeedInfoModel>(
      `/api/deeds?id=${id}&isRestricted=${isRestricted}`,
    );

    return result;
  }
}

const useDeedClient = () => useHttpClient(new DeedClient());
export default useDeedClient;
