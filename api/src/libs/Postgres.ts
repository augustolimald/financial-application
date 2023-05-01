import { Client, Pool } from 'pg';

class Postgres {
  private connectionString: string;

  constructor() {
    this.connectionString = process.env.POSTGRES_URL;
  }

  getClient() {
    return new Client({
      connectionString: this.connectionString,
    });
  }

  getPool() {
    return new Pool({
      connectionString: this.connectionString,
    });
  }
}

export default new Postgres();
