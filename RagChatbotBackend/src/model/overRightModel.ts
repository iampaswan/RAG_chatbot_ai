import mongoose from "mongoose";

const FactOverrideSchema = new mongoose.Schema(
  {
    conflictQuestion: { type: String, required: true },
    verifiedAnswer: { type: String, required: true },

    source: { type: String, default: "user_verified" },
    confidence: { type: Number, default: 1.0 }
  },
  { timestamps: true }
);

export const FactOverride = mongoose.model(
  "FactOverride",
  FactOverrideSchema
);
