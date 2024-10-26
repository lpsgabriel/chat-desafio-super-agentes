import { OpenAI } from "openai";

export async function createConversationTitle(message: string) {
  const openai = new OpenAI();
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente de conversa modelo gpt-4o-mini, utilizado para criar títulos para conversas com usuários finais, gerando títulos inteligentes, personalizados e com profundidade, e principalmente, curtos e fáceis de lembrar.",
        },
        {
          role: "user",
          content: `Crie um título para a seguinte mensagem de conversa: ${message}`,
        },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error);
    throw new Error("Falha ao obter resposta da IA");
  }
}
