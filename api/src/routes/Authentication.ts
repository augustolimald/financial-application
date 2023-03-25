import { Request, Response, NextFunction } from 'express';
import Token from '../libs/Token';

export async function Authentication(request: Request, response: Response, next: NextFunction) {
  const header = request.headers.authorization;
  if (!header) {
    return response.status(401).json({ message: 'Informe um token' });
  }

  const [_, token] = header.split(' ');
  if (!token) {
    return response.status(401).json({ message: 'Informe um token no formato bearer' });
  }

  let tokenData: any = null;
  try {
    tokenData = Token.validate(token);
  } catch (error) {
    return response.status(401).json({ error: 'Informe um token válido' });
  }

  response.locals.token = token;
  request.body.user_id = tokenData.id;
  return next();
}
