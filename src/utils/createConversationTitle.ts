import { OpenAI } from "openai";

export async function createConversationTitle(message: string) {
  const openai = new OpenAI();
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Crie um título curto para a seguinte mensagem de conversa:",
        },
        { role: "user", content: message },
      ],
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao obter resposta da IA:", error);
    throw new Error("Falha ao obter resposta da IA");
  }
}
