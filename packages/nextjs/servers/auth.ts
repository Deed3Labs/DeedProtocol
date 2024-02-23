import { getClient } from "./contract";
import { verify } from "jsonwebtoken";
import { isArray } from "lodash-es";
import { NextApiRequest, NextApiResponse } from "next";
import { getContract } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";
import AuthToken from "~~/models/auth-token";

export const authentify = async (
  req: NextApiRequest,
  res: NextApiResponse,
  constraints?: {
    requireSpecificAddress?: string;
    requireValidator?: boolean;
    requireAdmin?: boolean;
  },
) => {
  const { chainId } = req.query;
  const walletAddress = getWalletAddressFromToken(req);
  if (walletAddress) {
    if (
      constraints?.requireSpecificAddress &&
      walletAddress === constraints.requireSpecificAddress
    ) {
      return true;
    }
    if (constraints?.requireValidator || constraints?.requireAdmin) {
      if (!chainId || Number.isNaN(chainId) || isArray(chainId)) {
        res.status(400).send("Error: chainId is required and should be a number");
        return false;
      }
      const accessManager =
        deployedContracts[+chainId as keyof typeof deployedContracts].AccessManager;
      const contract = getContract({
        address: accessManager.address,
        abi: accessManager.abi,
        publicClient: getClient(chainId),
      });
      if (constraints.requireValidator) {
        return await contract.read.hasValidatorRole([walletAddress]);
      } else {
        return await contract.read.hasAdminRole([walletAddress]);
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
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const publicKey = process.env.NEXT_DYNAMIC_PUBLIC_KEY!;
    try {
      return verify(authorizationHeader, publicKey, {
        algorithms: ["RS256"],
      }) as AuthToken;
    } catch (error) {
      console.warn("Failed to decode jwt token: ", error);
    }
  }
  return undefined;
};
