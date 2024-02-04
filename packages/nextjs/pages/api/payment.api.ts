import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { RegistrationDb } from "~~/databases/registrations.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await verifyPayment(req, res);
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Send a payement intent to Stripe.
 */
const verifyPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { receiptId } = req.query;
  if (receiptId === undefined || typeof receiptId !== "string") {
    return res.status(400).send("Missing receiptId or receiptId is not a string");
  }
  const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!, {});
  const paymentIntent = await stripe.checkout.sessions.retrieve(receiptId as string);

  if (paymentIntent === undefined) {
    return res.status(404).send("Payment not found");
  }

  if (paymentIntent.payment_status !== "paid") {
    return res.status(400).send("Payment not paid");
  }
  const registrationId = paymentIntent.client_reference_id;

  if (!registrationId) {
    return res.status(400).send("No registration id");
  }

  const registration = await RegistrationDb.getRegistration(registrationId);

  if (!registration) {
    return res.status(404).send({ registrationId, error: "Registration not found" });
  }

  registration.paymentInformation.receipt = paymentIntent.payment_intent?.toString();

  await RegistrationDb.saveRegistration(registration);

  return res.status(200).send({
    registrationId,
    isVerified: true,
  });
};

export default withErrorHandler(handler);
