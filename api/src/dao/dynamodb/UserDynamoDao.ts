import { User } from '../../model/User';
import { UserDao } from '../UserDao';
import Dynamo from '../../libs/Dynamo';

export class UserDynamoDao implements UserDao {
  async findByEmail(email: string): Promise<User> {
    const client = Dynamo.getClient();

    const response = await new Promise(resolve => {
      client.scan({ TableName: 'User' }).then(resolve);
    });

    const data = response['Items'].find(item => item.email.S === email);

    if (!data) {
      return null;
    }

    return new User({
      id: data.id.S,
      name: data.name.S,
      email: data.email.S,
      password: data.password.S,
    });
  }

  async create(data: User): Promise<User> {
    const client = Dynamo.getClient();

    await client.putItem({
      TableName: 'User',
      Item: {
        id: { S: data.id },
        name: { S: data.name },
        email: { S: data.email },
        password: { S: data.password },
      },
    });

    return { ...data, password: undefined };
  }
}
