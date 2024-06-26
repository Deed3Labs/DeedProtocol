import "./base";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { DeedDb } from "~~/databases/deeds.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { authentify } from "~~/servers/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await verifyPayment(req, res);
  } else if (req.method === "POST") {
    return await submitPayment(req, res);
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

  const registration = await DeedDb.getDeed(registrationId);

  if (!registration) {
    return res.status(404).send({ registrationId, error: "Registration not found" });
  }

  registration.paymentInformation.receipt = paymentIntent.payment_intent?.toString();

  await DeedDb.saveDeed(registration);

  return res.status(200).send({
    registrationId,
    isVerified: true,
  });
};

async function submitPayment(req: NextApiRequest, res: NextApiResponse) {
  const { id, paymentReceipt } = req.query;

  if (!id || isArray(id)) {
    return res.status(400).send("Error: id of type number is required");
  }

  if (!req.query.paymentReceipt) {
    return res.status(400).send("Error: payment receipt is required");
  }

  const deedInfo = await DeedDb.getDeed(id);

  if (!deedInfo) {
    return res.status(404).send(`Error: Deed ${id} not found`);
  }

  if (!(await authentify(req, res, [deedInfo.ownerInformation.walletAddress, "Validator"]))) {
    return;
  }

  deedInfo.paymentInformation.receipt = paymentReceipt as string;
  await DeedDb.saveDeed(deedInfo);

  return res.status(200).send("success");
}

export default withErrorHandler(handler);
