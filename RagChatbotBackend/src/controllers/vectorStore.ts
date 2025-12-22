export type vector = number[]

export interface Chunk {
   id: string,
   text: string,
   embedding: vector
}

export class InMemoryVectorStore {
   private chunks: Chunk[] = [];

   async addChunk(chunk: Chunk): Promise<void> {
      this.chunks.push(chunk)
   }

   private cosineSimilarity(a: vector, b: vector): number {
      const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
      const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0))
      const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0))
      if (normA === 0 || normB === 0) return 0;
      return dot / (normA * normB)
   }

   async querySimilar(embedding: vector, topk: number = 3): Promise<Chunk[]> {

      const scored = this.chunks.map(chunk => ({
         chunk,
         score: this.cosineSimilarity(embedding, chunk.embedding)
      }))
      scored.sort((a, b) => b.score - a.score)
      return scored.slice(0, topk).map(s => s.chunk)
   }
}


