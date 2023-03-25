import { Client } from 'pg';

class Postgres {
  private client: Client;
  private connectionString: string;

  constructor() {
    this.connectionString = process.env.POSTGRES_URL;
  }

  getClient() {
    return new Client({
      connectionString: this.connectionString,
    });
  }
}

export default new Postgres();
