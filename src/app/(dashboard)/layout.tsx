import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex items-start">
     
        <div className="hidden lg:flex">
          <AppSidebar />
        
          <SidebarTrigger className="ml-2 my-6" />
        </div>
  
      </div>
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 pt-0">
          <div className="block lg:hidden">
            <SidebarTrigger className="ml-1 mt-2" />
          </div>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
