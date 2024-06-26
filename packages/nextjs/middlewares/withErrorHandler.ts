import { request } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "~~/services/logger.service";

function withErrorHandler(fn: any) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      return await fn(req, res);
    } catch (error) {
      logger.error({ error, requestBody: request, location: fn.name });
      return res.status(500).send("Internal Server Error");
    }
  };
}

export default withErrorHandler;
