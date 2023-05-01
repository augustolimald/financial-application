import { Router } from 'express';

import { User } from '../../model/User';
import { UserPostgresDao } from '../../dao/postgres/UserPostgresDao';

import { Transaction } from '../../model/Transaction';
import { TransactionPostgresDao } from '../../dao/postgres/TransactionPostgresDao';

import Hash from '../../libs/Hash';
import Token from '../../libs/Token';
import SQS from '../../libs/SQS';

const router = Router();

const userPostgresDao = new UserPostgresDao();
const transactionPostgresDao = new TransactionPostgresDao();

router.post('/users', async (request, response) => {
  const user = new User(request.body);

  user.password = Hash.hash(user.password);

  const userDao = await userPostgresDao.create(user);

  return response.status(201).json(userDao);
});

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

router.post('/transactions', async (request, response) => {
  const transaction = new Transaction(request.body);

  const transactionDao = await transactionPostgresDao.create(transaction);

  SQS.sendMessage(transactionDao);

  return response.status(201).json(transactionDao);
});

router.get('/balance', async (request, response) => {
  const { user_id } = request.body;

  const balance = await userPostgresDao.getBalance(user_id);

  return response.status(200).json({ balance });
});

export default router;
