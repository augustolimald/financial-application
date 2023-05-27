import { Router } from 'express';

import { Transaction } from '../model';
import { UserPostgresDao, TransactionPostgresDao } from '../dao/postgres';

const router = Router();

const userPostgresDao = new UserPostgresDao();
const transactionPostgresDao = new TransactionPostgresDao();

router.post('/transactions', async (request, response) => {
  const transaction = new Transaction(request.body);

  const transactionDao = await transactionPostgresDao.createAndUpdateBalance(transaction);

  return response.status(201).json(transactionDao);
});

router.get('/balance', async (request, response) => {
  const { user_id } = request.body;

  const balance = await userPostgresDao.getBalance(user_id);

  return response.status(200).json({ balance });
});

export default router;
