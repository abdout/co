// import Footer from "@/components/template/footer/footer"
import "../globals.css";
import PlatformHeader from "@/components/template/header-platform/platform-header"
import { UploadProvider } from "@/components/upload/context";
import { ModalProvider } from "@/components/atom/modal/context";
import { ThemeProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

interface AppLayoutProps {
  children: React.ReactNode
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = localFont({
  src: "../fonts/Rubik-Black.ttf",
  variable: "--font-heading",
  preload: true,
  display: 'swap',
});

export default async function AppLayout({ children }: AppLayoutProps) {
  // Server-side authentication check
  const session = await auth();
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }
  
  return (
    <body
      className={cn(
        "min-h-screen bg-background antialiased overflow-x-hidden",
        fontSans.variable,
        fontHeading.variable,
        "font-sans"
      )}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
        <div data-wrapper="" className="px-4 md:px-8 lg:px-0 xl:px-32 2xl:px-48 border-grid flex flex-1 flex-col">
          <PlatformHeader />
          <main className="flex flex-1 flex-col pt-8">
            <UploadProvider>
              {/* <MemberProvider> */}
                <ModalProvider>
                  {children}
                </ModalProvider>
              {/* </MemberProvider> */}
            </UploadProvider>
          </main>
          {/* </ProjectProvider> */}
          {/* </MainProvider> */}
        </div>
      </ThemeProvider>
      <Toaster position="bottom-right" />
      {/* <Footer /> */}
    </body>
  )
}