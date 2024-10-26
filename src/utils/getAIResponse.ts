import { IMessageGpt } from "@/@types/IMessage";
import { OpenAI } from "openai";

export async function getAIResponse(messages: IMessageGpt[]) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de conversa modelo gpt-4o-mini, utilizado para conversas com usuários finais, gerando respostas inteligentes, personalizadas e com profundidade.",
        },
        ...messages,
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error);
    throw new Error("Falha ao obter resposta da IA");
  }
}
