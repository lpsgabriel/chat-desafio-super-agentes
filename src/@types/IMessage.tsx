export type IMessage = {
  conversationId: string;
  origin: "user" | "ai";
  content: string;
};
