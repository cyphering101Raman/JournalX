import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JournalX",
  description: "The AI-Powered Journaling Platform",
  icons: {
    icon: "/JournalX-icon.png",
    shortcut: "/JournalX-icon.png",
    apple: "/JournalX-icon.png",
  },
};

import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col bg-black text-white antialiased`}>
        <Navbar />
        <Toaster position="top-center" />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
