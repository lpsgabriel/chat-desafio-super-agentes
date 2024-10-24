import Chat from "@/components/Chat";
import { Box, Heading } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <Heading as="h1" textAlign="center" my={3}>
        Desafio Chat Super Agentes
      </Heading>
      <Chat />
    </Box>
  );
}
