import "./base";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { ValidationDb } from "~~/databases/validations.db";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { FileValidationModel } from "~~/models/file.model";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { key } = req.query;
    if (key) {
      return await get(req, res);
    } else {
      return await getAll(req, res);
    }
  } else if (req.method === "POST") {
    return await save(req, res);
  } else {
    return res.status(405).send("Method Not Supported");
  }
};

/**
 * Get validation by file key
 */
const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { key, registrationId } = req.query;
  if (!key || !registrationId || isArray(key) || isArray(registrationId)) {
    return res.status(400).send("Error: registrationId and key of type string are required");
  }
  const validation = await ValidationDb.getValidation(registrationId, key);
  return res.status(200).send(validation);
};

/**
 * Get all validations
 */
const getAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const validations = await ValidationDb.getAllValidations();
  return res.status(200).send(validations);
};

/**
 * Save a validation
 */
const save = async (req: NextApiRequest, res: NextApiResponse) => {
  const validation = JSON.parse(req.body) as FileValidationModel;
  const validationId = await ValidationDb.saveValidation(validation);
  return res.status(200).send(validationId);
};

export default withErrorHandler(handler);
