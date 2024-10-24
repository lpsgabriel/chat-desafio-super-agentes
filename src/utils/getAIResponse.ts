import { OpenAI } from "openai";

export async function getAIResponse(message: string) {
  const openai = new OpenAI();
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error);
    throw new Error("Falha ao obter resposta da IA");
  }
}
