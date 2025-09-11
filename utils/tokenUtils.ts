import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export const createJWT = (payload: TokenPayload): string => {
  const token = jwt.sign(payload, JWT_SECRET as jwt.Secret, {
    expiresIn: JWT_EXPIRES_IN || '30d',
  });
  return token;
};

export const verifyJWT = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
  return decoded;
};
