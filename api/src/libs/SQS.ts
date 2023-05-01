import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

class SQS {
  private queueUrl: string;
  private client: SQSClient;

  constructor() {
    this.client = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.queueUrl = process.env.AWS_QUEUE_URL;
  }

  sendMessage(message: any, groupId: string | undefined) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId: groupId,
    });

    return this.client.send(command);
  }
}

export default new SQS();
