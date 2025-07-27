import config from "../config/environment";
import { db } from "../clients/firestore.client";
import { mergeAudioFiles } from "../helpers/merge-audio-files";
import { transcribeSpeech } from "../helpers/transcribe-speech";
import { aiResume } from "../helpers/ai-resume";

export async function finishThread(chatId: string) {
  const collectionName = config.collectionName;
  const collection = db.collection(collectionName);
  const document = await collection
    .where('chatId', '==', chatId)
    .where('finished', '==', false)
    .get();

  if (document.empty) {
    throw new Error("No open thread found");
  }

  if (document.docs.length > 1) {
    throw new Error("Multiple open threads found, please resolve this issue");
  }

  const docData = document.docs[0].data();
  const fileKeys = docData.fileKeys;
  if (fileKeys.length === 0) {
    throw new Error("No files to merge in this thread");
  }
  const bucketName = config.bucketName;
  const mergedFileKey = await mergeAudioFiles(fileKeys, bucketName);
  const transcription = await transcribeSpeech(mergedFileKey);
  console.log({ transcription });
  const summary = await aiResume(transcription);

  await document.docs[0].ref.update({
    finished: true,
    finishedAt: new Date().toISOString(),
  });

  return {
    summary,
  };
}
