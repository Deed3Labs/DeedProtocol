/* eslint-disable no-console */
import "./base";
import { NextApiRequest, NextApiResponse } from "next";
import withErrorHandler from "~~/middlewares/withErrorHandler";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

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
      return res.status(400).send("Invalid log level: " + level);
  }

  return res.status(200).end();
};

export default withErrorHandler(handler);
