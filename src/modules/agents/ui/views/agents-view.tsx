"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import  { trpc } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";



export const AgentsView = () => {
    const { data } = useSuspenseQuery({
        queryKey: ['agents.getMany'],
        queryFn: () => trpc.agents.getMany.useQuery(),
    })

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-8">
            <DataTable data={data} columns={columns} />
            {data.length === 0 && (
                <EmptyState title="Create your first agent"
                 description="Create an agent to join your meetings. Each agent will follow your
                  instructions and can interact with partcicipants during the call" />
            )}
        </div>
    )

}

export const AgentsViewLoading = () => {

    return (
        <div>
            <LoadingState title="Loading Agents " description="This may take a few seconds"/>
        </div>
    )

}

export const AgentsViewError= () => {

    return (
        <div>
            <ErrorState title="Error loading Agents" description="Please try again later"/>
        </div>
    )

}