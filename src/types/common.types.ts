export interface UploadVoiceNoteInput {
  file: Express.Multer.File;
  chatId: string;
}
