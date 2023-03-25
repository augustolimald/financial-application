import { Router } from 'express';

import { User } from '../../model/User';
import { UserDynamoDao } from '../../dao/dynamodb/UserDynamoDao';

import { Transaction } from '../../model/Transaction';
import { TransactionPostgresDao } from '../../dao/postgres/TransactionPostgresDao';
import { TransactionDynamoDao } from '../../dao/dynamodb/TransactionDynamoDao';

import Hash from '../../libs/Hash';
import Token from '../../libs/Token';

const router = Router();

const userDynamoDao = new UserDynamoDao();
const transactionPostgresDao = new TransactionPostgresDao();
const transactionDynamoDao = new TransactionDynamoDao();

router.post('/users', async (request, response) => {
  const user = new User(request.body);

  user.password = Hash.hash(user.password);

  const userDao = await userDynamoDao.create(user);

  return response.status(201).json(userDao);
});

router.post('/login', async (request, response) => {
  const { email, password } = request.body;

  const userDao = await userDynamoDao.findByEmail(email);

  if (!userDao || !Hash.compare(password, userDao.password)) {
    return response.status(200).json({ error: 'Dados inválidos' });
  }

  userDao.password = undefined;

  const token = Token.generate(userDao, null);

  return response.status(200).json({ ...userDao, token });
});

router.post('/transactions', async (request, response) => {
  const transaction = new Transaction(request.body);

  const transactionDao = await transactionDynamoDao.create(transaction);

  return response.status(201).json(transactionDao);
});

router.get('/balance', async (request, response) => {
  const { user_id } = request.body;

  const balance = await transactionPostgresDao.sumByUser(user_id);

  return response.status(200).json(balance);
});

export default router;
