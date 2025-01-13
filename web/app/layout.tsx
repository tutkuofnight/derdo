import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import StoreProvider from "@/store/StoreProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import SessionProvider from "@/components/providers/SessionProvider"
import Header from "@/components/Header"
import { Toaster } from "@/components/ui/toaster"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "derdo"
  },
  description: "The platform for upload and listen music together with your friends.",
  icons: [
    {
      url: "/favicon.svg",
      rel: "icon",
      type: "image/x-icon",
    },
    {
      url: "/favicon.svg",
      rel: "icon",
      type: "image/svg+xml",
    },
    {
      url: "/favicon.svg",
      rel: "apple-touch-icon",
      type: "image/svg+xml",
    },
  ],
  openGraph: {
    type: "website",
    url: "https://secret-rewind.vercel.app",
    title: "derdo",
    description: "The platform for upload and listen music together with your friends.",
    siteName: "derdo",
    images: [{
      url: "/favicon.svg",
    }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <StoreProvider>
            <ThemeProvider           
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <Header />
              {children}
              <Toaster />
            </ThemeProvider>
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
