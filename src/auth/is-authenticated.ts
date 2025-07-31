import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getSecret } from "../clients/secret-manager";
import config from "../config/environment";

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const jwtSecret = await getSecret(config.googleProjectNumber, config.jwtSecretName);
  const decoded = jwt.verify(
    token,
    jwtSecret,
    {
      issuer: "resume-my-mom-voice-notes-service",
      audience: "resume-my-mom-voice-notes-bot",
    }
  );

  if (
    !decoded ||
    typeof decoded !== "object" ||
    !("chatId" in decoded)
  ) {
    return res.status(401).json({ error: "Invalid token" });
  }

  next();
}