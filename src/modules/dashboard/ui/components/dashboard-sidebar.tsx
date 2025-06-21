"use client";
import { Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem } from "@/components/ui/sidebar";
    import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
    import Link from "next/link";
    import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";


const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings"
    },
     {
        icon: BotIcon,
        label: "Agents",
        href: "/agents"
    },
];

const SecondSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade"
    },
];

const DashboardSidebar = () => {

const pathname = usePathname();

  return (
    <Sidebar>
        <SidebarHeader className="text-sidebar-accent-foreground">
            <Link className="flex items-center gap-2 px-2 pt-2" href="/">
                <Image src="/logo.svg" width={36} height={36} alt="Pam's ai" />
                <p className="text-2xl font-semibold">Pam AI</p>
            </Link>
        </SidebarHeader>
        <div className="px-2 py-2">
            <Separator className="opacity-100 text-[#6D6B68]"/>
        </div>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {firstSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton className={cn(
                                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-sidebar-[5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                    pathname === item.href ? "bg-linear-to-r/oklch border-sidebar-[5D6B68]/10" : "bg-transparent")}
                                    isActive={pathname === item.href}>
                                    <Link href={item.href} className="flex items-center gap-2">
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-sm tracking-tight">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <div className="px-2 py-2">
                <Separator className="opacity-100 text-[#6D6B68]"/>
            </div>
            <SidebarGroup>
                <SidebarContent>
                    <SidebarMenu>
                        {SecondSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton className={cn(
                                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-sidebar-[5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                    pathname === item.href ? "bg-linear-to-r/oklch border-sidebar-[5D6B68]/10" : "bg-transparent")}
                                    isActive={pathname === item.href}>
                                    <Link href={item.href} className="flex items-center gap-2">
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-sm tracking-tight">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-white">
            <DashboardUserButton />
        </SidebarFooter>
    </Sidebar>

  );
}

export default DashboardSidebar;