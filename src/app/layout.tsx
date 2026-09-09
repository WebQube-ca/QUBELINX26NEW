import type { Metadata } from "next";
import {
  DM_Sans,
  Geist_Mono,
  Manrope,
  Outfit,
  Sora,
  Space_Grotesk,
  Syne,
} from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QubeLinx — Everything you share. One powerful link.",
    template: "%s | QubeLinx",
  },
  description:
    "Create a beautiful page for everything you are and everything you share. Put your QubeLinx anywhere and let people discover everything from one simple link.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: "QubeLinx",
    description: "Everything you share. One powerful link.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} ${spaceGrotesk.variable} ${dmSans.variable} ${outfit.variable} ${syne.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-manrope)]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
