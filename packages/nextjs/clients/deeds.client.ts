import useHttpClient, { HttpClient } from "./base.client";
import { ExplorerPageSize } from "~~/constants";
import { defaultPropertyFilter } from "~~/contexts/property-filter.context";
import { DeedInfoModel } from "~~/models/deed-info.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import logger from "~~/services/logger.service";

// LINK ../pages/api/deed.api.ts

export class DeedClient extends HttpClient {
  async saveDeed(deed: DeedInfoModel) {
    const result = await this.post<string>("/api/deeds", undefined, JSON.stringify(deed));
    if (!result.ok) {
      logger.error({ message: "Error saving deed", status: result.status });
    }

    return result;
  }

  async getDeed(id: string, isRestricted: boolean = false) {
    const result = await this.get<DeedInfoModel>(
      `/api/deeds?id=${id}&isRestricted=${isRestricted}`,
    );

    return result;
  }

  async searchDeeds(
    filter?: PropertiesFilterModel,
    currentPage: number = 0,
    pageSize: number = ExplorerPageSize,
  ) {
    const result = await this.get<DeedInfoModel[]>(`/api/deeds`, {
      ...(filter ?? defaultPropertyFilter),
      currentPage,
      pageSize,
    });
    return result;
  }
}

const useDeedClient = () => useHttpClient(new DeedClient());
export default useDeedClient;
