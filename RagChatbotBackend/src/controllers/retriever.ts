import { GoogleGenAI } from "@google/genai";
import { splitTextIntoChunks } from "./chunking";
import { Chunk, InMemoryVectorStore } from "./vectorStore";
import fs from 'fs/promises'
import path from "path";

import dotenv from 'dotenv'
dotenv.config()

process.env.GEMINI_API_VERSION = "v1";

import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);





export class Retriever {

   private store: InMemoryVectorStore

   constructor(store: InMemoryVectorStore) {
      this.store = store
   }


   async ingestDocuments(dirPath: string, maxCharsPerChunk: number = 1000) {

      const files = await fs.readdir(dirPath);

      for (const file of files) {
         const full = path.join(dirPath, file);
         const stat = await fs.stat(full);
         if (stat.isFile()) {
            const raw = await fs.readFile(full, "utf-8");
            const chunks = splitTextIntoChunks(raw, maxCharsPerChunk);
            for (let i = 0; i < chunks.length; i++) {
               const txt = chunks[i];


               const raw = await client.featureExtraction({
                  model: "BAAI/bge-large-en-v1.5",
                  inputs: txt,
                  provider: "hf-inference",
               });
               console.log(raw);

               const embedding = Array.isArray(raw[0])
                  ? (raw[0] as number[])
                  : (raw as number[]);

               this.store.addChunk({
                  id: `${file}#${i}`,
                  text: txt,
                  embedding
               });
            }
         }
      }
   }


   async retrieveRelevant(query: string, topK: number = 3): Promise<Chunk[]> {
      console.log("Generating embedding for query:", query);
      const raw = await client.featureExtraction({
         model: "BAAI/bge-large-en-v1.5",
         inputs: query,
         provider: "hf-inference",
      });
      console.log(raw);
      console.log('embeding compeleted')

      const queryEmbedding = Array.isArray(raw[0])
         ? (raw[0] as number[])
         : (raw as number[]);

      if (!queryEmbedding) {
         throw new Error("Query embedding vector not found in response");
      }

      const top = await this.store.querySimilar(queryEmbedding, topK);
      return top;
   }




}
