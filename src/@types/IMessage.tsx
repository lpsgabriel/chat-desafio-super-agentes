export type IMessageDb = {
  id: string;
  conversationId: string;
  type: "text" | "image" | "file";
  origin: "user" | "assistant";
  content: string;
};

export type IMessageGpt = {
  role: "user" | "system" | "assistant";
  content: string;
};
