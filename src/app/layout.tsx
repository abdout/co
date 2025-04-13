import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/providers";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";



const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "./fonts/Rubik-Black.ttf",
  variable: "--font-heading",
  preload: true,
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Company",
  description: "Company automation",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en" suppressHydrationWarning >
      <head>
        <link rel="preload" href="./fonts/Rubik-Black.ttf" as="font" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Remove Facebook #_=_ hash on page load
            if (window.location.hash === '#_=_') {
              history.replaceState 
                ? window.history.replaceState(null, null, window.location.href.split('#')[0])
                : window.location.hash = '';
            }
          `
        }} />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background antialiased overflow-x-hidden",
          fontSans.variable,
          fontHeading.variable,
          "font-sans"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <div className="container">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
    </SessionProvider>
  );
}