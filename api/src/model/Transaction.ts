import { uuid } from 'uuidv4';

interface ITransactionCreation {
  id?: string;
  value: number;
  user_id: string;
  description: string;
  created_at?: Date;
  processed_at?: Date;
}

export class Transaction {
  id: string;
  value: number;
  user_id: string;
  description: string;
  created_at?: Date;
  processed_at?: Date;

  constructor(data: ITransactionCreation) {
    this.value = data.value;
    this.description = data.description;
    this.user_id = data.user_id;
    this.created_at = data.created_at;
    this.processed_at = data.processed_at;

    this.id = data.id || uuid();
  }
}
