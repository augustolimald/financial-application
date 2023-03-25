import { DynamoDB } from '@aws-sdk/client-dynamodb';

class Dynamo {
  private client: DynamoDB;

  constructor() {
    this.client = new DynamoDB({ region: 'us-west-2', endpoint: 'http://localhost:8000' });
  }

  getClient() {
    return this.client;
  }
}

export default new Dynamo();
