// app/components/Providers.tsx

"use client";

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react"
import theme from "../../theme"; // 确认路径是否正确

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ChakraProvider>
    </>
  );
}
