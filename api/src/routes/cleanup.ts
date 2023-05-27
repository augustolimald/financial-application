import { Router } from 'express';

import { UserPostgresDao } from '../dao/postgres';

const userPostgresDao = new UserPostgresDao();

const router = Router();

router.post('/cleanup', async (request, response) => {
  await userPostgresDao.cleanup();
  return response.status(204).json();
});

export default router;
