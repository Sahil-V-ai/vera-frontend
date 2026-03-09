import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: html,
        },
        Text: text ? { Charset: 'UTF-8', Data: text } : undefined,
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: process.env.AWS_SES_SOURCE_EMAIL || process.env.BETTER_AUTH_EMAIL_FROM || 'noreply@example.com',
  });

  try {
    const result = await sesClient.send(command);
    return result;
  } catch (error) {
    console.error('Error sending email via SES:', error);
    throw error;
  }
}
