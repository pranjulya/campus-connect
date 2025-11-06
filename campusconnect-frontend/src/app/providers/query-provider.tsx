"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import { queryClient as sharedQueryClient } from "@/lib/queryClient";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => sharedQueryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
