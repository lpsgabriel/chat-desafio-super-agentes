import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Files, Fields } from "formidable";
import { fileQueue } from "@/lib/fileQueue/fileQueue";
import { PrismaClient } from "@prisma/client";
import { createNewConversation } from "@/utils";

const prisma = new PrismaClient();

export const config = {
  api: { bodyParser: false },
};

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
            where: { id: conversationId[0] },
          })
        : null;

      if (!conversation) {
        conversation = await createNewConversation("Análise de arquivo txt");
      }
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      if (!file?.filepath) {
        return res.status(400).json({ error: "Arquivo inválido." });
      }
      await fileQueue.add("process-text-file", {
        filePath: file.filepath,
        conversationId: conversation.id,
      });

      res
        .status(200)
        .json({ conversationId: conversation.id ?? conversationId });
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
