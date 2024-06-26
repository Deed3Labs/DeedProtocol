import "./base";
import { NextApiRequest, NextApiResponse } from "next";
import withErrorHandler from "~~/middlewares/withErrorHandler";
import { QuoteModel } from "~~/models/quote.model";

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
  const { promoCode, appraisalAndInspection } = req.query;
  const legalWrapperFees = 225;
  const documentNotarizationFees = 50;
  const stateAndCountyFees = 150;
  const titleReportFees = 75;
  const appraisalAndInspectionFees = 220;

  const quote: QuoteModel = {
    legalWrapperFees: legalWrapperFees,
    documentNotarizationFees,
    stateAndCountyFees,
    titleReportFees,
    appraisalAndInspectionFees,
    promoCodeReduction: promoCode ? 100 : 0,
    advancedPlan: 95,
    total:
      legalWrapperFees +
      documentNotarizationFees +
      stateAndCountyFees +
      titleReportFees +
      (appraisalAndInspection === "true" ? appraisalAndInspectionFees : 0) -
      (promoCode ? 100 : 0),
  };

  return res.status(200).send(quote);
};

export default withErrorHandler(handler);
