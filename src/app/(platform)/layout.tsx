// import Footer from "@/components/template/footer/footer"
import "../globals.css";
import PlatformHeader from "@/components/template/header-platform/platform-header"
import { UploadProvider } from "@/components/upload/context";
import { ModalProvider } from "@/components/atom/modal/context";
import { Toaster } from "@/components/ui/sonner";


interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
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
          
        {/* </ProjectProvider> */}
      {/* </MainProvider> */}
      </main>
      <Toaster position="bottom-right" />
      {/* <Footer /> */}
    </div>
  )
}