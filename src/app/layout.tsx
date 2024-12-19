import './globals.css';

import Maintenance from '@/app/maintenance/page';
import AuthModal from '@/components/auth-modal';
import Header from '@/components/header';
import { TooltipProvider } from '@/components/ui';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import Script from 'next/script';

const geist = Geist({
  subsets: ['latin'],
  preload: true,
  fallback: ['sans-serif'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'v0.diy - UI Component Generator',
  description:
    'Generate beautiful UI components using shadcn, NextUI, and Tailwind CSS. Build modern web interfaces quickly and efficiently.',
  keywords: [
    'UI generator',
    'shadcn',
    'NextUI',
    'Tailwind CSS',
    'component generator',
    'web development',
    'React components',
  ],
  openGraph: {
    title: 'v0.diy - UI Component Generator',
    description:
      'Generate beautiful UI components using shadcn, NextUI, and Tailwind CSS',
    type: 'website',
    locale: 'en_US',
    siteName: 'v0.diy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'v0.diy - UI Component Generator',
    description:
      'Generate beautiful UI components using shadcn, NextUI, and Tailwind CSS',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script
          type="module"
          src={'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js'}
          strategy="afterInteractive"
          async
        />
        <Script
          noModule
          src={'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js'}
          strategy="afterInteractive"
          async
        />
      </head>
      <body className={cn(geist.className, 'min-h-screen')}>
        <SessionProvider>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster richColors expand />
              {process.env.MAINTENANCE === 'MAINTENANCE' ? (
                <Maintenance />
              ) : (
                <>
                  <Header />
                  <main>{children}</main>
                  <AuthModal />
                  <Toaster />
                </>
              )}
            </ThemeProvider>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
