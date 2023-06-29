import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

class SQS {
  private queueUrl: string;
  private client: SQSClient;

  constructor() {
    if (this.isConfigured()) {
      this.client = new SQSClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

      this.queueUrl = process.env.AWS_QUEUE_URL;
    }
  }

  isConfigured() {
    return !!process.env.AWS_ACCESS_KEY_ID;
  }

  sendMessage(message: any, groupId: string | undefined) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId: groupId,
      MessageDeduplicationId: groupId,
    });

    return this.client.send(command);
  }
}

export default new SQS();
