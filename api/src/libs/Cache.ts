import Client from 'ioredis';
import Redlock from 'redlock';

class Cache {
  private client: Client;
  private redlock: Redlock;

  constructor() {
    this.client = new Client(process.env.REDIS_URL);
    this.redlock = new Redlock([this.client], {
      retryDelay: 300,
    });
  }

  async set(key: string, value: any): Promise<any> {
    return this.client.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const cached = await this.client.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // Local Test Purpose
  async addValueToUser(user_id: string, value: number): Promise<any> {
    const cacheKey = `cache:users:${user_id}:balance`;

    const lock = await this.redlock.acquire([`locks:${cacheKey}`], 10000);

    let balance: number;
    const balanceResponse = await this.client.get(cacheKey);

    if (balanceResponse) {
      balance = JSON.parse(balanceResponse) + value;
    } else {
      balance = value;
    }

    await this.client.set(cacheKey, balance);

    return lock.release();
  }
}

export default new Cache();
