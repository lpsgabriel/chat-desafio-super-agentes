export type IMessageDb = {
  id: string;
  conversationId: string;
  origin: "user" | "assistant";
  content: string;
};

export type IMessageGpt = {
  role: "user" | "system" | "assistant";
  content: string;
};
