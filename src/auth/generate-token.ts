import jwt from 'jsonwebtoken';
import { getSecret } from "../clients/secret-manager.js";
import config from "../config/environment.js";

export async function generateToken(chatId: string): Promise<string> {
  const jwtSecret = await getSecret(config.googleProjectNumber, config.jwtSecretName);
  const token = jwt.sign(
    {
      chatId
    },
    jwtSecret,
    {
      expiresIn: '15m',
      issuer: 'resume-my-mom-voice-notes-service',
      audience: 'resume-my-mom-voice-notes-bot',
    }
  );
  return token;
}
