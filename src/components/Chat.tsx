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
}

const Chat: React.FC<ChatProps> = ({
  conversationId,
  initialMessages,
  chatMutate,
}) => {
  const [messages, setMessages] = useState<IMessageDb[]>(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (messages.length === 2) {
      chatMutate();
    }
  }, [messages, chatMutate]);

  const sendMessage = async (message: string) => {
    const response = await axios.post("/api/chat", {
      message,
      conversationId,
    });
    setMessages([
      ...messages,
      response.data.userMessage,
      response.data.aiMessage,
    ]);
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    if (conversationId) {
      formData.append("conversationId", conversationId);
    }
    const response = await axios.post("/api/uploadImage", formData);
    setMessages([
      ...messages,
      response.data.userMessage,
      response.data.aiMessage,
    ]);
  };

  const handleTextFileUpload = async (file: File) => {
    const formData = new FormData();
    if (conversationId) {
      formData.append("conversationId", conversationId);
    }
    formData.append("file", file);
    const response = await axios.post("/api/uploadTextFile", formData);
    setMessages([
      ...messages,
      response.data.userMessage,
      response.data.aiMessage,
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
      <Messages messages={messages} />
      <ChatInput
        sendMessage={sendMessage}
        handleImageUpload={handleImageUpload}
        handleTextFileUpload={handleTextFileUpload}
      />
    </Flex>
  );
};

export default Chat;
