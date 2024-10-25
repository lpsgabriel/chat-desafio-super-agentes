import React, { useEffect, useState } from "react";
import axios from "axios";
import { Flex } from "@chakra-ui/react";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";
import { IMessageDb } from "@/@types/IMessage";

interface ChatProps {
  conversationId: string | null;
  initialMessages: IMessageDb[];
  chatMutate: () => void;
  setConversation: (conversationId: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  conversationId,
  initialMessages,
  chatMutate,
  setConversation,
}) => {
  const [messages, setMessages] =
    useState<Partial<IMessageDb>[]>(initialMessages);
  const [newMessageIsLoading, setNewMessageIsLoading] =
    useState<boolean>(false);
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (messages.length === 2) {
      chatMutate();
    }
  }, [messages, chatMutate]);

  const sendMessage = async (message: string) => {
    setNewMessageIsLoading(true);
    setMessages([
      ...messages,
      { origin: "user", content: message, type: "text" },
    ]);
    const response = await axios.post("/api/chat", {
      message,
      conversationId,
    });
    setNewMessageIsLoading(false);
    setConversation(response.data.conversationId);
    setMessages([
      ...messages,
      response.data.userMessage,
      response.data.aiMessage,
    ]);
  };

  const handleImageUpload = async (file: File) => {
    setNewMessageIsLoading(true);
    setMessages([
      ...messages,
      { origin: "user", content: "Imagem enviada para análise", type: "text" },
    ]);
    const formData = new FormData();
    formData.append("image", file);
    if (conversationId) {
      formData.append("conversationId", conversationId);
    }
    const response = await axios.post("/api/uploadImage", formData);
    setNewMessageIsLoading(false);
    setConversation(response.data.conversationId);
    setMessages([
      ...messages,
      response.data.userMessage,
      response.data.aiMessage,
    ]);
  };

  const handleTextFileUpload = async (files: FileList) => {
    const formData = new FormData();
    const filesLength = files.length;
    setMessages([
      ...messages,
      {
        origin: "user",
        content: `${
          filesLength > 1 ? "Arquivos enviados" : "Arquivo enviado"
        } para contexto!`,
        type: "text",
      },
    ]);
    setNewMessageIsLoading(true);
    if (conversationId) {
      formData.append("conversationId", conversationId);
    }
    for (const file of files) {
      formData.append("file", file);
    }
    const response = await axios.post("/api/uploadTextFile", formData);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setNewMessageIsLoading(false);
    setConversation(response.data.conversationId);
    setMessages([
      ...messages,
      {
        origin: "user",
        content: `${
          filesLength > 1 ? "Arquivos enviados" : "Arquivo enviado"
        } para contexto!`,
        type: "text",
      },
      {
        origin: "assistant",
        content: `${
          filesLength > 1 ? "Arquivos anexados" : "Arquivo anexado"
        } ao contexto da conversa!`,
        type: "text",
      },
    ]);
  };

  return (
    <Flex
      w={"100%"}
      mx="auto"
      maxW="container.md"
      minHeight={"100%"}
      flexDirection={"column"}
      py={8}
    >
      <Messages messages={messages} newMessageIsLoading={newMessageIsLoading} />
      <ChatInput
        sendMessage={sendMessage}
        handleImageUpload={handleImageUpload}
        handleTextFileUpload={handleTextFileUpload}
      />
    </Flex>
  );
};

export default Chat;
