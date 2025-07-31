import "./globals.css";

import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { SWRProvider } from '@/providers/swr-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Storium',
  description: 'Secure and efficient file management platform with Google OAuth authentication and modern React features powered by SWR.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SWRProvider>
          <Toaster position='top-right' richColors closeButton />
          {children}
        </SWRProvider>
      </body>
    </html>
  );
}
