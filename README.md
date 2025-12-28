# RAG Chatbot (RAG_chatbot_ai)

A Retrieval-Augmented Generation (RAG) chatbot backend implemented in TypeScript. The backend ingests documents, builds embeddings, stores them in an in-memory vector store, retrieves relevant context for user queries, and uses generative models to produce answers. It includes endpoints for uploading documents and fetching chat history persisted in MongoDB.

---

## Table of contents
- [Features](#features)
- [Architecture overview](#architecture-overview)
- [Requirements](#requirements)
- [Environment variables](#environment-variables)
- [Install & run](#install--run)
- [Endpoints / Example usage](#endpoints--example-usage)
- [Important files & directories](#important-files--directories)
- [Notes, tips & suggestions](#notes-tips--suggestions)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- File upload endpoint to add documents.
- Document chunking and embedding ingestion.
- Embedding generation using Hugging Face Inference API (featureExtraction).
- In-memory vector store for nearest-neighbor retrieval.
- Retrieval + generation orchestration (integrates with Google GenAI / Gemini or other LLMs).
- MongoDB-based chat history persistence and retrieval.
- CORS enabled and JSON body parsing.

---

## Architecture overview
- Server: Express + TypeScript
- Document ingestion: read files from `RagChatbotBackend/documents`, split into chunks (controller: `chunking.ts`), create embeddings via Hugging Face Inference API (controller: `retriever.ts`), store chunk + embeddings in an in-memory store (`vectorStore.ts`).
- Query flow: Client calls `/ragStreaming` → server embeds query → retrieves top-K similar chunks → passes context to generator (LLM) → returns (streamed) response and persists chat to MongoDB.
- Storage: Chat history stored in MongoDB (Mongoose model referenced as `RagChat`).
- Uploads: `POST /upload` accepts file uploads (multer middleware).

---

## Requirements
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)
- Hugging Face API token (HF_TOKEN) for inference embeddings
- (Optional) Google GenAI / Gemini credentials if you plan to use Google generative APIs

---

## Environment variables
Create a `.env` file at the repo root (or in backend folder) with at least:

- PORT — port for the server (e.g. 3000)
- HF_TOKEN — Hugging Face Inference API token
- MONGODB_URI — MongoDB connection string
- (Optional) GOOGLE_CREDENTIALS or other keys required by your generator / Google GenAI integration
- Any other variables referenced in the code (check `RagChatbotBackend/src/*`)

You can add a `.env.example` that lists these keys (without values) for contributors.

---

## Install & run

1. Clone
   ```bash
   git clone https://github.com/iampaswan/RAG_chatbot_ai.git
   cd RAG_chatbot_ai/RagChatbotBackend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Development run (typical options — check `package.json` scripts)
   - If a dev script exists:
     ```bash
     npm run dev
     ```
   - Otherwise use ts-node-dev:
     ```bash
     npx ts-node-dev src/index.ts
     ```

4. Production build & run (example)
   ```bash
   npm run build   # compiles TS -> JS (if script present)
   npm start       # start compiled server (check package.json)
   ```

5. Ensure `.env` is present and `MONGODB_URI` and `HF_TOKEN` are set.

---

## Endpoints & Example usage

- Upload a file
  ```
  POST /upload
  Content-Type: multipart/form-data
  Form field name: myFile
  ```
  Example curl:
  ```bash
  curl -X POST http://localhost:3000/upload \
    -F "myFile=@/path/to/document.pdf"
  ```

- RAG / Chat endpoint
  ```
  POST /ragStreaming
  Content-Type: application/json
  Body: { "query": "Your question here" }
  ```
  Example curl:
  ```bash
  curl -X POST http://localhost:3000/ragStreaming \
    -H "Content-Type: application/json" \
    -d '{"query":"Explain the authentication flow in the uploaded docs"}'
  ```

- Fetch chat history
  ```
  GET /chatHistory
  ```
  Example curl:
  ```bash
  curl http://localhost:3000/chatHistory
  ```

Notes:
- Uploaded files are handled by multer and returned in the response (check upload configuration in `src/uploadfiles/upload`).
- After upload, documents should be ingested into the vector store (see `Retriever.ingestDocuments`). Depending on implementation, ingestion may be automatic or require a separate step/script.

---

## Important files & directories
- RagChatbotBackend/src/index.ts — app entry point
- RagChatbotBackend/src/routes/ragRoutes.ts — Express routes
- RagChatbotBackend/src/controllers/
  - chunking.ts — split texts into chunks
  - retriever.ts — embedding generation & ingestion
  - generator.ts — LLM generation orchestration
  - ragfunction.ts — main request handler wiring retrieval + generation
  - vectorStore.ts — in-memory vector store and similarity query
  - retrieverInstance.ts — helper to create Retriever instance
  - handlingConflicts.ts — conflict handling logic
- RagChatbotBackend/src/ragChat/ragChatHistory.ts — chat history retrieval (Mongoose)
- RagChatbotBackend/documents — directory used for storing ingested/uploaded documents
- RagChatbotFrotend/ — frontend folder (note: name contains a likely typo; consider renaming to `RagChatbotFrontend`)

---

## Notes, tips & suggestions
- Persistence: The current vector store is in-memory. Consider adding a persistent vector DB (Pinecone, Milvus, Weaviate, Qdrant, or a file/db-backed store) for production so embeddings survive restarts.
- Ingest script: Provide a small script to run `Retriever.ingestDocuments('documents')` automatically after upload, or hook ingestion into the upload handler.
- README improvements: Add `.env.example`, and document required keys and where to get them (HF token, Google credentials).
- Typo: `RagChatbotFrotend` → `RagChatbotFrontend`.
- Security: Never commit API tokens or credentials. Add `.env` to `.gitignore`.
- Health check & validation: Add a `/health` endpoint and validate incoming requests to make the service more robust.

---

## Troubleshooting
- If embeddings fail: verify `HF_TOKEN` is valid and rate limits are not exceeded.
- MongoDB connection issues: check `MONGODB_URI`, network/firewall, and that the DB accepts connections.
- If the server does not start: check `PORT` and logs printed from `src/index.ts`.
- Check logs printed around embedding and HF responses — retriever prints raw responses which helps debugging.

---

## Contributing
- Please open issues or PRs for improvements, bug fixes, or feature requests.
- Recommended contributions:
  - Add integration tests & e2e example flow (ingest -> query -> response)
  - Add persistent vector store option
  - Add README documentation for frontend & deployment instructions

---

## License
Specify your license here (e.g., MIT). If you don't have one yet, add a `LICENSE` file.

---

If you'd like, I can:
- Create a `.env.example` file for this repo.
- Draft a CONTRIBUTING.md or LICENSE file.
- Produce a sample ingestion script that runs `Retriever.ingestDocuments` and persists a serialized vector store.
