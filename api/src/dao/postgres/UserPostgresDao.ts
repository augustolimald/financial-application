import { UserDao } from '../UserDao';
import { User } from '../../model/User';
import Postgres from '../../libs/Postgres';

export class UserPostgresDao implements UserDao {
  async findByEmail(email: string): Promise<User> {
    const client = Postgres.getClient();
    client.connect();

    const response = await client.query('SELECT * FROM users WHERE email = $1;', [email]);

    client.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }

  async create(data: User): Promise<User> {
    const client = Postgres.getClient();
    client.connect();

    const response = await client.query(
      'INSERT INTO users(id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email;',
      [data.id, data.name, data.email, data.password],
    );

    client.end();

    if (response.rowCount !== 1) {
      return null;
    }

    return response.rows[0];
  }
}
