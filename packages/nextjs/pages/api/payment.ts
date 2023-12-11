import pinataSDK from "@pinata/sdk";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import AuthToken from "~~/models/auth-token";

const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PINATA_TOKEN });
if (!process.env.NEXT_PINATA_TOKEN) throw new Error("Missing NEXT_PINATA_TOKEN env var");

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  if (req.method === "POST") {
    try {
      const jwtToken = req.headers.authorization!;
      let email = undefined;
      const decoded = jwtDecode<AuthToken>(jwtToken);
      email = decoded.email;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 200,
        currency: "usd",
        payment_method_types: ["card"],
        receipt_email: email,
      });
      console.log(paymentIntent);
      await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: "pm_card_visa" });

      res.status(200).send("success bitch");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  } else {
    res.status(405).send("Method Not Supported");
  }
}
