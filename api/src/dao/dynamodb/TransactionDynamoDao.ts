import { Transaction } from '../../model/Transaction';
import { TransactionDao } from '../TransactionDao';
import Dynamo from '../../libs/Dynamo';

export class TransactionDynamoDao implements TransactionDao {
  async create(transaction: Transaction): Promise<Transaction> {
    const client = Dynamo.getClient();

    await client.putItem({
      TableName: 'Transaction',
      Item: {
        id: { S: transaction.id },
        description: { S: transaction.description },
        value: { N: transaction.value },
        user_id: { S: transaction.user_id },
      },
    });

    return transaction;
  }

  async findByUser(user_id: string): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }

  async sumByUser(user_id: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
