import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export function Validation(request: Request, response: Response, next: NextFunction) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ message: 'Erro de Validação', errors: errors.array() });
  }

  return next();
}
