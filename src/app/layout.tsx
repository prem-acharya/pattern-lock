import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pattern Lock",
  description:
    "Pattern Lock is a UI component that allows users to draw a pattern by connecting dots, similar to the pattern lock feature found on many mobile devices.",
  keywords:
    "pattern lock, UI component, authentication, security, react, nextjs",
  authors: [
    { name: "Prem Acharya", url: "https://shadcn-pattern-lock.vercel.app" },
  ],
  creator: "Prem Acharya",
  openGraph: {
    title: "Pattern Lock",
    description:
      "Pattern Lock is a UI component that allows users to draw a pattern by connecting dots, similar to the pattern lock feature found on many mobile devices.",
    url: "https://shadcn-pattern-lock.vercel.app",
    siteName: "Pattern Lock",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
