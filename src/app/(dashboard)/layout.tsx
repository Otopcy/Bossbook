import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="dashboard-layout" className="flex h-screen bg-background text-foreground p-0 lg:p-4 relative">
      {/* Global smooth blur backdrop — activated by topbar via JS class toggle */}
      <div id="overlay-backdrop" className="overlay-backdrop" />

      <MobileSidebar />
      <Sidebar className="hidden lg:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-transparent p-4 md:p-6 custom-scrollbar">
          <div className="max-w-[1150px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
