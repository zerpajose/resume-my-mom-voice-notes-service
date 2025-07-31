import express, { Request, Response } from 'express';
import multer from "multer";
import { isAuthenticated } from './auth/is-authenticated';
import { uploadVoiceNote } from "../src/controllers/upload-voice-note";
import { finishThread } from "../src/controllers/finish-thread";
import { generateToken } from "../src/auth/generate-token";

const router = express.Router();
const upload = multer();

router.post(
  '/auth/generate-token',
  async (req: Request, res: Response) => {
    try {
      const { chatId } = req.body;
      if (!chatId) {
        return res.status(400).json({ error: 'Chat ID is required' });
      }
      const token = await generateToken(chatId);
      res.status(200).json({ token });
    } catch (error) {
      console.error({ error });
      res.status(400).json({ error });
    }
  }
);

router.post(
  '/upload-voice-note/:chatId',
  isAuthenticated,
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const { params, file } = req;
      const { chatId } = params;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      await uploadVoiceNote({ file, chatId });
      res.status(201).json({ message: "Voice note uploaded successfully" });
    } catch (error) {
      console.error({ error });
      res.status(400).json({ error });
    }
  }
);

router.get(
  '/finish-thread/:chatId',
  isAuthenticated,
  async (req: Request, res: Response) => {
    try {
      const { chatId } = req.params;
      const { summary } = await finishThread(chatId);
      res.status(200).json({ summary });
    } catch (err) {
      const error = err as Error;
      console.error({ error });
      res.status(400).json({ error });
    }
  }
);

export default router;
