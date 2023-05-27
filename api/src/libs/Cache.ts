import { Redis } from 'ioredis';

class Cache {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL);
  }

  async set(key: string, value: any): Promise<any> {
    return this.client.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const cached = await this.client.get(key);
    return cached ? JSON.parse(cached) : null;
  }
}

export default new Cache();
