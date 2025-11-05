import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, TrashIcon, PencilIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    agentId: string;
    agentName: string;
    onEdit: () => void;
    onRemove: () => void;
}

export const AgentIdViewHeader = ({
    agentId,
    agentName,
    onEdit,
    onRemove,
}: Props) => {
    return (
        <div className="flex items-center justify-between gap-2 w-full max-w-full overflow-x-hidden">
            <Breadcrumb className="flex-1 min-w-0">
                <BreadcrumbList className="flex-wrap">
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className="font-medium text-base sm:text-xl">
                         <Link href="/agents" className="truncate">
                            My Agents
                        </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-foreground text-base sm:text-xl font-medium [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-4 sm:[&>svg]:size-4">
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem className="min-w-0">
                        <BreadcrumbLink asChild className="text-foreground text-base sm:text-xl font-medium truncate">
                            <Link href={`/agents/${agentId}`} className="truncate">
                                {agentName}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="min-w-[44px] min-h-[44px] touch-target flex-shrink-0">
                            <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onEdit}>
                            <PencilIcon className="size-4 text-black" />
                                Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onRemove}>
                            <TrashIcon className="size-4 text-black" />
                                Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
        </div>
    );
}