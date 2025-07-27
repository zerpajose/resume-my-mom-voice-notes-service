import { randomUUID } from 'crypto';
import config from '../config/environment.js';
import { UploadVoiceNoteInput } from '../types/common.types.js';
import { db } from '../clients/firestore.client.js';
import { uploadStorageFile } from '../helpers/upload-storage-file.js';

const collectionName = config.collectionName;
const collection = db.collection(collectionName);

export async function uploadVoiceNote(voiceNote: UploadVoiceNoteInput) {
  const {
    file,
    chatId,
  } = voiceNote;

  const fileName = `${chatId}/${randomUUID()}/${file.originalname}`;
  await uploadStorageFile(fileName, file.buffer);

  const document = await collection
    .where('chatId', '==', chatId)
    .where('finished', '==', false)
    .get();

  if (document.empty) {
    const id = randomUUID();
    const docRef = collection.doc(id);

    await docRef.set({
      id,
      fileKeys: [fileName],
      chatId,
      createdAt: new Date().toISOString(),
      finished: false,
    });

    return;
  }

  await document.docs[0].ref.update({
    fileKeys: [...document.docs[0].data().fileKeys, fileName],
    updatedAt: new Date().toISOString(),
  });
}
