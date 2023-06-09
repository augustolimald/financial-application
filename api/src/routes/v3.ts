import { Router } from 'express';

import { Cache, SQS } from '../libs';
import { Transaction } from '../model';
import { TransactionPostgresDao } from '../dao/postgres';

const router = Router();

const transactionPostgresDao = new TransactionPostgresDao();

router.post('/transactions', async (request, response) => {
  const transaction = new Transaction(request.body);

  const transactionDao = await transactionPostgresDao.create(transaction);

  if (SQS.isConfigured()) {
    SQS.sendMessage(transactionDao, transactionDao.id);
  } else {
    // Local Test Purpose
    await Cache.addValueToUser(transaction.user_id, transaction.value);
  }

  return response.status(201).json(transactionDao);
});

router.get('/balance', async (request, response) => {
  const { user_id } = request.body;

  const cacheKey = `cache:users:${user_id}:balance`;

  let balance = await Cache.get(cacheKey);

  if (!balance) {
    balance = await transactionPostgresDao.sumByUser(user_id);
  }

  return response.status(200).json({ balance });
});

export default router;
