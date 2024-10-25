import { IMessageDb } from "./IMessage";

export type IConversation = {
  id: string;
  title: string;
  messages: IMessageDb[];
};
