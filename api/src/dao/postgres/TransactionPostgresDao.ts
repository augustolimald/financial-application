import { Transaction } from '../../model/Transaction';
import { TransactionDao } from '../TransactionDao';
import Postgres from '../../libs/Postgres';

export class TransactionPostgresDao implements TransactionDao {
  async create(transaction: Transaction): Promise<Transaction> {
    const pool = Postgres.getPool();

    const response = await pool.query(
      'INSERT INTO transactions(id, description, value, user_id) VALUES ($1, $2, $3, $4) RETURNING *;',
      [transaction.id, transaction.description, transaction.value, transaction.user_id],
    );

    pool.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }

  async createAndUpdateBalance(transaction: Transaction): Promise<Transaction> {
    const pool = Postgres.getPool();

    await pool.query('BEGIN');

    let response;

    try {
      response = await pool.query(
        'INSERT INTO transactions(id, description, value, user_id) VALUES ($1, $2, $3, $4) RETURNING *;',
        [transaction.id, transaction.description, transaction.value, transaction.user_id],
      );

      await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [
        transaction.value,
        transaction.user_id,
      ]);

      await pool.query('UPDATE transactions SET processed_at = NOW() WHERE id = $1', [
        transaction.id,
      ]);

      await pool.query('COMMIT');
    } catch (error) {
      await pool.query('ROLLBACK');
    }

    pool.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }

  async findByUser(user_id: string): Promise<Transaction[]> {
    const pool = Postgres.getPool();

    const response = await pool.query(
      'SELECT id, description, value FROM transactions WHERE user_id = $1;',
      [user_id],
    );

    pool.end();

    return response.rows;
  }

  async sumByUser(user_id: string): Promise<number> {
    const pool = Postgres.getPool();

    const response = await pool.query(
      'SELECT COALESCE(SUM(value),0) AS total_value FROM transactions WHERE user_id = $1;',
      [user_id],
    );

    pool.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0].total_value;
  }
}
