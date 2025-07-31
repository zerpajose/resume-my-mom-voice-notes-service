import config from '../config/environment.js';
import speech from '@google-cloud/speech';
import { storage } from '../clients/storage.client.js';

export async function transcribeSpeech(fileKey: string): Promise<string> {
  const client = new speech.SpeechClient();
  const languageCode = 'es-US';

  const configuration = {
    model: 'latest_long',
    encoding: 'MP3' as 'LINEAR16' | 'FLAC' | 'MP3' | 'OGG_OPUS',
    sampleRateHertz: 48000,
    audioChannelCount: 1,
    enableWordTimeOffsets: true,
    enableWordConfidence: true,
    languageCode,
  };

  const audio = {
    uri: `gs://${config.bucketName}/${fileKey}`,
  };

  const request = {
    config: configuration,
    audio: audio,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();
  if(!response.results) {
    throw new Error('No transcription results found');
  }
  const transcription = response.results
    .map(result => {
      if (!result.alternatives) {
        throw new Error('No alternatives found for result');
      }
      return result.alternatives[0].transcript;
    })
    .join('\n');
  
  await storage.bucket(config.bucketName).file(fileKey).delete().catch(() => {});

  return transcription;
}
