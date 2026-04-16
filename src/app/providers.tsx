"use client";

import { patchRecoilReact19 } from "@shared/lib/recoilReact19Compat";
patchRecoilReact19();

import { type ReactNode, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import { chakraTheme } from "@app/styles";
import { UserProvider } from "@entities/user";
import { ModalProvider } from "@app/providers/ModalProvider/index";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClientRef = useRef<QueryClient>(undefined);
  if (!queryClientRef.current) {
    queryClientRef.current = getQueryClient();
  }

  return (
    <CacheProvider>
      <ChakraProvider theme={chakraTheme}>
        <QueryClientProvider client={queryClientRef.current}>
          <RecoilRoot>
            <UserProvider>
              <ModalProvider>{children}</ModalProvider>
            </UserProvider>
          </RecoilRoot>
        </QueryClientProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
