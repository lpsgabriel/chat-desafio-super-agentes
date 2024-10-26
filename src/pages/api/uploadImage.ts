import { IncomingForm, Files, Fields } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import vision from "@google-cloud/vision";
import { PrismaClient } from "@prisma/client";
import { createNewConversation } from "@/utils";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_VISION_CREDENTIALS || "{}"),
});
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new IncomingForm();
    const parseForm = (): Promise<{ fields: Fields; files: Files }> => {
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });
    };
    try {
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
        conversation = await createNewConversation("Análise de imagem");
      }
      const imageFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;
      if (!imageFile) {
        throw new Error("Nenhuma imagem válida foi enviada.");
      }
      const imagePath = imageFile.filepath;
      const [result] = await client.labelDetection(imagePath);
      const labels = result.labelAnnotations;
      if (!labels || labels.length === 0) {
        throw new Error("Nenhum objeto ou rótulo foi detectado na imagem.");
      }
      const descriptions = labels.map((label) => label.description).join(", ");
      const newUserMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          type: "image",
          origin: "user",
          content: `Imagem enviada para análise`,
        },
      });
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente que processa descrições de objetos, elementos, pessoas, entre outros que foram extraídos da análise de imagens.",
          },
          {
            role: "user",
            content: `Aqui está descrições extraídas de uma imagem: ${descriptions}, processe essas descrições, interprete-as e gere uma resposta baseada no conteúdo visual descrito, sem citar que voce processou essas descrições, apenas descrevendo a imagem.`,
          },
        ],
      });
      const aiMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          type: "image",
          content:
            gptResponse.choices[0].message.content ??
            "Não foi possível analisar a imagem.",
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
