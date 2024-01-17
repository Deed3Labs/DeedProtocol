import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { getDecodedToken } from "~~/servers/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    return await post(req, res);
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Send a payement intent to Stripe.
 */
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  let email = undefined;
  const decoded = getDecodedToken(req);
  if (!decoded) {
    return res.status(401).send("Error: Unauthorized");
  }
  email = decoded.email;
  const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 200,
    currency: "usd",
    payment_method_types: ["card"],
    receipt_email: email,
  });
  await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: "pm_card_visa" });

  return res.status(200).send("success");
};

export default withErrorHandler(handler);
