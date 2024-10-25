import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Files, Fields } from "formidable";
import fs from "fs";
import { OpenAI } from "openai";
import { PrismaClient } from "@prisma/client";
import { createNewConversation } from "@/utils";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const form = new IncomingForm();
      const parseForm = (): Promise<{ fields: Fields; files: Files }> => {
        return new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
          });
        });
      };
      const { fields, files } = await parseForm();
      const { conversationId } = fields;
      let conversation = conversationId
        ? await prisma.conversation.findUnique({
            where: {
              id: conversationId[0],
            },
            include: {
              messages: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          })
        : null;
      if (!conversation) {
        conversation = await createNewConversation("Análise de arquivo txt");
      }
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file?.filepath) {
        return res.status(400).json({ error: "Arquivo inválido." });
      }
      const newUserMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          origin: "user",
          content: `Arquivo txt enviado para análise`,
        },
      });
      const text = fs.readFileSync(file.filepath, "utf8");
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente que processa textos que foram extraídos de um arquivo .txt.",
          },
          {
            role: "user",
            content: `Aqui está o texto extraído de um arquivo .txt: ${text}, processe o texto, interprete-o e gere uma resposta baseada no conteúdo deste texto, buscando referências, se for possível, sem citar que voce processou o texto, apenas descrevendo-o`,
          },
        ],
      });
      const aiMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content:
            gptResponse.choices[0].message.content ??
            "Não foi possível analisar o arquivo txt.",
          origin: "assistant",
        },
      });
      res.status(200).json({
        conversationId: conversation.id,
        userMessage: newUserMessage,
        aiMessage: aiMessage,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro desconhecido.",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
