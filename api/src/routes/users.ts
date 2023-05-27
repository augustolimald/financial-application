import { Router } from 'express';

import { Hash } from '../libs';
import { User } from '../model';
import { UserPostgresDao } from '../dao/postgres';

const userPostgresDao = new UserPostgresDao();

const router = Router();

router.post('/users', async (request, response) => {
  const user = new User(request.body);

  const userAlreadyExists = await userPostgresDao.findByEmail(user.email);
  if (userAlreadyExists) {
    return response.status(409).json({ error: 'Usuário já cadastrado' });
  }

  user.password = Hash.hash(user.password);

  const userDao = await userPostgresDao.create(user);

  return response.status(201).json(userDao);
});

export default router;
