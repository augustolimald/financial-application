import { uuid } from 'uuidv4';

interface IUserCreation {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;

  constructor(data: IUserCreation) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;

    this.id = data.id || uuid();
  }
}
