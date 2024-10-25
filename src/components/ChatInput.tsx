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
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const popoverDisclosure = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (textInput.trim()) {
      sendMessage(textInput);
      setTextInput("");
    }
  };

  const clearInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
      handleImageUpload(e.target.files[0]);
      clearInput();
    }
  };

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
      handleTextFileUpload(e.target.files[0]);
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
          <PopoverHeader pt={4} fontWeight="bold" border="0">
            Enviar Anexo
          </PopoverHeader>
          <PopoverArrow bg={"#2a2a2a"} />
          <PopoverCloseButton zIndex={2} onClick={popoverDisclosure.onClose} />
          <PopoverBody>
            <Flex>
              <Flex flexDirection={"column"}>
                <Text>Imagem</Text>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Button
                  isDisabled={!selectedImage}
                  onClick={() => {
                    handleImageUpload(selectedImage!);
                    popoverDisclosure.onClose();
                    setSelectedImage(null);
                  }}
                >
                  Enviar
                </Button>
              </Flex>
              <Flex flexDirection={"column"}>
                <Text>Arquivo .txt</Text>
                <Input
                  type="file"
                  accept=".txt"
                  onChange={handleTextFileChange}
                />
                <Button
                  onClick={() => handleTextFileUpload(selectedFile!)}
                  isDisabled={!selectedFile}
                >
                  Enviar
                </Button>
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
