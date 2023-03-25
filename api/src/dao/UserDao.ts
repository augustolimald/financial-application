import { User } from '../model/User';

export interface UserDao {
  findByEmail(email: string): Promise<User>;
  create(user: User): Promise<User>;
}
