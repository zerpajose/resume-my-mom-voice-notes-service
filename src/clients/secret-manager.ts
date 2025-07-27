import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(projectId: string, secretId: string): Promise<string> {
  const name = `projects/${projectId}/secrets/${secretId}/versions/latest`;
  const [accessResponse] = await client.accessSecretVersion({
  name,
  });

  const responsePayload = accessResponse.payload?.data?.toString();
  return responsePayload || '';
}
