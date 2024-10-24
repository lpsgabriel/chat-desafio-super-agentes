import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const conversations = await prisma.conversation.findMany({
        include: {
          messages: true,
        },
      });
      res.status(200).json(conversations);
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      res.status(500).json({ error: "Erro ao buscar conversas" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
