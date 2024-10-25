import React, { useEffect, useRef } from "react";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { IMessageDb } from "@/@types/IMessage";

interface MessageListProps {
  messages: Partial<IMessageDb>[];
  newMessageIsLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  newMessageIsLoading,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <Flex
      flexDirection={"column"}
      minH={"100%"}
      borderRadius="md"
      overflow={"auto"}
      h={"100%"}
      p={4}
    >
      {messages.length > 0 ? (
        messages
          .filter((msg) => msg?.type !== "file")
          .map((msg) => (
            <Box
              key={msg?.id}
              my={1}
              p={2}
              bg={msg?.origin === "user" ? "#2a2a2a" : "transparent"}
              ml={msg?.origin === "user" ? "6rem" : 0}
              borderRadius="3xl"
            >
              <Flex p={2}>
                <Text>{msg?.content}</Text>
              </Flex>
            </Box>
          ))
      ) : (
        <Box
          alignSelf={"center"}
          my={"auto"}
          fontSize={"1.5rem"}
          fontWeight={"bold"}
        >
          Olá, como posso ajudar?
        </Box>
      )}
      {newMessageIsLoading && (
        <Box my={1} p={2}>
          <Spinner />
        </Box>
      )}

      <div ref={messagesEndRef} />
    </Flex>
  );
};

export default MessageList;
