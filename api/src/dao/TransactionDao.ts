import { Transaction } from '../model/Transaction';

export interface TransactionDao {
  create(data: Transaction): Promise<Transaction>;

  findByUser(user_id: string): Promise<Transaction[]>;

  sumByUser(user_id: string): Promise<number>;
}
