import express, { Request, Response } from "express";
import multer from "multer";

export const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, './documents/')
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});


