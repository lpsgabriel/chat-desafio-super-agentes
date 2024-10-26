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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente que processa textos extraídos de um arquivo afim de enriquecer o contexto de uma conversa.",
        },
        {
          role: "user",
          content: `Aqui está o conteúdo de um arquivo .txt: ${text} processe-o e interprete-o afim de enriquecer as próximas respostas e contextos passados na conversa.`,
        },
      ],
    });

    const now = new Date();

    await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId,
          type: "text",
          origin: "user",
          content: "Arquivo enviado para contexto!",
          createdAt: new Date(now.getTime()),
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
          createdAt: new Date(now.getTime() + 10),
        },
      }),
      prisma.message.create({
        data: {
          conversationId,
          type: "text",
          origin: "system",
          content: "Arquivo anexado ao contexto da conversa!",
          createdAt: new Date(now.getTime() + 20),
        },
      }),
    ]);
  } catch (error) {
    console.error("Erro ao processar arquivo:", error);
  }
}
