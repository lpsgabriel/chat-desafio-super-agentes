import { PrismaClient } from "@prisma/client";
import { createConversationTitle } from "./createConversationTitle";

const prisma = new PrismaClient();
export async function createNewConversation(title?: string) {
  let conversationTitle = "Nova Conversa";
  if (title) {
    conversationTitle =
      (await createConversationTitle(title)) ?? "Nova Conversa";
  }
  return await prisma.conversation.create({
    data: {
      title: conversationTitle ?? "Nova Conversa",
    },
    include: {
      messages: true,
    },
  });
}
