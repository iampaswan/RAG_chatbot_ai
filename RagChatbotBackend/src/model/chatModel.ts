import { Schema, model, Document } from 'mongoose';

export interface IChat extends Document {
  question: string;
  answer: string;
  createdAt: Date;
  hasConflict?: boolean;

}

const chatSchema = new Schema<IChat>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    hasConflict: { type: Boolean, default: false },

  }, { timestamps: true });

export const RagChat = model<IChat>('Chat', chatSchema);
