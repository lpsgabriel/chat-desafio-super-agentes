import { createConversationTitle, getAIResponse } from "@/utils";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function createNewConversation(message: string) {
  const conversationTitle = await createConversationTitle(message);
  return await prisma.conversation.create({
    data: {
      title: conversationTitle ?? "Nova conversa",
    },
    include: {
      messages: true,
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { message, conversationId } = req.body;
    try {
      let conversation = conversationId
        ? await prisma.conversation.findUnique({
            where: {
              id: conversationId,
            },
            include: {
              messages: true,
            },
          })
        : null;
      if (!conversation) {
        conversation = await createNewConversation(message);
      }
      const newUserMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          origin: "user",
          content: message,
        },
      });
      const aiResponse = await getAIResponse(message);
      const aiMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          content: aiResponse ?? "Desculpe, não entendi o que você disse.",
          origin: "ai",
        },
      });
      res.status(200).json({
        conversationId: conversation.id,
        userMessage: newUserMessage,
        aiMessage: aiMessage,
      });
    } catch (error) {
      console.error("Erro ao processar a mensagem:", error);
      res.status(500).json({ error: "Erro ao processar a mensagem" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
