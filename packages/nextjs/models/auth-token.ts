import { JwtPayload } from "jsonwebtoken";
import { Address } from "viem";

export default interface AuthToken extends JwtPayload {
  verified_credentials: [{ address: Address; lastSelectedAt: string; id: string }];
  email: string;
}
