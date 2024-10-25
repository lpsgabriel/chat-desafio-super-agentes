import { createNewConversation } from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const conversation = await createNewConversation();
      res.status(200).json({
        conversationId: conversation.id,
        userMessage: {},
        aiMessage: {},
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
