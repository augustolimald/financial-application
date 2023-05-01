import { UserDao } from '../UserDao';
import { User } from '../../model/User';
import Postgres from '../../libs/Postgres';

export class UserPostgresDao implements UserDao {
  async findByEmail(email: string): Promise<User> {
    const pool = Postgres.getPool();

    const response = await pool.query(
      'SELECT id, email, name, password FROM users WHERE email = $1;',
      [email],
    );

    pool.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }

  async create(data: User): Promise<User> {
    const pool = Postgres.getPool();

    const response = await pool.query(
      'INSERT INTO users(id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email;',
      [data.id, data.name, data.email, data.password],
    );

    pool.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }

  async getBalance(user_id: string): Promise<number> {
    const pool = Postgres.getPool();

    const response = await pool.query('SELECT balance FROM users WHERE id = $1', [user_id]);

    pool.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0].balance;
  }

  async updateBalance(user_id: string, value: number): Promise<void> {
    const pool = Postgres.getPool();

    await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [value, user_id]);

    return pool.end();
  }

  async cleanup(): Promise<void> {
    const pool = Postgres.getPool();

    await pool.query('DELETE FROM users;');

    return pool.end();
  }
}
