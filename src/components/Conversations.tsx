import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Text, Flex, Button } from "@chakra-ui/react";
import { IConversation } from "@/@types/IConversation";
import { IMessageDb } from "@/@types/IMessage";

interface ConversationsProps {
  conversations: IConversation[];
  onSelectConversation: (
    conversationId: string,
    messages: IMessageDb[]
  ) => void;
  loadConversations: () => void;
}
const Conversations: React.FC<ConversationsProps> = ({
  conversations,
  onSelectConversation,
  loadConversations,
}) => {
  const [conversationList, setConversationList] = useState<IConversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    setConversationList(conversations);
  }, [conversations]);

  const createNewConversation = async () => {
    const response = await axios.post("/api/chat/new");
    loadConversations();
    if (response.status === 200) {
      setConversationList([response.data, ...conversationList]);
      onSelectConversation(response.data.conversationId, []);
    }
  };

  const handleConversationClick = async (conversationId: string) => {
    try {
      const response = await axios.get(`/api/conversations/${conversationId}`);
      if (response.status === 200) {
        onSelectConversation(conversationId, response.data.messages);
      }
    } catch (error) {
      console.error("Erro ao carregar conversa:", error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setIsUserScrolling(!isAtBottom);
    }
  };
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToBottom();
    }
  }, [conversationList, isUserScrolling]);
  return (
    <Flex
      flexDirection={"column"}
      p={4}
      w={"300px"}
      overflowY={"auto"}
      overflowX={"hidden"}
      alignItems={"center"}
      mr={"3rem"}
    >
      <Button
        onClick={createNewConversation}
        colorScheme="orange"
        mb={4}
        p={"1.5rem"}
        w={"100%"}
      >
        Nova Conversa
      </Button>
      <Flex
        flexDirection={"column"}
        p={4}
        w={"300px"}
        overflow={"auto"}
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        {conversationList?.map((conversation: IConversation) => (
          <Flex
            key={conversation.id}
            my={2}
            p={3}
            borderRadius="md"
            bg="#1a1a1a"
            _hover={{ bg: "#2a2a2a", cursor: "pointer" }}
            onClick={() => handleConversationClick(conversation.id)}
          >
            <Text fontWeight="bold">{conversation.title}</Text>
          </Flex>
        ))}
        <div ref={messagesEndRef} />
      </Flex>
    </Flex>
  );
};

export default Conversations;