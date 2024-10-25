import { Queue, Worker } from "bullmq";
import { processTextFile } from "./fileProcessor";
import Redis from "ioredis";

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export const fileQueue = new Queue("file-processing", {
  connection: redisConnection,
});

const fileWorker = new Worker(
  "file-processing",
  async (job) => {
    await processTextFile(job.data.filePath, job.data.conversationId);
  },
  { connection: redisConnection }
);

fileWorker.on("error", (error) => {
  console.error("Erro no processamento da fila:", error);
});
