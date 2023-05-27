import { Router } from 'express';

import { Hash, Token } from '../libs';
import { UserPostgresDao } from '../dao/postgres';

const userPostgresDao = new UserPostgresDao();

const router = Router();

router.post('/login', async (request, response) => {
  const { email, password } = request.body;

  const userDao = await userPostgresDao.findByEmail(email);

  if (!userDao || !Hash.compare(password, userDao.password)) {
    return response.status(200).json({ error: 'Dados inválidos' });
  }

  userDao.password = undefined;

  const token = Token.generate(userDao, null);

  return response.status(200).json({ ...userDao, token });
});

export default router;
