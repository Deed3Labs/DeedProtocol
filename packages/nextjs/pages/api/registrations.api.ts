import { NextApiRequest, NextApiResponse } from "next";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import {
  createRegistration,
  getAllRegistrations,
  getRegistration,
} from "~~/servers/databases/registrations.db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check if the request method is GET.
  try {
    switch (req.method) {
      case "GET":
        get(req, res);
        break;
      case "POST":
        post(req, res);
        break;
      default:
        return res.status(405).send("Method not allowed");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

export default withErrorHandler(handler);

/**
 *
 * Retrieve the deed information from the database.
 */
async function get(req: NextApiRequest, res: NextApiResponse) {
  const { id, isDraft } = req.query;
  if (id !== undefined) {
    res.status(200).send(await getRegistration(Number(id)));
  } else {
    res.status(200).send(await getAllRegistrations());
  }
}

/**
 * Add a new deed information to the database.
 */
async function post(req: NextApiRequest, res: NextApiResponse) {
  const { code, product, advancedPlanEnabled, appraisalEnabled, deedInfo } = req.body;
  if (!code || typeof code !== "string") {
    res.status(400).send("Error: code is required");
    return;
  }
  if (!product || typeof product !== "string") {
    res.status(400).send("Error: product is required");
    return;
  }
  if (typeof advancedPlanEnabled !== "boolean") {
    res.status(400).send("Error: advancedPlanEnabled is required");
    return;
  }
  if (typeof appraisalEnabled !== "boolean") {
    res.status(400).send("Error: appraisalEnabled is required");
    return;
  }
  if (!deedInfo) {
    res.status(400).send("Error: deedInfo is required");
    return;
  }
  if (typeof deedInfo !== "object") {
    res.status(400).send("Error: deedInfo must be an object");
    return;
  }
  if (!deedInfo.ownerName || typeof deedInfo.ownerName !== "string") {
    res.status(400).send("Error: deedInfo.ownerName is required");
    return;
  }
  if (!deedInfo.entityName || typeof deedInfo.entityName !== "string") {
    res.status(400).send("Error: deedInfo.entityName is required");
    return;
  }

  await createRegistration(deedInfo);

  res.status(200).send("OK");
}
