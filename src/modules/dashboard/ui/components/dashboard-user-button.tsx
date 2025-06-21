import { authClient } from "@/lib/auth-client";
import { DropdownMenu,
     DropdownMenuContent, 
     DropdownMenuItem, 
     DropdownMenuSeparator, 
     DropdownMenuLabel , 
     DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import {useRouter } from "next/navigation";

export const DashboardUserButton = () => {
const {data, isPending} = authClient.useSession();
const router = useRouter();

const onLogout = () => {
    authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.push("/sign-in");
            },
        },
    });
}

    if (isPending || !data?.user) {
        return null;
    }   
  return (
    <DropdownMenu>
        <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full  flex items-center justify-baseline  bg-white/5 hover:bg-white/10 overflow-hidden">
            {data.user.image ? (
                <Avatar>
                    <AvatarImage src={data.user.image} alt={data.user.name || "User"} />
                </Avatar>
            ): <GeneratedAvatar seed={data.user.name} variant="initials" className="sizw-9 mr-3" />}
            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 w-min-0">
                <p className="text-sm truncate w-full">{data.user.name}</p>
                <p className="text-xs truncate w-full">{data.user.email}</p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-72 bg-white/5 backdrop-blur-md border border-border/10">
            <DropdownMenuLabel className="text-sm">
                <div className="flex flex-col  gap-1">
                    <span className="font-medium truncate">{data.user.name}</span>
                    <span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer size-4 flex items-center justify-between">
                Billing
                <CreditCardIcon className="size-4"/>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onLogout}
            className="cursor-pointer size-4 flex items-center justify-between">
                Logout
                <LogOutIcon className="size-4" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}