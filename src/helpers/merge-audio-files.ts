import { randomUUID } from 'crypto';
import { storage } from '../clients/storage.client.js';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

/**
 * Merges multiple audio files from storage into one audio file and uploads the result back to storage.
 * @param fileKeys Array of storage file keys to merge (in order)
 * @param bucketName Name of the storage bucket
 * @param outputFormat Output audio format (e.g., 'mp3', 'wav')
 * @returns The key of the merged audio file in storage
 */
export async function mergeAudioFiles(fileKeys: string[], bucketName: string, outputFormat = 'mp3') {
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  // Download all files
  const localFiles: string[] = [];
  for (const key of fileKeys) {
    const localPath = path.join(tmpDir, key);
    const parentDir = path.dirname(localPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    await storage.bucket(bucketName).file(key).download({ destination: localPath });
    localFiles.push(localPath);
  }

  // Prepare output file
  const mergedFileName = `merged-${randomUUID()}.${outputFormat}`;
  const mergedFilePath = path.join(tmpDir, mergedFileName);

  // Merge using ffmpeg
  await new Promise((resolve, reject) => {
    const command = ffmpeg();
    localFiles.forEach(file => command.input(file));
    command
      .on('error', reject)
      .on('end', resolve)
      .mergeToFile(mergedFilePath, tmpDir);
  });

  // Upload merged file to storage
  await storage.bucket(bucketName).upload(mergedFilePath, { destination: mergedFileName });

  for (const key of fileKeys) {
    await storage.bucket(bucketName).file(key).delete().catch(() => {});
  }

  // Cleanup
  localFiles.forEach(f => fs.unlinkSync(f));
  fs.unlinkSync(mergedFilePath);

  // Return the file key (path in bucket)
  return mergedFileName;
}
