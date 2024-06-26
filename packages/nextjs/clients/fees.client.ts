import { useEffect, useState } from "react";
import { HttpClient } from "./base.client";
import useWallet from "~~/hooks/useWallet";
import { FeesModel } from "~~/models/fees.model";
import { cacheFees } from "~~/services/cache.service";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

export class FeesClient extends HttpClient {
  public async getFees() {
    const res = await this.get<FeesModel>(`/api/fees`);
    if (!res.ok || !res.value) {
      const message = "Error getting fees";
      logger.error({ message, error: res.error });
      notification.error(message);
      return undefined;
    }
    return res.value;
  }

  public async saveFees(fees: FeesModel) {
    const res = await this.post(`/api/fees`, undefined, JSON.stringify(fees));
    if (!res.ok || !res.value) {
      const message = "Error saving fees";
      logger.error({ message, error: res.error });
      notification.error(message);
      return undefined;
    }
    return res.value;
  }
}

const useFeesClient = (): { fees: FeesModel; client: FeesClient } => {
  const [fees, setFees] = useState<FeesModel>({});
  const { authToken } = useWallet();
  const [client, setClient] = useState<FeesClient>(new FeesClient());

  useEffect(() => {
    const fetchFees = async () => {
      const fees = await cacheFees();
      setFees(fees);
    };
    fetchFees();
  }, []);

  useEffect(() => {
    if (authToken) {
      setClient(client.authentify(authToken));
    }
  }, [authToken]);

  return { fees, client };
};
export default useFeesClient;
