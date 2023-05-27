import { Router } from 'express';

import { Transaction } from '../model';
import { TransactionPostgresDao } from '../dao/postgres';

const router = Router();

const transactionPostgresDao = new TransactionPostgresDao();

router.post('/transactions', async (request, response) => {
  const transaction = new Transaction(request.body);

  const transactionDao = await transactionPostgresDao.create(transaction);

  return response.status(201).json(transactionDao);
});

router.get('/balance', async (request, response) => {
  const { user_id } = request.body;

  const balance = await transactionPostgresDao.sumByUser(user_id);

  return response.status(200).json({ balance });
});

export default router;
