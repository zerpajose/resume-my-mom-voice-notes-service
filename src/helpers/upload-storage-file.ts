import config from '../config/environment.js';
import { storage } from '../clients/storage.client.js';

export async function uploadStorageFile(fileName: string, contents: Buffer | string) {
  await storage.bucket(config.bucketName).file(fileName).save(contents);
}
