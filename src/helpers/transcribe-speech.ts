import config from '../config/environment.js';
import speech from '@google-cloud/speech';

export async function transcribeSpeech(fileKey: string): Promise<string> {

  const client = new speech.SpeechClient();
  const languageCode = 'es-US';

  const configuration = {
    languageCode,
  };

  const audio = {
    uri: `gs://${config.bucketName}/${fileKey}`,
  };

  const request = {
    config: configuration,
    audio: audio,
  };

  // Detects speech in the audio file. This creates a recognition job that you
  // can wait for now, or get its result later.
  const [operation] = await client.longRunningRecognize(request);
  // Get a Promise representation of the final result of the job
  const [response] = await operation.promise();
  const transcription = (response.results ?? [])
    .map(result => {
      const alternatives = result.alternatives ?? [];
      return alternatives[0]?.transcript ?? '';
    })
    .filter(Boolean)
    .join('\n');
  return transcription;
}
