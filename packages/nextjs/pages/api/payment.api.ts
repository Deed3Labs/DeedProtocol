import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import AuthToken from "~~/models/auth-token";
import { jwtDecode } from "~~/servers/jwt-util";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    post(req, res);
  } else {
    res.status(405).send("Method Not Supported");
  }
};

/**
 * Send a payement intent to Stripe.
 */
const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const jwtToken = req.headers.authorization!;
  let email = undefined;
  let decoded;
  try {
    decoded = jwtDecode<AuthToken>(jwtToken);
  } catch (error) {
    res.status(401).send(`Error: Invalid JWT token`);
    return;
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

  res.status(200).send("success");
};

export default withErrorHandler(handler);
