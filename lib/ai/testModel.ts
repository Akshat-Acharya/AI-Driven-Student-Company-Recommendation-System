import { ChatGroq } from "@langchain/groq";

export async function testModel() {

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const response = await model.invoke(
    "Explain what a resume is in two sentences."
  );

  return response.content;
}