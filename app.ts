
import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { uploadVoiceNote } from "./src/controllers/upload-voice-note";
import { finishThread } from "./src/controllers/finish-thread";


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const upload = multer();

app.post('/upload-voice-note/:chatId', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { params, file } = req;
    const { chatId } = params;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // If you want to validate other fields, add them to the schema and parse req.body
    // For now, just pass the buffer
    await uploadVoiceNote({ file, chatId });
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
