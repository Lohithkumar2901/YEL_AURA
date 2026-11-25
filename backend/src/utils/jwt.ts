import jwt from 'jsonwebtoken';

export const generateToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });

export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' });

export const setTokenCookie = (res: any, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
