import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { AgentProvider } from "@/providers/agent-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenPE | Radical Transparency in Climate Action",
  description: "Deterministic, AI-powered climate verification infrastructure. Convert real-world climate actions into machine-verifiable proof.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${inter.variable} ${plusJakarta.variable} antialiased`}>
        <ThemeProvider>
          <AppProvider>
            <AgentProvider>
              {children}
            </AgentProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
