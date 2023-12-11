import { JwtPayload } from "jwt-decode";
import { Address } from "viem";

export default interface AuthToken extends JwtPayload {
  verified_credentials: [{ address: Address }];
  email: string;
}
