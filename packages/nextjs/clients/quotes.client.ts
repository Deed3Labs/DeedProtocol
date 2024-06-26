import useHttpClient, { HttpClient } from "./base.client";
import { QuoteModel } from "~~/models/quote.model";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

export class QuoteClient extends HttpClient {
  public async getQuote(options: { promoCode?: string; appraisalAndInspection: boolean }) {
    const res = await this.get<QuoteModel>(`/api/quotes`, options);
    if (!res.ok || !res.value) {
      const message = "Error getting quote";
      logger.error({ message, error: res.error });
      notification.error(message);
      return undefined;
    }
    return res.value;
  }
}

const useQuoteClient = () => useHttpClient(new QuoteClient());
export default useQuoteClient;
