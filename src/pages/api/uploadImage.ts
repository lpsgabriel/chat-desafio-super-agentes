import { IncomingForm, Files, Fields } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import vision from "@google-cloud/vision";

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
      const { files } = await parseForm();
      const imageFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;
      if (!imageFile || !imageFile) {
        throw new Error("Nenhuma imagem válida foi enviada.");
      }
      const imagePath = imageFile.filepath;
      const [result] = await client.labelDetection(imagePath);
      const labels = result.labelAnnotations;
      if (!labels || labels.length === 0) {
        throw new Error("Nenhum objeto ou rótulo foi detectado na imagem.");
      }
      const descriptions = labels.map((label) => label.description).join(", ");
      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente que processa textos extraídos de imagens.",
          },
          {
            role: "user",
            content: `Aqui está o texto extraído de uma imagem: ${descriptions}, processe o texto, interprete-o e gere uma resposta baseada no conteúdo visual descrito pelo texto, sem citar que voce processou o texto, apenas descrevendo a imagem.`,
          },
        ],
      });
      res.status(200).json({
        origin: "ai",
        content: gptResponse.choices[0].message.content,
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
