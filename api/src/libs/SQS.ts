import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

class SQS {
  private queueUrl: string;
  private client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: process.env.AWS_REGION,
    });

    this.queueUrl = process.env.AWS_QUEUE_URL;
  }

  sendMessage(message: any) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
    });

    return this.client.send(command);
  }
}

export default new SQS();
