import { ChatOllama } from "@langchain/ollama";

export async function testModel() {

  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama3",
    temperature: 0,
  });

  const response = await model.invoke(
    "Explain what a resume is in two sentences."
  );

  return response.content;
}