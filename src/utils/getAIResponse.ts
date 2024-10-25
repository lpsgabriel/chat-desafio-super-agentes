import { IMessageGpt } from "@/@types/IMessage";
import { OpenAI } from "openai";

export async function getAIResponse(messages: IMessageGpt[]) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error);
    throw new Error("Falha ao obter resposta da IA");
  }
}
