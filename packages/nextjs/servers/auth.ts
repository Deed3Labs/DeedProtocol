import { getClient } from "./contract";
import { verify } from "jsonwebtoken";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { Address, getContract } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";
import AuthToken from "~~/models/auth-token";
import logger from "~~/services/logger.service";

type Role = "Validator" | "Admin";
type Constraint = Address | Role;
/**
 * Ensure authentication
 * @param req
 * @param res
 * @param constraints first level is OR, second level is AND
 * @returns
 */
export const authentify = async (
  req: NextApiRequest,
  res: NextApiResponse,
  constraints: (Constraint[] | Constraint)[],
) => {
  const { chainId } = req.query;
  const walletAddress = getWalletAddressFromToken(req);
  if (!chainId || Number.isNaN(chainId) || isArray(chainId)) {
    res.status(400).send("Error: chainId is required and should be a number");
    return false;
  }
  if (walletAddress) {
    const ensureConstraint = async (constraint: Constraint) => {
      if (constraint.startsWith("0x") && constraint.length === 42) {
        // Address constraint
        return constraint === walletAddress;
      } else {
        // Role constraint
        const accessManager =
          deployedContracts[+chainId as keyof typeof deployedContracts].AccessManager;
        const contract = getContract({
          address: accessManager.address,
          abi: accessManager.abi,
          publicClient: getClient(chainId),
        });

        if (constraint === "Validator") {
          return await contract.read.hasValidatorRole([walletAddress]);
        } else if (constraint === "Admin") {
          return await contract.read.hasAdminRole([walletAddress]);
        }
      }
    };

    for (const orConstraint of constraints) {
      if (Array.isArray(orConstraint)) {
        if (orConstraint.every(ensureConstraint)) {
          return true;
        }
      } else {
        if (await ensureConstraint(orConstraint)) {
          return true;
        }
      }
    }
  }

  res.status(401).send("Error: Unauthorized");
  return false;
};

export const getWalletAddressFromToken = (req: NextApiRequest) => {
  const decoded = getDecodedToken(req);
  if (decoded) {
    return decoded.verified_credentials[0].address;
  }
  return undefined;
};

export const getDecodedToken = (req: NextApiRequest) => {
  const authorizationHeader = req.headers.authorization ?? (req.query.authorization as string);
  if (authorizationHeader) {
    const publicKey = process.env.NEXT_DYNAMIC_PUBLIC_KEY!;
    try {
      return verify(authorizationHeader, publicKey, {
        algorithms: ["RS256"],
      }) as AuthToken;
    } catch (error) {
      logger.warn("Failed to decode jwt token: ", error);
    }
  }
  return undefined;
};