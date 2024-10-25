import Chat from "@/components/Chat";
import Conversations from "@/components/Conversations";
import { Flex, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { IMessageDb } from "@/@types/IMessage";
import { IConversation } from "@/@types/IConversation";
import axios from "axios";

export default function Home() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<IMessageDb[]>([]);
  const [conversations, setConversations] = useState<IConversation[]>([]);

  const handleSelectConversation = (
    conversationId: string,
    conversationMessages: IMessageDb[]
  ) => {
    setSelectedConversationId(conversationId);
    setMessages(conversationMessages);
  };

  const loadConversations = useCallback(async () => {
    try {
      const response = await axios.get("/api/conversations");
      if (response.status === 200) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      minH="100vh"
      maxH="100vh"
      overflow={"hidden"}
      p={"2rem"}
      pt={"6rem"}
    >
      <Flex
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        bg={"#111"}
        textAlign="center"
        p="1rem"
        zIndex={1}
      >
        <Heading as="h1">Desafio Chat Super Agentes</Heading>
      </Flex>
      <Flex flexDirection={"row"} overflow={"hidden"} flexGrow={1} w={"100%"}>
        <Conversations
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          conversations={conversations}
          loadConversations={loadConversations}
        />
        <Chat
          conversationId={selectedConversationId}
          initialMessages={messages}
          chatMutate={loadConversations}
          setConversation={setSelectedConversationId}
        />
      </Flex>
    </Flex>
  );
}
