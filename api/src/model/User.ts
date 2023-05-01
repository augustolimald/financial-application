import { uuid } from 'uuidv4';

interface IUserCreation {
  id?: string;
  name: string;
  email: string;
  password?: string;
  balance?: number;
}

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  balance?: number;

  constructor(data: IUserCreation) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.balance = data.balance;

    this.id = data.id || uuid();
  }
}
