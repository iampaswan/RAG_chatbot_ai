import { InMemoryVectorStore } from "../controllers/vectorStore";
import { Retriever } from "../controllers/retriever";

const store = new InMemoryVectorStore();
const retriever = new Retriever(store);

// Run ingestion ONCE when this file is imported
(async () => {
  try {
    console.log("Ingesting documents on startup...");
    await retriever.ingestDocuments("./documents", 800);
    console.log("Documents ingested successfully ");
  } catch (err) {
    console.error("Failed to ingest documents:", err);
  }
})();

export default retriever;
