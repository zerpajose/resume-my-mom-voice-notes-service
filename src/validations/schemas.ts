import * as z from "zod/v4"; 

export const UploadVoiceNoteSchema = z.object({
  file: z.instanceof(File),
});
