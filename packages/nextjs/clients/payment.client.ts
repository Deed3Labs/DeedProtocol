import useHttpClient, { HttpClient } from "./base.client";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

export class PaymentClient extends HttpClient {
  public async verifyPayment(receiptId: string) {
    const res = await this.get(`/api/payment?receiptId=${receiptId}`);
    if (!res.ok || !res.value) {
      const message = "Error verifying payment";
      logger.error({ message, error: res.error });
      notification.error(message);
      return undefined;
    }
    return {
      isVerified: res.value.isVerified,
      registrationId: res.value.registrationId,
    };
  }
}

const usePaymentClient = () => useHttpClient(new PaymentClient());
export default usePaymentClient;
