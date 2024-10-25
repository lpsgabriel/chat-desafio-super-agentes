import React, { useRef, useState } from "react";
import {
  Flex,
  Icon,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverHeader,
  Input,
  Text,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import { FaRegImage } from "react-icons/fa6";

interface ChatInputProps {
  sendMessage: (message: string) => void;
  handleImageUpload: (file: File) => void;
  handleTextFileUpload: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  sendMessage,
  handleImageUpload,
  handleTextFileUpload,
}) => {
  const [textInput, setTextInput] = useState("");

  const popoverDisclosure = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileClick = () => {
    imageInputRef.current?.click();
  };

  const handleTextFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = () => {
    if (textInput.trim()) {
      sendMessage(textInput);
      setTextInput("");
    }
  };

  const clearInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleImageUpload(e.target.files[0]);
      popoverDisclosure.onClose();
      clearInput();
    }
  };

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleTextFileUpload(e.target.files[0]);
      popoverDisclosure.onClose();
      clearInput();
    }
  };

  return (
    <Flex borderRadius="md" bg={"#2a2a2a"} alignItems={"center"}>
      <Popover placement="top" isOpen={popoverDisclosure.isOpen}>
        <PopoverTrigger>
          <Button
            bg={"#2a2a2a"}
            borderLeftRadius={0}
            onClick={popoverDisclosure.onOpen}
            minW="auto"
            _active={{
              bg: "transparent",
              borderColor: "transparent",
              "& > svg": { color: "orange.800" },
            }}
            _hover={{
              borderColor: "transparent",
              "& > svg": { color: "orange.600" },
            }}
          >
            <Icon as={CgAttachment} color={"#DD6b20"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent color={"white"} bg={"#2a2a2a"} borderColor={"#2a2a2a"}>
          <PopoverArrow bg={"#2a2a2a"} />
          <PopoverCloseButton zIndex={2} onClick={popoverDisclosure.onClose} />
          <PopoverBody>
            <Flex>
              <Flex flexDirection={"column"} p={"1rem"} alignItems={"center"}>
                <Input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  display={"none"}
                />
                <Button
                  w={"100%"}
                  onClick={handleImageFileClick}
                  bg={"#2a2a2a"}
                  border={"1px solid #DD6b20"}
                  py={"1.75rem"}
                  _active={{
                    bg: "#1a1a1a",
                    "& > svg": { color: "orange.800" },
                  }}
                  _hover={{
                    bg: "#1a1a1a",
                    "& > svg": { color: "orange.600" },
                  }}
                >
                  <Icon boxSize={"2rem"} as={FaRegImage} color={"#DD6b20"} />
                </Button>
                <Text mt={"0.25rem"}>Imagem</Text>
              </Flex>
              <Flex flexDirection={"column"}>
                <Text>Arquivo .txt</Text>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleTextFileChange}
                  display={"none"}
                />
              </Flex>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Input
        alignContent={"center"}
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
        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        _hover={{ borderColor: "transparent" }}
        _focus={{
          borderColor: "transparent",
          boxShadow: "none",
        }}
        placeholder="Digite sua mensagem..."
      />
      <Button
        onClick={handleSendMessage}
        bg={"#2a2a2a"}
        borderLeftRadius={0}
        _active={{
          bg: "transparent",
          borderColor: "transparent",
          "& > svg": { color: "orange.800" },
        }}
        _hover={{
          borderColor: "transparent",
          "& > svg": { color: "orange.600" },
        }}
      >
        <Icon as={IoMdSend} color={"#DD6b20"} />
      </Button>
    </Flex>
  );
};

export default ChatInput;
