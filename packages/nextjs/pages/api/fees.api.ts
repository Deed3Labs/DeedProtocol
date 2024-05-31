import { NextApiRequest, NextApiResponse } from "next";
import { FeesnDb as FeesDb } from "~~/databases/fees.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { authentify } from "~~/servers/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await get(req, res);
  } else if (req.method === "POST") {
    return await save(req, res);
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Get a product price from Stripe for a specified product.
 */
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const fees = await FeesDb.getFees();
  return res.status(200).send(JSON.stringify(fees));
};

const save = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authentify(req, res, ["Admin"])) {
    return;
  }

  try {
    const parsed = JSON.parse(req.body);
    await FeesDb.saveFees(parsed);
    return res.status(200).send("Saved");
  } catch (error) {
    return res.status(400).send("Invalid JSON body");
  }
};

export default withErrorHandler(handler);
