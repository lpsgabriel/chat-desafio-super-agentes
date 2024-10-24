import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Button,
  Flex,
  Icon,
  Textarea,
  Input,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  PopoverHeader,
} from "@chakra-ui/react";
import { IMessage } from "@/@types/IMessage";
import { IoMdSend } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [textInput, setTextInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversationId, setConversationId] = useState(null);

  const sendMessage = async () => {
    if (textInput.trim()) {
      const response = await axios.post("/api/chat", {
        message: textInput,
        conversationId,
      });
      setTextInput("");
      setConversationId(response.data.conversationId);
      setMessages([
        ...messages,
        response.data.userMessage,
        response.data.aiMessage,
      ]);
    }
  };

  useEffect(() => {
    console.log("Mensagens atualizadas: ", messages);
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    // if (conversationId) {
    //   formData.append("conversationId", conversationId);
    // }
    formData.append("image", selectedImage);
    const response = await axios.post("/api/uploadImage", formData);
    console.log("response", response);
    if (response.status === 200) {
      console.log("entrou no if");
      console.log("response", response.data);
      setSelectedImage(null);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      console.log("messages", messages);
    }
    setConversationId(response.data.conversationId);
  };

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTextFileUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await axios.post("/api/uploadTextFile", formData);
    console.log("response", response.data.message);
    setMessages([...messages, response.data.message]);
  };

  return (
    <Flex
      mx="auto"
      maxW="container.md"
      minHeight={"100%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
      py={8}
    >
      <Flex flexDirection={"column"}>
        <Flex
          flexDirection={"column"}
          borderColor={"white"}
          borderWidth={1}
          minH={"100%"}
          borderRadius="md"
          overflow={"auto"}
          h={"100%"}
          p={4}
        >
          {messages.map((msg) => (
            <Box
              key={msg.conversationId}
              my={1}
              p={2}
              bg={msg.origin === "user" ? "#2a2a2a" : "transparent"}
              ml={msg.origin === "user" ? "6rem" : 0}
              borderRadius="3xl"
              minH={"100%"}
            >
              <Flex p={2}>
                <Text>{msg.content}</Text>
              </Flex>
            </Box>
          ))}
        </Flex>
        <Flex borderRadius="md" bg={"#2a2a2a"} alignItems={"center"}>
          <Popover placement="top">
            <PopoverTrigger>
              <Button
                onClick={sendMessage}
                bg={"#2a2a2a"}
                borderLeftRadius={0}
                _hover={{
                  borderColor: "transparent",
                  "& > svg": { color: "orange.200" },
                }}
                minW="auto"
              >
                <Icon
                  size={"lg"}
                  as={CgAttachment}
                  color={"orange"}
                  _hover={{ color: "orange.200" }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              color={"white"}
              bg={"#2a2a2a"}
              borderColor={"#2a2a2a"}
            >
              <PopoverHeader pt={4} fontWeight="bold" border="0">
                Enviar Anexo
              </PopoverHeader>
              <PopoverArrow bg={"#2a2a2a"} />
              <PopoverCloseButton zIndex={2} />
              <PopoverBody>
                <Flex>
                  <Flex flexDirection={"column"}>
                    <Text>Imagem</Text>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Button onClick={handleImageUpload}>Enviar</Button>
                  </Flex>
                  <Flex flexDirection={"column"}>
                    <Text>Arquivo .txt</Text>
                    <Input
                      type="file"
                      accept=".txt"
                      onChange={handleTextFileChange}
                    />
                    <Button onClick={handleTextFileUpload}>Enviar</Button>
                  </Flex>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Textarea
            borderRightRadius={0}
            overflow={"auto"}
            minH={"3rem"}
            width={"100%"}
            maxH={"10rem"}
            resize={"none"}
            borderColor={"transparent"}
            bg={"#2a2a2a"}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            _hover={{ borderColor: "transparent" }}
            _focus={{
              borderColor: "transparent",
              boxShadow: "none",
            }}
            placeholder="Digite sua mensagem..."
          />
          <Button
            onClick={sendMessage}
            bg={"#2a2a2a"}
            borderLeftRadius={0}
            _hover={{
              borderColor: "transparent",
              "& > svg": { color: "orange.200" },
            }}
          >
            <Icon
              size={"lg"}
              as={IoMdSend}
              color={"orange"}
              _hover={{ color: "orange.200" }}
            />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Chat;
