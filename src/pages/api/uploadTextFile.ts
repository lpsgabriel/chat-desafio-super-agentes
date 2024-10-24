import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Files, Fields } from "formidable";
import fs from "fs";
import { OpenAI } from "openai";

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

      const { files } = await parseForm();
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file?.filepath) {
        return res.status(400).json({ error: "Arquivo inválido." });
      }

      const text = fs.readFileSync(file.filepath, "utf8");

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Processar o seguinte texto: " },
          { role: "user", content: text },
        ],
      });

      res.status(200).json({ message: response.choices[0].message.content });
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
