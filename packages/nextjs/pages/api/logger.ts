import logger from "../../services/logger";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { level } = req.query;
  const { body } = req;
  switch (level) {
    case "debug":
      logger.debug(body);
      break;
    case "info":
      logger.info(body);
      break;
    case "warn":
      logger.warn(body);
      break;
    case "error":
      logger.error(body);
      break;
    default:
      logger.info(body);
      break;
  }
  res.status(200);
}
