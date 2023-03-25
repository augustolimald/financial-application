import { uuid } from 'uuidv4';

interface ITransactionCreation {
  id?: string;
  value: number;
  user_id: string;
  description: string;
}

export class Transaction {
  id: string;
  value: number;
  user_id: string;
  description: string;

  constructor(data: ITransactionCreation) {
    this.value = data.value;
    this.description = data.description;
    this.user_id = data.user_id;

    this.id = data.id || uuid();
  }
}
