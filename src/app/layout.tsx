import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { AppProvider } from "@/providers/app-provider";
import { AgentProvider } from "@/providers/agent-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarbonCore Infrastructure — Climate Compliance OS",
  description: "Deterministic, AI-powered climate verification infrastructure. Convert real-world climate actions into machine-verifiable proof.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
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
