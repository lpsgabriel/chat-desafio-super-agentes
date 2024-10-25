import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#1a1a1a",
        color: "white",
      },
      "::-webkit-scrollbar": {
        width: "6px",
      },
      "::-webkit-scrollbar-track": {
        background: "#1a1a1a",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#111",
        borderRadius: "10px",
        border: "1px solid #DD6b20",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#333",
      },
    },
  },
});

export default theme;
