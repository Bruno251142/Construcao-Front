import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  userId: number;
};

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader =
    request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      error: 'Token não enviado',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      'secret-key',
    ) as JwtPayload;

    request.userId = decoded.userId;

    next();
  } catch {
    return response.status(401).json({
      error: 'Token inválido',
    });
  }
}