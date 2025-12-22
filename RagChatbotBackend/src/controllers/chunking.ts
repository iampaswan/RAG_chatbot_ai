export function splitTextIntoChunks(text: string, maxChars: number): string[] {

   const chunks: string[] = [];
   let current = "";

   const sentences = text.split(/(?<=[.?!])\s+/);
   for (const sentence of sentences) {
      if ((current + " " + sentence).length > maxChars) {
         if (current.trim().length > 0) {
            chunks.push(current.trim());
         }
         current = sentence;
      } else {
         current = current + " " + sentence;
      }
   }
   if (current.trim().length > 0) {
      chunks.push(current.trim());
   }
   return chunks;
}