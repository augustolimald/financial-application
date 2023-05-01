import { User } from '../model/User';

export interface UserDao {
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<User>;

  getBalance(user_id: string): Promise<number>;
  updateBalance(user_id: string, value: number): Promise<void>;

  cleanup(): Promise<void>;
}
