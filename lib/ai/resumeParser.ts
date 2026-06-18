import { ChatGroq } from "@langchain/groq";

export async function parseResume(resumeText: string) {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const prompt = `
Extract structured information from this resume.

Return ONLY JSON.

Fields:
{
 "fullName": string | null,
 "university": string | null,
 "degree": string | null,
 "graduationYear": number | null,
 "skills": string[],
 "projects": string[],
 "experienceLevel": string | null,
 "domainFocus": string | null
}

Resume:
${resumeText}
`;

  const response = await model.invoke(prompt);

  let output = response.content as string;

  output = output.replace(/```json/g, "").replace(/```/g, "");

  const jsonMatch = output.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("AI did not return JSON");
  }

  return JSON.parse(jsonMatch[0]);
}