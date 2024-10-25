import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: id as string,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      if (!conversation) {
        return res.status(404).json({ error: "Conversa não encontrada" });
      }
      res.status(200).json(conversation);
    } catch (error) {
      console.error("Erro ao buscar a conversa:", error);
      res.status(500).json({ error: "Erro ao buscar a conversa" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
