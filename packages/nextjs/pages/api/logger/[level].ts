import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { level } = req.query;
  const { body } = req;

  switch (level) {
    case "debug":
      console.debug(body);
      break;
    case "info":
      console.info(body);
      break;
    case "warn":
      console.warn(body);
      break;
    case "error":
      console.error(body);
      break;
    default:
      res.status(400).send("Invalid log level: " + level);
  }

  res.status(200);
}
