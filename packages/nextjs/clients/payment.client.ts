import useHttpClient, { HttpClient } from "./base.client";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

export class PaymentClient extends HttpClient {
  public async verifyPayment(receiptId: string) {
    const res = await this.get(`/api/payments?receiptId=${receiptId}`);
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

  async submitPaymentReceipt(id: string, receipt: string) {
    const result = await this.post<number>(`/api/payments?id=${id}&paymentReceipt=${receipt}`);
    if (!result.ok) {
      logger.error({ message: "Error saving payment", status: result.status });
    }
    return result;
  }
}

const usePaymentClient = () => useHttpClient(new PaymentClient());
export default usePaymentClient;
