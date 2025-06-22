import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar";
import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props{
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            
            <DashboardSidebar />
            <main className="flex flex-col bg-muted w-screen h-screen">
            <DashboardNavbar />
              {children}
            </main>
        </SidebarProvider>
    );
}

export default Layout;