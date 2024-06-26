import "./base";
import { NextApiRequest, NextApiResponse } from "next";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { authentify } from "~~/servers/auth";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return await resolveMarker(req, res);
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Send a payement intent to Stripe.
 */
const resolveMarker = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await authentify(req, res, [])) {
    return;
  }

  const { search } = req.query;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const resp = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?proximity=ip&access_token=${mapboxToken}`,
  );

  return res.status(200).send(resp);
};

export default withErrorHandler(handler);
