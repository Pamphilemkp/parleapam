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
            <main className="flex flex-col bg-muted w-full min-w-0 h-screen-mobile sm:h-screen overflow-x-hidden max-w-full">
                <DashboardNavbar />
                <div className="flex-1 overflow-y-auto overflow-x-hidden w-full max-w-full">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}

export default Layout;