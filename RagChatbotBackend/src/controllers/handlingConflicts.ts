export function isCorrectionMessage(text: string) {
  return /is right|right answer|correct answer|actually/i.test(text);
}


export function extractValue(text: string) {
  return text
    .replace(/is right|right answer|correct answer|actually/gi, "")
    .trim();
}

import { InferenceClient } from "@huggingface/inference";
const client = new InferenceClient(process.env.HF_TOKEN);




export async function extractEntityPropertyHF(question: string) {
  console.log("Extracting entity/property from question:", question);
  const prompt = `
You are an information extraction system.

Extract the MAIN entity and the property being asked about.

Rules:
- Return ONLY valid JSON
- No explanations
- Use lowercase property names

Question:
"${question}"

Output format:
{
  "entity": "...",
  "property": "..."
}
`;

  const response = await client.textGeneration({
    model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
    inputs: prompt,

  });

  console.log("Extraction response raw:", response);

  const text = response.generated_text
    .replace(/```json|```/g, "")
    .trim();

  console.log("Cleaned extraction text:", text);




  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse entity/property:", text);
    return { entity: null, property: null };
  }
}



