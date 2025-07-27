import express, { Request, Response } from "express";
import cors from "cors";
import { UploadVoiceNoteSchema } from "./src/validations/schemas";
import { uploadVoiceNote } from "./src/controllers/upload-voice-note";
import { finishThread } from "./src/controllers/finish-thread";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post('/upload-voice-note/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const contactData = UploadVoiceNoteSchema.parse(req.body);
    await uploadVoiceNote({ ...contactData, chatId });
    res.status(201).json({ message: "Voice note uploaded successfully" });
  } catch (error) {
    console.error({ error });
    res.status(400).json({ error });
  }
});

app.get('/finish-thread/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const { summary } = await finishThread(chatId);
    res.status(200).json({ summary });
  } catch (err) {
    const error = err as Error;
    console.error({ error });
    res.status(400).json({ error });
  }
});

export default app;
