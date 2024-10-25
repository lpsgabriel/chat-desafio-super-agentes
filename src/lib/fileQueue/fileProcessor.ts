import fs from "fs";
import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processTextFile(
  filePath: string,
  conversationId: string
) {
  try {
    const text = fs.readFileSync(filePath, "utf8");

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Processando conteúdo do arquivo .txt para enriquecer o contexto da conversa.",
        },
        { role: "user", content: text },
      ],
    });

    await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          type: "text",
          origin: "user",
          content: "Arquivo enviado para contexto!",
        },
      }),
      prisma.message.create({
        data: {
          conversationId,
          type: "file",
          origin: "assistant",
          content:
            gptResponse.choices[0].message.content ??
            "Erro no processamento do arquivo.",
        },
      }),
      prisma.message.create({
        data: {
          conversationId,
          type: "text",
          origin: "assistant",
          content: gptResponse.choices[0].message.content
            ? "Arquivo processado com sucesso!"
            : "Erro no processamento do arquivo.",
        },
      }),
    ]);
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
  }
}
