'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>DevLog — Engineering Task Tracker</title>
        <meta
          name="description"
          content="Track tasks with AI-powered decomposition and status updates"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
