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
      <AppSidebar />
      <SidebarInset>
        <div>
          <SidebarTrigger className="ml-2 py-6   px-5 " />
        </div>
        <main className="flex flex-1  flex-col gap-4 p-17 pt-0">
          {" "}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
