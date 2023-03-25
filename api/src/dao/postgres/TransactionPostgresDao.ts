import { Transaction } from '../../model/Transaction';
import { TransactionDao } from '../TransactionDao';
import Postgres from '../../libs/Postgres';

export class TransactionPostgresDao implements TransactionDao {
  async create(transaction: Transaction): Promise<Transaction> {
    const client = Postgres.getClient();
    client.connect();

    const response = await client.query(
      'INSERT INTO transactions(id, description, value, user_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [transaction.id, transaction.description, transaction.value, transaction.user_id],
    );

    client.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }

  async findByUser(user_id: string): Promise<Transaction[]> {
    const client = Postgres.getClient();
    client.connect();

    const response = await client.query(
      'SELECT id, description, value FROM transactions WHERE user_id = $1;',
      [user_id],
    );

    client.end();

    return response.rows;
  }

  async sumByUser(user_id: string): Promise<number> {
    const client = Postgres.getClient();
    client.connect();

    const response = await client.query(
      'SELECT COALESCE(SUM(value),0) AS total_value FROM transactions WHERE user_id = $1;',
      [user_id],
    );

    client.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0].total_value;
  }
}
