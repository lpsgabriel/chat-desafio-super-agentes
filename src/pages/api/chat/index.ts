import { IMessageGpt } from "@/@types/IMessage";
import {
  createConversationTitle,
  createNewConversation,
  getAIResponse,
} from "@/utils";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

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
              messages: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          })
        : null;
      if (!conversation) {
        conversation = await createNewConversation();
      }
      const newUserMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          type: "text",
          origin: "user",
          content: message,
        },
      });
      const messagesForContext: IMessageGpt[] = conversation.messages.map(
        (msg) => ({
          role: msg.origin === "user" ? "user" : "assistant",
          content: msg.content,
        })
      );
      if (conversation.title === "Nova Conversa") {
        const newTitle = await createConversationTitle(message);
        await prisma.conversation.update({
          where: {
            id: conversation.id,
          },
          data: {
            title: newTitle ?? "Nova Conversa",
          },
        });
      }
      messagesForContext.push({
        role: "user",
        content: message,
      });
      const aiResponse = await getAIResponse(messagesForContext);
      const aiMessage = await prisma.message.create({
        data: {
          conversationId: conversation.id,
          type: "text",
          content: aiResponse ?? "Desculpe, não entendi o que você disse.",
          origin: "assistant",
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
