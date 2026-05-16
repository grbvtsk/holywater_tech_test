import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevLog — Engineering Task Tracker',
  description: 'Track tasks with AI-powered decomposition and status updates',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
