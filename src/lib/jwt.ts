import jwt from "jsonwebtoken";

// {address: '0x2Ef348733575dB4EE9E24FF0568F9A4946E66C33', type: 'wallet', iat: 1754683002, exp: 1754769402}

interface IJWTResult {
  address: string;
  type: string;
  iat: number;
  exp: number;
  isExpired: boolean;
}

export const readJWT = (token: string): IJWTResult | null => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded !== "object") {
      return null;
    }

    const { address, type, iat, exp } = decoded as IJWTResult;
    const isExpired = exp ? exp < Math.floor(Date.now() / 1000) : false;
    return {
      address,
      type,
      iat,
      exp,
      isExpired,
    };
  } catch {
    return null;
  }
};
