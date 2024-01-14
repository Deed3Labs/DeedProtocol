import { verify } from "jsonwebtoken";

export const jwtDecode = <JwtPayload>(jwtToken: string): JwtPayload => {
  const publicKey = process.env.NEXT_DYNAMIC_PUBLIC_KEY!;

  const decoded = verify(jwtToken, publicKey, {
    algorithms: ["RS256"],
  });
  return decoded as JwtPayload;
};
