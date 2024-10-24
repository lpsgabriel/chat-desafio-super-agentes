import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#1a1a1a",
        color: "white",
      },
    },
  },
});

export default theme;
