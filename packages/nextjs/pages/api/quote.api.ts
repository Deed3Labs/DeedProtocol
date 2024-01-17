import { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import withErrorHandler from "~~/middlewares/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await get(req, res);
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Get a product price from Stripe for a specified product.
 */
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, product, advancedPlanEnabled, appraisalEnabled } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).send("Error: code is required");
  }
  if (!product || typeof product !== "string") {
    return res.status(400).send("Error: product is required");
  }

  const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY!);

  const productObj = await stripe.prices.retrieve(product);
  let priceUSDcents = productObj.unit_amount ? productObj.unit_amount : 0;

  const codes = await stripe.promotionCodes.list({
    code,
    active: true,
  });

  if (codes.data.length > 0) {
    const codeObj = codes.data[0];
    if (codeObj.coupon.amount_off) {
      priceUSDcents = priceUSDcents ? priceUSDcents - codeObj.coupon.amount_off : 0;
    } else if (codeObj.coupon.percent_off) {
      priceUSDcents = priceUSDcents ? priceUSDcents * (1 - codeObj.coupon.percent_off / 100) : 0;
    }
  }

  if (advancedPlanEnabled) {
  }

  return res.status(200).send(`${priceUSDcents}`);
};

export default withErrorHandler(handler);
