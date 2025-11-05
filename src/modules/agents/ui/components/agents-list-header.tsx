"use client";
import { Button } from "@/components/ui/button"
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilters } from "./agents-search-filters";
import { DEFAULT_PAGE} from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const AgentsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filters, setFilters] = useAgentsFilters();

    const isAnyFilterModified = !!filters.search;
    const onClearFilters = () => {
        setFilters({
            search: "",
            page: DEFAULT_PAGE,
        })
    }

    return(
        <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className="px-2 sm:px-4 py-2 sm:py-4 md:px-8 flex flex-col gap-y-2 sm:gap-y-4 w-full max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between gap-2">
                <h5 className="font-medium text-base sm:text-xl">My Agents</h5>
                <Button onClick={() => setIsDialogOpen(true)} className="touch-target text-sm sm:text-base">
                    <PlusIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">New Agents</span>
                </Button>
            </div>
            <ScrollArea>
            <div className="flex items-center gap-x-2 p-1">
            <AgentsSearchFilters />
            {isAnyFilterModified && (
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                    <XCircleIcon />
                     Clear
                </Button>
            )}
        </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        </div>
        </>
    )
}