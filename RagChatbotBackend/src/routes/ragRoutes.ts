import express, { Request, Response } from 'express'
import { main } from '../controllers/ragfunction'
import { getRagChatHistory } from '../ragChat/ragChatHistory'

import { upload } from '../uploadfiles/upload'
const router = express.Router();

router.post('/ragStreaming', main)


router.post("/upload", upload.single("myFile"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }
  res.send({
    message: "File uploaded successfully",
    file: req.file,
  });
});

router.get('/chatHistory', getRagChatHistory)

export default router;